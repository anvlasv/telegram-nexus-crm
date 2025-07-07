
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useStorageSetup = () => {
  useEffect(() => {
    const setupStorage = async () => {
      try {
        // Проверяем, существует ли bucket 'media'
        const { data: buckets, error: listError } = await supabase.storage.listBuckets();
        
        if (listError) {
          console.error('Ошибка получения списка buckets:', listError);
          return;
        }
        
        const mediaBucketExists = buckets?.some(bucket => bucket.name === 'media');
        
        if (!mediaBucketExists) {
          console.log('Bucket media не найден, создаем...');
          
          // Создаем bucket, если его нет
          const { error: createError } = await supabase.storage.createBucket('media', {
            public: true,
            allowedMimeTypes: ['image/*', 'video/*', 'audio/*', 'application/*'],
            fileSizeLimit: 50 * 1024 * 1024 // 50MB
          });
          
          if (createError) {
            console.error('Ошибка создания bucket media:', createError);
          } else {
            console.log('Bucket media успешно создан');
          }
        }
      } catch (error) {
        console.error('Ошибка настройки storage:', error);
      }
    };
    
    setupStorage();
  }, []);
};
