
import React from 'react';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Mail, Calendar } from 'lucide-react';
import { UserProfile } from '@/hooks/useProfile';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProfileHeader } from './ProfileHeader';

interface ProfileInfoProps {
  profile: UserProfile | null;
  formData: {
    full_name: string;
    bio: string;
    position: string;
    location: string;
  };
  displayName: string;
}

export const ProfileInfo: React.FC<ProfileInfoProps> = ({
  profile,
  formData,
  displayName,
}) => {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <ProfileHeader 
        profile={profile} 
        displayName={displayName} 
        position={formData.position} 
      />
      <Separator className="dark:border-gray-700" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-gray-700 dark:text-gray-300">Email</Label>
          <div className="flex items-center mt-1 text-gray-900 dark:text-gray-100">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            {profile?.email || user?.email}
          </div>
        </div>
        <div>
          <Label className="text-gray-700 dark:text-gray-300">{t('location')}</Label>
          <div className="flex items-center mt-1 text-gray-900 dark:text-gray-100">
            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
            {formData.location}
          </div>
        </div>
      </div>
      {formData.bio && (
        <div>
          <Label className="text-gray-700 dark:text-gray-300">{t('about')}</Label>
          <p className="mt-1 text-gray-900 dark:text-gray-100">{formData.bio}</p>
        </div>
      )}
    </div>
  );
};
