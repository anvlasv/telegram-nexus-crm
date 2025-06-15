
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Channel = Tables<'telegram_channels'>;
type ChannelInsert = TablesInsert<'telegram_channels'>;
type ChannelUpdate = TablesUpdate<'telegram_channels'>;

export const useChannels = () => {
  const [selectedChannelId, setSelectedChannelId] = useState<string>('');
  const [isChannelSwitching, setIsChannelSwitching] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: channels = [], isLoading, error } = useQuery({
    queryKey: ['telegram-channels'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('telegram_channels')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  // Set first channel as selected ONLY if none selected and channels exist
  useEffect(() => {
    if (!selectedChannelId && channels.length > 0) {
      // Check if there's a stored channel preference
      const storedChannelId = localStorage.getItem('selectedChannelId');
      
      if (storedChannelId && channels.find(c => c.id === storedChannelId)) {
        console.log('[useChannels] Восстанавливаем сохраненный канал:', storedChannelId);
        setSelectedChannelId(storedChannelId);
      } else if (channels.length > 0) {
        console.log('[useChannels] Выбираем первый доступный канал:', channels[0].id);
        setSelectedChannelId(channels[0].id);
        localStorage.setItem('selectedChannelId', channels[0].id);
      }
    }
  }, [channels, selectedChannelId]);

  // Store channel selection in localStorage with transition handling
  const handleSetSelectedChannelId = (channelId: string) => {
    if (channelId === selectedChannelId) return;
    
    console.log('[useChannels] Переключение канала:', { from: selectedChannelId, to: channelId });
    setIsChannelSwitching(true);
    
    // Immediately update selected channel
    setSelectedChannelId(channelId);
    localStorage.setItem('selectedChannelId', channelId);
    
    // Invalidate all related queries to trigger refetch
    queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] });
    queryClient.invalidateQueries({ queryKey: ['recent-posts'] });
    queryClient.invalidateQueries({ queryKey: ['aggregated-data'] });
    
    // Short delay for smooth transition
    setTimeout(() => {
      setIsChannelSwitching(false);
      console.log('[useChannels] Канал переключен успешно:', channelId);
    }, 100);
  };

  return {
    channels,
    selectedChannelId,
    setSelectedChannelId: handleSetSelectedChannelId,
    isLoading,
    error,
    isChannelSwitching,
  };
};

export const useCreateChannel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (channel: Omit<ChannelInsert, 'user_id'>) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('telegram_channels')
        .insert([{ ...channel, user_id: userData.user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegram-channels'] });
    },
  });
};

export const useUpdateChannel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<ChannelUpdate>) => {
      const { data, error } = await supabase
        .from('telegram_channels')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegram-channels'] });
    },
  });
};

export const useDeleteChannel = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('telegram_channels')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['telegram-channels'] });
    },
  });
};
