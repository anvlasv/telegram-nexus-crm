
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCreateScheduledPost, useUpdateScheduledPost, useDeleteScheduledPost, usePublishPost } from './useScheduledPosts';

export const useSchedulerActions = (selectedChannel: any) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const createPost = useCreateScheduledPost();
  const updatePost = useUpdateScheduledPost();
  const deletePost = useDeleteScheduledPost();
  const publishPost = usePublishPost();

  const handleCreatePost = async (formData: any, editingPost?: any) => {
    if (!selectedChannel) {
      toast({
        title: t('error'),
        description: t('select-channel-first'),
        variant: 'destructive',
      });
      return false;
    }

    try {
      if (editingPost) {
        await updatePost.mutateAsync({
          id: editingPost.id,
          content: formData.content || formData.pollQuestion || '',
          scheduled_for: formData.scheduledFor,
          mediaFiles: formData.mediaFiles,
          post_type: formData.type,
          poll_options: formData.pollOptions?.length > 0 ? formData.pollOptions : null,
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
          mediaFiles: formData.mediaFiles,
          post_type: formData.type,
          poll_options: formData.pollOptions?.length > 0 ? formData.pollOptions : null,
        });

        toast({
          title: t('success'),
          description: t('post-scheduled-successfully'),
        });
      }

      return true;
    } catch (error: any) {
      console.error('Error creating/updating scheduled post:', error);
      toast({
        title: t('error'),
        description: error?.message || (editingPost ? t('error-updating-post') : t('error-scheduling-post')),
        variant: 'destructive',
      });
      return false;
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
    } catch (error: any) {
      console.error('[Scheduler] Error publishing post:', error);
      toast({
        title: t('error'),
        description: error?.message || t('error-publishing-post'),
        variant: 'destructive',
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    if (confirm(t('confirm-delete-post'))) {
      try {
        await deletePost.mutateAsync(id);
        toast({
          title: t('success'),
          description: t('post-deleted'),
        });
      } catch (error: any) {
        console.error('Error deleting post:', error);
        toast({
          title: t('error'),
          description: error?.message || t('error-deleting-post'),
          variant: 'destructive',
        });
      }
    }
  };

  return {
    handleCreatePost,
    handlePublishPost,
    handleDeletePost,
    isCreating: createPost.isPending,
    isUpdating: updatePost.isPending,
    isPublishing: publishPost.isPending,
  };
};
