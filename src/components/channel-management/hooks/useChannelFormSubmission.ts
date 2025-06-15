
import { useState } from 'react';
import { toast } from 'sonner';

interface UseChannelFormSubmissionProps {
  onSubmit: (data: any, chatData: any) => Promise<void>;
  onClose: () => void;
  resetForm: () => void;
}

export const useChannelFormSubmission = ({
  onSubmit,
  onClose,
  resetForm
}: UseChannelFormSubmissionProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent,
    formData: any,
    chatData: any,
    editingChannel: any,
    verificationStatus: string
  ) => {
    e.preventDefault();
    
    console.log('[Form Submission] Starting submission with data:', {
      formData,
      chatData,
      editingChannel,
      verificationStatus
    });
    
    if (!editingChannel && (!chatData || verificationStatus !== 'success')) {
      console.log('[Form Submission] Validation failed - missing chat data or verification');
      toast.error('Сначала введите корректный username канала');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('[Form Submission] Calling onSubmit with:', {
        formData,
        channelData: editingChannel || chatData
      });
      
      // Для редактирования передаем form data и оригинальные данные канала
      if (editingChannel) {
        console.log('[Form Submission] Updating existing channel');
        await onSubmit(formData, editingChannel);
      } else {
        console.log('[Form Submission] Creating new channel');
        await onSubmit(formData, chatData);
      }
      
      console.log('[Form Submission] Submit successful, closing form');
      onClose();
      resetForm();
    } catch (error) {
      console.error('[Form Submission] Error submitting form:', error);
      
      // More detailed error logging
      if (error instanceof Error) {
        console.error('[Form Submission] Error message:', error.message);
        console.error('[Form Submission] Error stack:', error.stack);
      }
      
      toast.error('Ошибка при сохранении канала: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
