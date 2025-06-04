
import React from 'react';
import { Bot } from 'lucide-react';

export const BotSetupInstructions: React.FC = () => {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
      <div className="flex items-start gap-3">
        <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
        <div className="flex-1">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
            Подключение канала через бота @Teleg_CRMbot
          </h4>
          <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
            <li>Добавьте бота @Teleg_CRMbot в ваш канал как администратора</li>
            <li>Дайте боту права на публикацию сообщений и управление каналом</li>
            <li>Укажите username канала ниже - бот автоматически получит все остальные данные</li>
            <li>После подключения бот будет синхронизировать информацию о канале</li>
          </ol>
        </div>
      </div>
    </div>
  );
};
