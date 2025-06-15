
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePublishPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, channelId }: { postId: string; channelId: string }) => {
      try {
        console.log('[usePublishPost] Начинаем публикацию поста:', { postId, channelId });
        
        const { data: postData, error: postError } = await supabase
          .from('scheduled_posts')
          .select('content, post_type, media_urls, poll_options')
          .eq('id', postId)
          .single();

        if (postError) {
          console.error('[usePublishPost] Ошибка получения поста:', postError);
          throw new Error(`Ошибка получения поста: ${postError.message}`);
        }

        const { data: channelData, error: channelError } = await supabase
          .from('telegram_channels')
          .select('channel_id, username, name')
          .eq('id', channelId)
          .single();

        if (channelError) {
          console.error('[usePublishPost] Ошибка получения канала:', channelError);
          throw new Error(`Ошибка получения канала: ${channelError.message}`);
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('Пользователь не авторизован');
        }

        let requestBody: any = {
          chatId: channelData.channel_id || `@${channelData.username}`,
        };

        switch (postData.post_type) {
          case 'poll':
            requestBody.action = 'sendPoll';
            requestBody.question = postData.content;
            requestBody.options = postData.poll_options || [];
            if (requestBody.options.length < 2) {
              throw new Error('Опрос должен содержать минимум 2 варианта ответа');
            }
            break;
          
          case 'photo':
            requestBody.action = 'sendPhoto';
            requestBody.text = postData.content || '';
            requestBody.mediaUrls = postData.media_urls;
            break;
            
          case 'video':
            requestBody.action = 'sendVideo';
            requestBody.text = postData.content || '';
            requestBody.mediaUrls = postData.media_urls;
            break;
            
          case 'audio':
            requestBody.action = 'sendAudio';
            requestBody.text = postData.content || '';
            requestBody.mediaUrls = postData.media_urls;
            break;
            
          case 'document':
            requestBody.action = 'sendDocument';
            requestBody.text = postData.content || '';
            requestBody.mediaUrls = postData.media_urls;
            break;
            
          default:
            requestBody.action = 'sendMessage';
            requestBody.text = postData.content;
            break;
        }

        console.log('[usePublishPost] Отправляем запрос в Telegram API:', requestBody);

        const { data: telegramResponse, error: telegramError } = await supabase.functions.invoke('telegram-api', {
          body: requestBody,
        });

        if (telegramError) {
          console.error('[usePublishPost] Ошибка edge function:', telegramError);
          throw new Error(`Ошибка API: ${telegramError.message}`);
        }

        if (!telegramResponse?.ok) {
          const errorMsg = telegramResponse?.description || 'Неизвестная ошибка Telegram API';
          console.error('[usePublishPost] Telegram API вернул ошибку:', telegramResponse);
          throw new Error(`Telegram API: ${errorMsg}`);
        }

        const { error: updateError } = await supabase
          .from('scheduled_posts')
          .update({ status: 'sent' })
          .eq('id', postId);

        if (updateError) {
          console.error('[usePublishPost] Ошибка обновления статуса поста:', updateError);
        }

        return telegramResponse;
      } catch (err: any) {
        console.error('[usePublishPost] Общая ошибка публикации:', err);
        throw new Error(err.message || 'Произошла ошибка при публикации поста');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] });
    },
    onError: (error) => {
      console.error('[usePublishPost] Mutation error:', error);
    },
  });
};
