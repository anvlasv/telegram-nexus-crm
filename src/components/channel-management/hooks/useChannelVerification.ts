
import { useState, useEffect } from 'react';
import { useGetChatInfo, useGetChatMemberCount, useCheckBotAdmin } from '@/hooks/useTelegramApi';

export const useChannelVerification = (editingChannel: any) => {
  const getChatInfo = useGetChatInfo();
  const getChatMemberCount = useGetChatMemberCount();
  const checkBotAdmin = useCheckBotAdmin();

  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [chatData, setChatData] = useState<any>(null);

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

  const resetVerification = () => {
    setVerificationStatus('idle');
    setVerificationMessage('');
    setChatData(null);
  };

  return {
    verificationStatus,
    verificationMessage,
    chatData,
    verifyChannel,
    resetVerification,
    setChatData,
    setVerificationStatus
  };
};
