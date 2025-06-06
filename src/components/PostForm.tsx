
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Mic, Image, Video, FileText, BarChart3, Camera } from 'lucide-react';
import { useChannels } from '@/hooks/useChannels';

const POST_TYPES = [
  { value: 'text', label: 'Текстовый пост', icon: FileText },
  { value: 'photo', label: 'Фото', icon: Image },
  { value: 'video', label: 'Видео', icon: Video },
  { value: 'document', label: 'Документ', icon: Upload },
  { value: 'audio', label: 'Аудио', icon: Mic },
  { value: 'animation', label: 'GIF', icon: Camera },
  { value: 'poll', label: 'Опрос', icon: BarChart3 },
  { value: 'album', label: 'Альбом', icon: Image },
  { value: 'story', label: 'История', icon: Camera },
];

interface PostFormProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({ onSubmit, initialData, isLoading }) => {
  const { channels } = useChannels();
  const [formData, setFormData] = useState({
    channelId: initialData?.channel_id || '',
    content: initialData?.content || '',
    scheduledFor: initialData?.scheduled_for || '',
    type: initialData?.type || 'text',
    mediaFiles: [],
    pollOptions: ['', ''],
    pollQuestion: '',
    albumFiles: [],
  });

  const [isRecording, setIsRecording] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (formData.type === 'album') {
      setFormData({ ...formData, albumFiles: files });
    } else {
      setFormData({ ...formData, mediaFiles: files });
    }
  };

  const addPollOption = () => {
    setFormData({
      ...formData,
      pollOptions: [...formData.pollOptions, '']
    });
  };

  const updatePollOption = (index: number, value: string) => {
    const newOptions = [...formData.pollOptions];
    newOptions[index] = value;
    setFormData({ ...formData, pollOptions: newOptions });
  };

  const removePollOption = (index: number) => {
    if (formData.pollOptions.length > 2) {
      const newOptions = formData.pollOptions.filter((_, i) => i !== index);
      setFormData({ ...formData, pollOptions: newOptions });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'photo':
      case 'video':
      case 'document':
      case 'animation':
        return (
          <div className="space-y-2">
            <Label>Загрузить файл</Label>
            <Input
              type="file"
              onChange={handleFileUpload}
              accept={
                formData.type === 'photo' ? 'image/*' :
                formData.type === 'video' ? 'video/*' :
                formData.type === 'animation' ? 'image/gif,video/*' :
                '*/*'
              }
              className="cursor-pointer"
            />
            {formData.mediaFiles.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Выбрано файлов: {formData.mediaFiles.length}
              </p>
            )}
          </div>
        );

      case 'audio':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Загрузить аудио</Label>
              <Input
                type="file"
                onChange={handleFileUpload}
                accept="audio/*"
                className="cursor-pointer"
              />
            </div>
            <div className="space-y-2">
              <Label>Или записать аудио</Label>
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                onClick={() => setIsRecording(!isRecording)}
                className="w-full"
              >
                <Mic className="mr-2 h-4 w-4" />
                {isRecording ? 'Остановить запись' : 'Начать запись'}
              </Button>
            </div>
          </div>
        );

      case 'poll':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Вопрос опроса</Label>
              <Input
                value={formData.pollQuestion}
                onChange={(e) => setFormData({ ...formData, pollQuestion: e.target.value })}
                placeholder="Введите вопрос опроса"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Варианты ответов</Label>
              {formData.pollOptions.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={option}
                    onChange={(e) => updatePollOption(index, e.target.value)}
                    placeholder={`Вариант ${index + 1}`}
                    required
                  />
                  {formData.pollOptions.length > 2 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removePollOption(index)}
                    >
                      ×
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addPollOption}
                className="w-full"
              >
                Добавить вариант
              </Button>
            </div>
          </div>
        );

      case 'album':
        return (
          <div className="space-y-2">
            <Label>Загрузить файлы для альбома</Label>
            <Input
              type="file"
              onChange={handleFileUpload}
              accept="image/*,video/*"
              multiple
              className="cursor-pointer"
            />
            {formData.albumFiles.length > 0 && (
              <p className="text-sm text-muted-foreground">
                Выбрано файлов: {formData.albumFiles.length}
              </p>
            )}
          </div>
        );

      case 'story':
        return (
          <div className="space-y-2">
            <Label>Загрузить файл для истории</Label>
            <Input
              type="file"
              onChange={handleFileUpload}
              accept="image/*,video/*"
              className="cursor-pointer"
            />
            <p className="text-xs text-muted-foreground">
              Истории автоматически исчезают через 24 часа
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const selectedType = POST_TYPES.find(type => type.value === formData.type);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {selectedType?.icon && <selectedType.icon className="h-5 w-5" />}
          {initialData ? 'Редактировать пост' : 'Создать пост'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Канал</Label>
              <Select value={formData.channelId} onValueChange={(value) => setFormData({...formData, channelId: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите канал" />
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
            <div className="space-y-2">
              <Label>Тип поста</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите тип" />
                </SelectTrigger>
                <SelectContent>
                  {POST_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Дата и время публикации</Label>
            <Input
              type="datetime-local"
              value={formData.scheduledFor}
              onChange={(e) => setFormData({...formData, scheduledFor: e.target.value})}
              required
            />
          </div>

          {renderTypeSpecificFields()}

          {(formData.type === 'text' || formData.type === 'photo' || formData.type === 'video' || formData.type === 'album') && (
            <div className="space-y-2">
              <Label>Текст поста</Label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Введите текст поста..."
                className="min-h-[100px]"
                required={formData.type === 'text'}
              />
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Сохранение...' : (initialData ? 'Обновить' : 'Запланировать')}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
