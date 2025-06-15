
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  username: string | null;
  created_at: string | null;
  updated_at: string | null;
  // Virtual fields for display
  email?: string;
  bio?: string;
  position?: string;
  location?: string;
}

export const useProfile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading profile:', error);
        return;
      }

      if (data) {
        const profileWithVirtualFields: UserProfile = {
          ...data,
          email: user.email || '',
          bio: '',
          position: 'Администратор канала',
          location: 'Москва, Россия',
        };
        setProfile(profileWithVirtualFields);
      } else {
        // Create initial profile
        const newProfile = {
          id: user.id,
          full_name: user.user_metadata?.full_name || '',
          avatar_url: null,
          username: null,
        };

        const { data: created, error: createError } = await supabase
          .from('profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) {
          console.error('Error creating profile:', createError);
        } else {
          const profileWithVirtualFields: UserProfile = {
            ...created,
            email: user.email || '',
            bio: '',
            position: 'Администратор канала',
            location: 'Москва, Россия',
          };
          setProfile(profileWithVirtualFields);
        }
      }
    } catch (error) {
      console.error('Error in loadProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return false;

    setSaving(true);
    try {
      // Filter out virtual fields that don't exist in the database
      const dbUpdates = {
        ...(updates.full_name !== undefined && { full_name: updates.full_name }),
        ...(updates.avatar_url !== undefined && { avatar_url: updates.avatar_url }),
        ...(updates.username !== undefined && { username: updates.username }),
      };

      const { data, error } = await supabase
        .from('profiles')
        .update(dbUpdates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating profile:', error);
        toast({
          title: 'Ошибка',
          description: 'Не удалось сохранить профиль',
          variant: 'destructive',
        });
        return false;
      }

      const updatedProfile: UserProfile = {
        ...data,
        email: profile.email,
        bio: updates.bio !== undefined ? updates.bio : profile.bio,
        position: updates.position !== undefined ? updates.position : profile.position,
        location: updates.location !== undefined ? updates.location : profile.location,
      };

      setProfile(updatedProfile);
      toast({
        title: 'Успешно',
        description: 'Профиль сохранен',
      });
      return true;
    } catch (error) {
      console.error('Error in updateProfile:', error);
      toast({
        title: 'Ошибка',
        description: 'Произошла ошибка при сохранении',
        variant: 'destructive',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    if (!user) return null;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        return null;
      }

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error in uploadAvatar:', error);
      return null;
    }
  };

  return {
    profile,
    loading,
    saving,
    updateProfile,
    uploadAvatar,
    refreshProfile: loadProfile,
  };
};
