
import React from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface PostTypeSelectorProps {
  postType: string;
  onPostTypeChange: (type: string) => void;
  disabled?: boolean;
}

export const PostTypeSelector: React.FC<PostTypeSelectorProps> = ({
  postType,
  onPostTypeChange,
  disabled = false,
}) => {
  const { t } = useLanguage();

  if (disabled) return null;

  return (
    <div className="space-y-3">
      <Label>{t('post-type')}</Label>
      <RadioGroup value={postType} onValueChange={onPostTypeChange}>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="text" id="text" />
          <label htmlFor="text" className="text-sm">{t('text-post')}</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="photo" id="photo" />
          <label htmlFor="photo" className="text-sm">{t('photo-album-post')}</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="video" id="video" />
          <label htmlFor="video" className="text-sm">{t('video-post')}</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="audio" id="audio" />
          <label htmlFor="audio" className="text-sm">{t('audio-post')}</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="document" id="document" />
          <label htmlFor="document" className="text-sm">{t('document-post')}</label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="poll" id="poll" />
          <label htmlFor="poll" className="text-sm">{t('poll-post')}</label>
        </div>
      </RadioGroup>
    </div>
  );
};
