
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Send, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const Scheduler = () => {
  const { t } = useLanguage();

  const handleSchedulePost = () => {
    console.log('Opening post scheduler...');
  };

  const handleViewCalendar = () => {
    console.log('Opening calendar view...');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {t('scheduler')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('scheduler-description')}
          </p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button onClick={handleSchedulePost} className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            {t('schedule-post')}
          </Button>
          <Button onClick={handleViewCalendar} variant="outline" className="flex-1 sm:flex-none">
            <Calendar className="h-4 w-4 mr-2" />
            {t('view-calendar')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('upcoming-posts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('no-upcoming-posts')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('scheduled-posts')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('no-scheduled-posts')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {t('post-templates')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('no-post-templates')}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
