-- Создаем bucket для медиафайлов постов
INSERT INTO storage.buckets (id, name, public, allowed_mime_types, file_size_limit)
VALUES (
  'media', 
  'media', 
  true,
  ARRAY['image/*', 'video/*', 'audio/*', 'application/*'],
  52428800  -- 50MB лимит
);

-- Политики для медиа bucket'а
CREATE POLICY "Медиафайлы доступны для просмотра всем" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'media');

CREATE POLICY "Пользователи могут загружать медиафайлы" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'media' AND auth.uid() IS NOT NULL);

CREATE POLICY "Пользователи могут удалять свои медиафайлы" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'media' AND auth.uid() IS NOT NULL);