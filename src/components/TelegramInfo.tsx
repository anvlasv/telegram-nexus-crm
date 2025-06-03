
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTelegram } from '@/hooks/useTelegram';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bot, User, Smartphone, Palette, Moon, Sun, Vibrate, Bell } from 'lucide-react';

export const TelegramInfo: React.FC = () => {
  const { webApp, user, isInTelegram, isDarkTheme, showAlert, hapticFeedback, toggleTheme } = useTelegram();
  const { t } = useLanguage();

  const handleTestAlert = () => {
    hapticFeedback('light');
    showAlert('🚀 Тест уведомления Telegram MiniApp работает!');
  };

  const handleHapticTest = () => {
    hapticFeedback('success');
  };

  if (!isInTelegram) {
    return (
      <Card className="p-4 sm:p-6 border-orange-200 dark:border-orange-800 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/50 dark:to-yellow-950/50">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
            <Bot className="h-5 w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <h3 className="font-semibold text-orange-800 dark:text-orange-200">Telegram MiniApp</h3>
        </div>
        <p className="text-sm text-orange-700 dark:text-orange-300 mb-4">
          🌐 Приложение запущено в веб-браузере. Для полного функционала откройте через Telegram бота.
        </p>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-orange-600 border-orange-300 dark:text-orange-400 dark:border-orange-600">
            Веб-версия
          </Badge>
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <Switch checked={isDarkTheme} onCheckedChange={toggleTheme} />
            <Moon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Статус подключения */}
      <Card className="p-4 sm:p-6 border-green-200 dark:border-green-800 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Bot className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <h3 className="font-semibold text-green-800 dark:text-green-200">Telegram MiniApp</h3>
            <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-300 dark:border-green-700">
              ✅ Активно
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Sun className="h-4 w-4 text-yellow-500" />
            <Switch checked={isDarkTheme} onCheckedChange={toggleTheme} />
            <Moon className="h-4 w-4 text-blue-500" />
          </div>
        </div>
        
        {user && (
          <div className="space-y-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-lg border border-white/20 dark:border-gray-700/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user.first_name} {user.last_name}
                </p>
                {user.username && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">@{user.username}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-500 dark:text-gray-400">ID:</span>
              <code className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded font-mono text-gray-900 dark:text-gray-100">
                {user.id}
              </code>
            </div>
          </div>
        )}
      </Card>

      {/* Информация о платформе */}
      <Card className="p-4 sm:p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h4 className="font-medium mb-4 flex items-center space-x-2">
          <Smartphone className="h-4 w-4 text-blue-500" />
          <span className="text-gray-900 dark:text-gray-100">Информация о платформе</span>
        </h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Платформа:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{webApp?.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Версия API:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{webApp?.version}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">Тема:</span>
              <div className="flex items-center space-x-1">
                <Palette className="h-3 w-3 text-gray-600 dark:text-gray-400" />
                <span className="font-medium capitalize text-gray-900 dark:text-gray-100">{webApp?.colorScheme}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Высота:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{webApp?.viewportHeight}px</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Тестирование функций */}
      <Card className="p-4 sm:p-6 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h4 className="font-medium mb-4 text-gray-900 dark:text-gray-100">🧪 Тестирование функций</h4>
        <div className="grid grid-cols-1 gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleTestAlert} 
            className="w-full justify-start bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <Bell className="h-4 w-4 mr-2" />
            Тест уведомления
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleHapticTest} 
            className="w-full justify-start bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <Vibrate className="h-4 w-4 mr-2" />
            Тест вибрации
          </Button>
        </div>
      </Card>

      {/* Информация о боте */}
      <Card className="p-4 sm:p-6 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800">
        <h4 className="font-medium mb-3 text-blue-800 dark:text-blue-200">🤖 Информация о боте</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-blue-700 dark:text-blue-300">Токен:</span>
            <code className="text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded text-blue-900 dark:text-blue-100">
              7696745596:AAG...x8Q
            </code>
          </div>
          <div className="pt-2 border-t border-blue-200 dark:border-blue-700">
            <span className="text-blue-700 dark:text-blue-300 text-xs">Web App URL:</span>
            <code className="text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-1 rounded block mt-1 break-all text-blue-900 dark:text-blue-100">
              https://6771f109-3495-4748-b495-455f4dce0096.lovableproject.com
            </code>
          </div>
        </div>
      </Card>
    </div>
  );
};
