
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

  // Скрываем селектор типов постов
  return null;
};
