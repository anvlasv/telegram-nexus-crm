
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
      await publishPost.mutateAsync({
        postId,
        channelId: selectedChannel.id
      });

      toast({
        title: t('success'),
        description: t('post-published'),
      });
    } catch (error) {
      console.error('Error publishing post:', error);
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
    return <div className="flex items-center justify-center h-64">{t('loading')}</div>;
  }

  return (
    <div className="space-y-4 p-2 md:p-4 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl md:text-2xl font-bold">{t('scheduler')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('scheduler-description')}
            </p>
          </div>
          
          <Button 
            onClick={handleCreateNewPost}
            className="bg-blue-600 hover:bg-blue-700 text-white self-start"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t('schedule-post')}</span>
            <span className="sm:hidden">{t('post')}</span>
          </Button>
        </div>
        
        {/* View Mode Toggles */}
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            onClick={() => setViewMode('list')}
            size="sm"
            className="flex-1 sm:flex-initial"
          >
            <List className="mr-2 h-4 w-4" />
            {t('list')}
          </Button>
          <Button 
            variant={viewMode === 'calendar' ? 'default' : 'outline'} 
            onClick={() => setViewMode('calendar')}
            size="sm"
            className="flex-1 sm:flex-initial"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {t('calendar')}
          </Button>
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

      {viewMode === 'calendar' ? (
        <CalendarView
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          posts={posts}
          onEditPost={handleEditPost}
          onPublishPost={handlePublishPost}
          onDeletePost={handleDeletePost}
        />
      ) : (
        <ListView
          posts={posts}
          onEditPost={handleEditPost}
          onPublishPost={handlePublishPost}
          onDeletePost={handleDeletePost}
          onCreatePost={handleCreateNewPost}
          hasSelectedChannel={!!selectedChannel}
        />
      )}
    </div>
  );
};
