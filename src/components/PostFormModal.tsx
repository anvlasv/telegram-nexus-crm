
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, Mic, Image, Video, FileText, BarChart3, Camera } from 'lucide-react';
import { FileDropZone } from './FileDropZone';

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

interface PostFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  selectedChannelId: string;
  isLoading?: boolean;
}

export const PostFormModal: React.FC<PostFormModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  selectedChannelId,
  isLoading 
}) => {
  const [formData, setFormData] = useState({
    content: '',
    scheduledFor: '',
    type: 'text',
    mediaFiles: [] as File[],
    pollOptions: ['', ''],
    pollQuestion: '',
  });

  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      channelId: selectedChannelId,
    });
    
    // Reset form
    setFormData({
      content: '',
      scheduledFor: '',
      type: 'text',
      mediaFiles: [],
      pollOptions: ['', ''],
      pollQuestion: '',
    });
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

  const renderTypeSpecificFields = () => {
    switch (formData.type) {
      case 'photo':
        return (
          <FileDropZone
            onFilesChange={(files) => setFormData({ ...formData, mediaFiles: files })}
            accept="image/*"
            multiple={false}
            currentFiles={formData.mediaFiles}
          />
        );

      case 'video':
        return (
          <FileDropZone
            onFilesChange={(files) => setFormData({ ...formData, mediaFiles: files })}
            accept="video/*"
            multiple={false}
            currentFiles={formData.mediaFiles}
          />
        );

      case 'document':
        return (
          <FileDropZone
            onFilesChange={(files) => setFormData({ ...formData, mediaFiles: files })}
            accept="*/*"
            multiple={false}
            currentFiles={formData.mediaFiles}
          />
        );

      case 'animation':
        return (
          <FileDropZone
            onFilesChange={(files) => setFormData({ ...formData, mediaFiles: files })}
            accept="image/gif,video/*"
            multiple={false}
            currentFiles={formData.mediaFiles}
          />
        );

      case 'audio':
        return (
          <div className="space-y-4">
            <FileDropZone
              onFilesChange={(files) => setFormData({ ...formData, mediaFiles: files })}
              accept="audio/*"
              multiple={false}
              currentFiles={formData.mediaFiles}
            />
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Или записать аудио</p>
              <Button
                type="button"
                variant={isRecording ? "destructive" : "outline"}
                onClick={() => setIsRecording(!isRecording)}
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
          <FileDropZone
            onFilesChange={(files) => setFormData({ ...formData, mediaFiles: files })}
            accept="image/*,video/*"
            multiple={true}
            maxFiles={10}
            currentFiles={formData.mediaFiles}
          />
        );

      case 'story':
        return (
          <div className="space-y-2">
            <FileDropZone
              onFilesChange={(files) => setFormData({ ...formData, mediaFiles: files })}
              accept="image/*,video/*"
              multiple={false}
              currentFiles={formData.mediaFiles}
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {selectedType?.icon && <selectedType.icon className="h-5 w-5" />}
            Создать пост
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="space-y-2">
              <Label>Дата и время публикации</Label>
              <Input
                type="datetime-local"
                value={formData.scheduledFor}
                onChange={(e) => setFormData({...formData, scheduledFor: e.target.value})}
                required
              />
            </div>
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

          <div className="flex gap-2 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? 'Планирование...' : 'Запланировать'}
            </Button>
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
