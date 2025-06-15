
export const createQuickActions = (
  sendMessage: (prompt: string, t: (key: string) => string) => Promise<void>,
  t: (key: string) => string
) => [
  {
    label: t('generate-post-idea'),
    onClick: async () => {
      const quickPrompt = t('generate-post-idea');
      await sendMessage(quickPrompt, t);
    }
  },
  {
    label: t('improve-engagement'),
    onClick: async () => {
      const quickPrompt = t('improve-engagement');
      await sendMessage(quickPrompt, t);
    }
  },
  {
    label: t('analyze-competitors'),
    onClick: async () => {
      const quickPrompt = t('analyze-competitors');
      await sendMessage(quickPrompt, t);
    }
  },
  {
    label: t('optimize-hashtags'),
    onClick: async () => {
      const quickPrompt = t('optimize-hashtags');
      await sendMessage(quickPrompt, t);
    }
  },
  {
    label: t('create-content-plan'),
    onClick: async () => {
      const quickPrompt = t('create-content-plan');
      await sendMessage(quickPrompt, t);
    }
  }
];
