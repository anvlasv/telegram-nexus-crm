
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChannelFormContent } from './ChannelFormContent';

interface ChannelFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingChannel: any;
  onSubmit: (data: any, chatData: any) => Promise<void>;
  isSubmitting: boolean;
}

export const ChannelForm: React.FC<ChannelFormProps> = ({
  isOpen,
  onClose,
  editingChannel,
  onSubmit,
  isSubmitting
}) => {
  const { t } = useLanguage();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            {editingChannel ? 'Редактировать канал' : t('add-channel')}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {editingChannel ? 'Обновите информацию о канале' : 'Подключите новый Telegram канал'}
          </DialogDescription>
        </DialogHeader>

        <ChannelFormContent
          editingChannel={editingChannel}
          onSubmit={onSubmit}
          onClose={onClose}
          isOpen={isOpen}
        />
      </DialogContent>
    </Dialog>
  );
};
