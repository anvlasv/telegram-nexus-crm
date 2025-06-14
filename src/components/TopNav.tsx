
import React, { useState } from 'react';
import { useChannels } from '@/hooks/useChannels';
import { ChannelInfoModal } from './ChannelInfoModal';
import { NotificationsModal } from './NotificationsModal';
import { ChannelSelector } from './header/ChannelSelector';
import { MobileControls } from './header/MobileControls';
import { DesktopControls } from './header/DesktopControls';

export const TopNav: React.FC = () => {
  const { channels, selectedChannelId } = useChannels();
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [showChannelSelect, setShowChannelSelect] = useState(false);
  const [showMenuSheet, setShowMenuSheet] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const selectedChannel = channels.find(c => c.id === selectedChannelId);

  const handleNotificationsClick = () => {
    setShowNotifications(true);
  };

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b bg-background px-3 lg:px-6">
        {/* Left side - Channel info */}
        <div className="flex items-center gap-3">
          <ChannelSelector 
            showChannelSelect={showChannelSelect}
            setShowChannelSelect={setShowChannelSelect}
            setShowChannelInfo={setShowChannelInfo}
          />
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

      {/* Channel Info Modal */}
      {selectedChannel && (
        <ChannelInfoModal
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
