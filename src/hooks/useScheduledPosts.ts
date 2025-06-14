
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type ScheduledPost = Tables<'scheduled_posts'>;
type ScheduledPostInsert = TablesInsert<'scheduled_posts'>;
type ScheduledPostUpdate = TablesUpdate<'scheduled_posts'>;

export const useScheduledPosts = () => {
  return useQuery({
    queryKey: ['scheduled-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_posts')
        .select(`
          *,
          telegram_channels (
            name,
            username,
            avatar_url
          )
        `)
        .order('scheduled_for', { ascending: true });
      
      if (error) throw error;
      return data as (ScheduledPost & { telegram_channels: { name: string; username: string; avatar_url?: string | null } })[];
    },
  });
};

export const useCreateScheduledPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (post: Omit<ScheduledPostInsert, 'user_id'>) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('scheduled_posts')
        .insert([{ ...post, user_id: userData.user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] });
    },
  });
};

export const useUpdateScheduledPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<ScheduledPostUpdate>) => {
      const { data, error } = await supabase
        .from('scheduled_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] });
    },
  });
};

export const useDeleteScheduledPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('scheduled_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] });
    },
  });
};

export const usePublishPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ postId, channelId }: { postId: string; channelId: string }) => {
      try {
        console.log('[usePublishPost] Начинаем публикацию поста:', { postId, channelId });
        
        // Получаем данные поста
        const { data: postData, error: postError } = await supabase
          .from('scheduled_posts')
          .select('content, post_type, media_urls, poll_options')
          .eq('id', postId)
          .single();

        if (postError) {
          console.error('[usePublishPost] Ошибка получения поста:', postError);
          throw new Error(`Ошибка получения поста: ${postError.message}`);
        }

        console.log('[usePublishPost] Данные поста:', postData);

        // Получаем данные канала
        const { data: channelData, error: channelError } = await supabase
          .from('telegram_channels')
          .select('channel_id, username, name')
          .eq('id', channelId)
          .single();

        if (channelError) {
          console.error('[usePublishPost] Ошибка получения канала:', channelError);
          throw new Error(`Ошибка получения канала: ${channelError.message}`);
        }

        console.log('[usePublishPost] Данные канала:', channelData);

        // Проверяем наличие токена бота
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          throw new Error('Пользователь не авторизован');
        }

        // Определяем тип сообщения и параметры
        let requestBody: any = {
          action: 'sendMessage',
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
          case 'video':
          case 'audio':
          case 'document':
            // Для медиа-постов пока отправляем как текст с информацией о медиа
            requestBody.text = postData.content + (postData.media_urls ? `\n\nВложения: ${postData.media_urls.join(', ')}` : '');
            break;
          default:
            requestBody.text = postData.content;
            break;
        }

        console.log('[usePublishPost] Отправляем запрос в Telegram API:', requestBody);

        // Отправляем запрос в Telegram API
        const { data: telegramResponse, error: telegramError } = await supabase.functions.invoke('telegram-api', {
          body: requestBody,
        });

        if (telegramError) {
          console.error('[usePublishPost] Ошибка edge function:', telegramError);
          throw new Error(`Ошибка API: ${telegramError.message}`);
        }

        console.log('[usePublishPost] Ответ от Telegram API:', telegramResponse);

        if (!telegramResponse?.ok) {
          const errorMsg = telegramResponse?.description || 'Неизвестная ошибка Telegram API';
          console.error('[usePublishPost] Telegram API вернул ошибку:', telegramResponse);
          throw new Error(`Telegram API: ${errorMsg}`);
        }

        console.log('[usePublishPost] Пост успешно опубликован');

        // Обновляем статус поста в базе данных
        const { error: updateError } = await supabase
          .from('scheduled_posts')
          .update({ status: 'sent' })
          .eq('id', postId);

        if (updateError) {
          console.error('[usePublishPost] Ошибка обновления статуса поста:', updateError);
          // Не бросаем ошибку, так как пост уже опубликован
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
