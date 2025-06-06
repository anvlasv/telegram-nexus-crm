
import { useMutation, useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface TelegramApiRequest {
  action: string;
  chatId?: string | number;
  username?: string;
}

interface TelegramChat {
  id: number;
  type: string;
  title?: string;
  username?: string;
  description?: string;
  invite_link?: string;
}

interface TelegramApiResponse {
  ok: boolean;
  result?: any;
  error_code?: number;
  description?: string;
}

const callTelegramApi = async (request: TelegramApiRequest): Promise<TelegramApiResponse> => {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    throw new Error('Not authenticated');
  }

  const response = await supabase.functions.invoke('telegram-api', {
    body: request,
  });

  if (response.error) {
    throw new Error(response.error.message);
  }

  return response.data;
};

export const useTelegramBotInfo = () => {
  return useQuery({
    queryKey: ['telegram-bot-info'],
    queryFn: () => callTelegramApi({ action: 'getMe' }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useGetChatInfo = () => {
  return useMutation({
    mutationFn: ({ chatId, username }: { chatId?: string | number; username?: string }) =>
      callTelegramApi({ action: 'getChat', chatId, username }),
  });
};

export const useGetChatMemberCount = () => {
  return useMutation({
    mutationFn: ({ chatId, username }: { chatId?: string | number; username?: string }) =>
      callTelegramApi({ action: 'getChatMemberCount', chatId, username }),
  });
};

export const useCheckBotAdmin = () => {
  return useMutation({
    mutationFn: ({ chatId, username }: { chatId?: string | number; username?: string }) =>
      callTelegramApi({ action: 'getChatMember', chatId, username }),
  });
};
