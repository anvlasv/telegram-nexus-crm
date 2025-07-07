
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const NoChannelSelected: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="h-full flex flex-col p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">{t('no-channel-selected')}</h2>
            <p className="text-muted-foreground">{t('select-channel-to-continue')}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
