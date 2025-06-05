
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
    'upcoming-posts': 'Предстоящие посты',
    'partner-requests': 'Запросы партнеров',
    'pending-requests': 'Ожидающие запросы на рекламу',
    'view-all-posts': 'Посмотреть все посты',
    'view-all-requests': 'Посмотреть все запросы',
    'accept': 'Принять',
    'decline': 'Отклонить',
    'channels-on-platform': 'каналов на платформе',
    'across-all-channels': 'по всем каналам',
    'since-last-month': 'с прошлого месяца',
    'recent-activity': 'Последняя активность',
    'latest-activities-on-channels': 'Последние действия в каналах',
    'new-post-published': 'Опубликован новый пост',
    'subscriber-joined': 'Присоединился подписчик',
    'increased-engagement': 'Повышенная вовлеченность',
    
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
    'telegram-integration': 'Интеграция Telegram',
    'telegram-description': 'Настройки для работы с Telegram API',
    'telegram-status': 'Статус подключения',
    'theme-settings': 'Настройки темы',
    'dark-theme': 'Темная тема',
    'theme-description': 'Переключение между светлой и темной темой',
    'profile': 'Профиль',
    'profile-description': 'Управление личными данными и настройками профиля',
    'profile-settings-text': 'Настройте свой профиль, изменяйте личные данные и управляйте своей учетной записью.',
    'security': 'Безопасность',
    'security-description': 'Настройки безопасности и доступа',
    'security-settings-text': 'Управляйте паролями, двухфакторной аутентификацией и другими настройками безопасности.',
    'appearance': 'Внешний вид',
    'appearance-description': 'Настройки темы и отображения',
    'appearance-settings-text': 'Настройте тему, цвета и другие параметры отображения интерфейса.',
    'general-settings': 'Общие настройки',
    'general-description': 'Основные настройки приложения',
    'general-settings-text': 'Настройте язык, часовой пояс и другие общие параметры приложения.',
    
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
    'total-likes': 'Всего лайков',
    'from-last-month': 'с прошлого месяца',
    'views-over-time': 'Просмотры за период',
    'views-description': 'Динамика просмотров ваших постов',
    
    // Scheduler
    'scheduler-description': 'Планирование и автоматическая публикация постов',
    'no-upcoming-posts': 'Нет предстоящих постов',
    'no-scheduled-posts': 'Нет запланированных постов',
    'post-templates': 'Шаблоны постов',
    'no-post-templates': 'Нет шаблонов постов',
    
    // Partners
    'partners-description': 'Управление партнерскими отношениями',
    'partnerships': 'Партнерства',
    'active-partnerships': 'Активные партнерства',
    'new-requests': 'Новые запросы',
    'pending-partnership-requests': 'Ожидающие запросы о партнерстве',
    'generated-revenue-from-partners': 'Доход от партнеров',
    
    // Marketplace
    'marketplace-description': 'Маркетплейс для покупки и продажи рекламы',
    'ads': 'Реклама',
    'buy-ads': 'Покупка рекламы',
    'buy-ads-description': 'Покупайте рекламные места в каналах',
    'sales': 'Продажи',
    'sell-ads': 'Продажа рекламы',
    'sell-ads-description': 'Продавайте рекламные места в своих каналах',
    'find-partners': 'Поиск партнеров',
    'find-partners-description': 'Находите партнеров для взаимовыгодного сотрудничества',
    
    // Notifications
    'notifications-description': 'Уведомления и оповещения системы',
    'system-notification': 'Системное уведомление',
    'important-system-message': 'Важное сообщение от системы',
    'security-update-text': 'Обновление безопасности: Пожалуйста, обновите приложение до последней версии.',
    'successful-action': 'Успешное действие',
    'operation-confirmation': 'Подтверждение выполнения операции',
    'channel-connected-text': 'Канал "Мой канал" успешно подключен к системе.',
    'new-notification': 'Новое уведомление',
    'new-features-info': 'Информация о новых возможностях',
    'ai-assistant-intro': 'Представляем AI-ассистента для автоматизации контента.',
    
    // Assistant
    'assistant-description': 'AI-помощник для управления контентом',
    'ai-suggestions': 'Предложения ИИ',
    'content-ideas': 'Идеи для контента',
    'generate-ideas': 'Генерировать идеи для постов',
    'analytics-insights': 'Аналитические инсайты',
    'performance-analysis': 'Анализ производительности',
    'get-insights': 'Получить инсайты по вашим каналам',
    'auto-responses': 'Автоответы',
    'smart-replies': 'Умные ответы',
    'setup-auto-replies': 'Настроить автоматические ответы',
    
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
    
    // Assistant
    'assistant': 'Ассистент',
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
    'upcoming-posts': 'Upcoming Posts',
    'partner-requests': 'Partner Requests',
    'pending-requests': 'Pending advertising requests',
    'view-all-posts': 'View All Posts',
    'view-all-requests': 'View All Requests',
    'accept': 'Accept',
    'decline': 'Decline',
    'channels-on-platform': 'channels on platform',
    'across-all-channels': 'across all channels',
    'since-last-month': 'since last month',
    'recent-activity': 'Recent Activity',
    'latest-activities-on-channels': 'Latest activities on your channels',
    'new-post-published': 'New post published',
    'subscriber-joined': 'Subscriber joined',
    'increased-engagement': 'Increased engagement',
    
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
    'telegram-integration': 'Telegram Integration',
    'telegram-description': 'Settings for Telegram API integration',
    'telegram-status': 'Connection Status',
    'theme-settings': 'Theme Settings',
    'dark-theme': 'Dark Theme',
    'theme-description': 'Switch between light and dark themes',
    'profile': 'Profile',
    'profile-description': 'Manage personal data and profile settings',
    'profile-settings-text': 'Configure your profile, change personal data and manage your account.',
    'security': 'Security',
    'security-description': 'Security and access settings',
    'security-settings-text': 'Manage passwords, two-factor authentication and other security settings.',
    'appearance': 'Appearance',
    'appearance-description': 'Theme and display settings',
    'appearance-settings-text': 'Configure theme, colors and other interface display parameters.',
    'general-settings': 'General Settings',
    'general-description': 'Basic application settings',
    'general-settings-text': 'Configure language, timezone and other general application parameters.',
    
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
    'total-likes': 'Total Likes',
    'from-last-month': 'from last month',
    'views-over-time': 'Views Over Time',
    'views-description': 'Dynamics of your posts views',
    
    // Scheduler
    'scheduler-description': 'Schedule and automatically publish posts',
    'no-upcoming-posts': 'No upcoming posts',
    'no-scheduled-posts': 'No scheduled posts',
    'post-templates': 'Post Templates',
    'no-post-templates': 'No post templates',
    
    // Partners
    'partners-description': 'Manage partnership relationships',
    'partnerships': 'Partnerships',
    'active-partnerships': 'Active partnerships',
    'new-requests': 'New Requests',
    'pending-partnership-requests': 'Pending partnership requests',
    'generated-revenue-from-partners': 'Revenue generated from partners',
    
    // Marketplace
    'marketplace-description': 'Marketplace for buying and selling ads',
    'ads': 'Ads',
    'buy-ads': 'Buy Ads',
    'buy-ads-description': 'Buy advertising space in channels',
    'sales': 'Sales',
    'sell-ads': 'Sell Ads',
    'sell-ads-description': 'Sell advertising space in your channels',
    'find-partners': 'Find Partners',
    'find-partners-description': 'Find partners for mutually beneficial cooperation',
    
    // Notifications
    'notifications-description': 'System notifications and alerts',
    'system-notification': 'System Notification',
    'important-system-message': 'Important system message',
    'security-update-text': 'Security update: Please update the app to the latest version.',
    'successful-action': 'Successful Action',
    'operation-confirmation': 'Operation confirmation',
    'channel-connected-text': 'Channel "My Channel" successfully connected to the system.',
    'new-notification': 'New Notification',
    'new-features-info': 'Information about new features',
    'ai-assistant-intro': 'Introducing AI assistant for content automation.',
    
    // Assistant
    'assistant-description': 'AI assistant for content management',
    'ai-suggestions': 'AI Suggestions',
    'content-ideas': 'Content Ideas',
    'generate-ideas': 'Generate post ideas',
    'analytics-insights': 'Analytics Insights',
    'performance-analysis': 'Performance analysis',
    'get-insights': 'Get insights about your channels',
    'auto-responses': 'Auto Responses',
    'smart-replies': 'Smart replies',
    'setup-auto-replies': 'Setup automatic replies',
    
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
    
    // Assistant
    'assistant': 'Assistant',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('ru');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['ru']] || key;
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
