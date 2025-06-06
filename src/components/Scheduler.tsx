
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { CalendarDays, Clock, Plus, Send, Edit, Trash2, List, Calendar as CalendarIcon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChannels } from '@/hooks/useChannels';
import { supabase } from '@/integrations/supabase/client';
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
  const { data: channels = [] } = useChannels();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: '1',
      channel: 'Tech News',
      content: 'Новые возможности AI в 2024',
      scheduledFor: '2024-12-06T10:00',
      status: 'pending',
      type: 'text'
    },
    {
      id: '2', 
      channel: 'Marketing Tips',
      content: 'Стратегии продвижения в Telegram',
      scheduledFor: '2024-12-06T14:30',
      status: 'sent',
      type: 'photo'
    },
    {
      id: '3',
      channel: 'Tech News',
      content: 'Опрос о новых технологиях',
      scheduledFor: '2024-12-07T12:00',
      status: 'pending',
      type: 'poll'
    }
  ]);

  const [newPost, setNewPost] = useState({
    channelId: '',
    content: '',
    scheduledFor: '',
    type: 'text'
  });

  const handleCreatePost = async () => {
    if (!newPost.channelId || !newPost.content || !newPost.scheduledFor) {
      toast({
        title: t('error'),
        description: 'Заполните все поля',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('scheduled_posts')
        .insert({
          channel_id: newPost.channelId,
          content: newPost.content,
          scheduled_for: newPost.scheduledFor,
          status: 'pending',
          user_id: userData.user.id
        });

      if (error) throw error;

      toast({
        title: t('success'),
        description: 'Пост запланирован успешно',
      });

      setNewPost({ channelId: '', content: '', scheduledFor: '', type: 'text' });
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
    return scheduledPosts.filter(post => 
      isSameDay(new Date(post.scheduledFor), date)
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
                    {format(new Date(post.scheduledFor), 'HH:mm')} - {post.content.substring(0, 20)}...
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('scheduler')}</h1>
          <p className="text-muted-foreground">
            Планирование и управление отложенными постами
          </p>
        </div>
        <div className="flex gap-2">
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
        <Card>
          <CardHeader>
            <CardTitle>Новый запланированный пост</CardTitle>
            <CardDescription>
              Создайте новый пост для отложенной публикации
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Канал</label>
                <Select value={newPost.channelId} onValueChange={(value) => setNewPost({...newPost, channelId: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите канал" />
                  </SelectTrigger>
                  <SelectContent>
                    {channels.map((channel) => (
                      <SelectItem key={channel.id} value={channel.id}>
                        {channel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Тип поста</label>
                <Select value={newPost.type} onValueChange={(value) => setNewPost({...newPost, type: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    {POST_TYPES.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Дата и время</label>
                <Input
                  type="datetime-local"
                  value={newPost.scheduledFor}
                  onChange={(e) => setNewPost({...newPost, scheduledFor: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Содержание поста</label>
              <Textarea
                placeholder="Введите текст поста..."
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                className="min-h-[100px]"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreatePost}>
                <CalendarDays className="mr-2 h-4 w-4" />
                Запланировать
              </Button>
              <Button variant="outline" onClick={() => setShowForm(false)}>
                {t('cancel')}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {viewMode === 'calendar' ? (
        <div className="space-y-4">
          <Tabs defaultValue="week" className="w-full">
            <TabsList>
              <TabsTrigger value="week">Неделя</TabsTrigger>
              <TabsTrigger value="month">Месяц</TabsTrigger>
            </TabsList>
            <TabsContent value="week" className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  {format(selectedDate, 'dd MMMM yyyy', { locale: ru })}
                </h3>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))}
                  >
                    ← Предыдущая неделя
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
                    Следующая неделя →
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
                  <div className="space-y-2">
                    {getPostsForDate(selectedDate).map((post) => (
                      <Card key={post.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline">{post.channel}</Badge>
                                <Badge className={getStatusColor(post.status)}>
                                  {t(post.status)}
                                </Badge>
                                <Badge className={getTypeColor(post.type)}>
                                  {POST_TYPES.find(t => t.value === post.type)?.label || post.type}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {post.content}
                              </p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {format(new Date(post.scheduledFor), 'HH:mm')}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="ghost">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
                                <Send className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost">
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
        <div className="grid gap-4">
          {scheduledPosts.map((post) => (
            <Card key={post.id}>
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline">{post.channel}</Badge>
                      <Badge className={getStatusColor(post.status)}>
                        {t(post.status)}
                      </Badge>
                      <Badge className={getTypeColor(post.type)}>
                        {POST_TYPES.find(t => t.value === post.type)?.label || post.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(post.scheduledFor).toLocaleString('ru-RU')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost">
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
