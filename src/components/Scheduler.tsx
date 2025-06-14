import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, List, Calendar as CalendarIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScheduledPosts, useCreateScheduledPost, useDeleteScheduledPost, useUpdateScheduledPost, usePublishPost } from '@/hooks/useScheduledPosts';
import { PostFormModal } from './PostFormModal';
import { CalendarView } from './scheduler/CalendarView';
import { ListView } from './scheduler/ListView';
import { useToast } from '@/hooks/use-toast';
import { useChannels } from '@/hooks/useChannels';

export const Scheduler: React.FC = () => {
  const { t } = useLanguage();
  const { channels, selectedChannelId } = useChannels();
  const { data: posts = [], isLoading } = useScheduledPosts();
  const createPost = useCreateScheduledPost();
  const deletePost = useDeleteScheduledPost();
  const updatePost = useUpdateScheduledPost();
  const publishPost = usePublishPost();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [editingPost, setEditingPost] = useState<any>(null);

  const selectedChannel = channels.find(c => c.id === selectedChannelId) || channels[0];

  // ВАЖНО: фильтруем посты только по выбранному каналу
  const filteredPosts = selectedChannel
    ? posts.filter((post) => post.channel_id === selectedChannel.id)
    : [];

  const handleCreatePost = async (formData: any) => {
    if (!selectedChannel) {
      toast({
        title: t('error'),
        description: t('select-channel-first'),
        variant: 'destructive',
      });
      return;
    }

    try {
      if (editingPost) {
        await updatePost.mutateAsync({
          id: editingPost.id,
          content: formData.content || formData.pollQuestion || '',
          scheduled_for: formData.scheduledFor,
          media_urls: formData.mediaFiles?.map((file: File) => file.name) || null,
        });
        
        toast({
          title: t('success'),
          description: t('post-updated-successfully'),
        });
      } else {
        await createPost.mutateAsync({
          channel_id: selectedChannel.id,
          content: formData.content || formData.pollQuestion || '',
          scheduled_for: formData.scheduledFor,
          status: 'pending',
          media_urls: formData.mediaFiles?.map((file: File) => file.name) || null,
        });

        toast({
          title: t('success'),
          description: t('post-scheduled-successfully'),
        });
      }

      setShowForm(false);
      setEditingPost(null);
    } catch (error) {
      console.error('Error creating/updating scheduled post:', error);
      toast({
        title: t('error'),
        description: editingPost ? t('error-updating-post') : t('error-scheduling-post'),
        variant: 'destructive',
      });
    }
  };

  const handlePublishPost = async (postId: string) => {
    if (!selectedChannel) {
      toast({
        title: t('error'),
        description: t('select-channel-first'),
        variant: 'destructive',
      });
      return;
    }

    try {
      console.log('[Scheduler] Publishing post:', { postId, channelId: selectedChannel.id });
      await publishPost.mutateAsync({
        postId,
        channelId: selectedChannel.id
      });

      toast({
        title: t('success'),
        description: t('post-published'),
      });
    } catch (error) {
      console.error('[Scheduler] Error publishing post:', error);
      toast({
        title: t('error'),
        description: t('error-publishing-post'),
        variant: 'destructive',
      });
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDeletePost = async (id: string) => {
    if (confirm(t('confirm-delete-post'))) {
      try {
        await deletePost.mutateAsync(id);
        toast({
          title: t('success'),
          description: t('post-deleted'),
        });
      } catch (error) {
        console.error('Error deleting post:', error);
        toast({
          title: t('error'),
          description: t('error-deleting-post'),
          variant: 'destructive',
        });
      }
    }
  };

  const handleCreateNewPost = () => {
    if (!selectedChannel) {
      toast({
        title: t('error'),
        description: t('select-channel-first'),
        variant: 'destructive',
      });
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

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="h-full flex flex-col p-2 sm:p-3 md:p-4 space-y-3 sm:space-y-4">
        {/* Header */}
        <div className="flex-shrink-0 space-y-2 sm:space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:space-y-0 flex-wrap gap-2 sm:gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-lg md:text-xl font-bold truncate">{t('scheduler')}</h1>
              <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
                {t('scheduler-description')}
              </p>
            </div>
            
            <div className="flex-shrink-0">
              <Button 
                onClick={handleCreateNewPost}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm"
                size="sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">{t('schedule-post')}</span>
                <span className="sm:hidden">{t('post')}</span>
              </Button>
            </div>
          </div>
          
          {/* View Mode Toggles */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            <Button 
              variant={viewMode === 'list' ? 'default' : 'outline'} 
              onClick={() => setViewMode('list')}
              size="sm"
              className="flex-1 sm:flex-initial min-w-0 text-xs sm:text-sm"
            >
              <List className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">{t('list')}</span>
            </Button>
            <Button 
              variant={viewMode === 'calendar' ? 'default' : 'outline'} 
              onClick={() => setViewMode('calendar')}
              size="sm"
              className="flex-1 sm:flex-initial min-w-0 text-xs sm:text-sm"
            >
              <CalendarIcon className="mr-2 h-4 w-4 flex-shrink-0" />
              <span className="truncate">{t('calendar')}</span>
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
        onSubmit={handleCreatePost}
        selectedChannelId={selectedChannel?.id || ''}
        isLoading={createPost.isPending || updatePost.isPending}
        editingPost={editingPost}
      />
    </div>
  );
};
