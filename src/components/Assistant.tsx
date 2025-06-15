
import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import AssistantFeatures from './assistant/AssistantFeatures';
import AssistantChat from './assistant/AssistantChat';
import AssistantQuickActions from './assistant/AssistantQuickActions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAssistantChat } from './assistant/useAssistantChat';
import { createAssistantFeatures } from './assistant/assistantFeatures';
import { createQuickActions } from './assistant/quickActionsConfig';

export const Assistant: React.FC = () => {
  const { t } = useLanguage();
  const {
    message,
    setMessage,
    chatHistory,
    isLoading,
    errorMsg,
    sendMessage,
    handleSendMessage
  } = useAssistantChat();

  const assistantFeatures = createAssistantFeatures(sendMessage, t);
  const quickActions = createQuickActions(sendMessage, t);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('assistant')}</h1>
        <p className="text-muted-foreground">{t('assistant-description')}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <AssistantFeatures assistantFeatures={assistantFeatures} />
        <AssistantChat
          chatHistory={chatHistory}
          isLoading={isLoading}
          errorMsg={errorMsg}
          message={message}
          setMessage={setMessage}
          onSend={() => handleSendMessage(t)}
          t={t}
        />
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t('quick-actions')}</CardTitle>
          <CardDescription>{t('quick-actions-description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <AssistantQuickActions quickActions={quickActions} t={t} />
        </CardContent>
      </Card>
    </div>
  );
};
