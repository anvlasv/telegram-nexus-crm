
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Users, Eye, MousePointer, Heart } from 'lucide-react';

const analyticsData = [
  {
    channel: 'Tech News Daily',
    subscribers: 856000,
    subscriberGrowth: 12.5,
    avgViews: 45000,
    viewGrowth: 8.3,
    engagement: 8.2,
    engagementGrowth: 0.8,
    ctr: 2.3,
    ctrGrowth: -0.2,
  },
  {
    channel: 'Crypto Updates',
    subscribers: 642000,
    subscriberGrowth: 18.7,
    avgViews: 38000,
    viewGrowth: 15.2,
    engagement: 12.1,
    engagementGrowth: 2.1,
    ctr: 3.1,
    ctrGrowth: 0.5,
  },
  {
    channel: 'Marketing Community',
    subscribers: 234000,
    subscriberGrowth: -2.1,
    avgViews: 18000,
    viewGrowth: -5.3,
    engagement: 15.3,
    engagementGrowth: 1.2,
    ctr: 4.2,
    ctrGrowth: 0.8,
  },
];

const topPosts = [
  {
    id: 1,
    channel: 'Tech News Daily',
    content: 'Breaking: Major AI breakthrough announced...',
    views: 89000,
    likes: 2400,
    shares: 890,
    engagement: 15.2,
    date: '2024-06-01',
  },
  {
    id: 2,
    channel: 'Crypto Updates',
    content: 'Bitcoin reaches new milestone as...',
    views: 76000,
    likes: 3200,
    shares: 1200,
    engagement: 18.5,
    date: '2024-06-01',
  },
  {
    id: 3,
    channel: 'Marketing Community',
    content: '10 essential marketing strategies for 2024...',
    views: 34000,
    likes: 1800,
    shares: 650,
    engagement: 22.1,
    date: '2024-05-31',
  },
];

export const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">Track performance and growth across all your channels</p>
      </div>

      {/* Channel Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Channel Performance</CardTitle>
          <CardDescription>Key metrics for your top-performing channels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analyticsData.map((channel, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-3">{channel.channel}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Users className="h-4 w-4 text-blue-500 mr-1" />
                      <span className="text-lg font-bold text-gray-900">
                        {(channel.subscribers / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      {channel.subscriberGrowth > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${channel.subscriberGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {channel.subscriberGrowth > 0 ? '+' : ''}{channel.subscriberGrowth}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Subscribers</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Eye className="h-4 w-4 text-purple-500 mr-1" />
                      <span className="text-lg font-bold text-gray-900">
                        {(channel.avgViews / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      {channel.viewGrowth > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${channel.viewGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {channel.viewGrowth > 0 ? '+' : ''}{channel.viewGrowth}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Avg Views</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <Heart className="h-4 w-4 text-red-500 mr-1" />
                      <span className="text-lg font-bold text-gray-900">{channel.engagement}%</span>
                    </div>
                    <div className="flex items-center justify-center">
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      <span className="text-xs text-green-600">+{channel.engagementGrowth}%</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Engagement</p>
                  </div>

                  <div className="text-center">
                    <div className="flex items-center justify-center mb-1">
                      <MousePointer className="h-4 w-4 text-orange-500 mr-1" />
                      <span className="text-lg font-bold text-gray-900">{channel.ctr}%</span>
                    </div>
                    <div className="flex items-center justify-center">
                      {channel.ctrGrowth > 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      <span className={`text-xs ${channel.ctrGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {channel.ctrGrowth > 0 ? '+' : ''}{channel.ctrGrowth}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">CTR</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Posts */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
          <CardDescription>Your most successful content this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPosts.map((post) => (
              <div key={post.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge variant="outline">{post.channel}</Badge>
                    <span className="text-xs text-gray-500">{post.date}</span>
                  </div>
                  <p className="font-medium text-gray-900 mb-2">{post.content}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {post.views.toLocaleString()} views
                    </span>
                    <span className="flex items-center">
                      <Heart className="h-3 w-3 mr-1" />
                      {post.likes.toLocaleString()} likes
                    </span>
                    <span>{post.shares.toLocaleString()} shares</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{post.engagement}%</div>
                  <div className="text-xs text-gray-500">Engagement</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
