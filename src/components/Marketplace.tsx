
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, ShoppingBag, TrendingUp } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Marketplace = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {t('marketplace')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('marketplace-description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('ads')}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {t('buy-ads')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <ShoppingBag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span>{t('buy-ads-description')}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('sales')}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {t('sell-ads')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span>{t('sell-ads-description')}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('partnerships')}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {t('find-partners')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Target className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span>{t('find-partners-description')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
