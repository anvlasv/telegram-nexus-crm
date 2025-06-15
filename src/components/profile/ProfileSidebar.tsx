
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Settings, Shield, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/hooks/useTelegram';

export const ProfileSidebar: React.FC = () => {
  const { t } = useLanguage();
  const { user: telegramUser } = useTelegram();

  return (
    <div className="space-y-6">
      <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <Settings className="h-5 w-5" />
            <span>{t('quick-actions')}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Settings className="h-4 w-4 mr-2" />
            {t('account-settings')}
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Shield className="h-4 w-4 mr-2" />
            {t('security')}
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <Activity className="h-4 w-4 mr-2" />
            {t('activity-history')}
          </Button>
        </CardContent>
      </Card>

      {telegramUser && (
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-100">
              {t('telegram-profile')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">ID:</span>
              <span className="ml-2 text-gray-900 dark:text-gray-100">{telegramUser.id}</span>
            </div>
            <div className="text-sm">
              <span className="text-gray-600 dark:text-gray-400">{t('name')}:</span>
              <span className="ml-2 text-gray-900 dark:text-gray-100">
                {telegramUser.first_name} {telegramUser.last_name}
              </span>
            </div>
            {telegramUser.username && (
              <div className="text-sm">
                <span className="text-gray-600 dark:text-gray-400">Username:</span>
                <span className="ml-2 text-gray-900 dark:text-gray-100">
                  @{telegramUser.username}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
