
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { useGetChatInfo, useGetChatMemberCount, useCheckBotAdmin } from '@/hooks/useTelegramApi';
import { ChannelVerification } from './ChannelVerification';
import { toast } from 'sonner';

interface ChannelFormProps {
  isOpen: boolean;
  onClose: () => void;
  editingChannel: any;
  onSubmit: (data: any, chatData: any) => Promise<void>;
  isSubmitting: boolean;
}

// Популярные часовые пояса
const TIMEZONES = [
  { value: 'Europe/Moscow', label: 'Москва (UTC+3)' },
  { value: 'Europe/Kiev', label: 'Киев (UTC+2)' },
  { value: 'Europe/Minsk', label: 'Минск (UTC+3)' },
  { value: 'Asia/Almaty', label: 'Алматы (UTC+6)' },
  { value: 'Asia/Tashkent', label: 'Ташкент (UTC+5)' },
  { value: 'Asia/Yerevan', label: 'Ереван (UTC+4)' },
  { value: 'Asia/Baku', label: 'Баку (UTC+4)' },
  { value: 'Europe/London', label: 'Лондон (UTC+0)' },
  { value: 'Europe/Berlin', label: 'Берлин (UTC+1)' },
  { value: 'America/New_York', label: 'Нью-Йорк (UTC-5)' },
  { value: 'America/Los_Angeles', label: 'Лос-Анджелес (UTC-8)' },
  { value: 'Asia/Tokyo', label: 'Токио (UTC+9)' },
  { value: 'Asia/Shanghai', label: 'Шанхай (UTC+8)' },
  { value: 'Asia/Dubai', label: 'Дубай (UTC+4)' },
  { value: 'Australia/Sydney', label: 'Сидней (UTC+10)' },
];

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
    if (editingChannel) {
      setFormData({
        username: editingChannel.username,
        type: editingChannel.type,
        status: editingChannel.status,
        timezone: editingChannel.timezone || 'Europe/Moscow',
      });
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
  }, [editingChannel, isOpen]);

  const verifyChannel = async (username: string) => {
    if (!username) return;

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
    if (formData.username && !editingChannel) {
      const timer = setTimeout(() => {
        verifyChannel(formData.username);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.username]);

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
          <div>
            <Label htmlFor="username" className="text-gray-900 dark:text-gray-100">
              {t('channel-username')}
            </Label>
            <Input
              id="username"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              placeholder="@channel_username"
              required
              disabled={!!editingChannel}
              className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
            />
          </div>

          <div>
            <Label className="text-gray-900 dark:text-gray-100">Часовой пояс</Label>
            <Select
              value={formData.timezone}
              onValueChange={(value) => setFormData({ ...formData, timezone: value })}
            >
              <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-h-60">
                {TIMEZONES.map((tz) => (
                  <SelectItem key={tz.value} value={tz.value} className="text-gray-900 dark:text-gray-100">
                    {tz.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-900 dark:text-gray-100">Тип</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'channel' | 'group') => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="channel" className="text-gray-900 dark:text-gray-100">Канал</SelectItem>
                  <SelectItem value="group" className="text-gray-900 dark:text-gray-100">Группа</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-900 dark:text-gray-100">Статус</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'active' | 'paused' | 'archived') => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="active" className="text-gray-900 dark:text-gray-100">{t('active')}</SelectItem>
                  <SelectItem value="paused" className="text-gray-900 dark:text-gray-100">{t('paused')}</SelectItem>
                  <SelectItem value="archived" className="text-gray-900 dark:text-gray-100">{t('archived')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
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
