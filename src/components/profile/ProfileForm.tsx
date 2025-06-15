
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { UserProfile } from '@/hooks/useProfile';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/hooks/useTelegram';

interface ProfileFormProps {
  profile: UserProfile | null;
  formData: {
    full_name: string;
    bio: string;
    position: string;
    location: string;
  };
  setFormData: React.Dispatch<React.SetStateAction<{
    full_name: string;
    bio: string;
    position: string;
    location: string;
  }>>;
  onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  profile,
  formData,
  setFormData,
  onAvatarChange,
}) => {
  const { t } = useLanguage();
  const { user: telegramUser } = useTelegram();

  const getAvatarFallback = () => {
    if (formData.full_name) {
      return formData.full_name[0].toUpperCase();
    }
    if (telegramUser?.first_name) {
      return telegramUser.first_name[0].toUpperCase();
    }
    return 'U';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Avatar className="h-16 w-16">
            {profile?.avatar_url && <AvatarImage src={profile.avatar_url} />}
            <AvatarFallback className="text-lg">
              {getAvatarFallback()}
            </AvatarFallback>
          </Avatar>
          <label htmlFor="avatar-upload" className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-1 cursor-pointer">
            <Camera className="h-3 w-3" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onAvatarChange}
            />
          </label>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-300">
            {t('full-name')}
          </Label>
          <Input
            id="fullName"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label htmlFor="position" className="text-gray-700 dark:text-gray-300">
            {t('position')}
          </Label>
          <Input
            id="position"
            value={formData.position}
            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>
      <div>
        <Label htmlFor="location" className="text-gray-700 dark:text-gray-300">
          {t('location')}
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="bio" className="text-gray-700 dark:text-gray-300">
          {t('bio')}
        </Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder={t('about-placeholder')}
          className="mt-1"
        />
      </div>
    </div>
  );
};
