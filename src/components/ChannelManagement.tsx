import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChannels, useCreateChannel, useUpdateChannel, useDeleteChannel } from '@/hooks/useChannels';
import { useAdvertisingCampaigns } from '@/hooks/useAdvertisingCampaigns';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ChannelCard } from './channel-management/ChannelCard';
import { ChannelForm } from './channel-management/ChannelForm';
import { EmptyChannelState } from './channel-management/EmptyChannelState';

export const ChannelManagement: React.FC = () => {
  const { t } = useLanguage();
  const { channels, isLoading } = useChannels();
  const { data: campaigns = [] } = useAdvertisingCampaigns();
  const createChannel = useCreateChannel();
  const updateChannel = useUpdateChannel();
  const deleteChannel = useDeleteChannel();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const resetForm = () => {
    setEditingChannel(null);
  };

  const handleFormSubmit = async (formData: any, chatData: any) => {
    console.log('[ChannelManagement] handleFormSubmit called with:', {
      formData,
      chatData,
      editingChannel
    });

    try {
      if (editingChannel) {
        // При редактировании используем название из существующего канала (из Telegram API)
        const channelData = {
          name: editingChannel.name, // Всегда используем существующее название
          username: formData.username,
          channel_id: editingChannel.channel_id,
          type: formData.type,
          status: formData.status,
          timezone: formData.timezone || 'Europe/Moscow',
          subscriber_count: editingChannel.subscriber_count || 0,
          avatar_url: editingChannel.avatar_url,
        };

        console.log('[ChannelManagement] Updating channel with data:', channelData);
        await updateChannel.mutateAsync({
          id: editingChannel.id,
          ...channelData,
        });
        console.log('[ChannelManagement] Channel update successful');
        toast.success('Канал успешно обновлен');
      } else {
        // При создании нового канала используем данные из Telegram API
        const channelData = {
          name: chatData?.title || chatData?.username || formData.username || 'Untitled Channel',
          username: chatData?.username || formData.username,
          channel_id: chatData?.id || chatData?.channel_id,
          type: formData.type,
          status: formData.status,
          timezone: formData.timezone || 'Europe/Moscow',
          subscriber_count: chatData?.member_count || 0,
          avatar_url: chatData?.avatar_url || null,
        };

        console.log('[ChannelManagement] Creating new channel with data:', channelData);
        await createChannel.mutateAsync(channelData);
        console.log('[ChannelManagement] Channel creation successful');
        toast.success('Канал успешно подключен');
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('[ChannelManagement] Error in handleFormSubmit:', error);
      
      if (error instanceof Error) {
        console.error('[ChannelManagement] Error details:', {
          message: error.message,
          stack: error.stack,
          name: error.name
        });
      }
      
      toast.error('Ошибка при сохранении канала: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    }
  };

  const handleEdit = (channel: any) => {
    setEditingChannel(channel);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (channel: any) => {
    setChannelToDelete(channel);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!channelToDelete) return;

    setIsDeleting(true);
    
    try {
      // Находим все кампании связанные с каналом
      const relatedCampaigns = campaigns.filter(
        (campaign: any) => campaign.channel_id === channelToDelete.id
      );

      console.log('[ChannelManagement] Deleting channel with related campaigns:', {
        channelId: channelToDelete.id,
        campaignsCount: relatedCampaigns.length
      });

      // Сначала удаляем все связанные кампании
      if (relatedCampaigns.length > 0) {
        for (const campaign of relatedCampaigns) {
          console.log('[ChannelManagement] Deleting campaign:', campaign.id);
          const { error: campaignError } = await supabase
            .from('advertising_campaigns')
            .delete()
            .eq('id', campaign.id);
          
          if (campaignError) {
            console.error('[ChannelManagement] Error deleting campaign:', campaignError);
            throw campaignError;
          }
        }
        console.log('[ChannelManagement] All related campaigns deleted successfully');
      }

      // Теперь удаляем канал
      console.log('[ChannelManagement] Deleting channel:', channelToDelete.id);
      await deleteChannel.mutateAsync(channelToDelete.id);
      
      console.log('[ChannelManagement] Channel deleted successfully');
      toast.success(`Канал "${channelToDelete.name}" и все связанные кампании (${relatedCampaigns.length}) успешно удалены`);
      
      setDeleteDialogOpen(false);
      setChannelToDelete(null);
    } catch (error) {
      console.error('[ChannelManagement] Error during deletion process:', error);
      toast.error('Ошибка при удалении: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    } finally {
      setIsDeleting(false);
    }
  };

  const getRelatedCampaignsCount = (channelId: string) => {
    return campaigns.filter((campaign: any) => campaign.channel_id === channelId).length;
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот канал?')) {
      try {
        await deleteChannel.mutateAsync(id);
        toast.success('Канал успешно удален');
      } catch (error) {
        console.error('Error deleting channel:', error);
        
        // Проверяем специфичные ошибки
        if (error instanceof Error && error.message.includes('foreign key constraint')) {
          toast.error('Невозможно удалить канал: у него есть связанные рекламные кампании. Сначала удалите все кампании этого канала.');
        } else if (error instanceof Error && error.message.includes('23503')) {
          toast.error('Невозможно удалить канал: у него есть связанные данные. Сначала удалите все связанные записи.');
        } else {
          toast.error('Ошибка при удалении канала: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
        }
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
              onDelete={handleDeleteClick}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить канал?</AlertDialogTitle>
            <AlertDialogDescription>
              {channelToDelete && (
                <div className="space-y-2">
                  <p>Вы уверены, что хотите удалить канал <strong>"{channelToDelete.name}"</strong>?</p>
                  {getRelatedCampaignsCount(channelToDelete.id) > 0 && (
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md p-3">
                      <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                        ⚠️ Внимание!
                      </p>
                      <p className="text-yellow-700 dark:text-yellow-300 text-sm mt-1">
                        Вместе с каналом будут удалены <strong>{getRelatedCampaignsCount(channelToDelete.id)}</strong> связанных рекламных кампаний.
                      </p>
                    </div>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Это действие нельзя отменить.
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? 'Удаление...' : 'Удалить'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
