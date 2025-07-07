
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePublishPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, channelId }: { postId: string; channelId: string }) => {
      try {
        console.log('[usePublishPost] Начинаем публикацию поста:', { postId, channelId });
        
        // Получаем данные поста
        const { data: postData, error: postError } = await supabase
          .from('scheduled_posts')
          .select('content, post_type, media_urls, poll_options, scheduled_for')
          .eq('id', postId)
          .single();

        if (postError) {
          console.error('[usePublishPost] Ошибка получения поста:', postError);
          throw new Error(`Не удалось получить данные поста: ${postError.message}`);
        }

        if (!postData) {
          throw new Error('Пост не найден');
        }

        // Получаем данные канала
        const { data: channelData, error: channelError } = await supabase
          .from('telegram_channels')
          .select('channel_id, username, name, timezone')
          .eq('id', channelId)
          .single();

        if (channelError) {
          console.error('[usePublishPost] Ошибка получения канала:', channelError);
          throw new Error(`Не удалось получить данные канала: ${channelError.message}`);
        }

        if (!channelData) {
          throw new Error('Канал не найден');
        }

        // Проверяем авторизацию
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError || !session) {
          throw new Error('Пользователь не авторизован');
        }

        // Определяем chat_id для Telegram
        let chatId: string;
        if (channelData.channel_id) {
          chatId = channelData.channel_id.toString();
        } else if (channelData.username) {
          chatId = `@${channelData.username}`;
        } else {
          throw new Error('Не указан ID канала или username');
        }

        // Формируем запрос для Telegram API
        let requestBody: any = {
          chatId: chatId,
        };

        // Обрабатываем разные типы постов
        switch (postData.post_type) {
          case 'poll':
            if (!postData.poll_options || postData.poll_options.length < 2) {
              throw new Error('Опрос должен содержать минимум 2 варианта ответа');
            }
            requestBody.action = 'sendPoll';
            requestBody.question = postData.content;
            requestBody.options = postData.poll_options;
            break;
          
          case 'photo':
            requestBody.action = 'sendPhoto';
            requestBody.text = postData.content || '';
            requestBody.mediaUrls = postData.media_urls || [];
            break;
            
          case 'video':
            requestBody.action = 'sendVideo';
            requestBody.text = postData.content || '';
            requestBody.mediaUrls = postData.media_urls || [];
            break;
            
          case 'audio':
            requestBody.action = 'sendAudio';
            requestBody.text = postData.content || '';
            requestBody.mediaUrls = postData.media_urls || [];
            break;
            
          case 'document':
            requestBody.action = 'sendDocument';
            requestBody.text = postData.content || '';
            requestBody.mediaUrls = postData.media_urls || [];
            break;
            
          default:
            if (!postData.content) {
              throw new Error('Текст сообщения не может быть пустым');
            }
            requestBody.action = 'sendMessage';
            requestBody.text = postData.content;
            break;
        }

        console.log('[usePublishPost] Отправляем запрос в Telegram API:', requestBody);

        // Отправляем запрос в Telegram API через edge функцию
        const { data: telegramResponse, error: telegramError } = await supabase.functions.invoke('telegram-api', {
          body: requestBody,
        });

        if (telegramError) {
          console.error('[usePublishPost] Ошибка edge function:', telegramError);
          throw new Error(`Ошибка сервера: ${telegramError.message}`);
        }

        if (!telegramResponse) {
          throw new Error('Пустой ответ от сервера');
        }

        if (!telegramResponse.ok) {
          const errorMsg = telegramResponse.description || telegramResponse.error_code || 'Неизвестная ошибка Telegram API';
          console.error('[usePublishPost] Telegram API вернул ошибку:', telegramResponse);
          throw new Error(`Ошибка Telegram API: ${errorMsg}`);
        }

        // Обновляем статус поста на "отправлен"
        const { error: updateError } = await supabase
          .from('scheduled_posts')
          .update({ 
            status: 'sent',
            updated_at: new Date().toISOString()
          })
          .eq('id', postId);

        if (updateError) {
          console.error('[usePublishPost] Ошибка обновления статуса поста:', updateError);
          // Не выбрасываем ошибку, так как пост уже отправлен
        }

        console.log('[usePublishPost] Пост успешно опубликован:', telegramResponse);
        return telegramResponse;

      } catch (err: any) {
        console.error('[usePublishPost] Общая ошибка публикации:', err);
        // Возвращаем понятное сообщение об ошибке
        throw new Error(err.message || 'Произошла ошибка при публикации поста');
      }
    },
    onSuccess: () => {
      // Обновляем кэш постов
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] });
    },
    onError: (error) => {
      console.error('[usePublishPost] Mutation error:', error);
    },
  });
};
