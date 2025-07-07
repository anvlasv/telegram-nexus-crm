
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type ScheduledPostInsert = TablesInsert<'scheduled_posts'>;
type ScheduledPostUpdate = TablesUpdate<'scheduled_posts'>;

// Функция для загрузки файлов в Supabase Storage и получения публичных URL
const uploadMediaFiles = async (files: File[]): Promise<string[]> => {
  if (!files || files.length === 0) return [];
  
  const urls: string[] = [];
  
  for (const file of files) {
    try {
      // Создаем уникальное имя файла
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `posts/${fileName}`;
      
      console.log(`[uploadMediaFiles] Загружаем файл в Storage: ${file.name} -> ${filePath}`);
      
      // Загружаем файл в Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error(`[uploadMediaFiles] Ошибка загрузки файла ${file.name}:`, uploadError);
        throw new Error(`Не удалось загрузить файл ${file.name}: ${uploadError.message}`);
      }
      
      // Получаем публичный URL
      const { data: urlData } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);
      
      if (urlData?.publicUrl) {
        urls.push(filePath); // Сохраняем путь файла для использования в базе данных
        console.log(`[uploadMediaFiles] Файл успешно загружен: ${filePath}`);
      } else {
        throw new Error(`Не удалось получить публичный URL для файла ${file.name}`);
      }
      
    } catch (error) {
      console.error(`[uploadMediaFiles] Ошибка обработки файла ${file.name}:`, error);
      throw error;
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
        console.log('[useCreateScheduledPost] Загружаем медиафайлы в Storage');
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
          media_urls: mediaUrls,
          // Устанавливаем "photo" (альбом) как тип по умолчанию, если не указан
          post_type: postData.post_type || 'photo'
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
        console.log('[useUpdateScheduledPost] Загружаем новые медиафайлы в Storage');
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
      // Получаем данные поста для удаления медиафайлов
      const { data: postData } = await supabase
        .from('scheduled_posts')
        .select('media_urls')
        .eq('id', id)
        .single();
      
      // Удаляем пост из базы данных
      const { error } = await supabase
        .from('scheduled_posts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Удаляем медиафайлы из Storage (если они есть)
      if (postData?.media_urls && postData.media_urls.length > 0) {
        try {
          const { error: storageError } = await supabase.storage
            .from('media')
            .remove(postData.media_urls);
          
          if (storageError) {
            console.warn('[useDeleteScheduledPost] Не удалось удалить медиафайлы из Storage:', storageError);
          }
        } catch (error) {
          console.warn('[useDeleteScheduledPost] Ошибка при удалении медиафайлов:', error);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] });
    },
  });
};
