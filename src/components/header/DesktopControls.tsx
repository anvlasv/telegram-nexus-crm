
import React from 'react';
import { ChevronDown, Bell, Sun, Moon, Globe, User, Settings, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTelegram } from '@/hooks/useTelegram';
import { useLanguage } from '@/contexts/LanguageContext';

export const DesktopControls: React.FC = () => {
  const { isDarkTheme, toggleTheme } = useTelegram();
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      {/* Desktop notifications */}
      <Button variant="ghost" size="sm" className="hidden lg:flex">
        <Bell className="h-4 w-4" />
      </Button>

      {/* Desktop Theme Switcher */}
      <div className="hidden lg:flex items-center gap-1">
        <Sun className="h-4 w-4 text-muted-foreground" />
        <Switch checked={isDarkTheme} onCheckedChange={toggleTheme} />
        <Moon className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Desktop Language toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
        className="hidden lg:flex"
      >
        <Globe className="h-4 w-4" />
        <span className="ml-1 text-xs">{language.toUpperCase()}</span>
      </Button>

      {/* Profile menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="hidden lg:flex items-center gap-2">
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
    </div>
  );
};
