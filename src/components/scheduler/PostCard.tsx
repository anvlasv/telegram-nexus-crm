
import React from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PostCardProps {
  post: any;
  onEdit: () => void;
  onDelete: () => void;
  onPublish: () => Promise<void>;
  channel: {
    name: string;
    username: string;
    avatar_url?: string | null;
    tg_avatar_url?: string | null; // Новый URL аватарки из Telegram
  };
}
export const PostCard: React.FC<PostCardProps> = ({ post, onEdit, onDelete, onPublish, channel }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [loading, setLoading] = React.useState(false);

  const handlePublish = async () => {
    setLoading(true);
    try {
      await onPublish();
      toast({ title: t('success'), description: t('post-published') });
    } catch (err: any) {
      toast({
        title: t('error'),
        description: err?.message || t('error-publishing-post'),
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-between space-x-4 bg-card p-4 rounded-lg shadow">
      <div className="flex items-center space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={channel.tg_avatar_url || channel.avatar_url || undefined}
            alt={channel.name}
          />
          <AvatarFallback>
            {channel.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold">{channel.name}</div>
          <div className="text-xs text-muted-foreground">@{channel.username}</div>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button size="sm" variant="outline" onClick={onEdit}>{t('edit')}</Button>
        <Button size="sm" variant="destructive" onClick={onDelete}>{t('delete')}</Button>
        <Button size="sm" onClick={handlePublish} disabled={loading}>
          {loading ? t('publishing') : t('publish')}
        </Button>
      </div>
    </div>
  );
};
