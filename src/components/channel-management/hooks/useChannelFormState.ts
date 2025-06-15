
import { useState, useEffect } from 'react';

interface FormData {
  username: string;
  type: 'channel' | 'group';
  status: 'active' | 'paused' | 'archived';
  timezone: string;
}

export const useChannelFormState = (editingChannel: any, isOpen: boolean) => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    type: 'channel' as 'channel' | 'group',
    status: 'active' as 'active' | 'paused' | 'archived',
    timezone: 'Europe/Moscow',
  });

  const resetForm = () => {
    setFormData({
      username: '',
      type: 'channel',
      status: 'active',
      timezone: 'Europe/Moscow',
    });
  };

  useEffect(() => {
    if (isOpen) {
      if (editingChannel) {
        setFormData({
          username: editingChannel.username,
          type: editingChannel.type,
          status: editingChannel.status,
          timezone: editingChannel.timezone || 'Europe/Moscow',
        });
      } else {
        resetForm();
      }
    }
  }, [editingChannel, isOpen]);

  return {
    formData,
    setFormData,
    resetForm
  };
};
