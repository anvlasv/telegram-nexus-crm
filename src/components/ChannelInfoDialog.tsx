
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Globe, User } from 'lucide-react';
import { getStatusColor } from '@/utils/channelUtils';
import type { Tables } from '@/integrations/supabase/types';

type Channel = Tables<'telegram_channels'>;

interface ChannelInfoDialogProps {
  channel: Channel;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ChannelInfoDialog: React.FC<ChannelInfoDialogProps> = ({
  channel,
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Информация о канале
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Аватар */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {channel.name?.[0] || channel.username[0].toUpperCase()}
            </div>
          </div>

          {/* Основная информация */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Название
              </label>
              <p className="text-sm font-medium">
                {channel.name || 'Не указано'}
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

            {channel.subscriber_count && (
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Подписчики
                </label>
                <p className="text-sm font-medium">
                  {channel.subscriber_count.toLocaleString()}
                </p>
              </div>
            )}

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Владелец
              </label>
              <div className="flex items-center gap-2 mt-1">
                <User className="h-4 w-4" />
                <span className="text-sm">Вы</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Страна
              </label>
              <div className="flex items-center gap-2 mt-1">
                <Globe className="h-4 w-4" />
                <span className="text-sm">Не указана</span>
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
