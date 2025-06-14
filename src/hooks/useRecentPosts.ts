
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type ScheduledPost = Tables<'scheduled_posts'>;
type Channel = Tables<'telegram_channels'>;

export const useRecentPosts = () => {
  return useQuery({
    queryKey: ['recent-posts'],
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
        .order('created_at', { ascending: false })
        .limit(4);
      
      if (error) throw error;
      return data as (ScheduledPost & { telegram_channels: Channel })[];
    },
  });
};
