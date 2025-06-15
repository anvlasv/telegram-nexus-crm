
import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { PenTool, Image, TrendingUp, Calendar } from 'lucide-react';
import AssistantFeatures from './assistant/AssistantFeatures';
import AssistantChat from './assistant/AssistantChat';
import AssistantQuickActions from './assistant/AssistantQuickActions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { useAssistantAI } from './assistant/useAssistantAI';

export const Assistant: React.FC = () => {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{id: string, role: 'user' | 'assistant', content: string}>>([]);
  const { isLoading, errorMsg, setErrorMsg, callAI, setIsLoading } = useAssistantAI();

  // AI features list
  const assistantFeatures = [
    {
      icon: PenTool,
      title: t('content-generation'),
      description: t('content-generation-desc'),
      action: t('generate-post'),
      onClick: async () => {
        const postPrompt = t('generate-post-idea') + ': ' + t('give-me-a-fresh-post-idea');
        setChatHistory(prev => [
          ...prev,
          { id: `${Date.now()}-user-feature`, role: 'user', content: postPrompt }
        ]);
        setIsLoading(true);
        const aiReply = await callAI(postPrompt);
        if (aiReply !== null) {
          setChatHistory(prev => [
            ...prev,
            { id: `${Date.now()}-ai`, role: 'assistant', content: aiReply || t('ai-response-placeholder') }
          ]);
          setMessage('');
        }
      }
    },
    {
      icon: Image,
      title: t('image-generation'),
      description: t('image-generation-desc'),
      action: t('create-image'),
      onClick: async () => {
        const imagePrompt = t('generate-image-ai');
        setChatHistory(prev => [
          ...prev,
          { id: `${Date.now()}-user-image`, role: 'user', content: imagePrompt }
        ]);
        setIsLoading(true);
        const aiReply = await callAI(imagePrompt);
        if (aiReply !== null) {
          setChatHistory(prev => [
            ...prev,
            { id: `${Date.now()}-ai`, role: 'assistant', content: aiReply || t('ai-response-placeholder') }
          ]);
          setMessage('');
        }
      }
    },
    {
      icon: TrendingUp,
      title: t('analytics-insights'),
      description: t('analytics-insights-desc'),
      action: t('analyze-data'),
      onClick: async () => {
        const analyticsPrompt = t('analytics-insight-prompt') || 'Проанализируй недавние показатели канала и предложи улучшения.';
        setChatHistory(prev => [
          ...prev,
          { id: `${Date.now()}-user-analytics`, role: 'user', content: analyticsPrompt }
        ]);
        setIsLoading(true);
        const aiReply = await callAI(analyticsPrompt);
        if (aiReply !== null) {
          setChatHistory(prev => [
            ...prev,
            { id: `${Date.now()}-ai`, role: 'assistant', content: aiReply || t('ai-response-placeholder') }
          ]);
          setMessage('');
        }
      }
    },
    {
      icon: Calendar,
      title: t('schedule-optimization'),
      description: t('schedule-optimization-desc'),
      action: t('optimize-schedule'),
      onClick: async () => {
        const schedulePrompt = t('schedule-optimization-prompt') || 'Оптимизируй расписание публикаций для максимального вовлечения.';
        setChatHistory(prev => [
          ...prev,
          { id: `${Date.now()}-user-schedule`, role: 'user', content: schedulePrompt }
        ]);
        setIsLoading(true);
        const aiReply = await callAI(schedulePrompt);
        if (aiReply !== null) {
          setChatHistory(prev => [
            ...prev,
            { id: `${Date.now()}-ai`, role: 'assistant', content: aiReply || t('ai-response-placeholder') }
          ]);
          setMessage('');
        }
      }
    },
  ];

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    setChatHistory(prev => [
      ...prev,
      { id: Date.now().toString(), role: 'user', content: message }
    ]);
    setIsLoading(true);
    const aiReply = await callAI(message);
    if (aiReply !== null) {
      setChatHistory(prev => [
        ...prev,
        { id: `${Date.now()}-ai`, role: 'assistant', content: aiReply || t('ai-response-placeholder') }
      ]);
      setMessage('');
    }
  };

  const quickActions = [
    {
      label: t('generate-post-idea'),
      onClick: async () => {
        const quickPrompt = t('generate-post-idea');
        setChatHistory(prev => [
          ...prev,
          { id: `${Date.now()}-user-quick`, role: 'user', content: quickPrompt }
        ]);
        setIsLoading(true);
        const aiReply = await callAI(quickPrompt);
        if (aiReply !== null) {
          setChatHistory(prev => [
            ...prev,
            { id: `${Date.now()}-ai`, role: 'assistant', content: aiReply || t('ai-response-placeholder') }
          ]);
          setMessage('');
        }
      }
    },
    {
      label: t('improve-engagement'),
      onClick: async () => {
        const quickPrompt = t('improve-engagement');
        setChatHistory(prev => [
          ...prev,
          { id: `${Date.now()}-user-quick2`, role: 'user', content: quickPrompt }
        ]);
        setIsLoading(true);
        const aiReply = await callAI(quickPrompt);
        if (aiReply !== null) {
          setChatHistory(prev => [
            ...prev,
            { id: `${Date.now()}-ai`, role: 'assistant', content: aiReply || t('ai-response-placeholder') }
          ]);
          setMessage('');
        }
      }
    },
    {
      label: t('analyze-competitors'),
      onClick: async () => {
        const quickPrompt = t('analyze-competitors');
        setChatHistory(prev => [
          ...prev,
          { id: `${Date.now()}-user-quick3`, role: 'user', content: quickPrompt }
        ]);
        setIsLoading(true);
        const aiReply = await callAI(quickPrompt);
        if (aiReply !== null) {
          setChatHistory(prev => [
            ...prev,
            { id: `${Date.now()}-ai`, role: 'assistant', content: aiReply || t('ai-response-placeholder') }
          ]);
          setMessage('');
        }
      }
    },
    {
      label: t('optimize-hashtags'),
      onClick: async () => {
        const quickPrompt = t('optimize-hashtags');
        setChatHistory(prev => [
          ...prev,
          { id: `${Date.now()}-user-quick4`, role: 'user', content: quickPrompt }
        ]);
        setIsLoading(true);
        const aiReply = await callAI(quickPrompt);
        if (aiReply !== null) {
          setChatHistory(prev => [
            ...prev,
            { id: `${Date.now()}-ai`, role: 'assistant', content: aiReply || t('ai-response-placeholder') }
          ]);
          setMessage('');
        }
      }
    },
    {
      label: t('create-content-plan'),
      onClick: async () => {
        const quickPrompt = t('create-content-plan');
        setChatHistory(prev => [
          ...prev,
          { id: `${Date.now()}-user-quick5`, role: 'user', content: quickPrompt }
        ]);
        setIsLoading(true);
        const aiReply = await callAI(quickPrompt);
        if (aiReply !== null) {
          setChatHistory(prev => [
            ...prev,
            { id: `${Date.now()}-ai`, role: 'assistant', content: aiReply || t('ai-response-placeholder') }
          ]);
          setMessage('');
        }
      }
    }
  ];

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
          onSend={handleSendMessage}
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
