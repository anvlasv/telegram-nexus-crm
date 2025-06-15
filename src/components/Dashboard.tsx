import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, TrendingUp, Hash, Calendar, Clock, DollarSign } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePartners } from '@/hooks/usePartners';
import { useAggregatedData } from '@/hooks/useAggregatedData';
import { useAdvertisingCampaigns } from '@/hooks/useAdvertisingCampaigns';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const { data: partners = [], isLoading: partnersLoading } = usePartners();
  const { data: campaigns = [] } = useAdvertisingCampaigns();
  const { data: aggregatedData, isLoading: aggregatedLoading } = useAggregatedData();

  if (partnersLoading || aggregatedLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500 dark:text-gray-400">{t('loading')}</div>
      </div>
    );
  }

  if (!aggregatedData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500 dark:text-gray-400">{t('no-data')}</div>
      </div>
    );
  }

  const handleViewAllPosts = () => {
    navigate('/scheduler');
  };

  const handleViewAllPartners = () => {
    navigate('/partners');
  };

  // Calculate partner revenues from campaigns
  const getPartnerRevenue = (partnerId: string) => {
    return campaigns
      .filter(c => c.partner_id === partnerId && c.status === 'published')
      .reduce((sum, c) => sum + c.price, 0);
  };

  const totalRevenue = campaigns
    .filter(c => c.status === 'published')
    .reduce((sum, c) => sum + c.price, 0);

  // Агрегированная статистика по всем каналам
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{t('dashboard')}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{t('overview')}</p>
      </div>

      {/* Stats Grid */}
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Posts from All Channels */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              {t('recent-posts')}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {t('latest-posts-across-channels')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              {aggregatedData.recentPosts.map((post) => (
                <div key={post.id} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <Avatar className="h-8 w-8 mt-1">
                    <AvatarImage src={post.channel_avatar || undefined} />
                    <AvatarFallback className="text-xs">
                      {post.channel_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {post.channel_name}
                      </span>
                      <Badge 
                        variant={post.status === 'sent' ? 'default' : post.status === 'pending' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {t(post.status || 'pending')}
                      </Badge>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <Clock className="h-3 w-3 mr-1" />
                      {format(new Date(post.scheduled_for), 'dd.MM.yyyy HH:mm', {
                        locale: language === 'ru' ? ru : enUS
                      })}
                    </div>
                  </div>
                </div>
              ))}
              {aggregatedData.recentPosts.length === 0 && (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  {t('no-recent-posts')}
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              onClick={handleViewAllPosts}
            >
              {t('view-all-posts')}
            </Button>
          </CardContent>
        </Card>

        {/* Revenue Summary - Fully Translated */}
        <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
              <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
              {t('revenue-summary')}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {t('partner-revenue-overview')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-green-50 dark:bg-green-900/20">
                <div className="flex items-center justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                      {t('total-revenue')}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {t('revenue-by-partner')}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-bold text-green-600 dark:text-green-400 text-lg">
                      {totalRevenue.toLocaleString()} ₽
                    </p>
                  </div>
                </div>
              </div>
              
              {partners.slice(0, 3).map((partner) => {
                const partnerRevenue = getPartnerRevenue(partner.id);
                return (
                  <div key={partner.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                        {partner.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {partner.partnership_type}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-bold text-green-600 dark:text-green-400 text-sm">
                        {partnerRevenue.toLocaleString()} ₽
                      </p>
                    </div>
                  </div>
                );
              })}
              {partners.length === 0 && (
                <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                  {t('no-partners')}
                </div>
              )}
            </div>
            <Button 
              variant="outline" 
              className="w-full mt-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
              onClick={handleViewAllPartners}
            >
              {t('view-all-partners')}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
