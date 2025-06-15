
import React from 'react';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChannelSwitchLoaderProps {
  channelName?: string;
}

export const ChannelSwitchLoader: React.FC<ChannelSwitchLoaderProps> = ({ channelName }) => {
  const { t } = useLanguage();
  
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <div className="text-center">
          <p className="text-sm font-medium">{t('switching-channel')}</p>
          {channelName && (
            <p className="text-xs text-muted-foreground mt-1">{channelName}</p>
          )}
        </div>
      </div>
    </div>
  );
};
