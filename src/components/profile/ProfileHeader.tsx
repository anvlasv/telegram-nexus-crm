
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Shield } from 'lucide-react';
import { UserProfile } from '@/hooks/useProfile';
import { useTelegram } from '@/hooks/useTelegram';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProfileHeaderProps {
  profile: UserProfile | null;
  displayName: string;
  position: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  displayName,
  position,
}) => {
  const { t } = useLanguage();
  const { user: telegramUser } = useTelegram();

  const getAvatarFallback = () => {
    if (profile?.full_name) {
      return profile.full_name[0].toUpperCase();
    }
    if (telegramUser?.first_name) {
      return telegramUser.first_name[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <Avatar className="h-16 w-16">
          {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
          <AvatarFallback className="text-lg">
            {getAvatarFallback()}
          </AvatarFallback>
        </Avatar>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          {displayName}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">{position}</p>
        <Badge className="mt-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
          <Shield className="h-3 w-3 mr-1" />
          {t('verified')}
        </Badge>
      </div>
    </div>
  );
};
