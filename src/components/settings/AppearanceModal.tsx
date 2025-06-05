
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/hooks/useTelegram';

interface AppearanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AppearanceModal: React.FC<AppearanceModalProps> = ({ open, onOpenChange }) => {
  const { t, language, setLanguage } = useLanguage();
  const { isDarkTheme, toggleTheme } = useTelegram();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('appearance')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Switch id="dark-mode" checked={isDarkTheme} onCheckedChange={toggleTheme} />
            <Label htmlFor="dark-mode">{t('dark-mode')}</Label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t('language')}</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="en">English</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="animations" />
            <Label htmlFor="animations">{t('enable-animations')}</Label>
          </div>
        </div>
        <div className="flex justify-end">
          <Button>{t('save-changes')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
