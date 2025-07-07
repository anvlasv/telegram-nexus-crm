
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

interface PostCardProps {
  post: any;
  onEdit: () => void;
  onDelete: () => void;
  onPublish: () => Promise<void>;
  channel: {
    name: string;
    username: string;
    avatar_url?: string | null;
  };
  isPublishing?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onEdit, 
  onDelete, 
  onPublish, 
  channel,
  isPublishing = false 
}) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const handlePublish = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await onPublish();
    } catch (err: any) {
      console.error('[PostCard] Publish error:', err);
      toast({
        title: t('error'),
        description: err?.message || t('error-publishing-post'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete();
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };

  const isPublished = post.status === 'sent';
  const isDisabled = loading || isPublishing || isPublished;

  return (
    <div className="bg-card p-3 sm:p-4 rounded-lg shadow border hover:shadow-md transition-shadow">
      {/* Header with channel info */}
      <div className="flex items-center space-x-3 mb-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage
            src={channel.avatar_url || undefined}
            alt={channel.name}
          />
          <AvatarFallback className="text-xs">
            {channel.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-sm truncate">{channel.name}</div>
        </div>
        <div className="text-xs text-muted-foreground text-right flex-shrink-0">
          {format(new Date(post.scheduled_for), 'dd.MM.yyyy HH:mm', { 
            locale: language === 'ru' ? ru : enUS 
          })}
        </div>
      </div>

      {/* Content */}
      <div className="mb-3">
        <p className="text-sm text-foreground line-clamp-3 break-words">
          {post.content}
        </p>
        {post.media_urls && post.media_urls.length > 0 && (
          <div className="mt-2 text-xs text-muted-foreground">
            📎 {post.media_urls.length} медиафайл(ов)
          </div>
        )}
      </div>

      {/* Status indicator */}
      {isPublished && (
        <div className="mb-3">
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            ✓ {t('published')}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-2 justify-end">
        <Button 
          size="sm" 
          variant="outline" 
          onClick={handleEdit}
          className="text-xs"
        >
          {t('edit')}
        </Button>
        <Button 
          size="sm" 
          variant="destructive" 
          onClick={handleDelete} 
          className="text-xs"
        >
          {t('delete')}
        </Button>
        <Button 
          size="sm" 
          onClick={handlePublish} 
          disabled={isDisabled}
          className="text-xs"
        >
          {loading || isPublishing ? t('publishing') : isPublished ? t('published') : t('publish')}
        </Button>
      </div>
    </div>
  );
};
