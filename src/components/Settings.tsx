
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useLanguage } from '@/contexts/LanguageContext';
import { TelegramInfo } from './TelegramInfo';
import { Globe, Bot, Database, ExternalLink, Settings as SettingsIcon, Bell, Shield, Palette, Users } from 'lucide-react';

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
          <div className="space-y-4">
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
                  <SelectItem value="dd.mm.yyyy">DD.MM.YYYY</SelectItem>
                  <SelectItem value="mm/dd/yyyy">MM/DD/YYYY</SelectItem>
                  <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
      
      case 'telegram':
        return <TelegramInfo />;
      
      case 'database':
        return (
          <div className="space-y-4">
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
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <div>
                  Project ID: 
                  <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded ml-2 text-gray-900 dark:text-gray-100">
                    upirwcmwofvmjsqdqorj
                  </code>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Push-уведомления</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Новые сообщения</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Запланированные посты</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Статистика каналов</span>
                </label>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium">Email уведомления</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-sm">Еженедельные отчеты</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="rounded" />
                  <span className="text-sm">Ошибки публикации</span>
                </label>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Настройки для этого модуля пока не реализованы
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
        <DialogContent className="sm:max-w-[600px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
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
