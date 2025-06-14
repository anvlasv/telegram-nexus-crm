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
    mutationFn: async ({ chatId, username }: { chatId?: string | number; username?: string }) => {
      const resp = await callTelegramApi({ action: 'getChat', chatId, username });
      // Попробуем сохранить ссылку на фото если есть
      // getChat возвращает поле photo с объектом small_file_id и big_file_id, надо загрузить через getFile
      if (resp.ok && resp.result && resp.result.photo && resp.result.photo.big_file_id) {
        // Получаем URL к файлу аватара через отдельный вызов
        try {
          const fileResp = await callTelegramApi({ action: 'getFile', chatId, username, file_id: resp.result.photo.big_file_id });
          if (fileResp.ok && fileResp.result && fileResp.result.file_path) {
            // Возвращаем полный url картинки через Telegram CDN API (пример: https://api.telegram.org/file/bot<TOKEN>/<file_path>)
            resp.result.tg_avatar_url = `https://api.telegram.org/file/bot${process.env.TELEGRAM_BOT_TOKEN}/${fileResp.result.file_path}`;
          }
        } catch (err) {
          // Игнорировать, если не удалось получить file_path
        }
      }
      return resp;
    }
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
