
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ru: {
    dashboard: 'Панель управления',
    channels: 'Каналы',
    analytics: 'Аналитика',
    scheduler: 'Планировщик',
    partners: 'Партнеры',
    marketplace: 'Маркетплейс',
    notifications: 'Уведомления',
    settings: 'Настройки',
    'quick-action': 'Быстрое действие',
    'search-placeholder': 'Поиск каналов, постов, партнеров...',
    'language-settings': 'Настройки языка',
    'interface-language': 'Язык интерфейса',
    'select-language': 'Выберите язык',
    'russian': 'Русский',
    'english': 'English',
    'save': 'Сохранить',
    'telegram-integration': 'Интеграция с Telegram',
    'miniapp-info': 'Telegram MiniApp',
    'miniapp-description': 'Для создания MiniApp нужно создать бота через @BotFather и настроить Web App URL',
    'supabase-integration': 'Интеграция Supabase',
    'supabase-description': 'Подключите Supabase для хранения данных о каналах, пользователях и аналитике'
  },
  en: {
    dashboard: 'Dashboard',
    channels: 'Channels',
    analytics: 'Analytics',
    scheduler: 'Scheduler',
    partners: 'Partners',
    marketplace: 'Marketplace',
    notifications: 'Notifications',
    settings: 'Settings',
    'quick-action': 'Quick Action',
    'search-placeholder': 'Search channels, posts, partners...',
    'language-settings': 'Language Settings',
    'interface-language': 'Interface Language',
    'select-language': 'Select Language',
    'russian': 'Русский',
    'english': 'English',
    'save': 'Save',
    'telegram-integration': 'Telegram Integration',
    'miniapp-info': 'Telegram MiniApp',
    'miniapp-description': 'To create MiniApp, create a bot via @BotFather and configure Web App URL',
    'supabase-integration': 'Supabase Integration',
    'supabase-description': 'Connect Supabase to store channels, users and analytics data'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
