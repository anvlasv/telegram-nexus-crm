
import React from 'react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ru, enUS } from 'date-fns/locale';
import { useLanguage } from '@/contexts/LanguageContext';

interface CalendarNavigationProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export const CalendarNavigation: React.FC<CalendarNavigationProps> = ({
  selectedDate,
  setSelectedDate,
}) => {
  const { t, language } = useLanguage();

  return (
    <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
      <h3 className="text-lg md:text-xl font-medium">
        {format(selectedDate, 'dd MMMM yyyy', { locale: language === 'ru' ? ru : enUS })}
      </h3>
      <div className="flex flex-wrap gap-2">
        <Button 
          variant="outline" 
          size="default"
          onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() - 7)))}
        >
          ← {t('prev')}
        </Button>
        <Button 
          variant="outline" 
          size="default"
          onClick={() => setSelectedDate(new Date())}
        >
          {t('today')}
        </Button>
        <Button 
          variant="outline" 
          size="default"
          onClick={() => setSelectedDate(new Date(selectedDate.setDate(selectedDate.getDate() + 7)))}
        >
          {t('next')} →
        </Button>
      </div>
    </div>
  );
};
