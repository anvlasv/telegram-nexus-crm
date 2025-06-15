
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
      setVerificationStatus('success');
      setChatData(editingChannel);
    } else if (isOpen && !editingChannel) {
      resetVerification();
    }
  }, [editingChannel, isOpen, setVerificationStatus, setChatData, resetVerification]);

  // Auto-verify for new channels
  useEffect(() => {
    if (formData.username && !editingChannel && verificationStatus === 'idle') {
      const timer = setTimeout(() => {
        verifyChannel(formData.username);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.username, editingChannel, verificationStatus, verifyChannel]);

  const onFormSubmit = (e: React.FormEvent) => {
    handleSubmit(e, formData, chatData, editingChannel, verificationStatus);
  };

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
          setFormData={setFormData}
          editingChannel={editingChannel}
        />
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          >
            {t('cancel')}
          </Button>
          <Button 
            type="submit"
            disabled={isSubmitting || (!editingChannel && verificationStatus !== 'success')}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            {editingChannel ? t('save') : t('create')}
          </Button>
        </DialogFooter>
      </form>
    </>
  );
};
