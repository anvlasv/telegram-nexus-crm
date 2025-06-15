
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type ScheduledPost = Tables<'scheduled_posts'>;

export const useScheduledPosts = () => {
  return useQuery({
    queryKey: ['scheduled-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scheduled_posts')
        .select(`
          *,
          telegram_channels (
            name,
            username,
            avatar_url
          )
        `)
        .order('scheduled_for', { ascending: true });
      
      if (error) throw error;
      return data as (ScheduledPost & { telegram_channels: { name: string; username: string; avatar_url?: string | null } })[];
    },
  });
};
