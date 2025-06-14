
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';

interface ScheduleFormProps {
  scheduledDate: string;
  scheduledTime: string;
  onScheduledDateChange: (date: string) => void;
  onScheduledTimeChange: (time: string) => void;
}

export const ScheduleForm: React.FC<ScheduleFormProps> = ({
  scheduledDate,
  scheduledTime,
  onScheduledDateChange,
  onScheduledTimeChange,
}) => {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="schedule-date">{t('schedule-date')}</Label>
        <Input
          id="schedule-date"
          type="date"
          value={scheduledDate}
          onChange={(e) => onScheduledDateChange(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="schedule-time">{t('schedule-time')}</Label>
        <Input
          id="schedule-time"
          type="time"
          value={scheduledTime}
          onChange={(e) => onScheduledTimeChange(e.target.value)}
          required
        />
      </div>
    </div>
  );
};
