import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Notifications = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {t('notifications')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Уведомления и оповещения системы
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <AlertCircle className="h-4 w-4" />
              Системное уведомление
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Важное сообщение от системы
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Обновление безопасности: Пожалуйста, обновите приложение до последней версии.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <CheckCircle className="h-4 w-4" />
              Успешное действие
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Подтверждение выполнения операции
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Канал "Мой канал" успешно подключен к системе.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Bell className="h-4 w-4" />
              Новое уведомление
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Информация о новых возможностях
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Представляем AI-ассистента для автоматизации контента.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
