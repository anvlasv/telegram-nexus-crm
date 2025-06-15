
import { useState, useEffect, useRef, useCallback } from 'react';
import { useGetChatInfo, useGetChatMemberCount, useCheckBotAdmin } from '@/hooks/useTelegramApi';
import { useChannels } from '@/hooks/useChannels';

export const useChannelVerification = (editingChannel: any) => {
  const getChatInfo = useGetChatInfo();
  const getChatMemberCount = useGetChatMemberCount();
  const checkBotAdmin = useCheckBotAdmin();
  const { channels } = useChannels();

  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [chatData, setChatData] = useState<any>(null);
  
  // Используем ref для отслеживания активной верификации
  const verificationInProgress = useRef(false);
  const verificationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const verifyChannel = useCallback(async (username: string) => {
    if (!username || editingChannel || verificationInProgress.current) {
      console.log('[useChannelVerification] Skipping verification:', {
        hasUsername: !!username,
        isEditing: !!editingChannel,
        inProgress: verificationInProgress.current
      });
      return;
    }

    console.log('[useChannelVerification] Starting verification for:', username);
    
    // Устанавливаем флаг активной верификации
    verificationInProgress.current = true;
    
    // Очищаем предыдущий таймаут
    if (verificationTimeoutRef.current) {
      clearTimeout(verificationTimeoutRef.current);
    }

    setVerificationStatus('checking');
    setVerificationMessage('');
    setChatData(null);

    // Устанавливаем таймаут на 30 секунд
    const timeout = setTimeout(() => {
      console.log('[useChannelVerification] Verification timeout');
      verificationInProgress.current = false;
      setVerificationStatus('error');
      setVerificationMessage('Превышено время ожидания. Попробуйте еще раз.');
    }, 30000);
    
    verificationTimeoutRef.current = timeout;

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
        throw new Error('Канал не найден или не доступен. Проверьте правильность username.');
      }

      const chat = chatInfoResponse.result;
      console.log('[useChannelVerification] Chat info received:', chat);

      // Проверяем, не добавлен ли уже этот канал
      const existingChannel = channels.find(channel => 
        channel.channel_id === chat.id || 
        channel.username === username.replace('@', '')
      );

      if (existingChannel) {
        console.log('[useChannelVerification] Channel already exists:', existingChannel);
        clearTimeout(timeout);
        verificationTimeoutRef.current = null;
        verificationInProgress.current = false;
        setVerificationStatus('error');
        setVerificationMessage(`Канал "${existingChannel.name}" уже добавлен в вашу систему. Вы не можете добавить один канал дважды.`);
        return;
      }

      setChatData(chat);

      // Шаг 2: Проверяем права администратора бота
      console.log('[useChannelVerification] Checking bot admin status...');
      const botAdminResponse = await checkBotAdmin.mutateAsync({ 
        chatId: chat.id 
      });

      if (!botAdminResponse?.ok) {
        console.log('[useChannelVerification] Bot admin check failed:', botAdminResponse);
        throw new Error('Бот @Teleg_CRMbot не является администратором этого канала. Добавьте бота в администраторы и дайте ему необходимые права.');
      }

      const memberStatus = botAdminResponse.result?.status;
      console.log('[useChannelVerification] Bot status:', memberStatus);
      
      if (memberStatus !== 'administrator' && memberStatus !== 'creator') {
        throw new Error('Бот @Teleg_CRMbot должен быть администратором канала с правами на отправку сообщений.');
      }

      // Шаг 3: Получаем количество участников
      console.log('[useChannelVerification] Getting member count...');
      try {
        const memberCountResponse = await getChatMemberCount.mutateAsync({ 
          chatId: chat.id 
        });

        if (memberCountResponse?.ok) {
          setChatData(prev => ({
            ...prev,
            member_count: memberCountResponse.result
          }));
          console.log('[useChannelVerification] Member count:', memberCountResponse.result);
        }
      } catch (error) {
        console.warn('[useChannelVerification] Member count failed, continuing without it:', error);
        // Не блокируем верификацию если не удалось получить количество участников
      }

      // Успешная верификация
      clearTimeout(timeout);
      verificationTimeoutRef.current = null;
      verificationInProgress.current = false;
      setVerificationStatus('success');
      setVerificationMessage('Канал успешно верифицирован и готов к подключению!');
      console.log('[useChannelVerification] Verification successful');

    } catch (error) {
      console.error('[useChannelVerification] Verification error:', error);
      clearTimeout(timeout);
      verificationTimeoutRef.current = null;
      verificationInProgress.current = false;
      setVerificationStatus('error');
      
      if (error instanceof Error) {
        setVerificationMessage(error.message);
      } else {
        setVerificationMessage('Ошибка при проверке канала. Убедитесь, что канал существует и бот добавлен в администраторы.');
      }
    }
  }, [editingChannel, getChatInfo, getChatMemberCount, checkBotAdmin, channels]);

  const resetVerification = useCallback(() => {
    console.log('[useChannelVerification] Resetting verification state');
    if (verificationTimeoutRef.current) {
      clearTimeout(verificationTimeoutRef.current);
      verificationTimeoutRef.current = null;
    }
    verificationInProgress.current = false;
    setVerificationStatus('idle');
    setVerificationMessage('');
    setChatData(null);
  }, []);

  // Очищаем таймаут при размонтировании компонента
  useEffect(() => {
    return () => {
      if (verificationTimeoutRef.current) {
        clearTimeout(verificationTimeoutRef.current);
      }
      verificationInProgress.current = false;
    };
  }, []);

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
