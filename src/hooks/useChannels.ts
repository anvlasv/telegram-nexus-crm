
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useChannels = () => {
  const [selectedChannelId, setSelectedChannelId] = useState<string>('');
  
  const { data: channels = [], isLoading, error } = useQuery({
    queryKey: ['telegram-channels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('telegram_channels')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data.map(channel => ({
        ...channel,
        avatar_url: channel.avatar_url || null // Add avatar_url field
      }));
    },
  });

  // Set first channel as selected if none selected and channels exist
  if (!selectedChannelId && channels.length > 0) {
    setSelectedChannelId(channels[0].id);
  }

  return {
    channels,
    selectedChannelId,
    setSelectedChannelId,
    isLoading,
    error,
  };
};
