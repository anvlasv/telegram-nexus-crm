
import { useState, useEffect } from 'react';

interface FormData {
  name?: string;
  username: string;
  type: 'channel' | 'group';
  status: 'active' | 'paused' | 'archived';
  timezone: string;
}

export const useChannelFormState = (editingChannel: any, isOpen: boolean) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    username: '',
    type: 'channel' as 'channel' | 'group',
    status: 'active' as 'active' | 'paused' | 'archived',
    timezone: 'Europe/Moscow',
  });

  const resetForm = () => {
    setFormData({
      name: '',
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
          name: editingChannel.name || '',
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
