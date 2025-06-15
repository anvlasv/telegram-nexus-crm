
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGetChatInfo, useGetChatMemberCount, useCheckBotAdmin } from '@/hooks/useTelegramApi';
import { ChannelVerification } from './ChannelVerification';
import { ChannelFormFields } from './ChannelFormFields';
import { toast } from 'sonner';

interface ChannelFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingChannel: any;
  onSubmit: (data: any, chatData: any) => Promise<void>;
  isSubmitting: boolean;
}

export const ChannelForm: React.FC<ChannelFormProps> = ({
  isOpen,
  onClose,
  editingChannel,
  onSubmit,
  isSubmitting
}) => {
  const { t } = useLanguage();
  const getChatInfo = useGetChatInfo();
  const getChatMemberCount = useGetChatMemberCount();
  const checkBotAdmin = useCheckBotAdmin();

  const [formData, setFormData] = useState({
    username: '',
    type: 'channel' as 'channel' | 'group',
    status: 'active' as 'active' | 'paused' | 'archived',
    timezone: 'Europe/Moscow',
  });
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [chatData, setChatData] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      if (editingChannel) {
        setFormData({
          username: editingChannel.username,
          type: editingChannel.type,
          status: editingChannel.status,
          timezone: editingChannel.timezone || 'Europe/Moscow',
        });
        setVerificationStatus('success');
        setChatData(editingChannel);
      } else {
        setFormData({
          username: '',
          type: 'channel',
          status: 'active',
          timezone: 'Europe/Moscow',
        });
        setVerificationStatus('idle');
        setVerificationMessage('');
        setChatData(null);
      }
    }
  }, [editingChannel, isOpen]);

  const verifyChannel = async (username: string) => {
    if (!username || editingChannel) return;

    setVerificationStatus('checking');
    setVerificationMessage('');

    try {
      const cleanUsername = username.startsWith('@') ? username : `@${username}`;

      const chatInfoResponse = await getChatInfo.mutateAsync({ 
        username: cleanUsername 
      });

      if (!chatInfoResponse.ok) {
        setVerificationStatus('error');
        setVerificationMessage('Канал не найден или не доступен');
        return;
      }

      const chat = chatInfoResponse.result;
      setChatData(chat);

      const botAdminResponse = await checkBotAdmin.mutateAsync({ 
        chatId: chat.id 
      });

      if (!botAdminResponse.ok) {
        setVerificationStatus('error');
        setVerificationMessage('Бот @Teleg_CRMbot не является администратором этого канала');
        return;
      }

      const memberStatus = botAdminResponse.result.status;
      if (memberStatus !== 'administrator' && memberStatus !== 'creator') {
        setVerificationStatus('error');
        setVerificationMessage('Бот @Teleg_CRMbot должен быть администратором канала');
        return;
      }

      const memberCountResponse = await getChatMemberCount.mutateAsync({ 
        chatId: chat.id 
      });

      setVerificationStatus('success');
      setVerificationMessage('Канал успешно верифицирован и готов к подключению');
      
      if (memberCountResponse.ok) {
        setChatData({
          ...chat,
          member_count: memberCountResponse.result
        });
      }

    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setVerificationMessage('Ошибка при проверке канала');
    }
  };

  useEffect(() => {
    if (formData.username && !editingChannel && verificationStatus === 'idle') {
      const timer = setTimeout(() => {
        verifyChannel(formData.username);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.username, editingChannel, verificationStatus]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatData && !editingChannel) {
      toast.error('Сначала введите корректный username канала');
      return;
    }

    await onSubmit(formData, chatData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gray-900 dark:text-gray-100">
            {editingChannel ? 'Редактировать канал' : t('add-channel')}
          </DialogTitle>
          <DialogDescription className="text-gray-600 dark:text-gray-400">
            {editingChannel ? 'Обновите информацию о канале' : 'Подключите новый Telegram канал'}
          </DialogDescription>
        </DialogHeader>

        <ChannelVerification
          verificationStatus={verificationStatus}
          verificationMessage={verificationMessage}
          chatData={chatData}
          editingChannel={!!editingChannel}
        />
        
        <form onSubmit={handleSubmit} className="space-y-4">
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
      </DialogContent>
    </Dialog>
  );
};
