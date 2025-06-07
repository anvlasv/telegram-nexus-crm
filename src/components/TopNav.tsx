
import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search, Settings, ChevronDown, LogOut, User, X } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useChannels } from '@/hooks/useChannels';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ChannelInfoModal } from './ChannelInfoModal';

export const TopNav: React.FC = () => {
  const { isDarkTheme, toggleTheme } = useTelegram();
  const { language, setLanguage, t } = useLanguage();
  const { user, signOut } = useAuth();
  const { channels } = useChannels();
  const isMobile = useIsMobile();
  const [selectedChannel, setSelectedChannel] = useState(channels[0] || null);
  const [isChannelInfoOpen, setIsChannelInfoOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [channelSelectorOpen, setChannelSelectorOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  const handleChannelSelect = (channel: any) => {
    setSelectedChannel(channel);
    setChannelSelectorOpen(false);
  };

  // Обновляем выбранный канал, если список каналов изменился
  React.useEffect(() => {
    if (channels.length > 0 && !selectedChannel) {
      setSelectedChannel(channels[0]);
    }
  }, [channels, selectedChannel]);

  const mockNotifications = [
    { id: 1, title: t('new-subscriber'), text: 'Tech News +1 ' + t('subscriber'), time: '5 ' + t('min-ago') },
    { id: 2, title: t('post-published'), text: t('post-in-channel') + ' Gaming Hub', time: '1 ' + t('hour-ago') },
    { id: 3, title: t('goal-reached'), text: '1000 ' + t('subscribers') + ' в Crypto Updates', time: '2 ' + t('hours-ago') },
  ];

  return (
    <header className="flex h-14 items-center gap-2 md:gap-4 border-b bg-background px-2 md:px-4 lg:px-6 min-w-0">
      <SidebarTrigger className="-ml-1 flex-shrink-0" />
      
      {/* Channel Selector - Mobile optimized */}
      <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
        {channels.length > 0 ? (
          <>
            {isMobile ? (
              // Mobile: только аватарка
              <DropdownMenu open={channelSelectorOpen} onOpenChange={setChannelSelectorOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={selectedChannel?.avatar_url} alt={selectedChannel?.name} />
                      <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                        {selectedChannel?.name?.charAt(0) || 'C'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-64">
                  {channels.map((channel) => (
                    <DropdownMenuItem
                      key={channel.id}
                      onClick={() => handleChannelSelect(channel)}
                      className="flex items-center gap-3 p-3"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={channel.avatar_url} alt={channel.name} />
                        <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                          {channel.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col items-start">
                        <span className="font-medium truncate w-full">{channel.name}</span>
                        <span className="text-xs text-muted-foreground">@{channel.username}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Desktop: название канала + аватарка
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2 max-w-48 truncate">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={selectedChannel?.avatar_url} alt={selectedChannel?.name} />
                        <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                          {selectedChannel?.name?.charAt(0) || 'C'}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium truncate">
                        {selectedChannel?.name || t('select-channel')}
                      </span>
                      <ChevronDown className="h-4 w-4 flex-shrink-0" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-48">
                    {channels.map((channel) => (
                      <DropdownMenuItem
                        key={channel.id}
                        onClick={() => setSelectedChannel(channel)}
                        className="flex items-center gap-2"
                      >
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={channel.avatar_url} alt={channel.name} />
                          <AvatarFallback className="text-xs bg-sidebar-primary text-sidebar-primary-foreground">
                            {channel.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start">
                          <span className="font-medium truncate w-full">{channel.name}</span>
                          <span className="text-xs text-muted-foreground">@{channel.username}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={() => setIsChannelInfoOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </>
            )}
          </>
        ) : (
          <span className="text-sm text-muted-foreground">{t('no-channels-connected')}</span>
        )}
      </div>
      
      <div className="flex-1 min-w-0" />
      
      <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
        {/* Search */}
        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Search className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{t('search')}</h3>
                <Button variant="ghost" size="sm" onClick={() => setSearchOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Input
                placeholder={t('search-placeholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              {searchQuery && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{t('search-results')}:</p>
                  <div className="space-y-1">
                    <div className="text-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer">
                      {t('found-in-channel')} "Tech News"
                    </div>
                    <div className="text-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer">
                      {t('post-from')} 15.12.2024
                    </div>
                  </div>
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        {/* Notifications */}
        <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs"></span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80" align="end">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{t('notifications')}</h3>
                <Button variant="ghost" size="sm" onClick={() => setNotificationsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-3">
                {mockNotifications.map((notification) => (
                  <div key={notification.id} className="space-y-1 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">{notification.title}</span>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{notification.text}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full" size="sm">
                {t('show-all')}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
        {!isMobile && (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
              className="h-8 text-xs"
            >
              {language.toUpperCase()}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="h-8 text-xs"
            >
              {isDarkTheme ? '☀️' : '🌙'}
            </Button>
          </>
        )}

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5 text-sm text-muted-foreground truncate">
              {user?.email}
            </div>
            {isMobile && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}>
                  {t('language')}: {language.toUpperCase()}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={toggleTheme}>
                  {t('theme')}: {isDarkTheme ? t('light') : t('dark')}
                </DropdownMenuItem>
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {selectedChannel && (
        <ChannelInfoModal
          channel={selectedChannel}
          isOpen={isChannelInfoOpen}
          onClose={() => setIsChannelInfoOpen(false)}
        />
      )}
    </header>
  );
};
