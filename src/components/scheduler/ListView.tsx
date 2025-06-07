
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PostCard } from './PostCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface ListViewProps {
  posts: any[];
  onEditPost: (post: any) => void;
  onPublishPost: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  onCreatePost: () => void;
  hasSelectedChannel: boolean;
}

export const ListView: React.FC<ListViewProps> = ({
  posts,
  onEditPost,
  onPublishPost,
  onDeletePost,
  onCreatePost,
  hasSelectedChannel,
}) => {
  const { t } = useLanguage();

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onEdit={onEditPost}
          onPublish={onPublishPost}
          onDelete={onDeletePost}
        />
      ))}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t('no-scheduled-posts')}</p>
          <Button 
            onClick={onCreatePost}
            disabled={!hasSelectedChannel}
            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('create-first-post')}
          </Button>
        </div>
      )}
    </div>
  );
};
