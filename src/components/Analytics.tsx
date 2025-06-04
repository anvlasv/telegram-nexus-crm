import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Eye, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Analytics = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {t('analytics')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Детальная аналитика ваших каналов
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('total-views')}
            </CardTitle>
            <Eye className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,234</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              +19% {t('from-last-month')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('total-likes')}
            </CardTitle>
            <Heart className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,567</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              +12% {t('from-last-month')}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('engagement-rate')}
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.4%</div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              +2% {t('from-last-month')}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('views-over-time')}</CardTitle>
          <CardDescription>{t('views-description')}</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <BarChart3 className="h-[200px] w-full" />
        </CardContent>
      </Card>
    </div>
  );
};
