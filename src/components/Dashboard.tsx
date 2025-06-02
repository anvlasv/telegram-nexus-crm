
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, TrendingUp, DollarSign, Calendar, Clock } from 'lucide-react';

const stats = [
  {
    title: 'Total Subscribers',
    value: '2.4M',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
  },
  {
    title: 'Active Channels',
    value: '24',
    change: '+2',
    trend: 'up',
    icon: MessageSquare,
  },
  {
    title: 'Engagement Rate',
    value: '8.2%',
    change: '+0.8%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    title: 'Revenue',
    value: '$12,450',
    change: '+18.2%',
    trend: 'up',
    icon: DollarSign,
  },
];

const recentPosts = [
  {
    id: 1,
    channel: 'Tech News Daily',
    content: 'New AI breakthrough in natural language processing...',
    scheduledFor: '2024-06-02 14:30',
    status: 'scheduled',
  },
  {
    id: 2,
    channel: 'Crypto Updates',
    content: 'Bitcoin reaches new all-time high amid...',
    scheduledFor: '2024-06-02 16:00',
    status: 'draft',
  },
  {
    id: 3,
    channel: 'Marketing Tips',
    content: '5 proven strategies to increase engagement...',
    scheduledFor: '2024-06-02 18:00',
    status: 'published',
  },
];

const pendingRequests = [
  {
    id: 1,
    advertiser: 'TechCorp Inc.',
    channel: 'Tech News Daily',
    budget: '$500',
    type: 'sponsored',
  },
  {
    id: 2,
    advertiser: 'Crypto Exchange',
    channel: 'Crypto Updates',
    budget: '$1,200',
    type: 'banner',
  },
];

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Overview of your Telegram channels and performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <stat.icon className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Posts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Scheduled Posts
            </CardTitle>
            <CardDescription>Upcoming and recent post activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{post.channel}</p>
                    <p className="text-sm text-gray-600 truncate">{post.content}</p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.scheduledFor}
                    </div>
                  </div>
                  <Badge variant={post.status === 'published' ? 'default' : post.status === 'scheduled' ? 'secondary' : 'outline'}>
                    {post.status}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Posts
            </Button>
          </CardContent>
        </Card>

        {/* Pending Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Partner Requests
            </CardTitle>
            <CardDescription>Pending advertising requests</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{request.advertiser}</p>
                    <p className="text-sm text-gray-600">{request.channel}</p>
                    <Badge variant="outline" className="mt-1">{request.type}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{request.budget}</p>
                    <div className="flex space-x-2 mt-2">
                      <Button size="sm" variant="outline">Decline</Button>
                      <Button size="sm">Accept</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Requests
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
