
import React from 'react';
import { FileDropZone } from '@/components/FileDropZone';
import { MediaPreview } from '@/components/MediaPreview';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface MediaUploaderProps {
  postType: string;
  mediaFiles: File[];
  onMediaFilesChange: (files: File[]) => void;
  existingMediaUrls?: string[];
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  postType,
  mediaFiles,
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

  return (
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

      {mediaFiles.length > 0 && (
        <div className="text-sm text-muted-foreground mt-2">
          {t('selected-files')}: {mediaFiles.length} / {getMaxFiles()}
        </div>
      )}
    </div>
  );
};
