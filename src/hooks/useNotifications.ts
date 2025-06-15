
import { useState, useMemo, useEffect } from 'react';

const mockNotifications = [
  {
    id: '1',
    type: 'success',
    title: 'Пост опубликован',
    message: 'Ваш пост в канале "Tech News" успешно опубликован',
    time: '2 минуты назад',
    read: false
  },
  {
    id: '2',
    type: 'warning',
    title: 'Низкая активность',
    message: 'Канал "Marketing Tips" показывает снижение активности',
    time: '1 час назад',
    read: false
  },
  {
    id: '3',
    type: 'info',
    title: 'Новый партнер',
    message: 'Заявка на сотрудничество от "Digital Agency"',
    time: '3 часа назад',
    read: true
  },
  {
    id: '4',
    type: 'error',
    title: 'Ошибка публикации',
    message: 'Не удалось опубликовать пост в канале "Crypto News"',
    time: '5 часов назад',
    read: false
  }
];

const STORAGE_KEY = 'notifications_state';

const loadNotificationsFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedNotifications = JSON.parse(stored);
      if (Array.isArray(parsedNotifications) && parsedNotifications.length > 0) {
        return parsedNotifications;
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки уведомлений из localStorage:', error);
  }
  return mockNotifications;
};

const saveNotificationsToStorage = (notifications: any[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Ошибка сохранения уведомлений в localStorage:', error);
  }
};

export const useNotifications = () => {
  const [notifications, setNotifications] = useState(() => loadNotificationsFromStorage());

  useEffect(() => {
    saveNotificationsToStorage(notifications);
  }, [notifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  return {
    notifications,
    setNotifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
