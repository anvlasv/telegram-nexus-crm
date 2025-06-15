
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bot, Info } from 'lucide-react';

export const ChannelConnectionHint: React.FC = () => {
  return (
    <Alert className="mb-4 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
      <Info className="h-4 w-4" />
      <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
        <div className="space-y-2">
          <p className="font-medium">Как подключить канал:</p>
          <ol className="list-decimal list-inside space-y-1 text-xs">
            <li>Добавьте бота @Teleg_CRMbot в администраторы вашего канала</li>
            <li>Дайте боту права на отправку сообщений</li>
            <li>Введите username канала (без @) в поле ниже</li>
            <li>Дождитесь автоматической верификации</li>
          </ol>
        </div>
      </AlertDescription>
    </Alert>
  );
};
