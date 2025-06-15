
import { useQuery } from '@tanstack/react-query';
import { useChannels } from './useChannels';
import { useRecentPosts } from './useRecentPosts';

export const useAggregatedData = () => {
  const { channels } = useChannels();
  const { data: recentPosts = [] } = useRecentPosts();

  return useQuery({
    queryKey: ['aggregated-data', channels.length, recentPosts.length],
    queryFn: async () => {
      // Агрегированная статистика по всем каналам
      const totalSubscribers = channels.reduce((sum, channel) => 
        sum + (channel.subscriber_count || 0), 0
      );
      
      const totalChannels = channels.length;
      
      const totalPosts = recentPosts.length;
      
      const averageEngagement = channels.length > 0 
        ? channels.reduce((sum, channel) => sum + (channel.engagement_rate || 0), 0) / channels.length
        : 0;
      
      // Примерная статистика (в реальном приложении здесь были бы запросы к API)
      const totalViews = totalSubscribers * 1.5; // Примерный расчет
      const totalReach = totalSubscribers * 0.8; // Примерный расчет
      
      // 4 самых последних поста (независимо от канала)
      const recentPostsWithChannel = recentPosts
        .map(post => {
          const channel = channels.find(c => c.id === post.channel_id);
          return {
            ...post,
            channel_name: channel?.name || 'Unknown',
            channel_avatar: channel?.avatar_url
          };
        })
        .slice(0, 4);

      return {
        totalChannels,
        totalSubscribers,
        totalPosts,
        totalViews: Math.round(totalViews),
        totalReach: Math.round(totalReach),
        averageEngagement: Math.round(averageEngagement * 10) / 10,
        recentPosts: recentPostsWithChannel
      };
    },
    enabled: channels.length > 0,
  });
};
