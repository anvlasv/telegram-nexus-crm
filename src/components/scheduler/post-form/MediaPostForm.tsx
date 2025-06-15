
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { MediaUploader } from '@/components/media/MediaUploader';
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

  return (
    <div className="space-y-4">
      <MediaUploader
        postType={postType}
        mediaFiles={mediaFiles}
        onMediaFilesChange={onMediaFilesChange}
        existingMediaUrls={existingMediaUrls}
      />
      
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
    </div>
  );
};
