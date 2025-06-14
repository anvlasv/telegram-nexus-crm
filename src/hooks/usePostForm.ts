
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface UsePostFormProps {
  isOpen: boolean;
  editingPost?: any;
}

export const usePostForm = ({ isOpen, editingPost }: UsePostFormProps) => {
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
      now.setMinutes(now.getMinutes() + 30);
      
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
      setPostType(editingPost.post_type || 'text');
      
      if (editingPost.post_type === 'poll') {
        setPollQuestion(editingPost.content || '');
        setPollOptions(editingPost.poll_options || ['', '']);
      }
      
      // Clear media files when editing - we'll show media URLs instead
      setMediaFiles([]);
      
      const scheduledFor = new Date(editingPost.scheduled_for);
      setScheduledDate(format(scheduledFor, 'yyyy-MM-dd'));
      setScheduledTime(format(scheduledFor, 'HH:mm'));
    } else {
      resetForm();
    }
  }, [editingPost]);

  const resetForm = () => {
    setContent('');
    setPollQuestion('');
    setPollOptions(['', '']);
    setMediaFiles([]);
    setPostType('text');
    const now = new Date();
    now.setMinutes(now.getMinutes() + 30);
    setScheduledDate(format(now, 'yyyy-MM-dd'));
    setScheduledTime(format(now, 'HH:mm'));
  };

  const getFormData = () => {
    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
    
    return {
      type: postType,
      content: postType === 'poll' ? pollQuestion : content,
      pollQuestion: postType === 'poll' ? pollQuestion : '',
      pollOptions: postType === 'poll' ? pollOptions.filter(option => option.trim()) : [],
      mediaFiles: (postType === 'photo' || postType === 'video' || postType === 'audio' || postType === 'document') ? mediaFiles : [],
      scheduledFor,
    };
  };

  return {
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
  };
};
