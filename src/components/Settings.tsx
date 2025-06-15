
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Globe, 
  Palette, 
  Shield, 
  Save,
  Volume2,
  Vibrate
} from 'lucide-react';
import { useTelegram } from '@/hooks/useTelegram';

export const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const { isDarkTheme, toggleTheme } = useTelegram();
  const { settings, updateSettings } = useNotificationSystem();

  const handleNotificationToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleSaveSettings = () => {
    // Settings are auto-saved via localStorage in updateSettings
    console.log('Settings saved');
  };

  return (
    <div className="space-y-6 p-4 sm:p-0">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
          <SettingsIcon className="h-8 w-8" />
          <span>{t('settings')}</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Управление настройками приложения
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Уведомления */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <Bell className="h-5 w-5" />
              <span>Уведомления</span>
            </CardTitle>
            <CardDescription>
              Настройте типы уведомлений, которые вы хотите получать
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="push_notifications" className="text-gray-700 dark:text-gray-300">
                Push-уведомления
              </Label>
              <Switch
                id="push_notifications"
                checked={settings.push_notifications}
                onCheckedChange={() => handleNotificationToggle('push_notifications')}
              />
            </div>
            
            <Separator className="dark:border-gray-700" />
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Типы уведомлений</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="publishing_errors" className="text-gray-700 dark:text-gray-300">
                  Ошибки публикации (критичные)
                </Label>
                <Switch
                  id="publishing_errors"
                  checked={settings.publishing_errors}
                  onCheckedChange={() => handleNotificationToggle('publishing_errors')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="scheduled_posts" className="text-gray-700 dark:text-gray-300">
                  Запланированные посты
                </Label>
                <Switch
                  id="scheduled_posts"
                  checked={settings.scheduled_posts}
                  onCheckedChange={() => handleNotificationToggle('scheduled_posts')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="new_messages" className="text-gray-700 dark:text-gray-300">
                  Новые сообщения
                </Label>
                <Switch
                  id="new_messages"
                  checked={settings.new_messages}
                  onCheckedChange={() => handleNotificationToggle('new_messages')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="channel_statistics" className="text-gray-700 dark:text-gray-300">
                  Статистика каналов
                </Label>
                <Switch
                  id="channel_statistics"
                  checked={settings.channel_statistics}
                  onCheckedChange={() => handleNotificationToggle('channel_statistics')}
                />
              </div>
            </div>
            
            <Separator className="dark:border-gray-700" />
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Email уведомления</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="email_notifications" className="text-gray-700 dark:text-gray-300">
                  Email уведомления
                </Label>
                <Switch
                  id="email_notifications"
                  checked={settings.email_notifications}
                  onCheckedChange={() => handleNotificationToggle('email_notifications')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="weekly_reports" className="text-gray-700 dark:text-gray-300">
                  Еженедельные отчеты
                </Label>
                <Switch
                  id="weekly_reports"
                  checked={settings.weekly_reports}
                  onCheckedChange={() => handleNotificationToggle('weekly_reports')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="critical_errors" className="text-gray-700 dark:text-gray-300">
                  Критические ошибки
                </Label>
                <Switch
                  id="critical_errors"
                  checked={settings.critical_errors}
                  onCheckedChange={() => handleNotificationToggle('critical_errors')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="product_news" className="text-gray-700 dark:text-gray-300">
                  Новости продукта
                </Label>
                <Switch
                  id="product_news"
                  checked={settings.product_news}
                  onCheckedChange={() => handleNotificationToggle('product_news')}
                />
              </div>
            </div>
            
            <Separator className="dark:border-gray-700" />
            
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Звук и вибрация</h4>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="notification_sound" className="text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                  <Volume2 className="h-4 w-4" />
                  <span>Звук уведомлений</span>
                </Label>
                <Switch
                  id="notification_sound"
                  checked={settings.notification_sound}
                  onCheckedChange={() => handleNotificationToggle('notification_sound')}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="vibration" className="text-gray-700 dark:text-gray-300 flex items-center space-x-2">
                  <Vibrate className="h-4 w-4" />
                  <span>Вибрация</span>
                </Label>
                <Switch
                  id="vibration"
                  checked={settings.vibration}
                  onCheckedChange={() => handleNotificationToggle('vibration')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Интерфейс и язык */}
        <div className="space-y-6">
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Внешний вид</span>
              </CardTitle>
              <CardDescription>
                Настройки темы и отображения
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="dark-theme" className="text-gray-700 dark:text-gray-300">
                  Темная тема
                </Label>
                <Switch
                  id="dark-theme"
                  checked={isDarkTheme}
                  onCheckedChange={toggleTheme}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Язык</span>
              </CardTitle>
              <CardDescription>
                Выберите предпочитаемый язык интерфейса
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="language" className="text-gray-700 dark:text-gray-300">
                  Русский язык
                </Label>
                <Switch
                  id="language"
                  checked={language === 'ru'}
                  onCheckedChange={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Безопасность</span>
              </CardTitle>
              <CardDescription>
                Настройки безопасности и приватности
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full">
                Изменить пароль
              </Button>
              <Button variant="outline" className="w-full">
                Двухфакторная аутентификация
              </Button>
              <Button variant="outline" className="w-full">
                Активные сессии
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Save className="h-4 w-4 mr-2" />
          {t('save')} настройки
        </Button>
      </div>
    </div>
  );
};
