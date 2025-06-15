
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChannels, useCreateChannel, useUpdateChannel, useDeleteChannel } from '@/hooks/useChannels';
import { toast } from 'sonner';
import { ChannelCard } from './channel-management/ChannelCard';
import { ChannelForm } from './channel-management/ChannelForm';
import { EmptyChannelState } from './channel-management/EmptyChannelState';

export const ChannelManagement: React.FC = () => {
  const { t } = useLanguage();
  const { channels, isLoading } = useChannels();
  const createChannel = useCreateChannel();
  const updateChannel = useUpdateChannel();
  const deleteChannel = useDeleteChannel();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<any>(null);

  const resetForm = () => {
    setEditingChannel(null);
  };

  const handleFormSubmit = async (formData: any, chatData: any) => {
    try {
      const channelData = {
        name: chatData?.title || chatData?.username || formData.username || 'Untitled Channel',
        username: chatData?.username || formData.username,
        channel_id: chatData?.id || editingChannel?.channel_id,
        type: formData.type,
        status: formData.status,
        timezone: formData.timezone,
        subscriber_count: chatData?.member_count || editingChannel?.subscriber_count || 0,
        avatar_url: chatData?.avatar_url || (editingChannel ? editingChannel.avatar_url : null),
      };

      if (editingChannel) {
        await updateChannel.mutateAsync({
          id: editingChannel.id,
          ...channelData,
        });
        toast.success('Канал успешно обновлен');
      } else {
        await createChannel.mutateAsync(channelData);
        toast.success('Канал успешно подключен');
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

  const handleAddChannel = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500 dark:text-gray-400">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0 max-w-screen-lg mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
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
              onClick={handleAddChannel}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            >
              <Plus className="h-4 w-4 mr-2" />
              {t('add-channel')}
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {channels.length === 0 ? (
        <EmptyChannelState onAddChannel={handleAddChannel} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
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

      <ChannelForm
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          resetForm();
        }}
        editingChannel={editingChannel}
        onSubmit={handleFormSubmit}
        isSubmitting={createChannel.isPending || updateChannel.isPending}
      />
    </div>
  );
};
