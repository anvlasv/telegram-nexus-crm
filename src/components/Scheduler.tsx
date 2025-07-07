
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScheduledPosts } from '@/hooks/useScheduledPosts';
import { useSchedulerActions } from '@/hooks/useSchedulerActions';
import { useChannels } from '@/hooks/useChannels';
import { PostFormModal } from './PostFormModal';
import { CalendarView } from './scheduler/CalendarView';
import { ListView } from './scheduler/ListView';
import { ChannelSwitchLoader } from './ChannelSwitchLoader';
import { SchedulerHeader } from './scheduler/SchedulerHeader';
import { ViewModeSelector } from './scheduler/ViewModeSelector';
import { SearchResultsInfo } from './scheduler/SearchResultsInfo';
import { NoChannelSelected } from './scheduler/NoChannelSelected';
import { SchedulerLoading } from './scheduler/SchedulerLoading';

export const Scheduler: React.FC = () => {
  const { channels, selectedChannelId, isChannelSwitching } = useChannels();
  const { data: posts = [], isLoading, refetch } = useScheduledPosts();
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [editingPost, setEditingPost] = useState<any>(null);
  
  // Search state
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedChannel = channels.find(c => c.id === selectedChannelId);
  const { handleCreatePost, handlePublishPost, handleDeletePost, isCreating, isUpdating } = useSchedulerActions(selectedChannel);

  // Принудительное обновление постов при смене канала
  useEffect(() => {
    if (selectedChannelId) {
      console.log('[Scheduler] Канал изменился, обновляем посты:', selectedChannelId);
      refetch();
    }
  }, [selectedChannelId, refetch]);

  // Показываем лоадер переключения канала
  if (isChannelSwitching) {
    return <ChannelSwitchLoader channelName={selectedChannel?.name} />;
  }

  // Фильтруем посты по выбранному каналу
  const filteredPosts = selectedChannel
    ? posts.filter((post) => post.channel_id === selectedChannel.id)
    : [];

  // Фильтрация по поисковому запросу для списочного режима
  const searchFilteredPosts = React.useMemo(() => {
    if (viewMode !== 'list' || !searchQuery || searchQuery.replace(/\s/g, '').length < 4) {
      return filteredPosts;
    }
    
    const query = searchQuery.toLowerCase();
    return filteredPosts.filter(post => 
      post.content?.toLowerCase().includes(query) ||
      (post.poll_options && post.poll_options.some((option: string) => 
        option.toLowerCase().includes(query)
      ))
    );
  }, [filteredPosts, searchQuery, viewMode]);

  console.log('[Scheduler] Отфильтрованные посты:', {
    selectedChannelId,
    totalPosts: posts.length,
    filteredPosts: filteredPosts.length
  });

  const onSubmitPost = async (formData: any) => {
    const success = await handleCreatePost(formData, editingPost);
    if (success) {
      setShowForm(false);
      setEditingPost(null);
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleCreateNewPost = () => {
    if (!selectedChannel) {
      return;
    }
    setShowForm(true);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (searchOpen) {
      setSearchQuery('');
    }
  };

  if (isLoading) {
    return <SchedulerLoading />;
  }

  if (!selectedChannel) {
    return <NoChannelSelected />;
  }

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="h-full flex flex-col p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex-shrink-0 space-y-3 md:space-y-4">
          <SchedulerHeader
            onCreatePost={handleCreateNewPost}
            selectedChannel={selectedChannel}
          />
          
          {/* View Mode Toggles with Search */}
          <ViewModeSelector
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            searchOpen={searchOpen}
            searchQuery={searchQuery}
            onSearchToggle={toggleSearch}
            onSearchQueryChange={setSearchQuery}
          />
        </div>

        {/* Search Results Info - только для списочного режима */}
        <SearchResultsInfo
          viewMode={viewMode}
          searchQuery={searchQuery}
          resultsCount={searchFilteredPosts.length}
        />

        {/* Content */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <div className="h-full overflow-auto">
            {viewMode === 'calendar' ? (
              <CalendarView
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                posts={filteredPosts}
                onEditPost={handleEditPost}
                onPublishPost={handlePublishPost}
                onDeletePost={handleDeletePost}
                searchQuery={searchQuery}
              />
            ) : (
              <ListView
                posts={searchFilteredPosts}
                onEditPost={handleEditPost}
                onPublishPost={handlePublishPost}
                onDeletePost={handleDeletePost}
                onCreatePost={handleCreateNewPost}
                hasSelectedChannel={!!selectedChannel}
              />
            )}
          </div>
        </div>
      </div>

      <PostFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingPost(null);
        }}
        onSubmit={onSubmitPost}
        selectedChannelId={selectedChannel?.id || ''}
        isLoading={isCreating || isUpdating}
        editingPost={editingPost}
      />
    </div>
  );
};
