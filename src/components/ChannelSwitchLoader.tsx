
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChannelSwitchLoaderProps {
  channelName?: string;
}

export const ChannelSwitchLoader: React.FC<ChannelSwitchLoaderProps> = ({ channelName }) => {
  const { t } = useLanguage();
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 p-6 bg-background border rounded-lg shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center">
          <p className="text-sm font-medium">{t('switching-channel')}</p>
          {channelName && (
            <p className="text-xs text-muted-foreground mt-1">{channelName}</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">{t('page-reloading')}</p>
        </div>
      </div>
    </div>
  );
};
