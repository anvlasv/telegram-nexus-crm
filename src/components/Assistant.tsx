
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, MessageSquare, Lightbulb, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Assistant = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {t('assistant')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('assistant-description')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t('ai-suggestions')}</CardTitle>
          <CardDescription>{t('content-ideas')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <span>{t('generate-ideas')}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t('analytics-insights')}</CardTitle>
          <CardDescription>{t('performance-analysis')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-blue-500" />
            <span>{t('get-insights')}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{t('auto-responses')}</CardTitle>
          <CardDescription>{t('smart-replies')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4 text-green-500" />
            <span>{t('setup-auto-replies')}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
