
// Telegram Web App script - загружается автоматически внутри Telegram
(function() {
  if (window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;
    
    // Инициализация приложения
    tg.ready();
    tg.expand();
    
    // Настройка темы
    if (tg.colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
    }
    
    // Настройка главной кнопки
    tg.MainButton.setText('Готово');
    tg.MainButton.hide();
    
    // Обработка кнопки "Назад"
    tg.BackButton.onClick(function() {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        tg.close();
      }
    });
    
    console.log('Telegram Web App инициализирован:', {
      version: tg.version,
      platform: tg.platform,
      user: tg.initDataUnsafe?.user
    });
  }
})();
