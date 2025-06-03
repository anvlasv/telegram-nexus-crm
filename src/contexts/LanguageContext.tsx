
import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  ru: {
    // Навигация
    'dashboard': 'Панель управления',
    'channels': 'Каналы',
    'analytics': 'Аналитика',
    'scheduler': 'Планировщик',
    'partners': 'Партнеры',
    'marketplace': 'Маркетплейс',
    'notifications': 'Уведомления',
    'settings': 'Настройки',
    
    // Dashboard
    'overview': 'Обзор ваших Telegram каналов и производительности',
    'total-subscribers': 'Всего подписчиков',
    'active-channels': 'Активные каналы',
    'engagement-rate': 'Уровень вовлечения',
    'revenue': 'Доход',
    'scheduled-posts': 'Запланированные посты',
    'upcoming-posts': 'Предстоящие и недавние посты',
    'partner-requests': 'Запросы партнеров',
    'pending-requests': 'Ожидающие запросы на рекламу',
    'view-all-posts': 'Посмотреть все посты',
    'view-all-requests': 'Посмотреть все запросы',
    'accept': 'Принять',
    'decline': 'Отклонить',
    
    // Settings
    'system-settings': 'Управление настройками системы',
    'language-settings': 'Настройки языка',
    'interface-language': 'Язык интерфейса',
    'select-language': 'Выберите язык',
    'russian': 'Русский',
    'english': 'English',
    'supabase-integration': 'Интеграция Supabase',
    'supabase-description': 'Подключение к базе данных и backend сервисам',
    'connected-to-supabase': 'Подключено к Supabase',
    
    // Channel Management
    'channel-management': 'Управление каналами',
    'manage-channels': 'Управляйте своими Telegram каналами',
    'add-channel': 'Добавить канал',
    'channel-name': 'Название канала',
    'channel-username': 'Username канала',
    'channel-id': 'ID канала',
    'subscribers': 'подписчиков',
    'posts': 'постов',
    'last-post': 'Последний пост',
    'active': 'Активный',
    'paused': 'Приостановлен',
    'archived': 'Архивирован',
    'edit': 'Редактировать',
    'delete': 'Удалить',
    'no-channels': 'У вас пока нет каналов',
    'add-first-channel': 'Добавьте свой первый канал для начала работы',
    'cancel': 'Отмена',
    'save': 'Сохранить',
    'create': 'Создать',
    
    // Analytics
    'channel-analytics': 'Аналитика каналов',
    'detailed-analytics': 'Подробная аналитика производительности каналов',
    'views': 'Просмотры',
    'reactions': 'Реакции',
    'forwards': 'Пересылки',
    'growth': 'Рост',
    'this-month': 'За этот месяц',
    'total-views': 'Всего просмотров',
    'total-reactions': 'Всего реакций',
    'total-forwards': 'Всего пересылок',
    'subscriber-growth': 'Рост подписчиков',
    
    // Статусы
    'published': 'Опубликован',
    'scheduled': 'Запланирован',
    'draft': 'Черновик',
    'pending': 'В ожидании',
    'sent': 'Отправлен',
    'failed': 'Ошибка',
    'cancelled': 'Отменен',
    
    // Общие
    'loading': 'Загрузка...',
    'error': 'Ошибка',
    'success': 'Успешно',
    'warning': 'Предупреждение',
    'close': 'Закрыть',
    'open': 'Открыть',
    'back': 'Назад',
    'next': 'Далее',
    'previous': 'Предыдущий',
    'submit': 'Отправить',
    'reset': 'Сбросить',
    'search': 'Поиск',
    'filter': 'Фильтр',
    'sort': 'Сортировка',
    'export': 'Экспорт',
    'import': 'Импорт',
    'refresh': 'Обновить',
  },
  en: {
    // Navigation
    'dashboard': 'Dashboard',
    'channels': 'Channels',
    'analytics': 'Analytics',
    'scheduler': 'Scheduler',
    'partners': 'Partners',
    'marketplace': 'Marketplace',
    'notifications': 'Notifications',
    'settings': 'Settings',
    
    // Dashboard
    'overview': 'Overview of your Telegram channels and performance',
    'total-subscribers': 'Total Subscribers',
    'active-channels': 'Active Channels',
    'engagement-rate': 'Engagement Rate',
    'revenue': 'Revenue',
    'scheduled-posts': 'Scheduled Posts',
    'upcoming-posts': 'Upcoming and recent post activity',
    'partner-requests': 'Partner Requests',
    'pending-requests': 'Pending advertising requests',
    'view-all-posts': 'View All Posts',
    'view-all-requests': 'View All Requests',
    'accept': 'Accept',
    'decline': 'Decline',
    
    // Settings
    'system-settings': 'Manage system settings',
    'language-settings': 'Language Settings',
    'interface-language': 'Interface Language',
    'select-language': 'Select Language',
    'russian': 'Русский',
    'english': 'English',
    'supabase-integration': 'Supabase Integration',
    'supabase-description': 'Database and backend services connection',
    'connected-to-supabase': 'Connected to Supabase',
    
    // Channel Management
    'channel-management': 'Channel Management',
    'manage-channels': 'Manage your Telegram channels',
    'add-channel': 'Add Channel',
    'channel-name': 'Channel Name',
    'channel-username': 'Channel Username',
    'channel-id': 'Channel ID',
    'subscribers': 'subscribers',
    'posts': 'posts',
    'last-post': 'Last Post',
    'active': 'Active',
    'paused': 'Paused',
    'archived': 'Archived',
    'edit': 'Edit',
    'delete': 'Delete',
    'no-channels': 'You have no channels yet',
    'add-first-channel': 'Add your first channel to get started',
    'cancel': 'Cancel',
    'save': 'Save',
    'create': 'Create',
    
    // Analytics
    'channel-analytics': 'Channel Analytics',
    'detailed-analytics': 'Detailed analytics of channel performance',
    'views': 'Views',
    'reactions': 'Reactions',
    'forwards': 'Forwards',
    'growth': 'Growth',
    'this-month': 'This Month',
    'total-views': 'Total Views',
    'total-reactions': 'Total Reactions',
    'total-forwards': 'Total Forwards',
    'subscriber-growth': 'Subscriber Growth',
    
    // Statuses
    'published': 'Published',
    'scheduled': 'Scheduled',
    'draft': 'Draft',
    'pending': 'Pending',
    'sent': 'Sent',
    'failed': 'Failed',
    'cancelled': 'Cancelled',
    
    // General
    'loading': 'Loading...',
    'error': 'Error',
    'success': 'Success',
    'warning': 'Warning',
    'close': 'Close',
    'open': 'Open',
    'back': 'Back',
    'next': 'Next',
    'previous': 'Previous',
    'submit': 'Submit',
    'reset': 'Reset',
    'search': 'Search',
    'filter': 'Filter',
    'sort': 'Sort',
    'export': 'Export',
    'import': 'Import',
    'refresh': 'Refresh',
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

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
