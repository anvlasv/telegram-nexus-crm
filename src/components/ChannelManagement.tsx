
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Settings, Users, TrendingUp, MessageSquare } from 'lucide-react';

const channels = [
  {
    id: 1,
    name: 'Tech News Daily',
    username: '@technewsdaily',
    subscribers: '856K',
    type: 'channel',
    status: 'active',
    engagement: '8.2%',
    lastPost: '2 hours ago',
  },
  {
    id: 2,
    name: 'Crypto Updates',
    username: '@cryptoupdates',
    subscribers: '642K',
    type: 'channel',
    status: 'active',
    engagement: '12.1%',
    lastPost: '5 hours ago',
  },
  {
    id: 3,
    name: 'Marketing Community',
    username: '@marketingcommunity',
    subscribers: '234K',
    type: 'group',
    status: 'paused',
    engagement: '15.3%',
    lastPost: '1 day ago',
  },
  {
    id: 4,
    name: 'Startup Founders',
    username: '@startupfounders',
    subscribers: '189K',
    type: 'channel',
    status: 'active',
    engagement: '9.7%',
    lastPost: '3 hours ago',
  },
];

export const ChannelManagement: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Channel Management</h1>
          <p className="text-gray-600">Manage your Telegram channels and groups</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Channel
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Channels</p>
                <p className="text-3xl font-bold text-gray-900">24</p>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-3xl font-bold text-gray-900">2.4M</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg. Engagement</p>
                <p className="text-3xl font-bold text-gray-900">10.2%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channels List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Channels</CardTitle>
          <CardDescription>Overview of all connected Telegram channels and groups</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channels.map((channel) => (
              <div key={channel.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{channel.name}</h3>
                    <p className="text-sm text-gray-600">{channel.username}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <Badge variant={channel.type === 'channel' ? 'default' : 'secondary'}>
                        {channel.type}
                      </Badge>
                      <Badge variant={channel.status === 'active' ? 'default' : 'outline'}>
                        {channel.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{channel.subscribers}</p>
                    <p className="text-xs text-gray-500">Subscribers</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{channel.engagement}</p>
                    <p className="text-xs text-gray-500">Engagement</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-900">{channel.lastPost}</p>
                    <p className="text-xs text-gray-500">Last Post</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
