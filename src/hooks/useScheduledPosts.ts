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
      // Добавляем лог запроса и подробный вывод ошибки
      try {
        console.log('[usePublishPost] Публикация поста в канал', { postId, channelId });
        const { data, error } = await supabase.functions.invoke('telegram-api', {
          body: {
            action: 'sendMessage',
            channelId,
            postId,
          },
        });

        if (error) {
          console.error('[usePublishPost] Ошибка invoke:', error);
          throw error;
        }
        // Update post status
        const { error: updateErr } = await supabase
          .from('scheduled_posts')
          .update({ status: 'sent' })
          .eq('id', postId);

        if (updateErr) throw updateErr;
        return data;
      } catch (err) {
        // Пробрасываем ошибку наверх для отображения в UI
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] });
    },
    onError: (error) => {
      // Вызываем уведомление через toast, если он есть
      // (используйте useToast внутри компонента, чтобы сделать это)
      console.error('[usePublishPost] Ошибка:', error);
    },
  });
};
