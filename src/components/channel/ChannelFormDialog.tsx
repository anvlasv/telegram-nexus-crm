
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BotSetupInstructions } from './BotSetupInstructions';
import { ChannelForm } from './ChannelForm';
import { useCreateChannel, useUpdateChannel } from '@/hooks/useChannels';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';

interface ChannelFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  channel?: any;
}

export const ChannelFormDialog: React.FC<ChannelFormDialogProps> = ({
  open,
  onOpenChange,
  channel,
}) => {
  const { t } = useLanguage();
  const createChannelMutation = useCreateChannel();
  const updateChannelMutation = useUpdateChannel();
  const isEditing = !!channel;

  const [formData, setFormData] = useState({
    username: channel?.username || '',
    type: channel?.type || 'channel' as 'channel' | 'group',
    status: channel?.status || 'active' as 'active' | 'paused' | 'archived',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        await updateChannelMutation.mutateAsync({
          id: channel.id,
          ...formData,
        });
        toast.success('Канал обновлен');
      } else {
        await createChannelMutation.mutateAsync({
          ...formData,
          name: formData.username, // Temporary, will be updated by bot
          channel_id: 0, // Temporary, will be updated by bot
        });
        toast.success('Канал добавлен');
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Произошла ошибка');
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            {isEditing ? 'Редактировать канал' : 'Добавить канал'}
          </DialogTitle>
        </DialogHeader>
        
        {!isEditing && <BotSetupInstructions />}
        
        <ChannelForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isEditing={isEditing}
          isLoading={createChannelMutation.isPending || updateChannelMutation.isPending}
        />
      </DialogContent>
    </Dialog>
  );
};
