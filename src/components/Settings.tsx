
import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/contexts/LanguageContext';
import { TelegramInfo } from './TelegramInfo';
import { Globe, Bot, Database, ExternalLink } from 'lucide-react';

export const Settings: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('settings')}</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Управление настройками системы</p>
      </div>

      {/* Telegram Integration - теперь первая секция */}
      <TelegramInfo />

      {/* Language Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-lg font-semibold">{t('language-settings')}</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="language">{t('interface-language')}</Label>
            <Select value={language} onValueChange={(value: 'ru' | 'en') => setLanguage(value)}>
              <SelectTrigger className="w-48 mt-2">
                <SelectValue placeholder={t('select-language')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ru">{t('russian')}</SelectItem>
                <SelectItem value="en">{t('english')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Supabase Integration */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
            <Database className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-lg font-semibold">{t('supabase-integration')}</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('supabase-description')}</p>
            <Button variant="outline" size="sm" className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 hover:bg-green-100 dark:hover:bg-green-900">
              <Database className="h-4 w-4 mr-2" />
              ✅ Подключено к Supabase
            </Button>
          </div>
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <div>Project ID: <code className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">upirwcmwofvmjsqdqorj</code></div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
