
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type Partner = Tables<'partners'>;
type PartnerInsert = TablesInsert<'partners'>;
type PartnerUpdate = TablesUpdate<'partners'>;

export const usePartners = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Partner[];
    },
  });

  const updatePartnerStatus = async (partnerId: string, status: string) => {
    const { data, error } = await supabase
      .from('partners')
      .update({ status })
      .eq('id', partnerId)
      .select()
      .single();
    
    if (error) throw error;
    
    // Invalidate and refetch partners data
    queryClient.invalidateQueries({ queryKey: ['partners'] });
    
    return data;
  };

  return {
    ...query,
    partners: query.data || [],
    updatePartnerStatus,
  };
};

export const useCreatePartner = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (partner: Omit<PartnerInsert, 'user_id'>) => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('partners')
        .insert([{ ...partner, user_id: userData.user.id }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
    },
  });
};
