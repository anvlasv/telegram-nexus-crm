
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Users, Calendar, Activity, Globe, Hash, AtSign, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

interface Channel {
  id: string;
  name: string;
  username: string;
  subscriber_count: number | null;
  avatar_url?: string;
  status?: string;
  created_at?: string;
  last_post_at?: string;
  engagement_rate?: number;
  type?: string;
  timezone?: string;
}

interface ChannelInfoModalProps {
  channel: Channel;
  isOpen: boolean;
  onClose: () => void;
}

export const ChannelInfoModal: React.FC<ChannelInfoModalProps> = ({
  channel,
  isOpen,
  onClose,
}) => {
  const { t, language } = useLanguage();

  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    return format(new Date(dateString), 'dd.MM.yyyy HH:mm', {
      locale: language === 'ru' ? ru : enUS
    });
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'inactive': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTimezoneDisplay = (timezone?: string) => {
    if (!timezone) return '—';
    
    const timezones = {
      // Россия и СНГ
      'Europe/Kaliningrad': 'Калининград (UTC+2)',
      'Europe/Moscow': 'Москва (UTC+3)',
      'Europe/Samara': 'Самара (UTC+4)',
      'Asia/Yekaterinburg': 'Екатеринбург (UTC+5)',
      'Asia/Omsk': 'Омск (UTC+6)',
      'Asia/Krasnoyarsk': 'Красноярск (UTC+7)',
      'Asia/Irkutsk': 'Иркутск (UTC+8)',
      'Asia/Yakutsk': 'Якутск (UTC+9)',
      'Asia/Vladivostok': 'Владивосток (UTC+10)',
      'Asia/Magadan': 'Магадан (UTC+11)',
      'Asia/Kamchatka': 'Камчатка (UTC+12)',
      'Europe/Kiev': 'Киев (UTC+2)',
      'Europe/Minsk': 'Минск (UTC+3)',
      'Asia/Almaty': 'Алматы (UTC+6)',
      'Asia/Tashkent': 'Ташкент (UTC+5)',
      'Asia/Yerevan': 'Ереван (UTC+4)',
      'Asia/Baku': 'Баку (UTC+4)',
      // Европа
      'Europe/London': 'Лондон (UTC+0)',
      'Europe/Berlin': 'Берлин (UTC+1)',
      'Europe/Paris': 'Париж (UTC+1)',
      'Europe/Rome': 'Рим (UTC+1)',
      // Америка
      'America/New_York': 'Нью-Йорк (UTC-5)',
      'America/Los_Angeles': 'Лос-Анджелес (UTC-8)',
      'America/Chicago': 'Чикаго (UTC-6)',
      'America/Denver': 'Денвер (UTC-7)',
      // Азия
      'Asia/Tokyo': 'Токио (UTC+9)',
      'Asia/Shanghai': 'Шанхай (UTC+8)',
      'Asia/Dubai': 'Дубай (UTC+4)',
      'Asia/Seoul': 'Сеул (UTC+9)',
      'Asia/Mumbai': 'Мумбаи (UTC+5:30)',
      // Океания
      'Australia/Sydney': 'Сидней (UTC+10)',
      'Pacific/Auckland': 'Окленд (UTC+12)',
    } as Record<string, string>;
    
    return timezones[timezone] || timezone;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hash className="h-5 w-5" />
            {t('channel-details')}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Channel Header */}
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={channel.avatar_url} alt={channel.name} />
              <AvatarFallback className="text-lg font-semibold bg-sidebar-primary text-sidebar-primary-foreground">
                {channel.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-1">
              <h3 className="font-semibold text-lg">{channel.name}</h3>
              <div className="flex items-center gap-1 text-muted-foreground">
                <AtSign className="h-3 w-3" />
                <span className="text-sm">{channel.username}</span>
              </div>
              <Badge 
                className={`text-xs ${getStatusColor(channel.status)}`}
                variant="secondary"
              >
                {t(channel.status || 'inactive')}
              </Badge>
            </div>
          </div>

          <Separator />
          
          {/* Channel Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{t('subscribers')}</span>
              </div>
              <p className="text-2xl font-bold">
                {(channel.subscriber_count || 0).toLocaleString()}
              </p>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Activity className="h-4 w-4" />
                <span>{t('engagement-rate')}</span>
              </div>
              <p className="text-2xl font-bold">
                {channel.engagement_rate ? `${channel.engagement_rate.toFixed(1)}%` : '—'}
              </p>
            </div>
          </div>

          <Separator />
          
          {/* Channel Details */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Globe className="h-4 w-4" />
                {t('channel-type')}
              </label>
              <p className="font-medium">
                {channel.type === 'channel' ? t('public-channel') : t('private-channel')}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Часовой пояс
              </label>
              <p className="font-medium">{getTimezoneDisplay(channel.timezone)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {t('created-at')}
              </label>
              <p className="font-medium">{formatDate(channel.created_at)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Activity className="h-4 w-4" />
                {t('last-activity')}
              </label>
              <p className="font-medium">{formatDate(channel.last_post_at)}</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('owner')}
              </label>
              <p className="font-medium">Admin User</p>
            </div>
            
            <div>
              <label className="text-sm font-medium text-muted-foreground">
                {t('country')}
              </label>
              <p className="font-medium">🇷🇺 {t('russia')}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
