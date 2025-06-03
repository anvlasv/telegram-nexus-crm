
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCircle, AlertCircle, Info, Trash2, MarkAsRead } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const notifications = [
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

export const Notifications: React.FC = () => {
  const { t } = useLanguage();
  const [notificationList, setNotificationList] = useState(notifications);
  const [filter, setFilter] = useState('all');

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning': return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const markAsRead = (id: string) => {
    setNotificationList(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id: string) => {
    setNotificationList(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notificationList.filter(notif => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notificationList.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bell className="h-6 w-6" />
            {t('notifications')}
            {unreadCount > 0 && (
              <Badge className="bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            Управление уведомлениями и оповещениями
          </p>
        </div>
        <Button variant="outline">
          <MarkAsRead className="mr-2 h-4 w-4" />
          Отметить все как прочитанные
        </Button>
      </div>

      <Tabs value={filter} onValueChange={setFilter} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">Все ({notificationList.length})</TabsTrigger>
          <TabsTrigger value="unread">Непрочитанные ({unreadCount})</TabsTrigger>
          <TabsTrigger value="read">Прочитанные ({notificationList.length - unreadCount})</TabsTrigger>
        </TabsList>

        <TabsContent value={filter} className="space-y-4">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8 text-muted-foreground">
                  Нет уведомлений для отображения
                </div>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card key={notification.id} className={`${!notification.read ? 'border-l-4 border-l-primary' : ''}`}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <Badge className={getBadgeColor(notification.type)}>
                              {notification.type}
                            </Badge>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full"></div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {notification.time}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
