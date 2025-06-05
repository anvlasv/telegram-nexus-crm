
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useLanguage } from '@/contexts/LanguageContext';

interface SecurityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SecurityModal: React.FC<SecurityModalProps> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('security')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="current-password" className="text-right">
              {t('current-password')}
            </Label>
            <Input id="current-password" type="password" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="new-password" className="text-right">
              {t('new-password')}
            </Label>
            <Input id="new-password" type="password" className="col-span-3" />
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="two-factor" />
            <Label htmlFor="two-factor">{t('enable-two-factor')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="login-notifications" />
            <Label htmlFor="login-notifications">{t('login-notifications')}</Label>
          </div>
        </div>
        <div className="flex justify-end">
          <Button>{t('save-changes')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
