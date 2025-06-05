
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings as SettingsIcon, User, Shield, Palette } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { ProfileModal } from './settings/ProfileModal';
import { SecurityModal } from './settings/SecurityModal';
import { AppearanceModal } from './settings/AppearanceModal';
import { GeneralModal } from './settings/GeneralModal';

export const Settings = () => {
  const { t } = useLanguage();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const openModal = (modalName: string) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          {t('settings')}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('system-settings')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => openModal('profile')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('profile')}
            </CardTitle>
            <CardDescription>
              {t('profile-description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('profile-settings-text')}
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => openModal('security')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              {t('security')}
            </CardTitle>
            <CardDescription>
              {t('security-description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('security-settings-text')}
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => openModal('appearance')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              {t('appearance')}
            </CardTitle>
            <CardDescription>
              {t('appearance-description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('appearance-settings-text')}
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => openModal('general')}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SettingsIcon className="h-5 w-5" />
              {t('general-settings')}
            </CardTitle>
            <CardDescription>
              {t('general-description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {t('general-settings-text')}
            </p>
          </CardContent>
        </Card>
      </div>

      <ProfileModal 
        open={activeModal === 'profile'} 
        onOpenChange={(open) => !open && closeModal()} 
      />
      <SecurityModal 
        open={activeModal === 'security'} 
        onOpenChange={(open) => !open && closeModal()} 
      />
      <AppearanceModal 
        open={activeModal === 'appearance'} 
        onOpenChange={(open) => !open && closeModal()} 
      />
      <GeneralModal 
        open={activeModal === 'general'} 
        onOpenChange={(open) => !open && closeModal()} 
      />
    </div>
  );
};
