
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
        <h1 className="text-2xl font-bold text-gray-900">{t('settings')}</h1>
        <p className="text-gray-600 mt-1">Управление настройками системы</p>
      </div>

      {/* Language Settings */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Globe className="h-5 w-5 text-blue-600" />
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

      {/* Telegram Integration */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Bot className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold">{t('telegram-integration')}</h2>
        </div>
        
        <div className="space-y-4">
          <TelegramInfo />
          
          <div className="pt-4 border-t">
            <h3 className="font-medium mb-2">Информация о боте</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Токен бота: <code className="text-xs bg-gray-100 px-2 py-1 rounded">7696745596:AAG...x8Q</code></div>
              <div>Web App URL: <code className="text-xs bg-gray-100 px-2 py-1 rounded break-all">https://6771f109-3495-4748-b495-455f4dce0096.lovableproject.com</code></div>
            </div>
          </div>
          
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Открыть @BotFather
          </Button>
        </div>
      </Card>

      {/* Supabase Integration */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Database className="h-5 w-5 text-green-600" />
          <h2 className="text-lg font-semibold">{t('supabase-integration')}</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-3">{t('supabase-description')}</p>
            <Button variant="outline" size="sm" className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100">
              <Database className="h-4 w-4 mr-2" />
              Подключено к Supabase
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
