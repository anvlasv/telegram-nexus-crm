
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
            avatar_url,
            tg_avatar_url
          )
        `)
        .order('scheduled_for', { ascending: true });
      
      if (error) throw error;
      return data as (ScheduledPost & { telegram_channels: { name: string; username: string; avatar_url?: string | null; tg_avatar_url?: string | null } })[];
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
        console.log('[usePublishPost] Отправка запроса на публикацию:', { postId, channelId });
        
        // Получаем данные поста и канала
        const { data: postData, error: postError } = await supabase
          .from('scheduled_posts')
          .select('content')
          .eq('id', postId)
          .single();

        if (postError) {
          console.error('[usePublishPost] Ошибка получения поста:', postError);
          throw new Error(`Ошибка получения поста: ${postError.message}`);
        }

        const { data: channelData, error: channelError } = await supabase
          .from('telegram_channels')
          .select('chat_id, username')
          .eq('id', channelId)
          .single();

        if (channelError) {
          console.error('[usePublishPost] Ошибка получения канала:', channelError);
          throw new Error(`Ошибка получения канала: ${channelError.message}`);
        }

        console.log('[usePublishPost] Данные для публикации:', { 
          content: postData.content, 
          chatId: channelData.chat_id, 
          username: channelData.username 
        });

        const { data, error } = await supabase.functions.invoke('telegram-api', {
          body: {
            action: 'sendMessage',
            chatId: channelData.chat_id || channelData.username,
            text: postData.content,
          },
        });

        if (error) {
          console.error('[usePublishPost] Ошибка edge function:', error);
          throw new Error(`Ошибка API: ${error.message}`);
        }

        if (!data.ok) {
          console.error('[usePublishPost] Telegram API error:', data);
          throw new Error(`Telegram API: ${data.description || 'Неизвестная ошибка'}`);
        }

        console.log('[usePublishPost] Пост успешно опубликован:', data);

        // Обновляем статус поста
        const { error: updateError } = await supabase
          .from('scheduled_posts')
          .update({ status: 'sent' })
          .eq('id', postId);

        if (updateError) {
          console.error('[usePublishPost] Ошибка обновления статуса:', updateError);
          // Не бросаем ошибку, т.к. пост уже опубликован
        }

        return data;
      } catch (err: any) {
        console.error('[usePublishPost] Общая ошибка:', err);
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
