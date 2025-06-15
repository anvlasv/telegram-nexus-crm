
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileDropZone } from '@/components/FileDropZone';
import { MediaPreview } from '@/components/MediaPreview';
import { useLanguage } from '@/contexts/LanguageContext';
import { CharacterCounter } from './CharacterCounter';

interface MediaPostFormProps {
  postType: string;
  content: string;
  mediaFiles: File[];
  onContentChange: (content: string) => void;
  onMediaFilesChange: (files: File[]) => void;
  existingMediaUrls?: string[];
}

// Telegram character limits for captions
const TELEGRAM_CAPTION_LIMIT = 1024;

export const MediaPostForm: React.FC<MediaPostFormProps> = ({
  postType,
  content,
  mediaFiles,
  onContentChange,
  onMediaFilesChange,
  existingMediaUrls = [],
}) => {
  const { t } = useLanguage();

  const getAcceptedFileTypes = () => {
    switch (postType) {
      case 'photo': return 'image/*';
      case 'video': return 'video/*';
      case 'audio': return 'audio/*';
      case 'document': return 'application/*, text/*';
      default: return '*/*';
    }
  };

  const getMaxFiles = () => {
    switch (postType) {
      case 'photo': return 10;
      case 'video': return 1;
      case 'audio': return 1;
      case 'document': return 10;
      default: return 1;
    }
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = mediaFiles.filter((_, i) => i !== index);
    onMediaFilesChange(newFiles);
  };

  // Функция для конвертации файлов в URL (для предварительного просмотра)
  const convertFilesToUrls = React.useCallback((files: File[]): string[] => {
    return files.map(file => {
      // Создаем URL для предварительного просмотра
      if (file.type.startsWith('image/')) {
        return URL.createObjectURL(file);
      }
      // Для других типов файлов возвращаем имя файла
      return file.name;
    });
  }, []);

  // Обновляем URL при изменении файлов
  React.useEffect(() => {
    const urls = convertFilesToUrls(mediaFiles);
    // Здесь можно добавить логику для обновления URL в родительском компоненте
    // если это необходимо для формы
  }, [mediaFiles, convertFilesToUrls]);

  return (
    <div className="space-y-4">
      <div>
        <Label>{t('attach-media')}</Label>
        
        <FileDropZone
          onFilesChange={onMediaFilesChange}
          accept={getAcceptedFileTypes()}
          multiple={postType === 'photo' || postType === 'document'}
          maxFiles={getMaxFiles()}
          currentFiles={mediaFiles}
        />
        
        <MediaPreview
          files={mediaFiles}
          onRemove={handleRemoveFile}
          existingMediaUrls={existingMediaUrls}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="caption">{t('media-caption')}</Label>
        <div className="relative">
          <Textarea
            id="caption"
            value={content}
            onChange={(e) => onContentChange(e.target.value)}
            placeholder={t('media-caption-placeholder')}
            rows={3}
            className="resize-none"
            maxLength={TELEGRAM_CAPTION_LIMIT}
          />
          <CharacterCounter
            content={content}
            postType={postType}
            maxLength={TELEGRAM_CAPTION_LIMIT}
          />
        </div>
      </div>

      {mediaFiles.length > 0 && (
        <div className="text-sm text-muted-foreground">
          {t('selected-files')}: {mediaFiles.length} / {getMaxFiles()}
        </div>
      )}
    </div>
  );
};
