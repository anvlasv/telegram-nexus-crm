
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { MessageSquare, Users, Calendar, Plus, Edit2, Trash2, HelpCircle, Bot, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChannels, useCreateChannel, useUpdateChannel, useDeleteChannel } from '@/hooks/useChannels';
import { toast } from 'sonner';

export const ChannelManagement: React.FC = () => {
  const { t } = useLanguage();
  const { data: channels = [], isLoading } = useChannels();
  const createChannel = useCreateChannel();
  const updateChannel = useUpdateChannel();
  const deleteChannel = useDeleteChannel();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    channel_id: '',
    type: 'channel' as 'channel' | 'group',
    status: 'active' as 'active' | 'paused' | 'archived',
    subscriber_count: 0,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      username: '',
      channel_id: '',
      type: 'channel',
      status: 'active',
      subscriber_count: 0,
    });
    setEditingChannel(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingChannel) {
        await updateChannel.mutateAsync({
          id: editingChannel.id,
          ...formData,
          channel_id: parseInt(formData.channel_id),
        });
        toast.success('Канал успешно обновлен');
      } else {
        await createChannel.mutateAsync({
          ...formData,
          channel_id: parseInt(formData.channel_id),
        });
        toast.success('Канал успешно создан');
      }
      
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      toast.error('Ошибка при сохранении канала');
      console.error('Error saving channel:', error);
    }
  };

  const handleEdit = (channel: any) => {
    setEditingChannel(channel);
    setFormData({
      name: channel.name,
      username: channel.username,
      channel_id: channel.channel_id.toString(),
      type: channel.type,
      status: channel.status,
      subscriber_count: channel.subscriber_count || 0,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Вы уверены, что хотите удалить этот канал?')) {
      try {
        await deleteChannel.mutateAsync(id);
        toast.success('Канал успешно удален');
      } catch (error) {
        toast.error('Ошибка при удалении канала');
        console.error('Error deleting channel:', error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'paused': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'archived': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-500 dark:text-gray-400">{t('loading')}</div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {t('channel-management')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
              {t('manage-channels')}
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={resetForm}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('add-channel')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-gray-900 dark:text-gray-100">
                  {editingChannel ? 'Редактировать канал' : t('add-channel')}
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  {editingChannel ? 'Обновите информацию о канале' : 'Добавьте новый Telegram канал'}
                </DialogDescription>
              </DialogHeader>

              {/* Bot Setup Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Настройка бота для канала
                    </h4>
                    <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                      <li>Добавьте бота @YourBotName в ваш канал как администратора</li>
                      <li>Дайте боту права на публикацию сообщений</li>
                      <li>Для получения ID канала напишите любое сообщение в канал</li>
                      <li>Переслать это сообщение боту @userinfobot</li>
                      <li>Скопируйте полученный ID канала (начинается с -100)</li>
                    </ol>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-gray-900 dark:text-gray-100">
                    {t('channel-name')}
                  </Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Название вашего канала"
                    required
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="username" className="text-gray-900 dark:text-gray-100">
                      {t('channel-username')}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Публичное имя канала (t.me/channel_name)</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="@channel_username"
                    required
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Label htmlFor="channel_id" className="text-gray-900 dark:text-gray-100">
                      {t('channel-id')}
                    </Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>Цифровой ID канала. Получите его переслав сообщение из канала боту @userinfobot</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="channel_id"
                    type="text"
                    value={formData.channel_id}
                    onChange={(e) => setFormData({ ...formData, channel_id: e.target.value })}
                    placeholder="-1001234567890"
                    required
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    ID канала всегда начинается с -100
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="subscriber_count" className="text-gray-900 dark:text-gray-100">
                    Количество подписчиков
                  </Label>
                  <Input
                    id="subscriber_count"
                    type="number"
                    value={formData.subscriber_count}
                    onChange={(e) => setFormData({ ...formData, subscriber_count: parseInt(e.target.value) || 0 })}
                    min="0"
                    placeholder="0"
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-900 dark:text-gray-100">Тип</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: 'channel' | 'group') => setFormData({ ...formData, type: value })}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <SelectItem value="channel" className="text-gray-900 dark:text-gray-100">Канал</SelectItem>
                        <SelectItem value="group" className="text-gray-900 dark:text-gray-100">Группа</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-900 dark:text-gray-100">Статус</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value: 'active' | 'paused' | 'archived') => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                        <SelectItem value="active" className="text-gray-900 dark:text-gray-100">{t('active')}</SelectItem>
                        <SelectItem value="paused" className="text-gray-900 dark:text-gray-100">{t('paused')}</SelectItem>
                        <SelectItem value="archived" className="text-gray-900 dark:text-gray-100">{t('archived')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                    className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                  >
                    {t('cancel')}
                  </Button>
                  <Button 
                    type="submit"
                    disabled={createChannel.isPending || updateChannel.isPending}
                    className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                  >
                    {editingChannel ? t('save') : t('create')}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {channels.length === 0 ? (
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                {t('no-channels')}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
                {t('add-first-channel')}
              </p>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('add-channel')}
                  </Button>
                </DialogTrigger>
              </Dialog>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {channels.map((channel) => (
              <Card key={channel.id} className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {channel.name}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400">
                        {channel.username}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(channel.status || 'active')}>
                      {t(channel.status || 'active')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Users className="h-4 w-4 mr-2" />
                      <span>{(channel.subscriber_count || 0).toLocaleString()} {t('subscribers')}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      <span>0 {t('posts')}</span>
                    </div>
                  </div>
                  
                  {channel.last_post_at && (
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>{t('last-post')}: {new Date(channel.last_post_at).toLocaleDateString('ru-RU')}</span>
                    </div>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(channel)}
                      className="flex-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
                    >
                      <Edit2 className="h-4 w-4 mr-1" />
                      {t('edit')}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(channel.id)}
                      className="text-red-600 dark:text-red-400 border-red-300 dark:border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
};
