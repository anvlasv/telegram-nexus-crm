
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Bot, Send, MessageSquare, Lightbulb, FileText, BarChart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const assistantFeatures = [
  {
    id: 'content-generation',
    title: 'Генерация контента',
    description: 'Создание постов, статей и описаний для каналов',
    icon: FileText,
    color: 'bg-blue-500',
  },
  {
    id: 'post-optimization',
    title: 'Оптимизация постов',
    description: 'Улучшение существующего контента для лучшего охвата',
    icon: Lightbulb,
    color: 'bg-green-500',
  },
  {
    id: 'analytics-insights',
    title: 'Анализ и советы',
    description: 'Рекомендации по улучшению показателей канала',
    icon: BarChart,
    color: 'bg-purple-500',
  },
  {
    id: 'chat-assistant',
    title: 'Чат-помощник',
    description: 'Ответы на вопросы по ведению Telegram каналов',
    icon: MessageSquare,
    color: 'bg-orange-500',
  },
];

export const Assistant: React.FC = () => {
  const { t } = useLanguage();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    
    setIsLoading(true);
    // TODO: Здесь будет интеграция с OpenAI API
    setTimeout(() => {
      setResponse('Для работы ассистента необходимо подключить OpenAI API. Обратитесь к администратору для настройки интеграции.');
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          AI Ассистент
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Умный помощник для работы с Telegram каналами
        </p>
      </div>

      {/* Функции ассистента */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {assistantFeatures.map((feature) => (
          <Card 
            key={feature.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedFeature === feature.id 
                ? 'ring-2 ring-blue-500 shadow-lg' 
                : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedFeature(feature.id)}
          >
            <CardHeader className="pb-3">
              <div className={`w-10 h-10 ${feature.color} rounded-lg flex items-center justify-center mb-2`}>
                <feature.icon className="h-5 w-5 text-white" />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <CardDescription className="text-sm">
                {feature.description}
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Основной интерфейс чата */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            {selectedFeature 
              ? assistantFeatures.find(f => f.id === selectedFeature)?.title 
              : 'Выберите функцию ассистента'}
          </CardTitle>
          <CardDescription>
            {selectedFeature 
              ? 'Опишите вашу задачу подробно для получения лучшего результата'
              : 'Выберите одну из функций выше для начала работы'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedFeature && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium">Ваш запрос:</label>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Например: Создай пост про новые возможности нашего продукта..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={!prompt.trim() || isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Bot className="h-4 w-4 mr-2 animate-spin" />
                    Генерирую ответ...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Отправить запрос
                  </>
                )}
              </Button>

              {response && (
                <Card className="bg-gray-50 dark:bg-gray-800">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      Ответ ассистента
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{response}</p>
                  </CardContent>
                </Card>
              )}
            </>
          )}

          {!selectedFeature && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <Bot className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Выберите функцию ассистента для начала работы</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Быстрые шаблоны */}
      {selectedFeature === 'content-generation' && (
        <Card>
          <CardHeader>
            <CardTitle>Быстрые шаблоны</CardTitle>
            <CardDescription>Готовые запросы для генерации контента</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                'Создай пост-анонс мероприятия',
                'Напиши пост с советами',
                'Создай мотивирующий пост',
                'Напиши новость о продукте',
                'Создай пост-опрос',
                'Напиши благодарность подписчикам'
              ].map((template) => (
                <Button
                  key={template}
                  variant="outline"
                  size="sm"
                  onClick={() => setPrompt(template)}
                  className="text-left justify-start h-auto py-2 px-3"
                >
                  {template}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
