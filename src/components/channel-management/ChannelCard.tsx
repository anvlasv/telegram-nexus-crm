
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Edit, Trash2, Users, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

interface ChannelCardProps {
  channel: any;
  onEdit: (channel: any) => void;
  onDelete: (channel: any) => void;
}

export const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  onEdit,
  onDelete,
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'paused':
        return 'Приостановлен';
      case 'archived':
        return 'Архивирован';
      default:
        return status;
    }
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3 min-w-0 flex-1">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage 
                src={channel.avatar_url} 
                alt={channel.name}
              />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm font-medium">
                {channel.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm">
                {channel.name}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                @{channel.username}
              </p>
            </div>
          </div>
          <Badge className={`${getStatusColor(channel.status)} text-xs px-2 py-1 flex-shrink-0`}>
            {getStatusText(channel.status)}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
              <Users className="h-3 w-3" />
              <span>{channel.subscriber_count?.toLocaleString() || 0}</span>
            </div>
            {channel.last_post_at && (
              <div className="flex items-center space-x-1 text-gray-600 dark:text-gray-400">
                <Clock className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(channel.last_post_at), {
                    addSuffix: true,
                    locale: ru,
                  })}
                </span>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onEdit(channel)}
              className="flex-1 h-8 text-xs"
            >
              <Edit className="h-3 w-3 mr-1" />
              Изменить
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(channel)}
              className="flex-1 h-8 text-xs text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 dark:text-red-400 dark:border-red-800 dark:hover:bg-red-950"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Удалить
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
