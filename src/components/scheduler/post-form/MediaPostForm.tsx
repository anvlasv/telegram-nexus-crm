
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileDropZone } from '@/components/FileDropZone';
import { useLanguage } from '@/contexts/LanguageContext';

interface MediaPostFormProps {
  postType: string;
  content: string;
  mediaFiles: File[];
  onContentChange: (content: string) => void;
  onMediaFilesChange: (files: File[]) => void;
}

export const MediaPostForm: React.FC<MediaPostFormProps> = ({
  postType,
  content,
  mediaFiles,
  onContentChange,
  onMediaFilesChange,
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

  return (
    <div className="space-y-2">
      <Label>{t('attach-media')}</Label>
      <FileDropZone
        onFilesChange={onMediaFilesChange}
        accept={getAcceptedFileTypes()}
        multiple={postType === 'photo' || postType === 'audio' || postType === 'document'}
        maxFiles={getMaxFiles()}
        currentFiles={mediaFiles}
      />
      <div className="space-y-2 mt-4">
        <Label htmlFor="caption">{t('post-content')}</Label>
        <Textarea
          id="caption"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={t('post-content-placeholder')}
          rows={3}
        />
      </div>
    </div>
  );
};
