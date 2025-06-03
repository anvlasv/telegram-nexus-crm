
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Plus, Send, Edit, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChannels } from '@/hooks/useChannels';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const Scheduler: React.FC = () => {
  const { t } = useLanguage();
  const { channels } = useChannels();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [scheduledPosts, setScheduledPosts] = useState([
    {
      id: '1',
      channel: 'Tech News',
      content: 'Новые возможности AI в 2024',
      scheduledFor: '2024-12-04T10:00',
      status: 'pending'
    },
    {
      id: '2', 
      channel: 'Marketing Tips',
      content: 'Стратегии продвижения в Telegram',
      scheduledFor: '2024-12-04T14:30',
      status: 'sent'
    }
  ]);

  const [newPost, setNewPost] = useState({
    channelId: '',
    content: '',
    scheduledFor: ''
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

      setNewPost({ channelId: '', content: '', scheduledFor: '' });
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('scheduler')}</h1>
          <p className="text-muted-foreground">
            Планирование и управление отложенными постами
          </p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Запланировать пост
        </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="grid gap-4">
        {scheduledPosts.map((post) => (
          <Card key={post.id}>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{post.channel}</Badge>
                    <Badge className={getStatusColor(post.status)}>
                      {t(post.status)}
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
    </div>
  );
};
