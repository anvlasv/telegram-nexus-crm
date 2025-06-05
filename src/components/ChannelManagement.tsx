
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Loader2 } from 'lucide-react';
import { useChannels, useDeleteChannel } from '@/hooks/useChannels';
import { ChannelCard } from '@/components/channel/ChannelCard';
import { ChannelFormDialog } from '@/components/channel/ChannelFormDialog';
import { EmptyChannelsState } from '@/components/channel/EmptyChannelsState';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/hooks/useTelegram';

export const ChannelManagement = () => {
  const { t } = useLanguage();
  const { showConfirm } = useTelegram();
  const { channels, isLoading } = useChannels();
  const deleteChannelMutation = useDeleteChannel();
  const [showForm, setShowForm] = useState(false);
  const [editingChannel, setEditingChannel] = useState(null);

  const handleEdit = (channel: any) => {
    setEditingChannel(channel);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm(t('confirm-delete-channel'));
    if (confirmed) {
      deleteChannelMutation.mutate(id);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingChannel(null);
  };

  const handleCreatePost = () => {
    // Функция создания поста
    console.log('Creating new post...');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {t('channels')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('manage-channels')}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={() => setShowForm(true)} className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            {t('add-channel')}
          </Button>
          <Button onClick={handleCreatePost} variant="outline" className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            {t('create-post')}
          </Button>
        </div>
      </div>

      {channels.length === 0 ? (
        <EmptyChannelsState onAddChannel={() => setShowForm(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

      <ChannelFormDialog
        open={showForm}
        onOpenChange={handleFormClose}
        channel={editingChannel}
      />
    </div>
  );
};
