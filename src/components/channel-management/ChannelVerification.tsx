
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Bot, AlertCircle, CheckCircle } from 'lucide-react';

interface ChannelVerificationProps {
  verificationStatus: 'idle' | 'checking' | 'success' | 'error';
  verificationMessage: string;
  chatData: any;
  editingChannel: boolean;
}

export const ChannelVerification: React.FC<ChannelVerificationProps> = ({
  verificationStatus,
  verificationMessage,
  chatData,
  editingChannel
}) => {
  return (
    <>
      {!editingChannel && (
        <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 mb-4">
          <Bot className="h-4 w-4" />
          <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Как подключить канал:</strong>
            <ol className="list-decimal list-inside mt-2 space-y-1 text-xs">
              <li>Добавьте бота @Teleg_CRMbot в администраторы</li>
              <li>Дайте боту права администратора</li>
              <li>Введите username канала</li>
              <li>Дождитесь автоматической проверки</li>
            </ol>
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === 'checking' && (
        <p className="text-sm text-blue-600 mb-2">Проверяем канал...</p>
      )}

      {verificationMessage && (
        <Alert className={`mb-4 ${verificationStatus === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
          {verificationStatus === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          <AlertDescription className={`text-sm ${verificationStatus === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
            {verificationMessage}
          </AlertDescription>
        </Alert>
      )}

      {chatData && (
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg space-y-2 mb-4">
          <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm">Информация о канале:</h4>
          <div className="grid grid-cols-1 gap-1 text-xs">
            <p><strong>Название:</strong> {chatData.title}</p>
            <p><strong>Username:</strong> @{chatData.username}</p>
            <p><strong>ID:</strong> {chatData.id}</p>
            <p><strong>Подписчики:</strong> {chatData.member_count?.toLocaleString() || 'Неизвестно'}</p>
          </div>
        </div>
      )}
    </>
  );
};
