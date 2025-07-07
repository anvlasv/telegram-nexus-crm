
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SchedulerHeaderProps {
  onCreatePost: () => void;
  selectedChannel: any;
}

export const SchedulerHeader: React.FC<SchedulerHeaderProps> = ({
  onCreatePost,
  selectedChannel,
}) => {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col space-y-3 md:space-y-0 md:flex-row md:items-center md:justify-between">
      <div className="min-w-0 flex-1">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{t('scheduler')}</h1>
        <p className="text-sm md:text-base text-muted-foreground mt-1">
          {t('scheduler-description')}
        </p>
      </div>
      
      <div className="flex-shrink-0">
        <Button 
          onClick={onCreatePost}
          className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          size="default"
          disabled={!selectedChannel}
        >
          <Plus className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">{t('schedule-post')}</span>
          <span className="sm:hidden">{t('post')}</span>
        </Button>
      </div>
    </div>
  );
};
