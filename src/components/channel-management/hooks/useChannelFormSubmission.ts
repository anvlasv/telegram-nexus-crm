
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
    
    if (!editingChannel && (!chatData || verificationStatus !== 'success')) {
      toast.error('Сначала введите корректный username канала');
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting form data:', formData);
      console.log('Channel data:', editingChannel || chatData);
      
      // Для редактирования передаем form data и оригинальные данные канала
      if (editingChannel) {
        await onSubmit(formData, editingChannel);
      } else {
        await onSubmit(formData, chatData);
      }
      
      onClose();
      resetForm();
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error('Ошибка при сохранении канала');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleSubmit,
    isSubmitting
  };
};
