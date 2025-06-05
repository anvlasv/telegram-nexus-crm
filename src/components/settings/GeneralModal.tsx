
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';

interface GeneralModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GeneralModal: React.FC<GeneralModalProps> = ({ open, onOpenChange }) => {
  const { t } = useLanguage();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('general-settings')}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Switch id="notifications" />
            <Label htmlFor="notifications">{t('enable-notifications')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="auto-save" />
            <Label htmlFor="auto-save">{t('auto-save')}</Label>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">{t('timezone')}</Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={t('select-timezone')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="utc">UTC</SelectItem>
                <SelectItem value="moscow">Moscow</SelectItem>
                <SelectItem value="london">London</SelectItem>
                <SelectItem value="newyork">New York</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end">
          <Button>{t('save-changes')}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
