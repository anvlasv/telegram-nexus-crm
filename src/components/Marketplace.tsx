
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, TrendingUp, Users, Eye, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const marketplaceChannels = [
  {
    id: '1',
    name: 'Tech Новости',
    category: 'Технологии',
    subscribers: 15000,
    price: 5000,
    engagement: 8.5,
    description: 'Лучшие новости из мира технологий',
    image: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Бизнес Советы',
    category: 'Бизнес',
    subscribers: 25000,
    price: 8000,
    engagement: 12.3,
    description: 'Полезные советы для предпринимателей',
    image: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Крипто Аналитика',
    category: 'Финансы',
    subscribers: 30000,
    price: 12000,
    engagement: 15.7,
    description: 'Анализ рынка криптовалют',
    image: '/placeholder.svg'
  }
];

export const Marketplace: React.FC = () => {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredChannels = marketplaceChannels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         channel.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || channel.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('marketplace')}</h1>
        <p className="text-muted-foreground">
          Маркетплейс для размещения рекламы в Telegram каналах
        </p>
      </div>

      <Tabs defaultValue="browse" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="browse">Обзор каналов</TabsTrigger>
          <TabsTrigger value="my-orders">Мои заказы</TabsTrigger>
        </TabsList>

        <TabsContent value="browse" className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск каналов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="w-full sm:w-auto">
              <Filter className="mr-2 h-4 w-4" />
              Фильтры
            </Button>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedCategory === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('all')}
            >
              Все
            </Button>
            <Button
              variant={selectedCategory === 'Технологии' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('Технологии')}
            >
              Технологии
            </Button>
            <Button
              variant={selectedCategory === 'Бизнес' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('Бизнес')}
            >
              Бизнес
            </Button>
            <Button
              variant={selectedCategory === 'Финансы' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory('Финансы')}
            >
              Финансы
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredChannels.map((channel) => (
              <Card key={channel.id} className="overflow-hidden">
                <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                  <div className="text-6xl opacity-50">📱</div>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{channel.name}</CardTitle>
                      <CardDescription>{channel.description}</CardDescription>
                    </div>
                    <Badge variant="secondary">{channel.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{channel.subscribers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-muted-foreground" />
                      <span>{channel.engagement}% ER</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">
                      {channel.price.toLocaleString()} ₽
                    </span>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Heart className="h-4 w-4" />
                      </Button>
                      <Button size="sm">
                        Заказать
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="my-orders" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Активные заказы</CardTitle>
              <CardDescription>
                Управление вашими рекламными кампаниями
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                У вас пока нет активных заказов
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
