
import React from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PostCard } from './PostCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';

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
  const { t, language } = useLanguage();

  const getPostsForDate = (date: Date) => {
    return posts.filter(post => 
      isSameDay(new Date(post.scheduled_for), date)
    );
  };

  const WeekView = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const postsForDay = getPostsForDate(day);
          return (
            <div key={day.toISOString()} className="border rounded-lg p-2 min-h-[120px]">
              <div className="font-medium text-sm mb-2">
                {format(day, 'EEE dd', { locale: language === 'ru' ? ru : enUS })}
              </div>
              <div className="space-y-1">
                {postsForDay.map((post) => (
                  <div key={post.id} className="text-xs p-1 bg-blue-100 dark:bg-blue-900 rounded truncate">
                    {format(new Date(post.scheduled_for), 'HH:mm')} - {post.content.substring(0, 20)}...
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="week" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="week">{t('week')}</TabsTrigger>
          <TabsTrigger value="month">{t('month')}</TabsTrigger>
        </TabsList>
        <TabsContent value="week" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h3 className="text-base md:text-lg font-medium">
              {format(selectedDate, 'dd MMMM yyyy', { locale: language === 'ru' ? ru : enUS })}
            </h3>
            <div className="flex flex-wrap gap-1">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))}
              >
                ← {t('prev')}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedDate(new Date())}
              >
                {t('today')}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))}
              >
                {t('next')} →
              </Button>
            </div>
          </div>
          <WeekView />
        </TabsContent>
        <TabsContent value="month" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="rounded-md border"
            />
            <div className="space-y-4">
              <h3 className="text-base md:text-lg font-medium">
                {t('posts-for')} {format(selectedDate, 'dd MMMM yyyy', { locale: language === 'ru' ? ru : enUS })}
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {getPostsForDate(selectedDate).map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    channel={post.telegram_channels}
                    onEdit={() => onEditPost(post)}
                    onPublish={async () => await onPublishPost(post.id)}
                    onDelete={() => onDeletePost(post.id)}
                  />
                ))}
                {getPostsForDate(selectedDate).length === 0 && (
                  <p className="text-muted-foreground text-center py-8 text-sm">
                    {t('no-posts-scheduled-for-date')}
                  </p>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
