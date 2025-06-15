
-- Добавляем поле timezone в таблицу telegram_channels
ALTER TABLE telegram_channels 
ADD COLUMN timezone TEXT DEFAULT 'Europe/Moscow';

-- Обновляем существующие записи, устанавливая значение по умолчанию
UPDATE telegram_channels 
SET timezone = 'Europe/Moscow' 
WHERE timezone IS NULL;

-- Добавляем NOT NULL ограничение
ALTER TABLE telegram_channels 
ALTER COLUMN timezone SET NOT NULL;
