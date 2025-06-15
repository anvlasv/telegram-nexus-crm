import React, { useState, useEffect } from 'react';
import { Info, ChevronDown, User, Settings, LogOut } from 'lucide-react';
import { useChannels } from '@/hooks/useChannels';
import { ChannelInfoModal } from './ChannelInfoModal';
import { NotificationsModal } from './NotificationsModal';
import { ChannelSelector } from './header/ChannelSelector';
import { MobileControls } from './header/MobileControls';
import { DesktopControls } from './header/DesktopControls';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/hooks/useTelegram';
import { useProfile } from '@/hooks/useProfile';
import { useIsMobile } from '@/hooks/use-mobile';
import { useNavigate } from 'react-router-dom';

export const TopNav: React.FC = () => {
  const { t } = useLanguage();
  const { channels, selectedChannelId } = useChannels();
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [showChannelSelect, setShowChannelSelect] = useState(false);
  const [showMenuSheet, setShowMenuSheet] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { user: telegramUser } = useTelegram();
  const { profile } = useProfile();
  const isMobile = useIsMobile();
  const navigate = useNavigate();

  const selectedChannel = channels.find(c => c.id === selectedChannelId);

  useEffect(() => {
    if (showChannelInfo && selectedChannel) {
      console.log('[TopNav] Канал изменился, обновляем панель информации:', selectedChannel.name);
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

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  const getAvatarFallback = () => {
    if (profile?.full_name) {
      return profile.full_name[0].toUpperCase();
    }
    if (telegramUser?.first_name) {
      return telegramUser.first_name[0].toUpperCase();
    }
    return 'U';
  };

  // Mobile User Avatar Dropdown (768px and below)
  const MobileUserAvatar = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 md:hidden">
          <Avatar className="h-6 w-6">
            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
            <AvatarFallback className="text-xs">
              {getAvatarFallback()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('account')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          {t('profile')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettingsClick}>
          <Settings className="mr-2 h-4 w-4" />
          {t('settings')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // Tablet User Avatar Dropdown (769px - 1023px)
  const TabletUserAvatar = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="hidden md:flex lg:hidden h-8 w-8 p-0">
          <Avatar className="h-6 w-6">
            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
            <AvatarFallback className="text-xs">
              {getAvatarFallback()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('account')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleProfileClick}>
          <User className="mr-2 h-4 w-4" />
          {t('profile')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleSettingsClick}>
          <Settings className="mr-2 h-4 w-4" />
          {t('settings')}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <LogOut className="mr-2 h-4 w-4" />
          {t('logout')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b bg-background px-3 lg:px-6">
        <div className="flex items-center gap-2">
          <ChannelSelector 
            showChannelSelect={showChannelSelect}
            setShowChannelSelect={setShowChannelSelect}
          />
          
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

        <div className="flex items-center gap-2">
          {/* Mobile User Avatar */}
          <MobileUserAvatar />
          
          {/* Tablet User Avatar */}
          <TabletUserAvatar />
          
          {/* Mobile Controls - only show hamburger menu on mobile now */}
          <MobileControls 
            showMenuSheet={showMenuSheet}
            setShowMenuSheet={setShowMenuSheet}
            onNotificationsClick={handleNotificationsClick}
          />
          
          {/* Desktop Controls - unchanged */}
          <DesktopControls onNotificationsClick={handleNotificationsClick} />
        </div>
      </header>

      {selectedChannel && (
        <ChannelInfoModal
          key={selectedChannelId}
          channel={selectedChannel}
          isOpen={showChannelInfo}
          onClose={() => setShowChannelInfo(false)}
        />
      )}

      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};
