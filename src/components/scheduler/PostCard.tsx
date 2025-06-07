
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Edit, Send, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

interface PostCardProps {
  post: {
    id: string;
    content: string;
    scheduled_for: string;
    status?: string;
    telegram_channels?: { name: string; username: string };
  };
  onEdit: (post: any) => void;
  onPublish: (postId: string) => void;
  onDelete: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onEdit,
  onPublish,
  onDelete,
}) => {
  const { t, language } = useLanguage();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return t('sent');
      case 'pending': return t('pending');
      case 'failed': return t('failed');
      default: return t('unknown');
    }
  };

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs truncate max-w-32">
                {post.telegram_channels?.name}
              </Badge>
              <Badge className={`text-xs ${getStatusColor(post.status || 'pending')}`}>
                {getStatusText(post.status || 'pending')}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2 break-words">
              {post.content}
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              {new Date(post.scheduled_for).toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US')}
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0 self-start">
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={() => onEdit(post)}
              title={t('edit')}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={() => onPublish(post.id)}
              disabled={post.status === 'sent'}
              title={t('publish')}
            >
              <Send className="h-4 w-4" />
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="h-8 w-8 p-0"
              onClick={() => onDelete(post.id)}
              title={t('delete')}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
