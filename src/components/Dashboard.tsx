
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePartners } from '@/hooks/usePartners';
import { useAggregatedData } from '@/hooks/useAggregatedData';
import { useAdvertisingCampaigns } from '@/hooks/useAdvertisingCampaigns';
import { useNavigate } from 'react-router-dom';
import { DashboardStats } from './dashboard/DashboardStats';
import { RecentPostsCard } from './dashboard/RecentPostsCard';
import { RevenueSummaryCard } from './dashboard/RevenueSummaryCard';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
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

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">{t('dashboard')}</h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{t('overview')}</p>
      </div>

      {/* Stats Grid */}
      <DashboardStats aggregatedData={aggregatedData} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Posts from All Channels */}
        <RecentPostsCard 
          recentPosts={aggregatedData.recentPosts}
          onViewAllPosts={handleViewAllPosts}
        />

        {/* Revenue Summary */}
        <RevenueSummaryCard 
          partners={partners}
          campaigns={campaigns}
          onViewAllPartners={handleViewAllPartners}
        />
      </div>
    </div>
  );
};
