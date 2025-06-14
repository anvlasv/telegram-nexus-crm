
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
  existingMediaUrls?: string[];
}

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

  return (
    <div className="space-y-4">
      <div>
        <Label>{t('attach-media')}</Label>
        
        {/* Show existing media URLs if editing */}
        {existingMediaUrls && existingMediaUrls.length > 0 && (
          <div className="mb-3 p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-2">{t('existing-media')}:</p>
            <ul className="space-y-1">
              {existingMediaUrls.map((url, index) => (
                <li key={index} className="text-sm text-muted-foreground truncate">
                  {url}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <FileDropZone
          onFilesChange={onMediaFilesChange}
          accept={getAcceptedFileTypes()}
          multiple={postType === 'photo' || postType === 'audio' || postType === 'document'}
          maxFiles={getMaxFiles()}
          currentFiles={mediaFiles}
        />
      </div>
      
      <div className="space-y-2">
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
