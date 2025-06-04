
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Bell, Search, LogOut } from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { ChannelSelector } from '@/components/ChannelSelector';

export const TopNav: React.FC = () => {
  const { user, isDarkTheme, toggleTheme } = useTelegram();
  const { language, setLanguage } = useLanguage();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:px-6">
      <SidebarTrigger className="-ml-1" />
      
      <ChannelSelector />
      
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

        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="h-8 text-xs"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};
