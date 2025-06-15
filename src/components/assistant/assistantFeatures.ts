
import { PenTool, Image, TrendingUp, Calendar } from 'lucide-react';

export const createAssistantFeatures = (
  sendMessage: (prompt: string, t: (key: string) => string) => Promise<void>,
  t: (key: string) => string
) => [
  {
    icon: PenTool,
    title: t('content-generation'),
    description: t('content-generation-desc'),
    action: t('generate-post'),
    onClick: async () => {
      const postPrompt = t('generate-post-idea') + ': ' + t('give-me-a-fresh-post-idea');
      await sendMessage(postPrompt, t);
    }
  },
  {
    icon: Image,
    title: t('image-generation'),
    description: t('image-generation-desc'),
    action: t('create-image'),
    onClick: async () => {
      const imagePrompt = t('generate-image-ai');
      await sendMessage(imagePrompt, t);
    }
  },
  {
    icon: TrendingUp,
    title: t('analytics-insights'),
    description: t('analytics-insights-desc'),
    action: t('analyze-data'),
    onClick: async () => {
      const analyticsPrompt = t('analytics-insight-prompt') || 'Проанализируй недавние показатели канала и предложи улучшения.';
      await sendMessage(analyticsPrompt, t);
    }
  },
  {
    icon: Calendar,
    title: t('schedule-optimization'),
    description: t('schedule-optimization-desc'),
    action: t('optimize-schedule'),
    onClick: async () => {
      const schedulePrompt = t('schedule-optimization-prompt') || 'Оптимизируй расписание публикаций для максимального вовлечения.';
      await sendMessage(schedulePrompt, t);
    }
  },
];
