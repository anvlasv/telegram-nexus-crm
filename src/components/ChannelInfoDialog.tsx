
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Users, Globe, User, RefreshCw } from 'lucide-react';
import { getStatusColor } from '@/utils/channelUtils';
import type { Tables } from '@/integrations/supabase/types';
import { useTelegram } from '@/hooks/useTelegram';

type Channel = Tables<'telegram_channels'>;

interface ChannelInfoDialogProps {
  channel: Channel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ChannelInfo {
  avatar?: string;
  title?: string;
  description?: string;
  memberCount?: number;
  country?: string;
  owner?: string;
}

export const ChannelInfoDialog: React.FC<ChannelInfoDialogProps> = ({
  channel,
  open,
  onOpenChange,
}) => {
  const [channelInfo, setChannelInfo] = useState<ChannelInfo>({});
  const [loading, setLoading] = useState(false);
  const { showAlert } = useTelegram();

  const fetchChannelInfo = async () => {
    setLoading(true);
    try {
      // Здесь будет запрос к Telegram Bot API для получения информации о канале
      // Пока используем заглушки
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setChannelInfo({
        title: channel.name,
        description: `Канал @${channel.username}`,
        memberCount: channel.subscriber_count || 0,
        country: 'Россия', // Заглушка
        owner: 'Вы', // Заглушка
      });
    } catch (error) {
      showAlert('Ошибка при получении информации о канале');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open) {
      fetchChannelInfo();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Информация о канале
            <Button
              variant="ghost"
              size="icon"
              onClick={fetchChannelInfo}
              disabled={loading}
              className="ml-auto h-6 w-6"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Аватар */}
          <div className="flex justify-center">
            {channelInfo.avatar ? (
              <img 
                src={channelInfo.avatar} 
                alt="Channel avatar"
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                {channel.name?.[0] || channel.username[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Основная информация */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Название
              </label>
              <p className="text-sm font-medium">
                {channelInfo.title || channel.name || 'Не указано'}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Username
              </label>
              <p className="text-sm font-medium">
                @{channel.username}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Тип
              </label>
              <div className="flex items-center gap-2 mt-1">
                {channel.type === 'channel' ? (
                  <MessageSquare className="h-4 w-4" />
                ) : (
                  <Users className="h-4 w-4" />
                )}
                <span className="text-sm capitalize">{channel.type}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Статус
              </label>
              <div className="mt-1">
                <Badge className={getStatusColor(channel.status || 'active')}>
                  {channel.status === 'active' ? 'Активный' : 
                   channel.status === 'paused' ? 'Приостановлен' : 'Архивный'}
                </Badge>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Подписчики
              </label>
              <p className="text-sm font-medium">
                {(channelInfo.memberCount || channel.subscriber_count || 0).toLocaleString()}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Владелец
              </label>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4" />
                <span className="text-sm">{channelInfo.owner || 'Вы'}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Страна
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Globe className="h-4 w-4" />
                <span className="text-sm">{channelInfo.country || 'Не указана'}</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Дата подключения
              </label>
              <p className="text-sm">
                {new Date(channel.created_at).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
