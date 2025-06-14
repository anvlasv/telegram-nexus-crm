
import React from 'react';
import { Bell, Sun, Moon, Globe, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { MiniAppMenu } from "../MiniAppMenu";
import { useTelegram } from '@/hooks/useTelegram';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotifications } from '@/hooks/useNotifications';

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
  const { isDarkTheme, toggleTheme } = useTelegram();
  const { language, setLanguage } = useLanguage();
  const { unreadCount } = useNotifications();

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

      {/* Mobile Theme Switcher */}
      <div className="flex lg:hidden items-center gap-1">
        <Sun className="h-4 w-4 text-muted-foreground" />
        <Switch checked={isDarkTheme} onCheckedChange={toggleTheme} />
        <Moon className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Mobile Language toggle - глобус и буквы в одну строчку */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
        className="flex lg:hidden items-center gap-1 px-2"
      >
        <Globe className="h-4 w-4" />
        <span className="text-xs">{language.toUpperCase()}</span>
      </Button>

      {/* Mobile Menu Sheet */}
      <div className="block lg:hidden">
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
