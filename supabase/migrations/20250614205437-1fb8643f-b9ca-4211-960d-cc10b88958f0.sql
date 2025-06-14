
-- Создаем таблицу для рекламных кампаний
CREATE TABLE public.advertising_campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  partner_id UUID REFERENCES public.partners(id) NOT NULL,
  channel_id UUID REFERENCES public.telegram_channels(id) NOT NULL,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  media_urls TEXT[],
  post_type TEXT NOT NULL DEFAULT 'text' CHECK (post_type IN ('text', 'photo', 'video', 'poll')),
  price NUMERIC NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'RUB',
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'published')),
  scheduled_for TIMESTAMP WITH TIME ZONE,
  published_at TIMESTAMP WITH TIME ZONE,
  views_count INTEGER DEFAULT 0,
  clicks_count INTEGER DEFAULT 0,
  engagement_rate NUMERIC DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Добавляем Row Level Security (RLS)
ALTER TABLE public.advertising_campaigns ENABLE ROW LEVEL SECURITY;

-- Политики для рекламных кампаний
CREATE POLICY "Users can view their own campaigns"
  ON public.advertising_campaigns
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns"
  ON public.advertising_campaigns
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
  ON public.advertising_campaigns
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
  ON public.advertising_campaigns
  FOR DELETE
  USING (auth.uid() = user_id);

-- Триггер для автоматического обновления updated_at
CREATE TRIGGER update_advertising_campaigns_updated_at
  BEFORE UPDATE ON public.advertising_campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Индексы для повышения производительности
CREATE INDEX idx_advertising_campaigns_user_id ON public.advertising_campaigns(user_id);
CREATE INDEX idx_advertising_campaigns_partner_id ON public.advertising_campaigns(partner_id);
CREATE INDEX idx_advertising_campaigns_channel_id ON public.advertising_campaigns(channel_id);
CREATE INDEX idx_advertising_campaigns_status ON public.advertising_campaigns(status);
