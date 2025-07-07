
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePartners } from '@/hooks/usePartners';
import { useChannels } from '@/hooks/useChannels';
import { useCreateCampaign } from '@/hooks/useAdvertisingCampaigns';
import { useToast } from '@/hooks/use-toast';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { partners } = usePartners();
  const { channels } = useChannels();
  const createCampaign = useCreateCampaign();

  const [formData, setFormData] = useState({
    partner_id: '',
    channel_id: '',
    title: '',
    content: '',
    post_type: 'photo' as const, // Устанавливаем альбом как тип по умолчанию
    price: 0,
    currency: 'RUB',
    scheduled_for: undefined as Date | undefined,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.partner_id || !formData.channel_id || !formData.title) {
      toast({
        title: t('error'),
        description: 'Заполните все обязательные поля',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createCampaign.mutateAsync({
        ...formData,
        status: 'draft',
        scheduled_for: formData.scheduled_for?.toISOString(),
      });

      toast({
        title: t('success'),
        description: 'Рекламная кампания создана',
      });

      onClose();
      setFormData({
        partner_id: '',
        channel_id: '',
        title: '',
        content: '',
        post_type: 'photo',
        price: 0,
        currency: 'RUB',
        scheduled_for: undefined,
      });
    } catch (error) {
      toast({
        title: t('error'),
        description: 'Ошибка при создании кампании',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Создать рекламную кампанию</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="partner">Партнер *</Label>
              <Select value={formData.partner_id} onValueChange={(value) => setFormData({...formData, partner_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите партнера" />
                </SelectTrigger>
                <SelectContent>
                  {partners.map((partner) => (
                    <SelectItem key={partner.id} value={partner.id}>
                      {partner.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="channel">Канал *</Label>
              <Select value={formData.channel_id} onValueChange={(value) => setFormData({...formData, channel_id: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Выберите канал" />
                </SelectTrigger>
                <SelectContent>
                  {channels.map((channel) => (
                    <SelectItem key={channel.id} value={channel.id}>
                      {channel.name} (@{channel.username})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="title">Название кампании *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Введите название кампании"
            />
          </div>

          <div>
            <Label htmlFor="content">Содержание поста</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              placeholder="Введите текст рекламного поста"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="post_type">Тип поста</Label>
              <Select value={formData.post_type} onValueChange={(value: any) => setFormData({...formData, post_type: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">📝 Текст</SelectItem>
                  <SelectItem value="photo">📷 Фото</SelectItem>
                  <SelectItem value="video">🎥 Видео</SelectItem>
                  <SelectItem value="audio">🎵 Аудио</SelectItem>
                  <SelectItem value="document">📄 Документ</SelectItem>
                  <SelectItem value="poll">📊 Опрос</SelectItem>
                  <SelectItem value="sticker">😀 Стикер</SelectItem>
                  <SelectItem value="animation">🎬 GIF/Анимация</SelectItem>
                  <SelectItem value="voice">🎤 Голосовое сообщение</SelectItem>
                  <SelectItem value="video_note">📹 Видеосообщение</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="price">Стоимость</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: Number(e.target.value)})}
                placeholder="0"
              />
            </div>

            <div>
              <Label htmlFor="currency">Валюта</Label>
              <Select value={formData.currency} onValueChange={(value) => setFormData({...formData, currency: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RUB">₽ RUB</SelectItem>
                  <SelectItem value="USD">$ USD</SelectItem>
                  <SelectItem value="EUR">€ EUR</SelectItem>
                  <SelectItem value="KZT">₸ KZT</SelectItem>
                  <SelectItem value="BYN">Br BYN</SelectItem>
                  <SelectItem value="UAH">₴ UAH</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Дата публикации</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.scheduled_for ? format(formData.scheduled_for, "PPP") : "Выберите дату"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.scheduled_for}
                  onSelect={(date) => setFormData({...formData, scheduled_for: date})}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              {t('cancel')}
            </Button>
            <Button type="submit" disabled={createCampaign.isPending}>
              {createCampaign.isPending ? 'Создание...' : 'Создать кампанию'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
