
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostPreviewModal } from './PostPreviewModal';
import { WeekView } from './calendar/WeekView';
import { MonthView } from './calendar/MonthView';
import { CalendarNavigation } from './calendar/CalendarNavigation';
import { useLanguage } from '@/contexts/LanguageContext';

interface CalendarViewProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  posts: any[];
  onEditPost: (post: any) => void;
  onPublishPost: (postId: string) => void;
  onDeletePost: (postId: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  selectedDate,
  setSelectedDate,
  posts,
  onEditPost,
  onPublishPost,
  onDeletePost,
}) => {
  const { t } = useLanguage();
  const [previewPost, setPreviewPost] = React.useState<any>(null);

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
    <div className="space-y-4 md:space-y-6">
      <Tabs defaultValue="week" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="week">{t('week')}</TabsTrigger>
          <TabsTrigger value="month">{t('month')}</TabsTrigger>
        </TabsList>
        <TabsContent value="week" className="space-y-4 md:space-y-6">
          <CalendarNavigation
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <WeekView
            selectedDate={selectedDate}
            posts={posts}
            onPostClick={handlePostClick}
          />
        </TabsContent>
        <TabsContent value="month" className="space-y-4 md:space-y-6">
          <MonthView
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            posts={posts}
            onEditPost={onEditPost}
            onPublishPost={onPublishPost}
            onDeletePost={onDeletePost}
            onPostClick={handlePostClick}
          />
        </TabsContent>
      </Tabs>

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
