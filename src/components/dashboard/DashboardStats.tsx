
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, MessageSquare, TrendingUp, Hash } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface AggregatedData {
  totalChannels: number;
  totalSubscribers: number;
  totalPosts: number;
  averageEngagement: number;
}

interface DashboardStatsProps {
  aggregatedData: AggregatedData;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ aggregatedData }) => {
  const { t } = useLanguage();

  const aggregatedStats = [
    {
      title: t('total-channels'),
      value: aggregatedData.totalChannels.toString(),
      change: '+2',
      trend: 'up',
      icon: Hash,
    },
    {
      title: t('total-subscribers'),
      value: aggregatedData.totalSubscribers.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: Users,
    },
    {
      title: t('total-posts'),
      value: aggregatedData.totalPosts.toString(),
      change: '+8',
      trend: 'up',
      icon: MessageSquare,
    },
    {
      title: t('average-engagement'),
      value: `${aggregatedData.averageEngagement}%`,
      change: '+0.8%',
      trend: 'up',
      icon: TrendingUp,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
      {aggregatedStats.map((stat) => (
        <Card key={stat.title} className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardContent className="p-3 sm:p-6">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                  {stat.title}
                </p>
                <p className="text-lg sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">
                  {stat.change}
                </p>
              </div>
              <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
