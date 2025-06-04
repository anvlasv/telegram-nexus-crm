
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ChannelFormProps {
  formData: {
    username: string;
    type: 'channel' | 'group';
    status: 'active' | 'paused' | 'archived';
  };
  setFormData: (data: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isEditing: boolean;
  isLoading: boolean;
}

export const ChannelForm: React.FC<ChannelFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isEditing,
  isLoading,
}) => {
  const { t } = useLanguage();

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Label htmlFor="username" className="text-gray-900 dark:text-gray-100">
            Username канала
          </Label>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="h-4 w-4 text-gray-400" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Публичное имя канала (например: @my_channel)</p>
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
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Бот @Teleg_CRMbot автоматически получит название, ID и количество подписчиков
        </p>
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
          onClick={onCancel}
          className="bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 border-gray-300 dark:border-gray-600"
        >
          {t('cancel')}
        </Button>
        <Button 
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
        >
          {isEditing ? t('save') : 'Подключить канал'}
        </Button>
      </DialogFooter>
    </form>
  );
};
