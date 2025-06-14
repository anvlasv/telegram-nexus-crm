
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 md:gap-4">
        {weekDays.map((day) => {
          const postsForDay = getPostsForDate(day);
          return (
            <div key={day.toISOString()} className="border rounded-lg p-3 md:p-4 min-h-[140px] md:min-h-[120px]">
              <div className="font-medium text-sm md:text-base mb-2 md:mb-3">
                {format(day, 'EEE dd', { locale: language === 'ru' ? ru : enUS })}
              </div>
              <div className="space-y-2">
                {postsForDay.map((post) => (
                  <div key={post.id} className="text-xs md:text-sm p-2 bg-blue-100 dark:bg-blue-900 rounded truncate">
                    {format(new Date(post.scheduled_for), 'HH:mm')} - {post.content.substring(0, 30)}...
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
    <div className="space-y-4 md:space-y-6">
      <Tabs defaultValue="week" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="week">{t('week')}</TabsTrigger>
          <TabsTrigger value="month">{t('month')}</TabsTrigger>
        </TabsList>
        <TabsContent value="week" className="space-y-4 md:space-y-6">
          <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
            <h3 className="text-lg md:text-xl font-medium">
              {format(selectedDate, 'dd MMMM yyyy', { locale: language === 'ru' ? ru : enUS })}
            </h3>
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="outline" 
                size="default"
                onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))}
              >
                ← {t('prev')}
              </Button>
              <Button 
                variant="outline" 
                size="default"
                onClick={() => setSelectedDate(new Date())}
              >
                {t('today')}
              </Button>
              <Button 
                variant="outline" 
                size="default"
                onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))}
              >
                {t('next')} →
              </Button>
            </div>
          </div>
          <WeekView />
        </TabsContent>
        <TabsContent value="month" className="space-y-4 md:space-y-6">
          <div className="flex flex-col xl:flex-row gap-6 md:gap-8">
            <div className="flex-1">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className="rounded-md border w-full"
              />
            </div>
            <div className="flex-1 space-y-4">
              <h3 className="text-lg md:text-xl font-medium">
                {t('posts-for')} {format(selectedDate, 'dd MMMM yyyy', { locale: language === 'ru' ? ru : enUS })}
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
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
                  <p className="text-muted-foreground text-center py-8 text-sm md:text-base">
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
