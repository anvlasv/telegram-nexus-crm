
import React, { useState } from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, Search, Settings, ChevronDown, LogOut, User } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { ChannelInfoModal } from './ChannelInfoModal';

// Моковые данные каналов
const mockChannels = [
  { id: '1', name: 'Tech News', username: '@technews', subscribers: 15420 },
  { id: '2', name: 'Gaming Hub', username: '@gaminghub', subscribers: 8732 },
  { id: '3', name: 'Crypto Updates', username: '@cryptoupdates', subscribers: 23456 },
];

export const TopNav: React.FC = () => {
  const { isDarkTheme, toggleTheme } = useTelegram();
  const { language, setLanguage } = useLanguage();
  const { user, signOut } = useAuth();
  const [selectedChannel, setSelectedChannel] = useState(mockChannels[0]);
  const [isChannelInfoOpen, setIsChannelInfoOpen] = useState(false);

  const handleSignOut = () => {
    signOut();
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <SidebarTrigger className="-ml-1" />
      
      {/* Channel Selector */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <span className="font-medium">{selectedChannel.name}</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {mockChannels.map((channel) => (
              <DropdownMenuItem
                key={channel.id}
                onClick={() => setSelectedChannel(channel)}
                className="flex flex-col items-start"
              >
                <span className="font-medium">{channel.name}</span>
                <span className="text-xs text-muted-foreground">{channel.username}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsChannelInfoOpen(true)}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Search className="h-4 w-4" />
        </Button>
        
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
        >
          <Bell className="h-4 w-4" />
        </Button>
        
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
            <div className="px-2 py-1.5 text-sm text-muted-foreground">
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
      
      <ChannelInfoModal
        channel={selectedChannel}
        isOpen={isChannelInfoOpen}
        onClose={() => setIsChannelInfoOpen(false)}
      />
    </header>
  );
};
