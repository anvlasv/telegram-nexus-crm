
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, MessageSquare, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export const ProfileStats: React.FC = () => {
  const { t } = useLanguage();

  const stats = [
    { label: t('active-channels'), value: '3', icon: MessageSquare },
    { label: t('published-posts'), value: '127', icon: Activity },
    { label: t('views'), value: '45.2K', icon: BarChart3 }
  ];

  return (
    <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center space-x-2">
          <BarChart3 className="h-5 w-5" />
          <span>{t('statistics')}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <stat.icon className="h-8 w-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
