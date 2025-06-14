
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, TrendingUp, DollarSign, Calendar, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChannels } from '@/hooks/useChannels';
import { usePartners } from '@/hooks/usePartners';
import { useRecentPosts } from '@/hooks/useRecentPosts';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

export const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const { channels, isLoading: channelsLoading } = useChannels();
  const { data: partners = [], isLoading: partnersLoading } = usePartners();
  const { data: recentPosts = [], isLoading: postsLoading } = useRecentPosts();

  const totalSubscribers = channels.reduce((sum, channel) => sum + (channel.subscriber_count || 0), 0);
  const activeChannels = channels.filter(channel => channel.status === 'active').length;
  const avgEngagement = channels.length > 0 
    ? channels.reduce((sum, channel) => sum + (channel.engagement_rate || 0), 0) / channels.length 
    : 0;

  const stats = [
    {
      title: t('total-subscribers'),
      value: totalSubscribers.toLocaleString(),
      change: '+12.5%',
      trend: 'up',
      icon: Users,
    },
    {
      title: t('active-channels'),
      value: activeChannels.toString(),
      change: '+2',
      trend: 'up',
      icon: MessageSquare,
    },
    {
      title: t('engagement-rate'),
      value: `${avgEngagement.toFixed(1)}%`,
      change: '+0.8%',
      trend: 'up',
      icon: TrendingUp,
    },
    {
      title: t('revenue'),
      value: '$12,450',
      change: '+18.2%',
      trend: 'up',
      icon: DollarSign,
    },
  ];

  const pendingPartners = partners.filter(p => p.status === 'pending').slice(0, 2);

  if (channelsLoading || partnersLoading || postsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500 dark:text-gray-400">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{t('dashboard')}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{t('overview')}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {stats.map((stat) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Posts */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              {t('scheduled-posts')}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {t('upcoming-posts')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
                      {post.telegram_channels?.name || 'Unknown Channel'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                      {post.content}
                    </p>
                    <div className="flex items-center mt-1 sm:mt-2 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(post.scheduled_for), 'dd.MM.yyyy HH:mm', {
                        locale: language === 'ru' ? ru : enUS
                      })}
                    </div>
                  </div>
                  <Badge 
                    variant={post.status === 'sent' ? 'default' : post.status === 'pending' ? 'secondary' : 'outline'}
                    className="ml-2 flex-shrink-0"
                  >
                    {t(post.status || 'pending')}
                  </Badge>
                </div>
              ))}
              {recentPosts.length === 0 && (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  {t('no-scheduled-posts')}
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
              {t('view-all-posts')}
            </Button>
          </CardContent>
        </Card>

        {/* Pending Partners */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              {t('partner-requests')}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {t('pending-requests')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {pendingPartners.length > 0 ? (
                pendingPartners.map((partner) => (
                  <div key={partner.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm sm:text-base truncate">
                        {partner.name}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        {partner.partnership_type}
                      </p>
                      <Badge variant="outline" className="mt-1">
                        {t(partner.status || 'pending')}
                      </Badge>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-bold text-green-600 dark:text-green-400 text-sm sm:text-base">
                        {partner.commission_rate ? `${partner.commission_rate}%` : 'TBD'}
                      </p>
                      <div className="flex space-x-1 sm:space-x-2 mt-2">
                        <Button size="sm" variant="outline" className="text-xs">
                          {t('decline')}
                        </Button>
                        <Button size="sm" className="text-xs">
                          {t('accept')}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  Нет ожидающих запросов
                </div>
              )}
            </div>
            <Button variant="outline" className="w-full mt-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600">
              {t('view-all-requests')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
