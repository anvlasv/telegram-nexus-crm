
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface AdvertisingCampaign {
  id: string;
  partner_id: string;
  channel_id: string;
  user_id: string;
  title: string;
  content: string;
  media_urls?: string[];
  post_type: 'text' | 'photo' | 'video' | 'audio' | 'document' | 'poll' | 'location' | 'contact' | 'sticker' | 'animation' | 'voice' | 'video_note';
  price: number;
  currency: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
  scheduled_for?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
  views_count?: number;
  clicks_count?: number;
  engagement_rate?: number;
  partner?: {
    name: string;
    contact_info: any;
  };
  channel?: {
    name: string;
    username: string;
    subscriber_count: number;
  };
}

export const useAdvertisingCampaigns = () => {
  return useQuery({
    queryKey: ['advertising-campaigns'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('advertising_campaigns')
        .select(`
          *,
          partner:partners (name, contact_info),
          channel:telegram_channels (name, username, subscriber_count)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any[];
    },
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (campaign: {
      partner_id: string;
      channel_id: string;
      title: string;
      content: string;
      post_type: 'text' | 'photo' | 'video' | 'audio' | 'document' | 'poll' | 'location' | 'contact' | 'sticker' | 'animation' | 'voice' | 'video_note';
      price: number;
      currency: string;
      status: 'draft' | 'pending' | 'approved' | 'rejected' | 'published';
      scheduled_for?: string;
    }) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('advertising_campaigns')
        .insert([{ ...campaign, user_id: userData.user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertising-campaigns'] });
    },
  });
};

export const useUpdateCampaignStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('advertising_campaigns')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advertising-campaigns'] });
    },
  });
};
