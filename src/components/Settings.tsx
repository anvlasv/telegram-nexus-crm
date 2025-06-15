
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

export const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const settingsModules: SettingsModule[] = [
    {
      id: 'language',
      title: t('language-and-region'),
      description: t('language-region-desc'),
      icon: <Globe className="h-6 w-6" />
    },
    {
      id: 'telegram',
      title: t('telegram-integration'),
      description: t('telegram-integration-desc'),
      icon: <Bot className="h-6 w-6" />
    },
    {
      id: 'database',
      title: t('database'),
      description: t('database-desc'),
      icon: <Database className="h-6 w-6" />
    },
    {
      id: 'notifications',
      title: t('notifications'),
      description: t('notifications-desc'),
      icon: <Bell className="h-6 w-6" />
    },
    {
      id: 'security',
      title: t('security'),
      description: t('security-desc'),
      icon: <Shield className="h-6 w-6" />
    },
    {
      id: 'appearance',
      title: t('appearance'),
      description: t('appearance-desc'),
      icon: <Palette className="h-6 w-6" />
    },
    {
      id: 'team',
      title: t('team'),
      description: t('team-desc'),
      icon: <Users className="h-6 w-6" />
    }
  ];

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
              <Label className="text-gray-900 dark:text-gray-100">{t('timezone')}</Label>
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
              <Label className="text-gray-900 dark:text-gray-100">{t('date-format')}</Label>
              <Select defaultValue="dd.mm.yyyy">
                <SelectTrigger className="w-full mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dd.mm.yyyy">DD.MM.YYYY ({t('russian-format')})</SelectItem>
                  <SelectItem value="mm/dd/yyyy">MM/DD/YYYY ({t('american-format')})</SelectItem>
                  <SelectItem value="yyyy-mm-dd">YYYY-MM-DD ({t('iso-format')})</SelectItem>
                  <SelectItem value="dd/mm/yyyy">DD/MM/YYYY ({t('european-format')})</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-gray-900 dark:text-gray-100">{t('time-format')}</Label>
              <Select defaultValue="24h">
                <SelectTrigger className="w-full mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">{t('24h-format')}</SelectItem>
                  <SelectItem value="12h">{t('12h-format')}</SelectItem>
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
                  <strong>{t('region')}:</strong> <span className="ml-2">EU West (Ireland)</span>
                </div>
                <div>
                  <strong>{t('status')}:</strong> <span className="ml-2 text-green-600 dark:text-green-400">{t('active')}</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <h4 className="font-medium mb-3">{t('data-management')}</h4>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t('export-data')}
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  {t('import-data')}
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'notifications':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{t('push-notifications')}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{t('new-messages')}</Label>
                    <p className="text-xs text-gray-500">{t('new-messages-desc')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{t('scheduled-posts-notifications')}</Label>
                    <p className="text-xs text-gray-500">{t('scheduled-posts-desc')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{t('channel-statistics')}</Label>
                    <p className="text-xs text-gray-500">{t('channel-statistics-desc')}</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{t('publishing-errors')}</Label>
                    <p className="text-xs text-gray-500">{t('publishing-errors-desc')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{t('email-notifications')}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{t('weekly-reports')}</Label>
                    <p className="text-xs text-gray-500">{t('weekly-reports-desc')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{t('critical-errors')}</Label>
                    <p className="text-xs text-gray-500">{t('critical-errors-desc')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{t('product-news')}</Label>
                    <p className="text-xs text-gray-500">{t('product-news-desc')}</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{t('sounds-vibration')}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">{t('notification-sound')}</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">{t('vibration')}</Label>
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
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{t('account-security')}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{t('two-factor-auth')}</Label>
                    <p className="text-xs text-gray-500">{t('two-factor-desc')}</p>
                  </div>
                  <Button variant="outline" size="sm">{t('setup')}</Button>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{t('auto-logout')}</Label>
                    <p className="text-xs text-gray-500">{t('auto-logout-desc')}</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{t('api-tokens')}</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">{t('api-keys')}</Label>
                  <p className="text-xs text-gray-500 mb-2">{t('api-keys-desc')}</p>
                  <Button variant="outline" size="sm">{t('manage-keys')}</Button>
                </div>
                <div>
                  <Label className="text-sm font-medium">{t('active-sessions')}</Label>
                  <p className="text-xs text-gray-500 mb-2">{t('active-sessions-desc')}</p>
                  <Button variant="outline" size="sm">{t('show-sessions')}</Button>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{t('backup')}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{t('auto-backup')}</Label>
                    <p className="text-xs text-gray-500">{t('auto-backup-desc')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  {t('create-backup')}
                </Button>
              </div>
            </div>
          </div>
        );
      
      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{t('interface-theme')}</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium mb-2 block">{t('choose-theme')}</Label>
                  <Select defaultValue="system">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">{t('light-theme')}</SelectItem>
                      <SelectItem value="dark">{t('dark-theme')}</SelectItem>
                      <SelectItem value="system">{t('auto-theme')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{t('auto-switch')}</Label>
                    <p className="text-xs text-gray-500">{t('auto-switch-desc')}</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{t('display')}</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium mb-2 block">{t('font-size')}</Label>
                  <Select defaultValue="medium">
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">{t('small')}</SelectItem>
                      <SelectItem value="medium">{t('medium')}</SelectItem>
                      <SelectItem value="large">{t('large')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{t('compact-mode')}</Label>
                    <p className="text-xs text-gray-500">{t('compact-mode-desc')}</p>
                  </div>
                  <Switch />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{t('animations')}</Label>
                    <p className="text-xs text-gray-500">{t('animations-desc')}</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{t('color-scheme')}</h4>
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
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{t('team-members')}</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      A
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t('administrator')}</p>
                      <p className="text-xs text-gray-500">admin@example.com</p>
                    </div>
                  </div>
                  <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">{t('owner')}</span>
                </div>
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                      M
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t('moderator')}</p>
                      <p className="text-xs text-gray-500">moderator@example.com</p>
                    </div>
                  </div>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{t('moderator')}</span>
                </div>
              </div>
              <Button className="w-full">
                <Users className="h-4 w-4 mr-2" />
                {t('invite-member')}
              </Button>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">{t('roles-permissions')}</h4>
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">{t('default-role')}</Label>
                  <Select defaultValue="editor">
                    <SelectTrigger className="w-full mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">{t('viewer')}</SelectItem>
                      <SelectItem value="editor">{t('editor')}</SelectItem>
                      <SelectItem value="admin">{t('admin')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-sm font-medium">{t('require-invitation-confirmation')}</Label>
                    <p className="text-xs text-gray-500">{t('invitation-confirmation-desc')}</p>
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
            <p>{t('module-settings')}</p>
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
                {settingsModules.find(m => m.id === selectedModule)?.title || t('settings')}
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
