import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays, Clock, Plus, Send, Edit, Trash2, List, Calendar as CalendarIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useScheduledPosts, useCreateScheduledPost, useDeleteScheduledPost, useUpdateScheduledPost } from '@/hooks/useScheduledPosts';
import { PostFormModal } from './PostFormModal';
import { useToast } from '@/hooks/use-toast';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useChannels } from '@/hooks/useChannels';

export const Scheduler: React.FC = () => {
  const { t } = useLanguage();
  const { channels } = useChannels();
  const { data: posts = [], isLoading } = useScheduledPosts();
  const createPost = useCreateScheduledPost();
  const deletePost = useDeleteScheduledPost();
  const updatePost = useUpdateScheduledPost();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedChannelId, setSelectedChannelId] = useState<string>('');

  const handleCreatePost = async (formData: any) => {
    if (!selectedChannelId) {
      toast({
        title: t('error'),
        description: 'Выберите канал для публикации',
        variant: 'destructive',
      });
      return;
    }

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

  const handlePublishPost = async (postId: string) => {
    try {
      await updatePost.mutateAsync({
        id: postId,
        status: 'sent'
      });

      toast({
        title: t('success'),
        description: 'Пост опубликован',
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Ошибка при публикации поста',
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
      <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
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
    <div className="space-y-4 p-2 md:p-4 max-w-full overflow-x-hidden">
      {/* Mobile Header */}
      <div className="space-y-4">
        <div className="flex flex-col space-y-3">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{t('scheduler')}</h1>
            <p className="text-sm text-muted-foreground">
              Планирование и управление отложенными постами
            </p>
          </div>
          
          {/* Channel Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Выберите канал:</label>
            <Select value={selectedChannelId} onValueChange={setSelectedChannelId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Выберите канал для публикации" />
              </SelectTrigger>
              <SelectContent>
                {channels.map((channel) => (
                  <SelectItem key={channel.id} value={channel.id}>
                    {channel.name} (@{channel.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2 flex-1">
              <Button 
                variant={viewMode === 'list' ? 'default' : 'outline'} 
                onClick={() => setViewMode('list')}
                size="sm"
                className="flex-1"
              >
                <List className="mr-2 h-4 w-4" />
                Список
              </Button>
              <Button 
                variant={viewMode === 'calendar' ? 'default' : 'outline'} 
                onClick={() => setViewMode('calendar')}
                size="sm"
                className="flex-1"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                Календарь
              </Button>
            </div>
            <Button 
              onClick={() => selectedChannelId ? setShowForm(true) : toast({
                title: 'Ошибка',
                description: 'Сначала выберите канал',
                variant: 'destructive'
              })} 
              className="bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Запланировать пост</span>
              <span className="sm:hidden">Пост</span>
            </Button>
          </div>
        </div>
      </div>

      <PostFormModal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        onSubmit={handleCreatePost}
        selectedChannelId={selectedChannelId}
        isLoading={createPost.isPending}
      />

      {viewMode === 'calendar' ? (
        <div className="space-y-4">
          <Tabs defaultValue="week" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="week">Неделя</TabsTrigger>
              <TabsTrigger value="month">Месяц</TabsTrigger>
            </TabsList>
            <TabsContent value="week" className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h3 className="text-base md:text-lg font-medium">
                  {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
                </h3>
                <div className="flex flex-wrap gap-1">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))}
                  >
                    ← Пред.
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
                    След. →
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
                    Посты на {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {getPostsForDate(selectedDate).map((post) => (
                      <Card key={post.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 space-y-2 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs">{post.telegram_channels?.name}</Badge>
                                <Badge className={`text-xs ${getStatusColor(post.status || 'pending')}`}>
                                  {post.status === 'sent' ? 'Отправлен' : 
                                   post.status === 'pending' ? 'Ожидает' : 'Ошибка'}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2 break-words">
                                {post.content}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {format(new Date(post.scheduled_for), 'HH:mm')}
                              </div>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => handlePublishPost(post.id)}
                              >
                                <Send className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {getPostsForDate(selectedDate).length === 0 && (
                      <p className="text-muted-foreground text-center py-8 text-sm">
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
        <div className="space-y-3">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs truncate max-w-32">
                        {post.telegram_channels?.name}
                      </Badge>
                      <Badge className={`text-xs ${getStatusColor(post.status || 'pending')}`}>
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
                  <div className="flex gap-2 flex-shrink-0 self-start">
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => handlePublishPost(post.id)}
                      disabled={post.status === 'sent'}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleDeletePost(post.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Нет запланированных постов</p>
              <Button 
                onClick={() => selectedChannelId ? setShowForm(true) : toast({
                  title: 'Ошибка',
                  description: 'Сначала выберите канал',
                  variant: 'destructive'
                })} 
                className="mt-4 bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground"
              >
                <Plus className="mr-2 h-4 w-4" />
                Создать первый пост
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
