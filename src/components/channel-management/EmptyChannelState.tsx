
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { MessageSquare, Plus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmptyChannelStateProps {
  onAddChannel: () => void;
}

export const EmptyChannelState: React.FC<EmptyChannelStateProps> = ({ onAddChannel }) => {
  const { t } = useLanguage();

  return (
    <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <MessageSquare className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {t('no-channels')}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-center mb-6">
          {t('add-first-channel')}
        </p>
        <Button onClick={onAddChannel} className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
          <Plus className="h-4 w-4 mr-2" />
          {t('add-channel')}
        </Button>
      </CardContent>
    </Card>
  );
};
