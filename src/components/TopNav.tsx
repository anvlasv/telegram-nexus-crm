
import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bell, Search, Settings, ChevronDown, LogOut, User, X } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { useChannels } from '@/hooks/useChannels';
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
  const { language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const { channels } = useChannels();
  const [selectedChannel, setSelectedChannel] = useState(channels[0] || null);
  const [isChannelInfoOpen, setIsChannelInfoOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  // Обновляем выбранный канал, если список каналов изменился
  React.useEffect(() => {
    if (channels.length > 0 && !selectedChannel) {
      setSelectedChannel(channels[0]);
    }
  }, [channels, selectedChannel]);

  const mockNotifications = [
    { id: 1, title: 'Новый подписчик', text: 'Tech News +1 подписчик', time: '5 мин назад' },
    { id: 2, title: 'Пост опубликован', text: 'Пост в канале Gaming Hub', time: '1 час назад' },
    { id: 3, title: 'Достигнута цель', text: '1000 подписчиков в Crypto Updates', time: '2 часа назад' },
  ];

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6 min-w-0">
      <SidebarTrigger className="-ml-1 flex-shrink-0" />
      
      {/* Channel Selector */}
      <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
        {channels.length > 0 ? (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 max-w-48 truncate">
                  <span className="font-medium truncate">
                    {selectedChannel?.name || 'Выберите канал'}
                  </span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {channels.map((channel) => (
                  <DropdownMenuItem
                    key={channel.id}
                    onClick={() => setSelectedChannel(channel)}
                    className="flex flex-col items-start"
                  >
                    <span className="font-medium truncate w-full">{channel.name}</span>
                    <span className="text-xs text-muted-foreground">@{channel.username}</span>
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
        ) : (
          <span className="text-sm text-muted-foreground">Каналы не подключены</span>
        )}
      </div>
      
      <div className="flex-1 min-w-0" />
      
      <div className="flex items-center gap-2 flex-shrink-0">
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
                <h3 className="font-medium">Поиск</h3>
                <Button variant="ghost" size="sm" onClick={() => setSearchOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Input
                placeholder="Поиск по постам, каналам..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
              {searchQuery && (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Результаты поиска:</p>
                  <div className="space-y-1">
                    <div className="text-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer">
                      Найдено в канале "Tech News"
                    </div>
                    <div className="text-sm p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded cursor-pointer">
                      Пост от 15.12.2024
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
                <h3 className="font-medium">Уведомления</h3>
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
                Показать все
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        
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
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Выйти
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
