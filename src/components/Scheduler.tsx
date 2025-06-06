
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays, Clock, Plus, Send, Edit, Trash2, List, Calendar as CalendarIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScheduledPosts, useCreateScheduledPost, useDeleteScheduledPost } from '@/hooks/useScheduledPosts';
import { PostForm } from './PostForm';
import { useToast } from '@/hooks/use-toast';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';

const POST_TYPES = [
  { value: 'text', label: 'Текстовый пост' },
  { value: 'photo', label: 'Фото' },
  { value: 'video', label: 'Видео' },
  { value: 'document', label: 'Документ' },
  { value: 'audio', label: 'Аудио' },
  { value: 'animation', label: 'GIF' },
  { value: 'poll', label: 'Опрос' },
  { value: 'album', label: 'Альбом' },
  { value: 'story', label: 'История' },
];

export const Scheduler: React.FC = () => {
  const { t } = useLanguage();
  const { data: posts = [], isLoading } = useScheduledPosts();
  const createPost = useCreateScheduledPost();
  const deletePost = useDeleteScheduledPost();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  const handleCreatePost = async (formData: any) => {
    try {
      await createPost.mutateAsync({
        channel_id: formData.channelId,
        content: formData.content || formData.pollQuestion || '',
        scheduled_for: formData.scheduledFor,
        status: 'pending',
        media_urls: formData.mediaFiles?.map((file: File) => file.name) || null,
      });

      toast({
        title: t('success'),
        description: 'Пост запланирован успешно',
      });

      setShowForm(false);
    } catch (error) {
      console.error('Error creating scheduled post:', error);
      toast({
        title: t('error'),
        description: 'Ошибка при планировании поста',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePost = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот пост?')) {
      try {
        await deletePost.mutateAsync(id);
        toast({
          title: t('success'),
          description: 'Пост удален',
        });
      } catch (error) {
        toast({
          title: t('error'),
          description: 'Ошибка при удалении поста',
          variant: 'destructive',
        });
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'sent': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      text: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      photo: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      video: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      poll: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      album: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    };
    return colors[type] || colors.text;
  };

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
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day) => {
          const postsForDay = getPostsForDate(day);
          return (
            <div key={day.toISOString()} className="border rounded-lg p-2 min-h-[120px]">
              <div className="font-medium text-sm mb-2">
                {format(day, 'EEE dd', { locale: ru })}
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

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">Загрузка...</div>;
  }

  return (
    <div className="space-y-4 p-4 max-w-full overflow-x-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('scheduler')}</h1>
          <p className="text-muted-foreground">
            Планирование и управление отложенными постами
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            onClick={() => setViewMode('list')}
            size="sm"
          >
            <List className="mr-2 h-4 w-4" />
            Список
          </Button>
          <Button 
            variant={viewMode === 'calendar' ? 'default' : 'outline'} 
            onClick={() => setViewMode('calendar')}
            size="sm"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            Календарь
          </Button>
          <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Запланировать пост
          </Button>
        </div>
      </div>

      {showForm && (
        <PostForm
          onSubmit={handleCreatePost}
          isLoading={createPost.isPending}
        />
      )}

      {viewMode === 'calendar' ? (
        <div className="space-y-4">
          <Tabs defaultValue="week" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="week">Неделя</TabsTrigger>
              <TabsTrigger value="month">Месяц</TabsTrigger>
            </TabsList>
            <TabsContent value="week" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-lg font-medium">
                  {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))}
                  >
                    ← Пред. неделя
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDate(new Date())}
                  >
                    Сегодня
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))}
                  >
                    След. неделя →
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
                  <h3 className="text-lg font-medium">
                    Посты на {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {getPostsForDate(selectedDate).map((post) => (
                      <Card key={post.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline">{post.telegram_channels?.name}</Badge>
                                <Badge className={getStatusColor(post.status || 'pending')}>
                                  {post.status === 'sent' ? 'Отправлен' : 
                                   post.status === 'pending' ? 'Ожидает' : 'Ошибка'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {post.content}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {format(new Date(post.scheduled_for), 'HH:mm')}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => handleDeletePost(post.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {getPostsForDate(selectedDate).length === 0 && (
                      <p className="text-muted-foreground text-center py-8">
                        На эту дату постов не запланировано
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="grid gap-4 max-w-full">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="truncate max-w-32">
                        {post.telegram_channels?.name}
                      </Badge>
                      <Badge className={getStatusColor(post.status || 'pending')}>
                        {post.status === 'sent' ? 'Отправлен' : 
                         post.status === 'pending' ? 'Ожидает' : 'Ошибка'}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 break-words">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(post.scheduled_for).toLocaleString('ru-RU')}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDeletePost(post.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
