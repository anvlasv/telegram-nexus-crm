
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        initData: string;
        initDataUnsafe: any;
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark';
        themeParams: any;
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        BackButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isProgressVisible: boolean;
          isActive: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        sendData: (data: string) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        showPopup: (params: any, callback?: () => void) => void;
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
      };
    };
  }
}

export const useTelegram = () => {
  const [webApp, setWebApp] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [isInTelegram, setIsInTelegram] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  useEffect(() => {
    const app = window.Telegram?.WebApp;
    if (app) {
      app.ready();
      app.expand();
      setWebApp(app);
      setUser(app.initDataUnsafe?.user);
      setIsInTelegram(true);
      
      // Настройка темы
      const isDark = app.colorScheme === 'dark';
      setIsDarkTheme(isDark);
      
      // Применение темы ко всему документу
      if (isDark) {
        document.documentElement.classList.add('dark');
        // Настройка цветов для темной темы Telegram
        app.setHeaderColor('#111827');
        app.setBackgroundColor('#111827');
      } else {
        document.documentElement.classList.remove('dark');
        // Настройка цветов для светлой темы Telegram
        app.setHeaderColor('#ffffff');
        app.setBackgroundColor('#f9fafb');
      }

      // Применение CSS переменных из Telegram
      if (app.themeParams) {
        const root = document.documentElement;
        root.style.setProperty('--tg-bg-color', app.themeParams.bg_color || (isDark ? '#111827' : '#ffffff'));
        root.style.setProperty('--tg-text-color', app.themeParams.text_color || (isDark ? '#f3f4f6' : '#111827'));
        root.style.setProperty('--tg-hint-color', app.themeParams.hint_color || (isDark ? '#9ca3af' : '#6b7280'));
        root.style.setProperty('--tg-button-color', app.themeParams.button_color || '#3b82f6');
        root.style.setProperty('--tg-button-text-color', app.themeParams.button_text_color || '#ffffff');
      }
    } else {
      // Проверяем системные настройки темы для веб-версии
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkTheme(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, []);

  const sendData = (data: any) => {
    if (webApp) {
      webApp.sendData(JSON.stringify(data));
    }
  };

  const showAlert = (message: string) => {
    if (webApp) {
      webApp.showAlert(message);
    } else {
      alert(message);
    }
  };

  const showConfirm = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (webApp) {
        webApp.showConfirm(message, (confirmed: boolean) => {
          resolve(confirmed);
        });
      } else {
        resolve(confirm(message));
      }
    });
  };

  const hapticFeedback = (type: 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning' = 'light') => {
    if (webApp?.HapticFeedback) {
      if (type === 'success' || type === 'error' || type === 'warning') {
        webApp.HapticFeedback.notificationOccurred(type);
      } else {
        webApp.HapticFeedback.impactOccurred(type);
      }
    }
  };

  const toggleTheme = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      if (webApp) {
        webApp.setHeaderColor('#111827');
        webApp.setBackgroundColor('#111827');
      }
    } else {
      document.documentElement.classList.remove('dark');
      if (webApp) {
        webApp.setHeaderColor('#ffffff');
        webApp.setBackgroundColor('#f9fafb');
      }
    }
  };

  return {
    webApp,
    user,
    isInTelegram,
    isDarkTheme,
    sendData,
    showAlert,
    showConfirm,
    hapticFeedback,
    toggleTheme,
  };
};
