
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FileDropZone } from './FileDropZone';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';

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
  const [postType, setPostType] = useState('text');
  const [content, setContent] = useState('');
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');

  // Set default date and time
  useEffect(() => {
    if (isOpen && !editingPost) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 30); // Default to 30 minutes from now
      
      const dateStr = format(now, 'yyyy-MM-dd');
      const timeStr = format(now, 'HH:mm');
      
      setScheduledDate(dateStr);
      setScheduledTime(timeStr);
    }
  }, [isOpen, editingPost]);

  // Populate form when editing
  useEffect(() => {
    if (editingPost) {
      setContent(editingPost.content || '');
      setPostType('text'); // Default to text for editing
      
      const scheduledFor = new Date(editingPost.scheduled_for);
      setScheduledDate(format(scheduledFor, 'yyyy-MM-dd'));
      setScheduledTime(format(scheduledFor, 'HH:mm'));
    } else {
      // Reset form for new post
      setContent('');
      setPollQuestion('');
      setPollOptions(['', '']);
      setMediaFiles([]);
      setPostType('text');
    }
  }, [editingPost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!scheduledDate || !scheduledTime) {
      return;
    }

    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    
    const formData = {
      type: postType,
      content: postType === 'text' ? content : '',
      pollQuestion: postType === 'poll' ? pollQuestion : '',
      pollOptions: postType === 'poll' ? pollOptions.filter(option => option.trim()) : [],
      mediaFiles: postType !== 'text' ? mediaFiles : [],
      scheduledFor,
    };

    onSubmit(formData);
  };

  const addPollOption = () => {
    setPollOptions([...pollOptions, '']);
  };

  const removePollOption = (index: number) => {
    setPollOptions(pollOptions.filter((_, i) => i !== index));
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const getAcceptedFileTypes = () => {
    switch (postType) {
      case 'photo': return 'image/*';
      case 'video': return 'video/*';
      default: return '*/*';
    }
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
          {/* Post Type */}
          {!editingPost && (
            <div className="space-y-3">
              <Label>{t('post-type')}</Label>
              <RadioGroup value={postType} onValueChange={setPostType}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="text" id="text" />
                  <label htmlFor="text" className="text-sm">{t('text-post')}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="photo" id="photo" />
                  <label htmlFor="photo" className="text-sm">{t('photo-post')}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="video" id="video" />
                  <label htmlFor="video" className="text-sm">{t('video-post')}</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="poll" id="poll" />
                  <label htmlFor="poll" className="text-sm">{t('poll-post')}</label>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Content based on post type */}
          {postType === 'text' && (
            <div className="space-y-2">
              <Label htmlFor="content">{t('post-content')}</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={t('post-content-placeholder')}
                rows={6}
                required
              />
            </div>
          )}

          {postType === 'poll' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="poll-question">{t('poll-question')}</Label>
                <Input
                  id="poll-question"
                  value={pollQuestion}
                  onChange={(e) => setPollQuestion(e.target.value)}
                  placeholder={t('poll-question')}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>{t('poll-option')}</Label>
                {pollOptions.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updatePollOption(index, e.target.value)}
                      placeholder={`${t('poll-option')} ${index + 1}`}
                      required={index < 2}
                    />
                    {index >= 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removePollOption(index)}
                      >
                        {t('remove-poll-option')}
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addPollOption}
                  disabled={pollOptions.length >= 10}
                >
                  {t('add-poll-option')}
                </Button>
              </div>
            </div>
          )}

          {(postType === 'photo' || postType === 'video') && (
            <div className="space-y-2">
              <Label>{t('attach-media')}</Label>
              <FileDropZone
                onFilesChange={setMediaFiles}
                accept={getAcceptedFileTypes()}
                multiple={postType === 'photo'}
                maxFiles={postType === 'photo' ? 10 : 1}
                currentFiles={mediaFiles}
              />
              {(postType === 'photo' || postType === 'video') && (
                <div className="space-y-2 mt-4">
                  <Label htmlFor="caption">{t('post-content')}</Label>
                  <Textarea
                    id="caption"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={t('post-content-placeholder')}
                    rows={3}
                  />
                </div>
              )}
            </div>
          )}

          {/* Schedule DateTime */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="schedule-date">{t('schedule-date')}</Label>
              <Input
                id="schedule-date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="schedule-time">{t('schedule-time')}</Label>
              <Input
                id="schedule-time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Actions */}
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
