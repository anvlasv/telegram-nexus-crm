
import React from 'react';
import { Bell, Menu, Globe, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MiniAppMenu } from "../MiniAppMenu";
import { useNotifications } from '@/hooks/useNotifications';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/hooks/useTelegram';
import { useProfile } from '@/hooks/useProfile';

interface MobileControlsProps {
  showMenuSheet: boolean;
  setShowMenuSheet: (show: boolean) => void;
  onNotificationsClick: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  showMenuSheet,
  setShowMenuSheet,
  onNotificationsClick
}) => {
  const { unreadCount } = useNotifications();
  const { language, setLanguage } = useLanguage();
  const { user: telegramUser, isDarkTheme, toggleTheme } = useTelegram();
  const { profile } = useProfile();

  const getAvatarFallback = () => {
    if (profile?.full_name) {
      return profile.full_name[0].toUpperCase();
    }
    if (telegramUser?.first_name) {
      return telegramUser.first_name[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="flex items-center gap-2">
      {/* Mobile notifications */}
      <Button 
        variant="ghost" 
        size="sm" 
        className="block lg:hidden relative"
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

      {/* Mobile Language toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
        className="block lg:hidden"
      >
        <Globe className="h-4 w-4" />
        <span className="ml-1 text-xs">{language.toUpperCase()}</span>
      </Button>

      {/* Mobile Theme toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleTheme}
        className="block lg:hidden"
      >
        {isDarkTheme ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </Button>

      {/* Mobile Avatar */}
      <div className="block lg:hidden">
        <Avatar className="h-8 w-8">
          {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
          <AvatarFallback className="text-xs">
            {getAvatarFallback()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Mobile Menu Sheet - only show on mobile (below md breakpoint) */}
      <div className="block md:hidden">
        <Sheet open={showMenuSheet} onOpenChange={setShowMenuSheet}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="ml-1"
              aria-label="Меню"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 p-0">
            <div className="pt-4 pb-8 px-3">
              <MiniAppMenu onSelect={() => setShowMenuSheet(false)} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
