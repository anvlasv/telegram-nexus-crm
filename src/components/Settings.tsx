
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { TelegramInfo } from './TelegramInfo';
import { Globe, Bot, Database, ExternalLink, Settings as SettingsIcon, Bell, Shield, Palette, Users, Download, Upload, RefreshCw } from 'lucide-react';

interface SettingsModule {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const settingsModules: SettingsModule[] = [
  {
    id: 'language',
    title: 'Язык и регион',
    description: 'Настройки языка интерфейса и региональных параметров',
    icon: <Globe className="h-6 w-6" />
  },
  {
    id: 'telegram',
    title: 'Telegram интеграция',
    description: 'Настройки подключения к Telegram API и ботам',
    icon: <Bot className="h-6 w-6" />
  },
  {
    id: 'database',
    title: 'База данных',
    description: 'Настройки подключения к Supabase и управление данными',
    icon: <Database className="h-6 w-6" />
  },
  {
    id: 'notifications',
    title: 'Уведомления',
    description: 'Настройки push-уведомлений и email оповещений',
    icon: <Bell className="h-6 w-6" />
  },
  {
    id: 'security',
    title: 'Безопасность',
    description: 'Настройки безопасности аккаунта и доступа',
    icon: <Shield className="h-6 w-6" />
  },
  {
    id: 'appearance',
    title: 'Внешний вид',
    description: 'Настройки темы, цветов и отображения интерфейса',
    icon: <Palette className="h-6 w-6" />
  },
  {
    id: 'team',
    title: 'Команда',
    description: 'Управление участниками команды и правами доступа',
    icon: <Users className="h-6 w-6" />
  }
];

export const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const openModule = (moduleId: string) => {
    setSelectedModule(moduleId);
  };

  const closeModule = () => {
    setSelectedModule(null);
  };

  const renderModuleContent = (moduleId: string) => {
    switch (moduleId) {
      case 'language':
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="language" className="text-gray-900 dark:text-gray-100">
                {t('interface-language')}
              </Label>
              <Select value={language} onValueChange={(value: 'ru' | 'en') => setLanguage(value)}>
                <SelectTrigger className="w-full mt-2 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                  <SelectValue placeholder={t('select-language')} />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                  <SelectItem value="ru" className="text-gray-900 dark:text-gray-100">
                    {t('russian')}
                  </SelectItem>
                  <SelectItem value="en" className="text-gray-900 dark:text-gray-100">
                    {t('english')}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-900 dark:text-gray-100">Временная зона</Label>
              <Select defaultValue="europe/moscow">
                <SelectTrigger className="w-full mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="europe/moscow">Europe/Moscow (GMT+3)</SelectItem>
                  <SelectItem value="europe/london">Europe/London (GMT+0)</SelectItem>
                  <SelectItem value="america/new_york">America/New_York (GMT-5)</SelectItem>
                  <SelectItem value="asia/tokyo">Asia/Tokyo (GMT+9)</SelectItem>
                  <SelectItem value="australia/sydney">Australia/Sydney (GMT+10)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-900 dark:text-gray-100">Формат даты</Label>
              <Select defaultValue="dd.mm.yyyy">
                <SelectTrigger className="w-full mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd.mm.yyyy">DD.MM.YYYY (Российский)</SelectItem>
                  <SelectItem value="mm/dd/yyyy">MM/DD/YYYY (Американский)</SelectItem>
                  <SelectItem value="yyyy-mm-dd">YYYY-MM-DD (ISO)</SelectItem>
                  <SelectItem value="dd/mm/yyyy">DD/MM/YYYY (Европейский)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-900 dark:text-gray-100">Формат времени</Label>
              <Select defaultValue="24h">
                <SelectTrigger className="w-full mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">24-часовой формат</SelectItem>
                  <SelectItem value="12h">12-часовой формат (AM/PM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'telegram':
        return <TelegramInfo />;
      
      case 'database':
        return (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {t('supabase-description')}
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30"
              >
                <Database className="h-4 w-4 mr-2" />
                ✅ {t('connected-to-supabase')}
              </Button>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-3">
                <div>
                  <strong>Project ID:</strong>
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded ml-2 text-gray-900 dark:text-gray-100">
                    upirwcmwofvmjsqdqorj
                  </code>
                </div>
                <div>
                  <strong>Регион:</strong> <span className="ml-2">EU West (Ireland)</span>
                </div>
                <div>
                  <strong>Статус:</strong> <span className="ml-2 text-green-600 dark:text-green-400">Активен</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium mb-3">Управление данными</h4>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Экспорт данных
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Импорт данных
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Push-уведомления</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Новые сообщения</Label>
                    <p className="text-xs text-gray-500">Уведомления о новых сообщениях в каналах</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Запланированные посты</Label>
                    <p className="text-xs text-gray-500">Напоминания о публикации постов</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Статистика каналов</Label>
                    <p className="text-xs text-gray-500">Еженедельные отчеты по каналам</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Ошибки публикации</Label>
                    <p className="text-xs text-gray-500">Уведомления об ошибках при публикации</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Email уведомления</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Еженедельные отчеты</Label>
                    <p className="text-xs text-gray-500">Статистика по каналам и постам</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Критические ошибки</Label>
                    <p className="text-xs text-gray-500">Уведомления о системных ошибках</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Новости продукта</Label>
                    <p className="text-xs text-gray-500">Обновления и новые функции</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Звуки и вибрация</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Звук уведомлений</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Вибрация</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'security':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Безопасность аккаунта</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Двухфакторная аутентификация</Label>
                    <p className="text-xs text-gray-500">Дополнительная защита аккаунта</p>
                  </div>
                  <Button variant="outline" size="sm">Настроить</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Автоматический выход</Label>
                    <p className="text-xs text-gray-500">Выход после периода бездействия</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">API и токены</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">API ключи</Label>
                  <p className="text-xs text-gray-500 mb-2">Управление API ключами для интеграций</p>
                  <Button variant="outline" size="sm">Управлять ключами</Button>
                </div>
                <div>
                  <Label className="text-sm font-medium">Активные сессии</Label>
                  <p className="text-xs text-gray-500 mb-2">Просмотр и управление активными сессиями</p>
                  <Button variant="outline" size="sm">Показать сессии</Button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Резервное копирование</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Автоматическое резервирование</Label>
                    <p className="text-xs text-gray-500">Ежедневное создание резервных копий</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Создать резервную копию
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Тема интерфейса</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Выберите тему</Label>
                  <Select defaultValue="system">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Светлая тема</SelectItem>
                      <SelectItem value="dark">Темная тема</SelectItem>
                      <SelectItem value="system">Системная тема</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Автоматическое переключение</Label>
                    <p className="text-xs text-gray-500">Переключение темы по времени суток</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Отображение</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium mb-2 block">Размер шрифта</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Маленький</SelectItem>
                      <SelectItem value="medium">Средний</SelectItem>
                      <SelectItem value="large">Большой</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Компактный режим</Label>
                    <p className="text-xs text-gray-500">Уменьшенные отступы и элементы</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Анимации</Label>
                    <p className="text-xs text-gray-500">Плавные переходы между страницами</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Цветовая схема</h4>
              <div className="grid grid-cols-4 gap-2">
                <div className="h-8 bg-blue-500 rounded cursor-pointer border-2 border-blue-600"></div>
                <div className="h-8 bg-green-500 rounded cursor-pointer"></div>
                <div className="h-8 bg-purple-500 rounded cursor-pointer"></div>
                <div className="h-8 bg-red-500 rounded cursor-pointer"></div>
              </div>
            </div>
          </div>
        );
      
      case 'team':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Участники команды</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      A
                    </div>
                    <div>
                      <p className="text-sm font-medium">Администратор</p>
                      <p className="text-xs text-gray-500">admin@example.com</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Владелец</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      M
                    </div>
                    <div>
                      <p className="text-sm font-medium">Модератор</p>
                      <p className="text-xs text-gray-500">moderator@example.com</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Модератор</span>
                </div>
              </div>
              <Button className="w-full">
                <Users className="h-4 w-4 mr-2" />
                Пригласить участника
              </Button>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">Роли и права доступа</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Роль по умолчанию</Label>
                  <Select defaultValue="editor">
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Просмотр</SelectItem>
                      <SelectItem value="editor">Редактор</SelectItem>
                      <SelectItem value="admin">Администратор</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">Требовать подтверждение приглашений</Label>
                    <p className="text-xs text-gray-500">Новые участники должны подтвердить приглашение</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <SettingsIcon className="h-12 w-12 mx-auto mb-4" />
            <p>Настройки для этого модуля уже реализованы</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t('settings')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm sm:text-base">
          {t('system-settings')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {settingsModules.map((module) => (
          <Card 
            key={module.id} 
            className="cursor-pointer hover:shadow-md transition-shadow border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
            onClick={() => openModule(module.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                  {module.icon}
                </div>
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {module.title}
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {module.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedModule} onOpenChange={() => closeModule()}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <DialogHeader>
            <DialogTitle className="text-gray-900 dark:text-gray-100 flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5" />
              <span>
                {settingsModules.find(m => m.id === selectedModule)?.title || 'Настройки'}
              </span>
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              {settingsModules.find(m => m.id === selectedModule)?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            {selectedModule && renderModuleContent(selectedModule)}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
