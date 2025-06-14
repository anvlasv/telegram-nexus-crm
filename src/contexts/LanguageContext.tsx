
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ru: {
    // Navigation
    dashboard: 'Дашборд',
    channels: 'Каналы',
    analytics: 'Аналитика',
    scheduler: 'Планировщик',
    assistant: 'Ассистент',
    partners: 'Партнеры',
    marketplace: 'Маркетплейс',
    notifications: 'Уведомления',
    profile: 'Профиль',
    settings: 'Настройки',
    
    // Common
    loading: 'Загрузка...',
    error: 'Ошибка',
    success: 'Успешно',
    cancel: 'Отмена',
    save: 'Сохранить',
    delete: 'Удалить',
    edit: 'Редактировать',
    close: 'Закрыть',
    
    // Auth
    login: 'Войти',
    logout: 'Выйти',
    register: 'Регистрация',
    email: 'Email',
    password: 'Пароль',
    'confirm-password': 'Подтвердите пароль',
    
    // Dashboard
    'total-channels': 'Всего каналов',
    'total-posts': 'Всего постов',
    'total-views': 'Всего просмотров',
    'total-subscribers': 'Всего подписчиков',
    
    // Channel Management
    'add-channel': 'Добавить канал',
    'channel-name': 'Название канала',
    'channel-description': 'Описание канала',
    'channel-url': 'URL канала',
    
    // Settings
    'system-settings': 'Системные настройки',
    'interface-language': 'Язык интерфейса',
    'select-language': 'Выберите язык',
    'russian': 'Русский',
    'english': 'English',
    'supabase-description': 'Подключение к базе данных Supabase активно и работает корректно.',
    'connected-to-supabase': 'Подключено к Supabase',
    
    // Profile
    account: 'Аккаунт',
    
    // Post types
    'text-post': 'Текстовый пост',
    'media-post': 'Медиа пост',
    'poll-post': 'Опрос',
    
    // Partners & Campaigns
    'create-post': 'Создать пост',
    'edit-post': 'Редактировать пост',
    'schedule': 'Запланировать',
    'select-channel-first': 'Сначала выберите канал',
    'post-scheduled-successfully': 'Пост успешно запланирован',
    'post-updated-successfully': 'Пост успешно обновлен',
    'error-scheduling-post': 'Ошибка при планировании поста',
    'error-updating-post': 'Ошибка при обновлении поста',
    'post-published': 'Пост опубликован',
    'error-publishing-post': 'Ошибка при публикации поста',
    'confirm-delete-post': 'Вы уверены, что хотите удалить этот пост?',
    'post-deleted': 'Пост удален',
    'error-deleting-post': 'Ошибка при удалении поста',
    
    // Statuses
    'active': 'Активный',
    'pending': 'На рассмотрении',
    'inactive': 'Неактивный',
    'approved': 'Одобрено',
    'rejected': 'Отклонено',
    'draft': 'Черновик',
    'published': 'Опубликовано'
  },
  en: {
    // Navigation
    dashboard: 'Dashboard',
    channels: 'Channels',
    analytics: 'Analytics',
    scheduler: 'Scheduler',
    assistant: 'Assistant',
    partners: 'Partners',
    marketplace: 'Marketplace',
    notifications: 'Notifications',
    profile: 'Profile',
    settings: 'Settings',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    
    // Auth
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    'confirm-password': 'Confirm Password',
    
    // Dashboard
    'total-channels': 'Total Channels',
    'total-posts': 'Total Posts',
    'total-views': 'Total Views',
    'total-subscribers': 'Total Subscribers',
    
    // Channel Management
    'add-channel': 'Add Channel',
    'channel-name': 'Channel Name',
    'channel-description': 'Channel Description',
    'channel-url': 'Channel URL',
    
    // Settings
    'system-settings': 'System Settings',
    'interface-language': 'Interface Language',
    'select-language': 'Select Language',
    'russian': 'Русский',
    'english': 'English',
    'supabase-description': 'Supabase database connection is active and working correctly.',
    'connected-to-supabase': 'Connected to Supabase',
    
    // Profile
    account: 'Account',
    
    // Post types
    'text-post': 'Text Post',
    'media-post': 'Media Post',
    'poll-post': 'Poll',
    
    // Partners & Campaigns
    'create-post': 'Create Post',
    'edit-post': 'Edit Post',
    'schedule': 'Schedule',
    'select-channel-first': 'Select channel first',
    'post-scheduled-successfully': 'Post scheduled successfully',
    'post-updated-successfully': 'Post updated successfully',
    'error-scheduling-post': 'Error scheduling post',
    'error-updating-post': 'Error updating post',
    'post-published': 'Post published',
    'error-publishing-post': 'Error publishing post',
    'confirm-delete-post': 'Are you sure you want to delete this post?',
    'post-deleted': 'Post deleted',
    'error-deleting-post': 'Error deleting post',
    
    // Statuses
    'active': 'Active',
    'pending': 'Pending',
    'inactive': 'Inactive',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'draft': 'Draft',
    'published': 'Published'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ru';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  const value = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
