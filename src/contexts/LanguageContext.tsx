
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
    refresh: 'Обновить',
    search: 'Поиск',
    filter: 'Фильтр',
    sort: 'Сортировка',
    export: 'Экспорт',
    import: 'Импорт',
    
    // Auth
    login: 'Войти',
    logout: 'Выйти',
    register: 'Регистрация',
    email: 'Email',
    password: 'Пароль',
    'confirm-password': 'Подтвердите пароль',
    'forgot-password': 'Забыли пароль?',
    'remember-me': 'Запомнить меня',
    
    // Dashboard
    'total-channels': 'Всего каналов',
    'total-posts': 'Всего постов',
    'total-views': 'Всего просмотров',
    'total-subscribers': 'Всего подписчиков',
    'total-reach': 'Общий охват',
    'average-engagement': 'Средняя вовлеченность',
    'overview': 'Обзор всех каналов',
    'overview-for-channel': 'Обзор канала',
    'recent-posts': 'Недавние посты',
    'no-recent-posts': 'Нет недавних постов',
    'no-scheduled-posts-for-channel': 'Нет запланированных постов для этого канала',
    'no-channel-selected': 'Канал не выбран',
    'select-channel-to-view-dashboard': 'Выберите канал для просмотра аналитики',
    'view-all-posts': 'Все посты',
    'view-all-requests': 'Все заявки',
    'posts-this-month': 'Постов в этом месяце',
    'engagement-rate': 'Вовлеченность',
    'revenue': 'Доход',
    'switching-channel': 'Переключение канала...',
    
    // Channel Management
    'add-channel': 'Добавить канал',
    'channel-name': 'Название канала',
    'channel-username': 'Имя пользователя канала',
    'channel-description': 'Описание канала',
    'channel-url': 'URL канала',
    'channel-info': 'Информация о канале',
    'channel-details': 'Детали канала',
    'no-channels': 'Нет каналов',
    'active-channel': 'Активный канал',
    subscribers: 'Подписчики',
    'owner': 'Владелец',
    'country': 'Страна',
    'russia': 'Россия',
    'created-at': 'Создан',
    'last-activity': 'Последняя активность',
    'channel-type': 'Тип канала',
    'public-channel': 'Публичный канал',
    'private-channel': 'Приватный канал',
    'total': 'Всего',
    
    // Settings
    'system-settings': 'Системные настройки',
    'interface-language': 'Язык интерфейса',
    'select-language': 'Выберите язык',
    'russian': 'Русский',
    'english': 'English',
    'supabase-description': 'Подключение к базе данных Supabase активно и работает корректно.',
    'connected-to-supabase': 'Подключено к Supabase',
    'appearance': 'Внешний вид',
    'theme': 'Тема',
    'light-theme': 'Светлая тема',
    'dark-theme': 'Темная тема',
    'auto-theme': 'Автоматически',
    
    // Profile
    account: 'Аккаунт',
    'personal-info': 'Личная информация',
    'change-password': 'Изменить пароль',
    'account-settings': 'Настройки аккаунта',
    
    // Post types
    'text-post': 'Текстовый пост',
    'media-post': 'Медиа пост',
    'poll-post': 'Опрос',
    'photo-post': 'Фото',
    'video-post': 'Видео',
    'audio-post': 'Аудио',
    'document-post': 'Документ',
    'location-post': 'Геолокация',
    'contact-post': 'Контакт',
    'sticker-post': 'Стикер',
    'animation-post': 'Анимация',
    'voice-post': 'Голосовое сообщение',
    'video-note-post': 'Видеосообщение',
    
    // Partners & Campaigns
    'create-post': 'Создать пост',
    'edit-post': 'Редактировать пост',
    'schedule': 'Запланировать',
    'publish': 'Опубликовать',
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
    'partner-requests': 'Запросы партнеров',
    'pending-requests': 'Ожидающие заявки',
    'no-pending-requests': 'Нет ожидающих заявок',
    'accept': 'Принять',
    'decline': 'Отклонить',
    'revenue-by-partner': 'Доход по партнерам',
    
    // Scheduler
    'scheduled-posts': 'Запланированные посты',
    'upcoming-posts-for': 'Предстоящие посты для',
    'calendar-view': 'Календарь',
    'list-view': 'Список',
    'today': 'Сегодня',
    'tomorrow': 'Завтра',
    'this-week': 'На этой неделе',
    'next-week': 'На следующей неделе',
    
    // Analytics
    'analytics-overview': 'Обзор аналитики',
    'views': 'Просмотры',
    'likes': 'Лайки',
    'shares': 'Репосты',
    'comments': 'Комментарии',
    'click-through-rate': 'CTR',
    'reach': 'Охват',
    'impressions': 'Показы',
    'growth-rate': 'Темп роста',
    'top-performing-posts': 'Лучшие посты',
    'audience-insights': 'Анализ аудитории',
    
    // Statuses
    'active': 'Активный',
    'pending': 'На рассмотрении',
    'inactive': 'Неактивный',
    'approved': 'Одобрено',
    'rejected': 'Отклонено',
    'draft': 'Черновик',
    'published': 'Опубликовано',
    'scheduled': 'Запланировано',
    'sent': 'Отправлено',
    'failed': 'Ошибка',
    
    // Notifications
    'mark-as-read': 'Отметить как прочитанное',
    'mark-all-as-read': 'Отметить все как прочитанные',
    'no-notifications': 'Нет уведомлений',
    'new-notification': 'Новое уведомление',
    
    // Time & Dates
    'just-now': 'Только что',
    'minutes-ago': 'минут назад',
    'hours-ago': 'часов назад',
    'days-ago': 'дней назад',
    'weeks-ago': 'недель назад',
    'months-ago': 'месяцев назад',
    
    // Tooltips & Help
    'click-to-select': 'Нажмите для выбора',
    'drag-to-reorder': 'Перетащите для изменения порядка',
    'double-click-to-edit': 'Двойной клик для редактирования',
    'right-click-for-options': 'Правый клик для опций'
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
    refresh: 'Refresh',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    export: 'Export',
    import: 'Import',
    
    // Auth
    login: 'Login',
    logout: 'Logout',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    'confirm-password': 'Confirm Password',
    'forgot-password': 'Forgot Password?',
    'remember-me': 'Remember Me',
    
    // Dashboard
    'total-channels': 'Total Channels',
    'total-posts': 'Total Posts',
    'total-views': 'Total Views',
    'total-subscribers': 'Total Subscribers',
    'total-reach': 'Total Reach',
    'average-engagement': 'Average Engagement',
    'overview': 'Overview of all channels',
    'overview-for-channel': 'Channel overview',
    'recent-posts': 'Recent Posts',
    'no-recent-posts': 'No recent posts',
    'no-scheduled-posts-for-channel': 'No scheduled posts for this channel',
    'no-channel-selected': 'No channel selected',
    'select-channel-to-view-dashboard': 'Select a channel to view analytics',
    'view-all-posts': 'View All Posts',
    'view-all-requests': 'View All Requests',
    'posts-this-month': 'Posts This Month',
    'engagement-rate': 'Engagement Rate',
    'revenue': 'Revenue',
    'switching-channel': 'Switching channel...',
    
    // Channel Management
    'add-channel': 'Add Channel',
    'channel-name': 'Channel Name',
    'channel-username': 'Channel Username',
    'channel-description': 'Channel Description',
    'channel-url': 'Channel URL',
    'channel-info': 'Channel Info',
    'channel-details': 'Channel Details',
    'no-channels': 'No Channels',
    'active-channel': 'Active Channel',
    subscribers: 'Subscribers',
    'owner': 'Owner',
    'country': 'Country',
    'russia': 'Russia',
    'created-at': 'Created',
    'last-activity': 'Last Activity',
    'channel-type': 'Channel Type',
    'public-channel': 'Public Channel',
    'private-channel': 'Private Channel',
    'total': 'Total',
    
    // Settings
    'system-settings': 'System Settings',
    'interface-language': 'Interface Language',
    'select-language': 'Select Language',
    'russian': 'Русский',
    'english': 'English',
    'supabase-description': 'Supabase database connection is active and working correctly.',
    'connected-to-supabase': 'Connected to Supabase',
    'appearance': 'Appearance',
    'theme': 'Theme',
    'light-theme': 'Light Theme',
    'dark-theme': 'Dark Theme',
    'auto-theme': 'Auto',
    
    // Profile
    account: 'Account',
    'personal-info': 'Personal Info',
    'change-password': 'Change Password',
    'account-settings': 'Account Settings',
    
    // Post types
    'text-post': 'Text Post',
    'media-post': 'Media Post',
    'poll-post': 'Poll',
    'photo-post': 'Photo',
    'video-post': 'Video',
    'audio-post': 'Audio',
    'document-post': 'Document',
    'location-post': 'Location',
    'contact-post': 'Contact',
    'sticker-post': 'Sticker',
    'animation-post': 'Animation',
    'voice-post': 'Voice Message',
    'video-note-post': 'Video Note',
    
    // Partners & Campaigns
    'create-post': 'Create Post',
    'edit-post': 'Edit Post',
    'schedule': 'Schedule',
    'publish': 'Publish',
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
    'partner-requests': 'Partner Requests',
    'pending-requests': 'Pending Requests',
    'no-pending-requests': 'No pending requests',
    'accept': 'Accept',
    'decline': 'Decline',
    'revenue-by-partner': 'Revenue by Partner',
    
    // Scheduler
    'scheduled-posts': 'Scheduled Posts',
    'upcoming-posts-for': 'Upcoming posts for',
    'calendar-view': 'Calendar View',
    'list-view': 'List View',
    'today': 'Today',
    'tomorrow': 'Tomorrow',
    'this-week': 'This Week',
    'next-week': 'Next Week',
    
    // Analytics
    'analytics-overview': 'Analytics Overview',
    'views': 'Views',
    'likes': 'Likes',
    'shares': 'Shares',
    'comments': 'Comments',
    'click-through-rate': 'CTR',
    'reach': 'Reach',
    'impressions': 'Impressions',
    'growth-rate': 'Growth Rate',
    'top-performing-posts': 'Top Performing Posts',
    'audience-insights': 'Audience Insights',
    
    // Statuses
    'active': 'Active',
    'pending': 'Pending',
    'inactive': 'Inactive',
    'approved': 'Approved',
    'rejected': 'Rejected',
    'draft': 'Draft',
    'published': 'Published',
    'scheduled': 'Scheduled',
    'sent': 'Sent',
    'failed': 'Failed',
    
    // Notifications
    'mark-as-read': 'Mark as Read',
    'mark-all-as-read': 'Mark All as Read',
    'no-notifications': 'No Notifications',
    'new-notification': 'New Notification',
    
    // Time & Dates
    'just-now': 'Just now',
    'minutes-ago': 'minutes ago',
    'hours-ago': 'hours ago',
    'days-ago': 'days ago',
    'weeks-ago': 'weeks ago',
    'months-ago': 'months ago',
    
    // Tooltips & Help
    'click-to-select': 'Click to select',
    'drag-to-reorder': 'Drag to reorder',
    'double-click-to-edit': 'Double click to edit',
    'right-click-for-options': 'Right click for options'
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
