
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchResultsInfoProps {
  viewMode: 'list' | 'calendar';
  searchQuery: string;
  resultsCount: number;
}

export const SearchResultsInfo: React.FC<SearchResultsInfoProps> = ({
  viewMode,
  searchQuery,
  resultsCount,
}) => {
  const { t } = useLanguage();

  if (viewMode !== 'list' || !searchQuery || searchQuery.replace(/\s/g, '').length < 4) {
    return null;
  }

  return (
    <div className="text-sm text-muted-foreground">
      {t('search-results') || 'Результаты поиска'}: {resultsCount} {t('posts') || 'постов'}
    </div>
  );
};
