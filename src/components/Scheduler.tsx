
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
import { ru, enUS } from 'date-fns/locale';
import { useChannels } from '@/hooks/useChannels';

export const Scheduler: React.FC = () => {
  const { t, language } = useLanguage();
  const { channels } = useChannels();
  const { data: posts = [], isLoading } = useScheduledPosts();
  const createPost = useCreateScheduledPost();
  const deletePost = useDeleteScheduledPost();
  const updatePost = useUpdateScheduledPost();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [editingPost, setEditingPost] = useState<any>(null);

  // Берем первый канал как выбранный (можно будет получать из контекста)
  const selectedChannel = channels[0];

  const handleCreatePost = async (formData: any) => {
    if (!selectedChannel) {
      toast({
        title: t('error'),
        description: t('select-channel-first'),
        variant: 'destructive',
      });
      return;
    }

    try {
      await createPost.mutateAsync({
        channel_id: selectedChannel.id,
        content: formData.content || formData.pollQuestion || '',
        scheduled_for: formData.scheduledFor,
        status: 'pending',
        media_urls: formData.mediaFiles?.map((file: File) => file.name) || null,
        post_type: formData.type || 'text',
      });

      toast({
        title: t('success'),
        description: t('post-scheduled-successfully'),
      });

      setShowForm(false);
    } catch (error) {
      console.error('Error creating scheduled post:', error);
      toast({
        title: t('error'),
        description: t('error-scheduling-post'),
        variant: 'destructive',
      });
    }
  };

  const handlePublishPost = async (postId: string) => {
    try {
      // Здесь должна быть логика отправки поста в Telegram
      await updatePost.mutateAsync({
        id: postId,
        status: 'sent'
      });

      toast({
        title: t('success'),
        description: t('post-published'),
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: t('error-publishing-post'),
        variant: 'destructive',
      });
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setShowForm(true);
  };

  const handleDeletePost = async (id: string) => {
    if (confirm(t('confirm-delete-post'))) {
      try {
        await deletePost.mutateAsync(id);
        toast({
          title: t('success'),
          description: t('post-deleted'),
        });
      } catch (error) {
        toast({
          title: t('error'),
          description: t('error-deleting-post'),
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

  const getStatusText = (status: string) => {
    switch (status) {
      case 'sent': return t('sent');
      case 'pending': return t('pending');
      case 'failed': return t('failed');
      default: return t('unknown');
    }
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

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">{t('loading')}</div>;
  }

  return (
    <div className="space-y-4 p-2 md:p-4 max-w-full overflow-x-hidden">
      {/* Header with Schedule Post button */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold">{t('scheduler')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('scheduler-description')}
            </p>
          </div>
          
          <Button 
            onClick={() => selectedChannel ? setShowForm(true) : toast({
              title: t('error'),
              description: t('select-channel-first'),
              variant: 'destructive'
            })} 
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">{t('schedule-post')}</span>
            <span className="sm:hidden">{t('post')}</span>
          </Button>
        </div>
        
        {/* View Mode Toggles */}
        <div className="flex gap-2">
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            onClick={() => setViewMode('list')}
            size="sm"
            className="flex-1 sm:flex-initial"
          >
            <List className="mr-2 h-4 w-4" />
            {t('list')}
          </Button>
          <Button 
            variant={viewMode === 'calendar' ? 'default' : 'outline'} 
            onClick={() => setViewMode('calendar')}
            size="sm"
            className="flex-1 sm:flex-initial"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {t('calendar')}
          </Button>
        </div>
      </div>

      <PostFormModal
        isOpen={showForm}
        onClose={() => {
          setShowForm(false);
          setEditingPost(null);
        }}
        onSubmit={handleCreatePost}
        selectedChannelId={selectedChannel?.id || ''}
        isLoading={createPost.isPending}
        editingPost={editingPost}
      />

      {viewMode === 'calendar' ? (
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
                      <Card key={post.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 space-y-2 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <Badge variant="outline" className="text-xs">{post.telegram_channels?.name}</Badge>
                                <Badge className={`text-xs ${getStatusColor(post.status || 'pending')}`}>
                                  {getStatusText(post.status || 'pending')}
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
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleEditPost(post)}
                                title={t('edit')}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => handlePublishPost(post.id)}
                                disabled={post.status === 'sent'}
                                title={t('publish')}
                              >
                                <Send className="h-3 w-3" />
                              </Button>
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleDeletePost(post.id)}
                                title={t('delete')}
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
                        {t('no-posts-scheduled-for-date')}
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
                        {getStatusText(post.status || 'pending')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2 break-words">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(post.scheduled_for).toLocaleString(language === 'ru' ? 'ru-RU' : 'en-US')}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 self-start">
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleEditPost(post)}
                      title={t('edit')}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => handlePublishPost(post.id)}
                      disabled={post.status === 'sent'}
                      title={t('publish')}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-8 w-8 p-0"
                      onClick={() => handleDeletePost(post.id)}
                      title={t('delete')}
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
              <p className="text-muted-foreground">{t('no-scheduled-posts')}</p>
              <Button 
                onClick={() => selectedChannel ? setShowForm(true) : toast({
                  title: t('error'),
                  description: t('select-channel-first'),
                  variant: 'destructive'
                })} 
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="mr-2 h-4 w-4" />
                {t('create-first-post')}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
