
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, 
  MousePointer, 
  TrendingUp, 
  Check, 
  X, 
  Play, 
  Edit,
  MoreHorizontal 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AdvertisingCampaign, useUpdateCampaignStatus } from '@/hooks/useAdvertisingCampaigns';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface CampaignCardProps {
  campaign: AdvertisingCampaign;
}

export const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const { toast } = useToast();
  const updateStatus = useUpdateCampaignStatus();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'published': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Одобрено';
      case 'published': return 'Опубликовано';
      case 'pending': return 'На рассмотрении';
      case 'rejected': return 'Отклонено';
      case 'draft': return 'Черновик';
      default: return status;
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateStatus.mutateAsync({ id: campaign.id, status: newStatus });
      toast({
        title: 'Успешно',
        description: 'Статус кампании изменен',
      });
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось изменить статус',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{campaign.title}</CardTitle>
            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
              <span>{campaign.partner?.name}</span>
              <span>•</span>
              <span>@{campaign.channel?.username}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(campaign.status)}>
              {getStatusText(campaign.status)}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
                  <Eye className="mr-2 h-4 w-4" />
                  На рассмотрение
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('approved')}>
                  <Check className="mr-2 h-4 w-4" />
                  Одобрить
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('rejected')}>
                  <X className="mr-2 h-4 w-4" />
                  Отклонить
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleStatusChange('published')}>
                  <Play className="mr-2 h-4 w-4" />
                  Опубликовать
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {campaign.content && (
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm">{campaign.content}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Стоимость</p>
            <p className="text-lg font-bold text-green-600">
              {campaign.price} {campaign.currency}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">Тип поста</p>
            <p className="text-sm text-muted-foreground">
              {campaign.post_type === 'text' ? 'Текст' : 
               campaign.post_type === 'photo' ? 'Фото' :
               campaign.post_type === 'video' ? 'Видео' : 'Опрос'}
            </p>
          </div>
        </div>

        {campaign.status === 'published' && (
          <div className="grid grid-cols-3 gap-4 pt-2 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600">
                <Eye className="h-4 w-4" />
                <span className="font-semibold">{campaign.views_count || 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">Просмотры</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600">
                <MousePointer className="h-4 w-4" />
                <span className="font-semibold">{campaign.clicks_count || 0}</span>
              </div>
              <p className="text-xs text-muted-foreground">Клики</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-purple-600">
                <TrendingUp className="h-4 w-4" />
                <span className="font-semibold">{(campaign.engagement_rate || 0).toFixed(1)}%</span>
              </div>
              <p className="text-xs text-muted-foreground">Вовлеченность</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t">
          <span>
            {campaign.scheduled_for 
              ? `Запланировано: ${format(new Date(campaign.scheduled_for), 'dd MMM yyyy, HH:mm', { locale: ru })}`
              : `Создано: ${format(new Date(campaign.created_at), 'dd MMM yyyy', { locale: ru })}`
            }
          </span>
          {campaign.published_at && (
            <span>
              Опубликовано: {format(new Date(campaign.published_at), 'dd MMM yyyy', { locale: ru })}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
