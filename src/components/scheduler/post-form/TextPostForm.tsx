
import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface TextPostFormProps {
  content: string;
  onContentChange: (content: string) => void;
}

export const TextPostForm: React.FC<TextPostFormProps> = ({
  content,
  onContentChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-2">
      <Label htmlFor="content">{t('post-content')}</Label>
      <Textarea
        id="content"
        value={content}
        onChange={(e) => onContentChange(e.target.value)}
        placeholder={t('post-content-placeholder')}
        rows={6}
        required
      />
    </div>
  );
};
