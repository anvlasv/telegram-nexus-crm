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
      console.log('[useChannels] Загружаем каналы...');
      const { data, error } = await supabase
        .from('telegram_channels')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('[useChannels] Ошибка загрузки каналов:', error);
        throw error;
      }
      
      console.log('[useChannels] Каналы загружены:', data?.length || 0);
      return data;
    },
  });

  // Инициализация выбранного канала
  useEffect(() => {
    console.log('[useChannels] Инициализация каналов:', { 
      selectedChannelId, 
      channelsCount: channels.length 
    });

    if (!selectedChannelId && channels.length > 0) {
      const storedChannelId = localStorage.getItem('selectedChannelId');
      
      if (storedChannelId && channels.find(c => c.id === storedChannelId)) {
        console.log('[useChannels] Восстанавливаем сохраненный канал:', storedChannelId);
        setSelectedChannelId(storedChannelId);
      } else {
        console.log('[useChannels] Выбираем первый канал:', channels[0].id);
        setSelectedChannelId(channels[0].id);
        localStorage.setItem('selectedChannelId', channels[0].id);
      }
    }

    // Проверяем существование выбранного канала
    if (selectedChannelId && channels.length > 0) {
      const channelExists = channels.find(c => c.id === selectedChannelId);
      if (!channelExists) {
        console.log('[useChannels] Выбранный канал не найден, сбрасываем');
        setSelectedChannelId('');
        localStorage.removeItem('selectedChannelId');
      }
    }
  }, [channels, selectedChannelId]);

  // Обработка смены канала с полной перезагрузкой страницы
  const handleSetSelectedChannelId = (channelId: string) => {
    if (channelId === selectedChannelId) {
      console.log('[useChannels] Канал уже выбран:', channelId);
      return;
    }
    
    console.log('[useChannels] Переключение канала с перезагрузкой:', { 
      from: selectedChannelId, 
      to: channelId 
    });
    
    setIsChannelSwitching(true);
    
    // Сохраняем новый канал
    localStorage.setItem('selectedChannelId', channelId);
    
    // Добавляем флаг для отслеживания перезагрузки
    localStorage.setItem('channelSwitchReload', 'true');
    
    // Перезагружаем страницу
    window.location.reload();
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
