
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { TimezoneSelector } from './TimezoneSelector';

interface FormData {
  username: string;
  type: 'channel' | 'group';
  status: 'active' | 'paused' | 'archived';
  timezone: string;
}

interface ChannelFormFieldsProps {
  formData: FormData;
  setFormData: (data: FormData) => void;
  editingChannel: any;
}

export const ChannelFormFields: React.FC<ChannelFormFieldsProps> = ({
  formData,
  setFormData,
  editingChannel
}) => {
  const { t } = useLanguage();

  return (
    <>
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
          disabled={!!editingChannel}
          className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />
      </div>

      <TimezoneSelector
        value={formData.timezone}
        onChange={(value) => setFormData({ ...formData, timezone: value })}
      />

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
    </>
  );
};
