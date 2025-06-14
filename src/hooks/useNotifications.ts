
import { useState, useMemo } from 'react';

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

export const useNotifications = () => {
  const [notifications, setNotifications] = useState(mockNotifications);

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
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  };
};
