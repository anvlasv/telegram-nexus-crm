
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Users, Calendar, Edit2, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getStatusColor } from '@/utils/channelUtils';

interface ChannelCardProps {
  channel: any;
  onEdit: (channel: any) => void;
  onDelete: (id: string) => void;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onEdit, onDelete }) => {
  const { t } = useLanguage();

  return (
    <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
              {channel.name}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {channel.username}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(channel.status || 'active')}>
            {t(channel.status || 'active')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <Users className="h-4 w-4 mr-2" />
            <span>{(channel.subscriber_count || 0).toLocaleString()} {t('subscribers')}</span>
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-400">
            <MessageSquare className="h-4 w-4 mr-2" />
            <span>0 {t('posts')}</span>
          </div>
        </div>
        
        {channel.last_post_at && (
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{t('last-post')}: {new Date(channel.last_post_at).toLocaleDateString('ru-RU')}</span>
          </div>
        )}
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(channel)}
            className="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            {t('edit')}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(channel.id)}
            className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
