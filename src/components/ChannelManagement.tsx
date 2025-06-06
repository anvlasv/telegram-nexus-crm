import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, Users, Calendar, Plus, Edit2, Trash2, Bot, AlertCircle, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useChannels, useCreateChannel, useUpdateChannel, useDeleteChannel } from '@/hooks/useChannels';
import { useGetChatInfo, useGetChatMemberCount, useCheckBotAdmin } from '@/hooks/useTelegramApi';
import { toast } from 'sonner';

export const ChannelManagement: React.FC = () => {
  const { t } = useLanguage();
  const { data: channels = [], isLoading } = useChannels();
  const createChannel = useCreateChannel();
  const updateChannel = useUpdateChannel();
  const deleteChannel = useDeleteChannel();
  const getChatInfo = useGetChatInfo();
  const getChatMemberCount = useGetChatMemberCount();
  const checkBotAdmin = useCheckBotAdmin();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingChannel, setEditingChannel] = useState<any>(null);
  const [formData, setFormData] = useState({
    username: '',
    type: 'channel' as 'channel' | 'group',
    status: 'active' as 'active' | 'paused' | 'archived',
  });
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
  const [verificationMessage, setVerificationMessage] = useState('');
  const [chatData, setChatData] = useState<any>(null);

  const resetForm = () => {
    setFormData({
      username: '',
      type: 'channel',
      status: 'active',
    });
    setEditingChannel(null);
    setVerificationStatus('idle');
    setVerificationMessage('');
    setChatData(null);
  };

  const verifyChannel = async (username: string) => {
    if (!username) return;

    setVerificationStatus('checking');
    setVerificationMessage('');

    try {
      // Clean up username
      const cleanUsername = username.startsWith('@') ? username : `@${username}`;

      // Get chat info
      const chatInfoResponse = await getChatInfo.mutateAsync({ 
        username: cleanUsername 
      });

      if (!chatInfoResponse.ok) {
        setVerificationStatus('error');
        setVerificationMessage('Канал не найден или не доступен');
        return;
      }

      const chat = chatInfoResponse.result;
      setChatData(chat);

      // Check if bot is admin
      const botAdminResponse = await checkBotAdmin.mutateAsync({ 
        chatId: chat.id 
      });

      if (!botAdminResponse.ok) {
        setVerificationStatus('error');
        setVerificationMessage('Бот @Teleg_CRMbot не является администратором этого канала');
        return;
      }

      const memberStatus = botAdminResponse.result.status;
      if (memberStatus !== 'administrator' && memberStatus !== 'creator') {
        setVerificationStatus('error');
        setVerificationMessage('Бот @Teleg_CRMbot должен быть администратором канала');
        return;
      }

      // Get subscriber count
      const memberCountResponse = await getChatMemberCount.mutateAsync({ 
        chatId: chat.id 
      });

      setVerificationStatus('success');
      setVerificationMessage('Канал успешно верифицирован и готов к подключению');
      
      // Update chat data with member count
      if (memberCountResponse.ok) {
        setChatData({
          ...chat,
          member_count: memberCountResponse.result
        });
      }

    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('error');
      setVerificationMessage('Ошибка при проверке канала');
    }
  };

  // Auto-verify when username changes (with debounce)
  useEffect(() => {
    if (formData.username && !editingChannel) {
      const timer = setTimeout(() => {
        verifyChannel(formData.username);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData.username]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!chatData) {
      toast.error('Сначала введите корректный username канала');
      return;
    }

    try {
      const channelData = {
        name: chatData.title || chatData.username || 'Untitled Channel',
        username: chatData.username || formData.username,
        channel_id: chatData.id,
        type: formData.type,
        status: formData.status,
        subscriber_count: chatData.member_count || 0,
      };

      if (editingChannel) {
        await updateChannel.mutateAsync({
          id: editingChannel.id,
          ...channelData,
        });
        toast.success('Канал успешно обновлен');
      } else {
        await createChannel.mutateAsync(channelData);
        toast.success('Канал успешно подключен');
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
      username: channel.username,
      type: channel.type,
      status: channel.status,
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
                {editingChannel ? 'Обновите информацию о канале' : 'Подключите новый Telegram канал'}
              </DialogDescription>
            </DialogHeader>

            {!editingChannel && (
              <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <Bot className="h-4 w-4" />
                <AlertDescription className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Как подключить канал:</strong>
                  <ol className="list-decimal list-inside mt-2 space-y-1">
                    <li>Добавьте бота @Teleg_CRMbot в администраторы вашего канала</li>
                    <li>Дайте боту права администратора</li>
                    <li>Введите username канала в поле ниже</li>
                    <li>Система автоматически проверит канал</li>
                  </ol>
                </AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="username" className="text-gray-900 dark:text-gray-100">
                  {t('channel-username')}
                </Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="@channel_username"
                  required
                  disabled={editingChannel}
                  className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                />
                {verificationStatus === 'checking' && (
                  <p className="text-sm text-blue-600 mt-1">Проверяем канал...</p>
                )}
              </div>

              {verificationMessage && (
                <Alert className={verificationStatus === 'success' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}>
                  {verificationStatus === 'success' ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  <AlertDescription className={verificationStatus === 'success' ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}>
                    {verificationMessage}
                  </AlertDescription>
                </Alert>
              )}

              {chatData && (
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg space-y-2">
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">Информация о канале:</h4>
                  <p><strong>Название:</strong> {chatData.title}</p>
                  <p><strong>Username:</strong> @{chatData.username}</p>
                  <p><strong>ID:</strong> {chatData.id}</p>
                  <p><strong>Подписчики:</strong> {chatData.member_count?.toLocaleString() || 'Неизвестно'}</p>
                </div>
              )}

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
                  disabled={createChannel.isPending || updateChannel.isPending || (!editingChannel && verificationStatus !== 'success')}
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
                      @{channel.username}
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
  );
};
