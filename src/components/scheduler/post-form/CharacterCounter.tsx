
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CharacterCounterProps {
  content: string;
  postType: string;
  maxLength: number;
}

export const CharacterCounter: React.FC<CharacterCounterProps> = ({
  content,
  postType,
  maxLength,
}) => {
  const { t } = useLanguage();
  const currentLength = content.length;
  const remaining = maxLength - currentLength;
  
  const getColorClass = () => {
    const ratio = currentLength / maxLength;
    if (ratio >= 1) return 'text-red-500';
    if (ratio >= 0.9) return 'text-orange-500';
    if (ratio >= 0.8) return 'text-yellow-600';
    return 'text-gray-500 dark:text-gray-400';
  };

  const getLimitLabel = () => {
    if (['photo', 'video', 'audio', 'document'].includes(postType)) {
      return t('caption-limit');
    }
    return t('text-limit');
  };

  return (
    <div className="flex justify-between items-center text-xs mt-1">
      <span className="text-gray-400 dark:text-gray-500">
        {getLimitLabel()}: {maxLength}
      </span>
      <span className={getColorClass()}>
        {remaining} {t('characters-left')}
      </span>
    </div>
  );
};
