import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, User, Shield, Palette } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Settings = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {t('settings')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Настройки приложения и профиля
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Профиль
            </CardTitle>
            <CardDescription>
              Управление личными данными и настройками профиля
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Настройте свой профиль, изменяйте личные данные и управляйте своей учетной записью.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Безопасность
            </CardTitle>
            <CardDescription>
              Настройки безопасности и доступа
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Управляйте паролями, двухфакторной аутентификацией и другими настройками безопасности.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Внешний вид
            </CardTitle>
            <CardDescription>
              Настройки темы и отображения
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Настройте тему, цвета и другие параметры отображения интерфейса.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              Общие настройки
            </CardTitle>
            <CardDescription>
              Основные настройки приложения
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Настройте язык, часовой пояс и другие общие параметры приложения.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
