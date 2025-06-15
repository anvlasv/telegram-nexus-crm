
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface RecentPost {
  id: string;
  content: string;
  status: string;
  scheduled_for: string;
  channel_name: string;
  channel_avatar?: string;
}

interface RecentPostsCardProps {
  recentPosts: RecentPost[];
  onViewAllPosts: () => void;
}

export const RecentPostsCard: React.FC<RecentPostsCardProps> = ({ 
  recentPosts, 
  onViewAllPosts 
}) => {
  const { t, language } = useLanguage();

  return (
    <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-gray-900 dark:text-gray-100">
          <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
          {t('recent-posts')}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          {t('latest-posts-across-channels')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 sm:space-y-4">
          {recentPosts.map((post) => (
            <div key={post.id} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <Avatar className="h-8 w-8 mt-1">
                <AvatarImage src={post.channel_avatar || undefined} />
                <AvatarFallback className="text-xs">
                  {post.channel_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                    {post.channel_name}
                  </span>
                  <Badge 
                    variant={post.status === 'sent' ? 'default' : post.status === 'pending' ? 'secondary' : 'outline'}
                    className="text-xs"
                  >
                    {t(post.status || 'pending')}
                  </Badge>
                </div>
                <p className="font-medium text-gray-900 dark:text-gray-100 text-sm line-clamp-2">
                  {post.content}
                </p>
                <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {format(new Date(post.scheduled_for), 'dd.MM.yyyy HH:mm', {
                    locale: language === 'ru' ? ru : enUS
                  })}
                </div>
              </div>
            </div>
          ))}
          {recentPosts.length === 0 && (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              {t('no-recent-posts')}
            </div>
          )}
        </div>
        <Button 
          variant="outline" 
          className="w-full mt-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
          onClick={onViewAllPosts}
        >
          {t('view-all-posts')}
        </Button>
      </CardContent>
    </Card>
  );
};
