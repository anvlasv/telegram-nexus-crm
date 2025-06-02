
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTelegram } from '@/hooks/useTelegram';
import { useLanguage } from '@/contexts/LanguageContext';
import { Bot, User, Smartphone, Palette } from 'lucide-react';

export const TelegramInfo: React.FC = () => {
  const { webApp, user, isInTelegram, showAlert, hapticFeedback } = useTelegram();
  const { t } = useLanguage();

  const handleTestAlert = () => {
    hapticFeedback('light');
    showAlert('Тест уведомления Telegram MiniApp!');
  };

  const handleHapticTest = () => {
    hapticFeedback('success');
  };

  if (!isInTelegram) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Bot className="h-5 w-5 text-blue-600" />
          <h3 className="font-semibold">Telegram MiniApp</h3>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Это приложение не запущено внутри Telegram. Для полного функционала откройте через Telegram бота.
        </p>
        <Badge variant="outline" className="text-orange-600 border-orange-200">
          Веб-версия
        </Badge>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Bot className="h-5 w-5 text-green-600" />
          <h3 className="font-semibold">Telegram MiniApp</h3>
          <Badge variant="default" className="bg-green-100 text-green-700">
            Активно
          </Badge>
        </div>
        
        {user && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                {user.first_name} {user.last_name} (@{user.username})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">ID:</span>
              <code className="text-xs bg-gray-100 px-2 py-1 rounded">{user.id}</code>
            </div>
          </div>
        )}

        <div className="mt-4 pt-4 border-t space-y-2">
          <div className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Платформа: {webApp?.platform}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Palette className="h-4 w-4 text-gray-500" />
            <span className="text-sm">Тема: {webApp?.colorScheme}</span>
          </div>
          <div className="text-sm text-gray-600">
            Версия API: {webApp?.version}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h4 className="font-medium mb-3">Тест функций Telegram</h4>
        <div className="space-y-2">
          <Button variant="outline" size="sm" onClick={handleTestAlert} className="w-full">
            Тест уведомления
          </Button>
          <Button variant="outline" size="sm" onClick={handleHapticTest} className="w-full">
            Тест вибрации
          </Button>
        </div>
      </Card>
    </div>
  );
};
