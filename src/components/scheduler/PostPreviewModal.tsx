
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

interface PostPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: any;
  onEdit: () => void;
  onPublish: () => Promise<void>;
  onDelete: () => void;
}

export const PostPreviewModal: React.FC<PostPreviewModalProps> = ({
  isOpen,
  onClose,
  post,
  onEdit,
  onPublish,
  onDelete,
}) => {
  const { t, language } = useLanguage();
  const [loading, setLoading] = React.useState(false);

  if (!post) return null;

  const handlePublish = async () => {
    setLoading(true);
    try {
      await onPublish();
      onClose();
    } catch (error) {
      console.error('Error publishing post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    onEdit();
    onClose();
  };

  const handleDelete = () => {
    onDelete();
    onClose();
  };

  const getPostTypeIcon = () => {
    switch (post.post_type) {
      case 'photo': return '📷';
      case 'video': return '🎥';
      case 'audio': return '🎵';
      case 'document': return '📄';
      case 'poll': return '📊';
      default: return '💬';
    }
  };

  const renderPostContent = () => {
    if (post.post_type === 'poll') {
      return (
        <div className="space-y-3">
          <div className="font-medium">{post.content}</div>
          {post.poll_options && (
            <div className="space-y-2">
              {post.poll_options.map((option: string, index: number) => (
                <div key={index} className="flex items-center p-2 bg-gray-100 dark:bg-gray-800 rounded">
                  <div className="w-4 h-4 border border-gray-400 rounded-sm mr-3"></div>
                  <span>{option}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {post.content && (
          <div className="whitespace-pre-wrap break-words">
            {post.content}
          </div>
        )}
        {post.media_urls && post.media_urls.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">
              {t('attached-media')} ({post.media_urls.length})
            </div>
            <div className="grid grid-cols-2 gap-2">
              {post.media_urls.map((url: string, index: number) => (
                <div key={index} className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-center">
                  <div className="text-2xl mb-1">{getPostTypeIcon()}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {url.split('/').pop() || `${t('media-file')} ${index + 1}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-xl">{getPostTypeIcon()}</span>
            {t('post-preview')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header with channel info */}
          <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={post.telegram_channels?.avatar_url || undefined}
                alt={post.telegram_channels?.name || 'Channel'}
              />
              <AvatarFallback>
                {(post.telegram_channels?.name || 'C').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">
                {post.telegram_channels?.name || 'Unknown Channel'}
              </div>
              <div className="text-sm text-muted-foreground truncate">
                @{post.telegram_channels?.username || 'unknown'}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {format(new Date(post.scheduled_for), 'dd.MM.yyyy HH:mm', { 
                locale: language === 'ru' ? ru : enUS 
              })}
            </div>
          </div>

          {/* Post content preview */}
          <div className="border rounded-lg p-4 bg-white dark:bg-gray-950">
            <div className="flex items-center gap-2 mb-3 text-sm text-muted-foreground">
              <span>{getPostTypeIcon()}</span>
              <span>{t(`post-type-${post.post_type}`)}</span>
            </div>
            {renderPostContent()}
          </div>

          {/* Status */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{t('status')}:</span>
            <span className={`text-sm px-2 py-1 rounded-full ${
              post.status === 'sent' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {post.status === 'sent' ? t('published') : t('scheduled')}
            </span>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              {t('close')}
            </Button>
            <Button variant="outline" onClick={handleEdit}>
              {t('edit')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t('delete')}
            </Button>
            <Button 
              onClick={handlePublish} 
              disabled={loading || post.status === 'sent'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? t('publishing') : post.status === 'sent' ? t('published') : t('publish')}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
