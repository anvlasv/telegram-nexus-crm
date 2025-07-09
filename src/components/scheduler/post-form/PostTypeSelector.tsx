
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { FileText, Image, Video, Upload, Mic, Camera, BarChart3 } from 'lucide-react';

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

interface PostTypeSelectorProps {
  postType: string;
  onPostTypeChange: (type: string) => void;
  disabled?: boolean;
}

export const PostTypeSelector: React.FC<PostTypeSelectorProps> = ({
  postType,
  onPostTypeChange,
  disabled = false,
}) => {
  const selectedType = POST_TYPES.find(type => type.value === postType);

  return (
    <div className="space-y-2">
      <Label htmlFor="post-type-select" className="text-sm font-medium">
        Тип поста
      </Label>
      <Select 
        value={postType} 
        onValueChange={onPostTypeChange}
        disabled={disabled}
      >
        <SelectTrigger className="w-full">
          <SelectValue>
            {selectedType && (
              <div className="flex items-center gap-2">
                <selectedType.icon className="h-4 w-4" />
                <span>{selectedType.label}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {POST_TYPES.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              <div className="flex items-center gap-2">
                <type.icon className="h-4 w-4" />
                <span>{type.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
