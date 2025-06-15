
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { CharacterCounter } from './CharacterCounter';

interface TextPostFormProps {
  content: string;
  onContentChange: (content: string) => void;
}

// Telegram character limits
const TELEGRAM_TEXT_LIMIT = 4096;

export const TextPostForm: React.FC<TextPostFormProps> = ({
  content,
  onContentChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label htmlFor="content">{t('post-content')}</Label>
      <div className="relative">
        <Textarea
          id="content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder={t('post-content-placeholder')}
          rows={6}
          required
          className="resize-none"
          maxLength={TELEGRAM_TEXT_LIMIT}
        />
        <CharacterCounter
          content={content}
          postType="text"
          maxLength={TELEGRAM_TEXT_LIMIT}
        />
      </div>
    </div>
  );
};
