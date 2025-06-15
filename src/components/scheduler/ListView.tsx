
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, X } from 'lucide-react';
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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Фильтрация постов по поисковому запросу
  const filteredPosts = React.useMemo(() => {
    if (!searchQuery || searchQuery.replace(/\s/g, '').length < 4) {
      return posts;
    }
    
    const query = searchQuery.toLowerCase();
    return posts.filter(post => 
      post.content?.toLowerCase().includes(query) ||
      (post.poll_options && post.poll_options.some((option: string) => 
        option.toLowerCase().includes(query)
      ))
    );
  }, [posts, searchQuery]);

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

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
    }
  };

  return (
    <div className="space-y-3">
      {/* Search Results Info */}
      {searchQuery && searchQuery.replace(/\s/g, '').length >= 4 && (
        <div className="text-sm text-muted-foreground">
          {t('search-results') || 'Результаты поиска'}: {filteredPosts.length} {t('posts') || 'постов'}
        </div>
      )}

      {/* Posts List */}
      <div className="space-y-3">
        {filteredPosts.map((post) => (
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
      {filteredPosts.length === 0 && posts.length > 0 && searchQuery && (
        <div className="text-center py-8">
          <p className="text-muted-foreground mb-2">{t('no-search-results') || 'Ничего не найдено'}</p>
          <p className="text-sm text-muted-foreground">
            {t('try-different-search') || 'Попробуйте изменить поисковый запрос'}
          </p>
        </div>
      )}

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

// Экспортируем также SearchBar для использования в Scheduler
export const SearchBar: React.FC<{
  searchOpen: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toggleSearch: () => void;
}> = ({ searchOpen, searchQuery, setSearchQuery, toggleSearch }) => {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2">
      {searchOpen ? (
        <div className="flex items-center gap-2 w-1/3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('search-posts-placeholder') || 'Поиск по постам...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
              autoFocus
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSearch}
            className="h-10 w-10"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSearch}
          className="h-10 w-10"
        >
          <Search className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};
