
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTelegram } from '@/hooks/useTelegram';
import { useProfile } from '@/hooks/useProfile';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Edit3, 
  Save, 
  X,
  Settings,
  Activity,
  MessageSquare,
  BarChart3,
  Camera,
  Loader2
} from 'lucide-react';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { user: telegramUser } = useTelegram();
  const { profile, loading, saving, updateProfile, uploadAvatar } = useProfile();
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
    const success = await updateProfile(formData);
    if (success) {
      setIsEditing(false);
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
    if (file && profile) {
      const avatarUrl = await uploadAvatar(file);
      if (avatarUrl) {
        await updateProfile({ avatar_url: avatarUrl });
      }
    }
  };

  const getAvatarFallback = () => {
    if (formData.full_name) {
      return formData.full_name[0].toUpperCase();
    }
    if (telegramUser?.first_name) {
      return telegramUser.first_name[0].toUpperCase();
    }
    return 'U';
  };

  const getDisplayName = () => {
    if (formData.full_name) return formData.full_name;
    if (telegramUser?.first_name && telegramUser?.last_name) {
      return `${telegramUser.first_name} ${telegramUser.last_name}`.trim();
    }
    if (telegramUser?.first_name) return telegramUser.first_name;
    return t('user');
  };

  const stats = [
    { label: t('active-channels'), value: '3', icon: MessageSquare },
    { label: t('published-posts'), value: '127', icon: Activity },
    { label: t('views'), value: '45.2K', icon: BarChart3 }
  ];

  if (loading) {
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
                    disabled={saving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    {t('cancel')}
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={saving}
                  >
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {t('save')}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {!isEditing ? (
                <div className="space-y-4">
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
                        {getDisplayName()}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">{formData.position}</p>
                      <Badge className="mt-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                        <Shield className="h-3 w-3 mr-1" />
                        {t('verified')}
                      </Badge>
                    </div>
                  </div>
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
              ) : (
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
                          onChange={handleAvatarChange}
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
                    <Input
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder={t('about-placeholder')}
                      className="mt-1"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Статистика */}
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5" />
                <span>{t('statistics')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <stat.icon className="h-8 w-8 mx-auto mb-2 text-blue-600 dark:text-blue-400" />
                    <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stat.value}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100 flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>{t('quick-actions')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="h-4 w-4 mr-2" />
                {t('account-settings')}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="h-4 w-4 mr-2" />
                {t('security')}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                {t('activity-history')}
              </Button>
            </CardContent>
          </Card>

          {telegramUser && (
            <Card className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">
                  {t('telegram-profile')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">ID:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">{telegramUser.id}</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('name')}:</span>
                  <span className="ml-2 text-gray-900 dark:text-gray-100">
                    {telegramUser.first_name} {telegramUser.last_name}
                  </span>
                </div>
                {telegramUser.username && (
                  <div className="text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Username:</span>
                    <span className="ml-2 text-gray-900 dark:text-gray-100">
                      @{telegramUser.username}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
