
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, List, Calendar as CalendarIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScheduledPosts } from '@/hooks/useScheduledPosts';
import { useSchedulerActions } from '@/hooks/useSchedulerActions';
import { PostFormModal } from './PostFormModal';
import { CalendarView } from './scheduler/CalendarView';
import { ListView } from './scheduler/ListView';
import { useChannels } from '@/hooks/useChannels';
import { ChannelSwitchLoader } from './ChannelSwitchLoader';

export const Scheduler: React.FC = () => {
  const { t } = useLanguage();
  const { channels, selectedChannelId, isChannelSwitching } = useChannels();
  const { data: posts = [], isLoading } = useScheduledPosts();
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [editingPost, setEditingPost] = useState<any>(null);

  const selectedChannel = channels.find(c => c.id === selectedChannelId);
  const { handleCreatePost, handlePublishPost, handleDeletePost, isCreating, isUpdating } = useSchedulerActions(selectedChannel);

  // Показываем лоадер переключения канала
  if (isChannelSwitching) {
    return <ChannelSwitchLoader channelName={selectedChannel?.name} />;
  }

  // Filter posts by selected channel
  const filteredPosts = selectedChannel
    ? posts.filter((post) => post.channel_id === selectedChannel.id)
    : [];

  const onSubmitPost = async (formData: any) => {
    const success = await handleCreatePost(formData, editingPost);
    if (success) {
      setShowForm(false);
      setEditingPost(null);
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleCreateNewPost = () => {
    if (!selectedChannel) {
      return;
    }
    setShowForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
          {t('loading')}
        </div>
      </div>
    );
  }

  if (!selectedChannel) {
    return (
      <div className="w-full h-full overflow-hidden">
        <div className="h-full flex flex-col p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">{t('no-channel-selected')}</h2>
              <p className="text-muted-foreground">{t('select-channel-to-continue')}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="h-full flex flex-col p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex-shrink-0 space-y-3 md:space-y-4">
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{t('scheduler')}</h1>
              <p className="text-sm md:text-base text-muted-foreground mt-1">
                {t('scheduler-description')} - {selectedChannel.name}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <Button 
                onClick={handleCreateNewPost}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
                size="default"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{t('schedule-post')}</span>
                <span className="sm:hidden">{t('post')}</span>
              </Button>
            </div>
          </div>
          
          {/* View Mode Toggles */}
          <div className="flex gap-2">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              onClick={() => setViewMode('list')}
              size="default"
              className="flex-1 md:flex-initial"
            >
              <List className="mr-2 h-4 w-4" />
              <span>{t('list')}</span>
            </Button>
            <Button 
              variant={viewMode === 'calendar' ? 'default' : 'outline'} 
              onClick={() => setViewMode('calendar')}
              size="default"
              className="flex-1 md:flex-initial"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>{t('calendar')}</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full overflow-auto">
            {viewMode === 'calendar' ? (
              <CalendarView
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                posts={filteredPosts}
                onEditPost={handleEditPost}
                onPublishPost={handlePublishPost}
                onDeletePost={handleDeletePost}
              />
            ) : (
              <ListView
                posts={filteredPosts}
                onEditPost={handleEditPost}
                onPublishPost={handlePublishPost}
                onDeletePost={handleDeletePost}
                onCreatePost={handleCreateNewPost}
                hasSelectedChannel={!!selectedChannel}
              />
            )}
          </div>
        </div>
      </div>

      <PostFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingPost(null);
        }}
        onSubmit={onSubmitPost}
        selectedChannelId={selectedChannel?.id || ''}
        isLoading={isCreating || isUpdating}
        editingPost={editingPost}
      />
    </div>
  );
};
