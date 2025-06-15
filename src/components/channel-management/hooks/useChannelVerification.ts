
import { useState, useEffect } from 'react';
import { useGetChatInfo, useGetChatMemberCount, useCheckBotAdmin } from '@/hooks/useTelegramApi';

export const useChannelVerification = (editingChannel: any) => {
  const getChatInfo = useGetChatInfo();
  const getChatMemberCount = useGetChatMemberCount();
  const checkBotAdmin = useCheckBotAdmin();

  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [chatData, setChatData] = useState<any>(null);
  const [verificationTimeout, setVerificationTimeout] = useState<NodeJS.Timeout | null>(null);

  const verifyChannel = async (username: string) => {
    if (!username || editingChannel) return;

    console.log('[useChannelVerification] Starting verification for:', username);
    
    // Очищаем предыдущий таймаут
    if (verificationTimeout) {
      clearTimeout(verificationTimeout);
    }

    setVerificationStatus('checking');
    setVerificationMessage('');
    setChatData(null);

    // Устанавливаем таймаут на 30 секунд
    const timeout = setTimeout(() => {
      console.log('[useChannelVerification] Verification timeout');
      setVerificationStatus('error');
      setVerificationMessage('Превышено время ожидания. Попробуйте еще раз.');
    }, 30000);
    
    setVerificationTimeout(timeout);

    try {
      const cleanUsername = username.startsWith('@') ? username : `@${username}`;
      console.log('[useChannelVerification] Cleaned username:', cleanUsername);

      // Шаг 1: Получаем информацию о канале
      console.log('[useChannelVerification] Getting chat info...');
      const chatInfoResponse = await getChatInfo.mutateAsync({ 
        username: cleanUsername 
      });

      if (!chatInfoResponse?.ok) {
        console.log('[useChannelVerification] Chat info failed:', chatInfoResponse);
        clearTimeout(timeout);
        setVerificationTimeout(null);
        setVerificationStatus('error');
        setVerificationMessage('Канал не найден или не доступен. Проверьте правильность username.');
        return;
      }

      const chat = chatInfoResponse.result;
      console.log('[useChannelVerification] Chat info received:', chat);
      setChatData(chat);

      // Шаг 2: Проверяем права администратора бота
      console.log('[useChannelVerification] Checking bot admin status...');
      const botAdminResponse = await checkBotAdmin.mutateAsync({ 
        chatId: chat.id 
      });

      if (!botAdminResponse?.ok) {
        console.log('[useChannelVerification] Bot admin check failed:', botAdminResponse);
        clearTimeout(timeout);
        setVerificationTimeout(null);
        setVerificationStatus('error');
        setVerificationMessage('Бот @Teleg_CRMbot не является администратором этого канала. Добавьте бота в администраторы и дайте ему необходимые права.');
        return;
      }

      const memberStatus = botAdminResponse.result?.status;
      console.log('[useChannelVerification] Bot status:', memberStatus);
      
      if (memberStatus !== 'administrator' && memberStatus !== 'creator') {
        clearTimeout(timeout);
        setVerificationTimeout(null);
        setVerificationStatus('error');
        setVerificationMessage('Бот @Teleg_CRMbot должен быть администратором канала с правами на отправку сообщений.');
        return;
      }

      // Шаг 3: Получаем количество участников
      console.log('[useChannelVerification] Getting member count...');
      try {
        const memberCountResponse = await getChatMemberCount.mutateAsync({ 
          chatId: chat.id 
        });

        if (memberCountResponse?.ok) {
          setChatData({
            ...chat,
            member_count: memberCountResponse.result
          });
          console.log('[useChannelVerification] Member count:', memberCountResponse.result);
        }
      } catch (error) {
        console.warn('[useChannelVerification] Member count failed, continuing without it:', error);
        // Не блокируем верификацию если не удалось получить количество участников
      }

      // Успешная верификация
      clearTimeout(timeout);
      setVerificationTimeout(null);
      setVerificationStatus('success');
      setVerificationMessage('Канал успешно верифицирован и готов к подключению!');
      console.log('[useChannelVerification] Verification successful');

    } catch (error) {
      console.error('[useChannelVerification] Verification error:', error);
      clearTimeout(timeout);
      setVerificationTimeout(null);
      setVerificationStatus('error');
      setVerificationMessage('Ошибка при проверке канала. Убедитесь, что канал существует и бот добавлен в администраторы.');
    }
  };

  const resetVerification = () => {
    console.log('[useChannelVerification] Resetting verification state');
    if (verificationTimeout) {
      clearTimeout(verificationTimeout);
      setVerificationTimeout(null);
    }
    setVerificationStatus('idle');
    setVerificationMessage('');
    setChatData(null);
  };

  // Очищаем таймаут при размонтировании компонента
  useEffect(() => {
    return () => {
      if (verificationTimeout) {
        clearTimeout(verificationTimeout);
      }
    };
  }, [verificationTimeout]);

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
