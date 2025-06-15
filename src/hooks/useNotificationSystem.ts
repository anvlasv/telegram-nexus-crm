
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNotifications } from './useNotifications';

export type NotificationSeverity = 'error' | 'warning' | 'info' | 'success';

export interface NotificationSettings {
  push_notifications: boolean;
  new_messages: boolean;
  scheduled_posts: boolean;
  channel_statistics: boolean;
  publishing_errors: boolean;
  email_notifications: boolean;
  weekly_reports: boolean;
  critical_errors: boolean;
  product_news: boolean;
  notification_sound: boolean;
  vibration: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  push_notifications: true,
  new_messages: true,
  scheduled_posts: true,
  channel_statistics: false,
  publishing_errors: true,
  email_notifications: true,
  weekly_reports: true,
  critical_errors: true,
  product_news: false,
  notification_sound: true,
  vibration: true,
};

export const useNotificationSystem = () => {
  const { toast } = useToast();
  const { notifications, setNotifications } = useNotifications();
  const [settings, setSettings] = useState<NotificationSettings>(() => {
    const stored = localStorage.getItem('notification_settings');
    return stored ? JSON.parse(stored) : DEFAULT_SETTINGS;
  });

  const updateSettings = useCallback((newSettings: Partial<NotificationSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('notification_settings', JSON.stringify(updated));
  }, [settings]);

  const shouldShowNotification = useCallback((type: keyof NotificationSettings): boolean => {
    return settings[type] === true;
  }, [settings]);

  const addNotification = useCallback((
    title: string,
    message: string,
    severity: NotificationSeverity = 'info',
    category: keyof NotificationSettings = 'push_notifications'
  ) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      title,
      message,
      type: severity,
      time: new Date().toLocaleString('ru-RU'),
      read: false
    };

    // Add to notifications list
    setNotifications(prev => [newNotification, ...prev]);

    // Show toast if enabled
    if (shouldShowNotification(category) && shouldShowNotification('push_notifications')) {
      toast({
        title,
        description: message,
        variant: severity === 'error' ? 'destructive' : 'default',
      });
    }

    console.log(`Notification added: ${severity} - ${title}`);
  }, [toast, setNotifications, shouldShowNotification]);

  // Predefined notification methods
  const notifyPostPublished = useCallback((channelName: string) => {
    addNotification(
      'Пост опубликован',
      `Ваш пост в канале "${channelName}" успешно опубликован`,
      'success',
      'scheduled_posts'
    );
  }, [addNotification]);

  const notifyPublishingError = useCallback((channelName: string, error: string) => {
    addNotification(
      'Ошибка публикации',
      `Не удалось опубликовать пост в канале "${channelName}": ${error}`,
      'error',
      'publishing_errors'
    );
  }, [addNotification]);

  const notifyLowActivity = useCallback((channelName: string) => {
    addNotification(
      'Низкая активность',
      `Канал "${channelName}" показывает снижение активности`,
      'warning',
      'channel_statistics'
    );
  }, [addNotification]);

  const notifyNewPartner = useCallback((partnerName: string) => {
    addNotification(
      'Новый партнер',
      `Заявка на сотрудничество от "${partnerName}"`,
      'info',
      'new_messages'
    );
  }, [addNotification]);

  return {
    settings,
    updateSettings,
    addNotification,
    notifyPostPublished,
    notifyPublishingError,
    notifyLowActivity,
    notifyNewPartner,
  };
};
