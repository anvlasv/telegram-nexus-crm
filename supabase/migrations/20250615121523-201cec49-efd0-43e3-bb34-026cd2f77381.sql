
-- Включаем необходимые расширения для cron-задач
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Создаем cron-задачу для автоматической публикации постов (проверяет каждую минуту)
SELECT cron.schedule(
  'auto-publish-posts',
  '* * * * *', -- каждую минуту
  $$
  SELECT
    net.http_post(
        url:='https://upirwcmwofvmjsqdqorj.supabase.co/functions/v1/auto-publish-posts',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwaXJ3Y213b2Z2bWpzcWRxb3JqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4OTAxMTYsImV4cCI6MjA2NDQ2NjExNn0.TLDJdYHZKVA8Zjv8-UITJNGimIdZ4oCVHz4bNdMWw9U"}'::jsonb,
        body:='{"trigger": "cron"}'::jsonb
    ) as request_id;
  $$
);
