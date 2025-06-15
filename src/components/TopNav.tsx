
import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { useChannels } from '@/hooks/useChannels';
import { ChannelInfoModal } from './ChannelInfoModal';
import { NotificationsModal } from './NotificationsModal';
import { ChannelSelector } from './header/ChannelSelector';
import { MobileControls } from './header/MobileControls';
import { DesktopControls } from './header/DesktopControls';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

export const TopNav: React.FC = () => {
  const { t } = useLanguage();
  const { channels, selectedChannelId } = useChannels();
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [showChannelSelect, setShowChannelSelect] = useState(false);
  const [showMenuSheet, setShowMenuSheet] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const selectedChannel = channels.find(c => c.id === selectedChannelId);

  // Автоматически обновляем информацию о канале при смене канала
  useEffect(() => {
    // Если панель информации открыта и канал изменился, обновляем данные
    if (showChannelInfo && selectedChannel) {
      console.log('[TopNav] Канал изменился, обновляем панель информации:', selectedChannel.name);
      // Панель автоматически обновится благодаря новому selectedChannel
    }
  }, [selectedChannelId, selectedChannel, showChannelInfo]);

  const handleNotificationsClick = () => {
    setShowNotifications(true);
  };

  const handleChannelInfoClick = () => {
    if (selectedChannel) {
      console.log('[TopNav] Открываем информацию о канале:', selectedChannel.name);
      setShowChannelInfo(true);
    }
  };

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b bg-background px-3 lg:px-6">
        {/* Left side - Channel selector with info button */}
        <div className="flex items-center gap-2">
          <ChannelSelector 
            showChannelSelect={showChannelSelect}
            setShowChannelSelect={setShowChannelSelect}
          />
          
          {/* Channel info button */}
          {selectedChannel && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleChannelInfoClick}
              className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
              title={t('channel-info')}
            >
              <Info className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Right side - Controls */}
        <div className="flex items-center">
          <MobileControls 
            showMenuSheet={showMenuSheet}
            setShowMenuSheet={setShowMenuSheet}
            onNotificationsClick={handleNotificationsClick}
          />
          <DesktopControls onNotificationsClick={handleNotificationsClick} />
        </div>
      </header>

      {/* Channel Info Modal - обновляется автоматически при смене канала */}
      {selectedChannel && (
        <ChannelInfoModal
          key={selectedChannelId} // Принудительное обновление при смене канала
          channel={selectedChannel}
          isOpen={showChannelInfo}
          onClose={() => setShowChannelInfo(false)}
        />
      )}

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};
