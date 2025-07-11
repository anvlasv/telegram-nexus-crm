
import React from 'react';
import { ChevronDown, Bell, Globe, User, Settings, LogOut, Moon, Sun } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { useNotifications } from '@/hooks/useNotifications';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';

interface DesktopControlsProps {
  onNotificationsClick: () => void;
}

export const DesktopControls: React.FC<DesktopControlsProps> = ({
  onNotificationsClick
}) => {
  const { user: telegramUser, isDarkTheme, toggleTheme } = useTelegram();
  const { language, setLanguage, t } = useLanguage();
  const { unreadCount } = useNotifications();
  const { profile } = useProfile();
  const navigate = useNavigate();

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

  const getDisplayName = () => {
    if (profile?.full_name) return profile.full_name;
    if (telegramUser?.first_name && telegramUser?.last_name) {
      return `${telegramUser.first_name} ${telegramUser.last_name}`.trim();
    }
    if (telegramUser?.first_name) return telegramUser.first_name;
    return t('user');
  };

  return (
    <div className="flex items-center gap-2">
      {/* Desktop notifications */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="hidden lg:flex relative"
        onClick={onNotificationsClick}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <Badge 
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center text-xs bg-red-500 text-white p-0"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

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

      {/* Desktop Theme toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="hidden lg:flex"
        title={isDarkTheme ? t('light-theme') : t('dark-theme')}
      >
        {isDarkTheme ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      {/* Profile menu - only on desktop */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="hidden lg:flex items-center gap-2">
            <Avatar className="h-6 w-6">
              {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
              <AvatarFallback className="text-xs">
                {getAvatarFallback()}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm max-w-24 truncate">{getDisplayName()}</span>
            <ChevronDown className="h-3 w-3" />
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
    </div>
  );
};
