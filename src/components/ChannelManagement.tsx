
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChannels, useCreateChannel, useUpdateChannel, useDeleteChannel } from '@/hooks/useChannels';
import { toast } from 'sonner';
import { ChannelForm } from '@/components/channel/ChannelForm';
import { BotSetupInstructions } from '@/components/channel/BotSetupInstructions';
import { ChannelCard } from '@/components/channel/ChannelCard';
import { EmptyChannelsState } from '@/components/channel/EmptyChannelsState';

export const ChannelManagement: React.FC = () => {
  const { t } = useLanguage();
  const { data: channels = [], isLoading } = useChannels();
  const createChannel = useCreateChannel();
  const updateChannel = useUpdateChannel();
  const deleteChannel = useDeleteChannel();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    type: 'channel' as 'channel' | 'group',
    status: 'active' as 'active' | 'paused' | 'archived',
  });

  const resetForm = () => {
    setFormData({
      username: '',
      type: 'channel',
      status: 'active',
    });
    setEditingChannel(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingChannel) {
        await updateChannel.mutateAsync({
          id: editingChannel.id,
          ...formData,
        });
        toast.success('Канал успешно обновлен');
      } else {
        await createChannel.mutateAsync({
          ...formData,
          name: formData.username,
          channel_id: 0,
        });
        toast.success('Канал успешно добавлен. Бот @Teleg_CRMbot обновит данные автоматически.');
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Ошибка при сохранении канала');
      console.error('Error saving channel:', error);
    }
  };

  const handleEdit = (channel: any) => {
    setEditingChannel(channel);
    setFormData({
      username: channel.username,
      type: channel.type,
      status: channel.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот канал?')) {
      try {
        await deleteChannel.mutateAsync(id);
        toast.success('Канал успешно удален');
      } catch (error) {
        toast.error('Ошибка при удалении канала');
        console.error('Error deleting channel:', error);
      }
    }
  };

  const handleDialogCancel = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500 dark:text-gray-400">{t('loading')}</div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t('channel-management')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {t('manage-channels')}
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('add-channel')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-gray-100">
                  {editingChannel ? 'Редактировать канал' : t('add-channel')}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  {editingChannel ? 'Обновите информацию о канале' : 'Подключите новый Telegram канал'}
                </DialogDescription>
              </DialogHeader>

              <BotSetupInstructions />

              <ChannelForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onCancel={handleDialogCancel}
                isEditing={!!editingChannel}
                isLoading={createChannel.isPending || updateChannel.isPending}
              />
            </DialogContent>
          </Dialog>
        </div>

        {channels.length === 0 ? (
          <EmptyChannelsState
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            onResetForm={resetForm}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
