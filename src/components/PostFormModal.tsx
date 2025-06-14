
import React, { useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePostForm } from '@/hooks/usePostForm';
import { PostTypeSelector } from './scheduler/post-form/PostTypeSelector';
import { TextPostForm } from './scheduler/post-form/TextPostForm';
import { MediaPostForm } from './scheduler/post-form/MediaPostForm';
import { PollPostForm } from './scheduler/post-form/PollPostForm';
import { ScheduleForm } from './scheduler/post-form/ScheduleForm';

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  selectedChannelId: string;
  isLoading: boolean;
  editingPost?: any;
}

export const PostFormModal: React.FC<PostFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  selectedChannelId,
  isLoading,
  editingPost,
}) => {
  const { t } = useLanguage();
  const {
    postType,
    content,
    pollQuestion,
    pollOptions,
    mediaFiles,
    scheduledDate,
    scheduledTime,
    setPostType,
    setContent,
    setPollQuestion,
    setPollOptions,
    setMediaFiles,
    setScheduledDate,
    setScheduledTime,
    resetForm,
    getFormData,
  } = usePostForm({ isOpen, editingPost });

  // Reset form after creating post
  useEffect(() => {
    if (!isLoading && !isOpen) {
      resetForm();
    }
  }, [isLoading, isOpen, resetForm]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scheduledDate || !scheduledTime) {
      return;
    }

    const formData = getFormData();
    onSubmit(formData);
  };

  const renderPostContent = () => {
    if (postType === 'text') {
      return (
        <TextPostForm
          content={content}
          onContentChange={setContent}
        />
      );
    }

    if (postType === 'poll') {
      return (
        <PollPostForm
          pollQuestion={pollQuestion}
          pollOptions={pollOptions}
          onPollQuestionChange={setPollQuestion}
          onPollOptionsChange={setPollOptions}
        />
      );
    }

    if (['photo', 'video', 'audio', 'document'].includes(postType)) {
      return (
        <MediaPostForm
          postType={postType}
          content={content}
          mediaFiles={mediaFiles}
          onContentChange={setContent}
          onMediaFilesChange={setMediaFiles}
        />
      );
    }

    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {editingPost ? t('edit-post') : t('create-post')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <PostTypeSelector
            postType={postType}
            onPostTypeChange={setPostType}
            disabled={!!editingPost}
          />

          {renderPostContent()}

          <ScheduleForm
            scheduledDate={scheduledDate}
            scheduledTime={scheduledTime}
            onScheduledDateChange={setScheduledDate}
            onScheduledTimeChange={setScheduledTime}
          />

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('loading') : t('schedule')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
