
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type ScheduledPostInsert = TablesInsert<'scheduled_posts'>;
type ScheduledPostUpdate = TablesUpdate<'scheduled_posts'>;

// Функция для загрузки файлов и получения URL
const uploadMediaFiles = async (files: File[]): Promise<string[]> => {
  if (!files || files.length === 0) return [];
  
  const urls: string[] = [];
  
  for (const file of files) {
    try {
      const blobUrl = URL.createObjectURL(file);
      urls.push(blobUrl);
      console.log(`[uploadMediaFiles] Файл подготовлен для загрузки: ${file.name}`);
    } catch (error) {
      console.error(`[uploadMediaFiles] Ошибка обработки файла ${file.name}:`, error);
    }
  }
  
  return urls;
};

export const useCreateScheduledPost = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (post: Omit<ScheduledPostInsert, 'user_id'> & { mediaFiles?: File[] }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      let mediaUrls: string[] | null = null;
      if (post.mediaFiles && post.mediaFiles.length > 0) {
        mediaUrls = await uploadMediaFiles(post.mediaFiles);
      } else if (post.media_urls) {
        mediaUrls = post.media_urls;
      }
      
      const { mediaFiles, ...postData } = post;
      
      const { data, error } = await supabase
        .from('scheduled_posts')
        .insert([{ 
          ...postData, 
          user_id: userData.user.id,
          media_urls: mediaUrls
        }])
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
    mutationFn: async ({ id, mediaFiles, ...updates }: { id: string; mediaFiles?: File[] } & Partial<ScheduledPostUpdate>) => {
      let mediaUrls: string[] | null = null;
      if (mediaFiles && mediaFiles.length > 0) {
        mediaUrls = await uploadMediaFiles(mediaFiles);
      } else if (updates.media_urls) {
        mediaUrls = updates.media_urls;
      }
      
      const updateData = {
        ...updates,
        media_urls: mediaUrls
      };
      
      const { data, error } = await supabase
        .from('scheduled_posts')
        .update(updateData)
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
