
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Plus, Send, Edit, Trash2, Image, FileText, Music, Video, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChannels } from '@/hooks/useChannels';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const contentTypes = [
  { id: 'text', label: 'Текст', icon: FileText },
  { id: 'photo', label: 'Фото', icon: Image },
  { id: 'video', label: 'Видео', icon: Video },
  { id: 'audio', label: 'Аудио', icon: Music },
  { id: 'document', label: 'Документ', icon: FileText },
  { id: 'poll', label: 'Голосование', icon: BarChart3 },
  { id: 'album', label: 'Альбом', icon: Image },
];

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
      contentType: 'text',
      scheduledFor: '2024-12-04T10:00',
      status: 'pending'
    },
    {
      id: '2', 
      channel: 'Marketing Tips',
      content: 'Стратегии продвижения в Telegram',
      contentType: 'photo',
      scheduledFor: '2024-12-04T14:30',
      status: 'sent'
    }
  ]);

  const [newPost, setNewPost] = useState({
    channelId: '',
    content: '',
    contentType: 'text',
    scheduledFor: '',
    mediaFiles: [] as File[]
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

      setNewPost({ channelId: '', content: '', contentType: 'text', scheduledFor: '', mediaFiles: [] });
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

  const getContentTypeIcon = (type: string) => {
    const contentType = contentTypes.find(ct => ct.id === type);
    return contentType ? contentType.icon : FileText;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setNewPost(prev => ({ ...prev, mediaFiles: files }));
  };

  const renderContentFields = () => {
    switch (newPost.contentType) {
      case 'photo':
      case 'video':
      case 'audio':
      case 'document':
      case 'album':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">Файлы</label>
            <Input
              type="file"
              multiple={newPost.contentType === 'album'}
              accept={
                newPost.contentType === 'photo' || newPost.contentType === 'album' 
                  ? 'image/*' 
                  : newPost.contentType === 'video' 
                    ? 'video/*'
                    : newPost.contentType === 'audio'
                      ? 'audio/*'
                      : '*/*'
              }
              onChange={handleFileUpload}
              className="border-2 border-dashed border-blue-300 dark:border-blue-600"
            />
            {newPost.mediaFiles.length > 0 && (
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Выбрано файлов: {newPost.mediaFiles.length}
              </div>
            )}
          </div>
        );
      case 'poll':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Вопрос голосования</label>
              <Input
                placeholder="Введите вопрос..."
                className="border-blue-200 dark:border-blue-700 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Варианты ответов</label>
              <Input placeholder="Вариант 1" className="mb-2" />
              <Input placeholder="Вариант 2" className="mb-2" />
              <Button variant="outline" size="sm" className="text-blue-600 border-blue-300">
                <Plus className="h-4 w-4 mr-1" />
                Добавить вариант
              </Button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {t('scheduler')}
          </h1>
          <p className="text-muted-foreground">
            Планирование и управление отложенными постами
          </p>
        </div>
        <Button 
          onClick={() => setShowForm(!showForm)} 
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
        >
          <Plus className="mr-2 h-4 w-4" />
          Запланировать пост
        </Button>
      </div>

      {showForm && (
        <Card className="border-blue-200 dark:border-blue-700 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
            <CardTitle className="text-blue-900 dark:text-blue-100">Новый запланированный пост</CardTitle>
            <CardDescription>
              Создайте новый пост для отложенной публикации
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Канал</label>
                <Select value={newPost.channelId} onValueChange={(value) => setNewPost({...newPost, channelId: value})}>
                  <SelectTrigger className="border-blue-200 dark:border-blue-700 focus:border-blue-500">
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
                  className="border-blue-200 dark:border-blue-700 focus:border-blue-500"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Тип контента</label>
              <Select value={newPost.contentType} onValueChange={(value) => setNewPost({...newPost, contentType: value})}>
                <SelectTrigger className="border-blue-200 dark:border-blue-700 focus:border-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {contentTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            {renderContentFields()}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                {newPost.contentType === 'poll' ? 'Описание (опционально)' : 'Содержание поста'}
              </label>
              <Textarea
                placeholder={newPost.contentType === 'poll' ? 'Дополнительное описание...' : 'Введите текст поста...'}
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                className="min-h-[100px] border-blue-200 dark:border-blue-700 focus:border-blue-500"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleCreatePost}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
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
        {scheduledPosts.map((post) => {
          const ContentIcon = getContentTypeIcon(post.contentType);
          return (
            <Card key={post.id} className="border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-colors shadow-md">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-blue-300 text-blue-700 dark:border-blue-600 dark:text-blue-300">
                        {post.channel}
                      </Badge>
                      <Badge className={getStatusColor(post.status)}>
                        {t(post.status)}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <ContentIcon className="h-3 w-3" />
                        {contentTypes.find(ct => ct.id === post.contentType)?.label}
                      </div>
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
                    <Button size="sm" variant="ghost" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="hover:bg-green-50 dark:hover:bg-green-900/20">
                      <Send className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="hover:bg-red-50 dark:hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
