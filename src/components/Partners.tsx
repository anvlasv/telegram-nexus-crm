
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Handshake, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Partners = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {t('partners')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('partners-description')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              <Users className="h-5 w-5" />
              {t('partnerships')}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {t('active-partnerships')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500 dark:text-blue-400">
              12
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              <Handshake className="h-5 w-5" />
              {t('new-requests')}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {t('pending-partnership-requests')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500 dark:text-green-400">
              3
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-gray-100">
              <DollarSign className="h-5 w-5" />
              {t('revenue')}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {t('generated-revenue-from-partners')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-500 dark:text-purple-400">
              $5,500
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
