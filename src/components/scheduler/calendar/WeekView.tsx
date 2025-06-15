
import React from 'react';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';

interface WeekViewProps {
  selectedDate: Date;
  posts: any[];
  onPostClick: (post: any) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  selectedDate,
  posts,
  onPostClick,
}) => {
  const { t, language } = useLanguage();

  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const parsePostDate = (scheduledFor: string) => {
    try {
      let postDate: Date;
      
      if (scheduledFor.includes('T')) {
        postDate = new Date(scheduledFor);
      } else {
        postDate = new Date(scheduledFor + 'T00:00:00');
      }
      
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 md:gap-4">
      {weekDays.map((day) => {
        const postsForDay = getPostsForDate(day);
        const postCount = postsForDay.length;
        return (
          <div key={day.toISOString()} className="border rounded-lg p-3 md:p-4 min-h-[140px] md:min-h-[120px] relative">
            <div className="font-medium text-sm md:text-base mb-2 md:mb-3 flex items-center justify-between">
              <span>{format(day, 'EEE dd', { locale: language === 'ru' ? ru : enUS })}</span>
              {postCount > 0 && (
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1" />
                  <span className="text-xs text-blue-600">{postCount}</span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              {postsForDay.map((post) => {
                const postDate = parsePostDate(post.scheduled_for);
                const timeStr = postDate ? format(postDate, 'HH:mm') : '00:00';
                
                return (
                  <div 
                    key={post.id} 
                    className="text-xs md:text-sm p-2 bg-blue-100 dark:bg-blue-900 rounded truncate cursor-pointer hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    onClick={() => onPostClick(post)}
                  >
                    {timeStr} - {post.content.substring(0, 30)}...
                  </div>
                );
              })}
              {postCount === 0 && (
                <div className="text-xs text-gray-400 text-center py-2">
                  {t('no-posts-scheduled-for-date')}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
