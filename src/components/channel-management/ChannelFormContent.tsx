
import React, { useEffect } from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChannelVerification } from './ChannelVerification';
import { ChannelFormFields } from './ChannelFormFields';
import { useChannelFormState } from './hooks/useChannelFormState';
import { useChannelVerification } from './hooks/useChannelVerification';
import { useChannelFormSubmission } from './hooks/useChannelFormSubmission';

interface ChannelFormContentProps {
  editingChannel: any;
  onSubmit: (data: any, chatData: any) => Promise<void>;
  onClose: () => void;
  isOpen: boolean;
}

export const ChannelFormContent: React.FC<ChannelFormContentProps> = ({
  editingChannel,
  onSubmit,
  onClose,
  isOpen
}) => {
  const { t } = useLanguage();
  
  const { formData, setFormData, resetForm } = useChannelFormState(editingChannel, isOpen);
  
  const {
    verificationStatus,
    verificationMessage,
    chatData,
    verifyChannel,
    resetVerification,
    setChatData,
    setVerificationStatus
  } = useChannelVerification(editingChannel);

  const { handleSubmit, isSubmitting } = useChannelFormSubmission({
    onSubmit,
    onClose,
    resetForm
  });

  // Initialize verification data for editing
  useEffect(() => {
    if (isOpen && editingChannel) {
      console.log('[ChannelFormContent] Setting up editing mode for:', editingChannel.name);
      setVerificationStatus('success');
      setChatData(editingChannel);
    } else if (isOpen && !editingChannel) {
      console.log('[ChannelFormContent] Setting up creation mode');
      resetVerification();
    }
  }, [editingChannel, isOpen, setVerificationStatus, setChatData, resetVerification]);

  // Auto-verify for new channels with debouncing
  useEffect(() => {
    if (formData.username && !editingChannel && verificationStatus === 'idle') {
      console.log('[ChannelFormContent] Starting auto-verification for:', formData.username);
      
      // Дебаунсинг: ждем 1.5 секунды после последнего ввода
      const timer = setTimeout(() => {
        verifyChannel(formData.username);
      }, 1500);
      
      return () => {
        console.log('[ChannelFormContent] Clearing verification timer');
        clearTimeout(timer);
      };
    }
  }, [formData.username, editingChannel, verificationStatus, verifyChannel]);

  const handleUsernameChange = (newFormData: any) => {
    console.log('[ChannelFormContent] Username changed to:', newFormData.username);
    setFormData(newFormData);
    
    // Сбрасываем верификацию при изменении username
    if (!editingChannel && newFormData.username !== formData.username) {
      resetVerification();
    }
  };

  const onFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('[ChannelFormContent] Form submitted', {
      formData,
      chatData,
      verificationStatus,
      editingChannel: !!editingChannel
    });
    
    handleSubmit(e, formData, chatData, editingChannel, verificationStatus);
  };

  const canSubmit = editingChannel || verificationStatus === 'success';
  const isLoading = verificationStatus === 'checking' || isSubmitting;

  console.log('[ChannelFormContent] Render state:', {
    canSubmit,
    isLoading,
    verificationStatus,
    hasUsername: !!formData.username,
    editingChannel: !!editingChannel
  });

  return (
    <>
      <ChannelVerification
        verificationStatus={verificationStatus}
        verificationMessage={verificationMessage}
        chatData={chatData}
        editingChannel={!!editingChannel}
      />
      
      <form onSubmit={onFormSubmit} className="space-y-4">
        <ChannelFormFields
          formData={formData}
          setFormData={handleUsernameChange}
          editingChannel={editingChannel}
        />
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          >
            {t('cancel')}
          </Button>
          <Button 
            type="submit"
            disabled={!canSubmit || isLoading}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 disabled:opacity-50"
          >
            {isLoading ? 'Обработка...' : (editingChannel ? t('save') : t('create'))}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};
