
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const SchedulerLoading: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center justify-center h-64 p-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        {t('loading')}
      </div>
    </div>
  );
};
