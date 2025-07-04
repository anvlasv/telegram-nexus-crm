
import React from 'react';
import { format, isSameDay } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';
import { PostCard } from '../PostCard';
import { useLanguage } from '@/contexts/LanguageContext';

interface MonthViewProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  posts: any[];
  onEditPost: (post: any) => void;
  onPublishPost: (postId: string) => void;
  onDeletePost: (postId: string) => void;
  onPostClick: (post: any) => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  selectedDate,
  setSelectedDate,
  posts,
  onEditPost,
  onPublishPost,
  onDeletePost,
  onPostClick,
}) => {
  const { t, language } = useLanguage();

  const parsePostDate = (scheduledFor: string) => {
    try {
      // Пробуем разные варианты парсинга даты
      let postDate: Date;
      
      if (scheduledFor.includes('T')) {
        // Если уже есть время, парсим как есть
        postDate = new Date(scheduledFor);
      } else {
        // Если только дата, добавляем время
        postDate = new Date(scheduledFor + 'T00:00:00');
      }
      
      // Проверяем, что дата валидна
      if (isNaN(postDate.getTime())) {
        console.warn('Invalid date:', scheduledFor);
        return null;
      }
      
      return postDate;
    } catch (error) {
      console.warn('Error parsing date:', scheduledFor, error);
      return null;
    }
  };

  const getPostsForDate = (date: Date) => {
    return posts.filter(post => {
      const postDate = parsePostDate(post.scheduled_for);
      if (!postDate) return false;
      
      return isSameDay(postDate, date);
    });
  };

  // Prepare posts data for calendar markers
  const postsData = React.useMemo(() => {
    const data: Record<string, number> = {};
    posts.forEach(post => {
      const postDate = parsePostDate(post.scheduled_for);
      if (!postDate) return;
      
      const year = postDate.getFullYear();
      const month = String(postDate.getMonth() + 1).padStart(2, '0');
      const day = String(postDate.getDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      
      data[dateKey] = (data[dateKey] || 0) + 1;
    });
    return data;
  }, [posts]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
      <div className="lg:col-span-1">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="rounded-md border w-full"
          postsData={postsData}
        />
        <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
            <span>{t('posts-scheduled')}</span>
          </div>
        </div>
      </div>
      <div className="lg:col-span-2 space-y-4">
        <h3 className="text-lg md:text-xl font-medium">
          {t('posts-for')} {format(selectedDate, 'dd MMMM yyyy', { locale: language === 'ru' ? ru : enUS })}
        </h3>
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {getPostsForDate(selectedDate).map((post) => (
            <div key={post.id} onClick={() => onPostClick(post)} className="cursor-pointer">
              <PostCard
                post={post}
                channel={post.telegram_channels}
                onEdit={() => onEditPost(post)}
                onPublish={async () => await onPublishPost(post.id)}
                onDelete={() => onDeletePost(post.id)}
              />
            </div>
          ))}
          {getPostsForDate(selectedDate).length === 0 && (
            <p className="text-muted-foreground text-center py-8 text-sm md:text-base">
              {t('no-posts-scheduled-for-date')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
