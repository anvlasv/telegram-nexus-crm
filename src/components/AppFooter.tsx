
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export const AppFooter: React.FC = () => {
  const { language } = useLanguage();

  return (
    <footer className="app-footer">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div>
          © 2024 Telegram Nexus CRM
        </div>
        <div className="flex items-center gap-4">
          <span>v1.0.0</span>
          <span>
            {language === 'ru' ? 'Сделано с ❤️' : 'Made with ❤️'}
          </span>
        </div>
      </div>
    </footer>
  );
};
