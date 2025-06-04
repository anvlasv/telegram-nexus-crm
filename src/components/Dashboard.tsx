import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare, Users, TrendingUp, Calendar } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Dashboard = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {t('dashboard')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Обзор ваших Telegram каналов и статистики
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('active-channels')}</CardTitle>
            <MessageSquare className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('channels-on-platform')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('total-subscribers')}</CardTitle>
            <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,543</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('across-all-channels')}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('engagement-rate')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+2.5%</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('since-last-month')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('recent-activity')}</CardTitle>
          <CardDescription>{t('latest-activities-on-channels')}</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ul className="list-none space-y-2">
            <li className="flex items-center space-x-3">
              <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span>{t('new-post-published')}</span>
            </li>
            <li className="flex items-center space-x-3">
              <Users className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span>{t('subscriber-joined')}</span>
            </li>
            <li className="flex items-center space-x-3">
              <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span>{t('increased-engagement')}</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
