
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { PostCard } from './PostCard';
import { PostPreviewModal } from './PostPreviewModal';
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
  const [previewPost, setPreviewPost] = useState<any>(null);

  const handlePostClick = (post: any) => {
    setPreviewPost(post);
  };

  const handleEditFromPreview = () => {
    if (previewPost) {
      onEditPost(previewPost);
      setPreviewPost(null);
    }
  };

  const handlePublishFromPreview = async () => {
    if (previewPost) {
      await onPublishPost(previewPost.id);
      setPreviewPost(null);
    }
  };

  const handleDeleteFromPreview = () => {
    if (previewPost) {
      onDeletePost(previewPost.id);
      setPreviewPost(null);
    }
  };

  return (
    <div className="space-y-3">
      {/* Posts List */}
      <div className="space-y-3">
        {posts.map((post) => (
          <div key={post.id} onClick={() => handlePostClick(post)} className="cursor-pointer">
            <PostCard
              post={post}
              channel={post.telegram_channels}
              onEdit={() => onEditPost(post)}
              onPublish={async () => await onPublishPost(post.id)}
              onDelete={() => onDeletePost(post.id)}
            />
          </div>
        ))}
      </div>

      {/* Empty State */}
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">{t('no-scheduled-posts')}</p>
          <Button 
            onClick={onCreatePost}
            disabled={!hasSelectedChannel}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('create-first-post')}
          </Button>
        </div>
      )}

      {/* Preview Modal */}
      <PostPreviewModal
        isOpen={!!previewPost}
        onClose={() => setPreviewPost(null)}
        post={previewPost}
        onEdit={handleEditFromPreview}
        onPublish={handlePublishFromPreview}
        onDelete={handleDeleteFromPreview}
      />
    </div>
  );
};
