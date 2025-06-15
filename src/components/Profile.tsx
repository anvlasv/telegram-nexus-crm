
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, User, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/hooks/useTelegram';
import { useProfile } from '@/hooks/useProfile';
import { ProfileInfo } from './profile/ProfileInfo';
import { ProfileForm } from './profile/ProfileForm';
import { ProfileStats } from './profile/ProfileStats';
import { ProfileSidebar } from './profile/ProfileSidebar';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { user: telegramUser } = useTelegram();
  const { profile, isLoading, updateProfile, uploadAvatar, isUpdating } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    bio: '',
    position: '',
    location: ''
  });

  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        position: profile.position || t('channel-administrator'),
        location: profile.location || t('moscow-russia')
      });
    }
  }, [profile, t]);

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        position: profile.position || t('channel-administrator'),
        location: profile.location || t('moscow-russia')
      });
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadAvatar(file);
      } catch (error) {
        console.error('Failed to upload avatar:', error);
      }
    }
  };

  const getDisplayName = () => {
    if (formData.full_name) return formData.full_name;
    if (telegramUser?.first_name && telegramUser?.last_name) {
      return `${telegramUser.first_name} ${telegramUser.last_name}`.trim();
    }
    if (telegramUser?.first_name) return telegramUser.first_name;
    return t('user');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 sm:p-0">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {t('profile')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          {t('personal-information')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{t('personal-information')}</span>
              </CardTitle>
              {!isEditing ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="text-blue-600 dark:text-blue-400"
                >
                  <Edit3 className="h-4 w-4 mr-2" />
                  {t('edit')}
                </Button>
              ) : (
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancel}
                    className="text-gray-600 dark:text-gray-400"
                    disabled={isUpdating}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {t('cancel')}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={isUpdating}
                  >
                    {isUpdating ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {t('save')}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {!isEditing ? (
                <ProfileInfo 
                  profile={profile} 
                  formData={formData} 
                  displayName={getDisplayName()} 
                />
              ) : (
                <ProfileForm
                  profile={profile}
                  formData={formData}
                  setFormData={setFormData}
                  onAvatarChange={handleAvatarChange}
                />
              )}
            </CardContent>
          </Card>

          <ProfileStats />
        </div>

        <ProfileSidebar />
      </div>
    </div>
  );
};
