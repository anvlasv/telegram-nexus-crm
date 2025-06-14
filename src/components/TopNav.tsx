import React, { useState } from 'react';
import { ChevronDown, Menu, Settings, User, LogOut, Info, Bell, Globe, Sun, Moon } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSidebar } from '@/components/ui/sidebar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChannels } from '@/hooks/useChannels';
import { ChannelInfoModal } from './ChannelInfoModal';
import { Switch } from '@/components/ui/switch';
import { useTelegram } from '@/hooks/useTelegram';
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { MiniAppMenu } from "./MiniAppMenu";
import { useIsMobile } from '@/hooks/use-mobile';

export const TopNav: React.FC = () => {
  const { toggleSidebar } = useSidebar();
  const { t, language, setLanguage } = useLanguage();
  const { channels, selectedChannelId, setSelectedChannelId } = useChannels();
  const [showChannelInfo, setShowChannelInfo] = useState(false);
  const [showChannelSelect, setShowChannelSelect] = useState(false);
  const [showMenuDrawer, setShowMenuDrawer] = useState(false);
  const { isDarkTheme, toggleTheme } = useTelegram();
  const isMobile = useIsMobile();

  const selectedChannel = channels.find(c => c.id === selectedChannelId) || channels[0];

  const handleChannelSelect = (channelId: string) => {
    setSelectedChannelId(channelId);
    setShowChannelSelect(false);
  };

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b bg-background px-3 lg:px-6">
        {/* Left side - Channel info */}
        <div className="flex items-center gap-3">
          {/* Channel info - Avatar only on mobile, name + avatar on desktop */}
          {selectedChannel && (
            <DropdownMenu open={showChannelSelect} onOpenChange={setShowChannelSelect}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 h-auto p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={selectedChannel.avatar_url || undefined} 
                      alt={selectedChannel.name} 
                    />
                    <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                      {selectedChannel.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  {/* Show channel name only on desktop */}
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium">{selectedChannel.name}</span>
                    <span className="text-xs text-muted-foreground">
                      @{selectedChannel.username}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64">
                <DropdownMenuLabel>{t('channels')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {channels.map((channel) => (
                  <DropdownMenuItem
                    key={channel.id}
                    className="flex items-center gap-3 p-3"
                    onClick={() => handleChannelSelect(channel.id)}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={channel.avatar_url || undefined} 
                        alt={channel.name} 
                      />
                      <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                        {channel.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-medium">{channel.name}</span>
                      <span className="text-xs text-muted-foreground">
                        @{channel.username}
                      </span>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowChannelInfo(true)}>
                  <Info className="mr-2 h-4 w-4" />
                  {t('channel-info')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Right side - Controls and Mobile menu */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>

          {/* Theme Switcher with icons */}
          <div className="flex items-center gap-1">
            <Sun className="h-4 w-4 text-muted-foreground" />
            <Switch checked={isDarkTheme} onCheckedChange={toggleTheme} />
            <Moon className="h-4 w-4 text-muted-foreground" />
          </div>

          {/* Language toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
          >
            <Globe className="h-4 w-4" />
            <span className="ml-1 text-xs">{language.toUpperCase()}</span>
          </Button>

          {/* Profile menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="text-xs">U</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{t('account')}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                {t('profile')}
              </DropdownMenuItem>
              <DropdownMenuItem>
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

          {/* "Бутерброд" Меню — только для мобильных */}
          {isMobile && (
            <Button
              variant="ghost"
              size="sm"
              className="ml-1 block md:hidden"
              onClick={() => setShowMenuDrawer(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
        </div>
      </header>

      {/* Drawer Menu для miniapp/планшетов */}
      <Drawer open={showMenuDrawer} onOpenChange={setShowMenuDrawer}>
        <DrawerContent className="w-72 p-0">
          <div className="pt-4 pb-8 px-3">
            <MiniAppMenu onSelect={() => setShowMenuDrawer(false)} />
          </div>
        </DrawerContent>
      </Drawer>

      {/* Channel Info Modal */}
      {selectedChannel && (
        <ChannelInfoModal
          channel={selectedChannel}
          isOpen={showChannelInfo}
          onClose={() => setShowChannelInfo(false)}
        />
      )}
    </>
  );
};
