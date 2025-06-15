
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  MessageSquare, 
  PenTool, 
  Image, 
  TrendingUp, 
  Calendar,
  Send,
  Sparkles
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMutation } from '@tanstack/react-query';

async function generateWithAI(prompt: string): Promise<string> {
  const resp = await fetch('/functions/v1/generate-with-ai', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt }),
  });
  if (!resp.ok) {
    const data = await resp.json().catch(() => ({}));
    throw new Error(data.error || 'AI generation failed');
  }
  const data = await resp.json();
  return data.generatedText || '';
}

export const Assistant: React.FC = () => {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{id: string, role: 'user' | 'assistant', content: string}>>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const aiMutation = useMutation({
    mutationFn: async (prompt: string) => {
      setErrorMsg(null);
      return await generateWithAI(prompt);
    },
    onSuccess: (aiReply: string) => {
      setChatHistory(prev => [
        ...prev,
        {
          id: `${Date.now()}-ai`,
          role: 'assistant',
          content: aiReply || t('ai-response-placeholder'),
        }
      ]);
      setIsLoading(false);
      setMessage('');
    },
    onError: (err: any) => {
      setErrorMsg(err instanceof Error ? err.message : 'AI error');
      setIsLoading(false);
    }
  });

  const assistantFeatures = [
    {
      icon: PenTool,
      title: t('content-generation'),
      description: t('content-generation-desc'),
      action: t('generate-post'),
      onClick: () => {
        // Пример prompt для генерации поста
        const postPrompt = t('generate-post-idea') + ': ' + t('give-me-a-fresh-post-idea');
        setChatHistory(prev => [
          ...prev,
          {
            id: `${Date.now()}-user-feature`,
            role: 'user',
            content: postPrompt,
          }
        ]);
        setIsLoading(true);
        aiMutation.mutate(postPrompt);
      }
    },
    {
      icon: Image,
      title: t('image-generation'),
      description: t('image-generation-desc'),
      action: t('create-image'),
      onClick: () => {
        const imagePrompt = t('generate-image-ai');
        setChatHistory(prev => [
          ...prev,
          {
            id: `${Date.now()}-user-image`,
            role: 'user',
            content: imagePrompt,
          }
        ]);
        setIsLoading(true);
        aiMutation.mutate(imagePrompt);
      }
    },
    {
      icon: TrendingUp,
      title: t('analytics-insights'),
      description: t('analytics-insights-desc'),
      action: t('analyze-data'),
      onClick: () => {
        const analyticsPrompt = t('analytics-insight-prompt') || 'Проанализируй недавние показатели канала и предложи улучшения.';
        setChatHistory(prev => [
          ...prev,
          {
            id: `${Date.now()}-user-analytics`,
            role: 'user',
            content: analyticsPrompt,
          }
        ]);
        setIsLoading(true);
        aiMutation.mutate(analyticsPrompt);
      }
    },
    {
      icon: Calendar,
      title: t('schedule-optimization'),
      description: t('schedule-optimization-desc'),
      action: t('optimize-schedule'),
      onClick: () => {
        const schedulePrompt = t('schedule-optimization-prompt') || 'Оптимизируй расписание публикаций для максимального вовлечения.';
        setChatHistory(prev => [
          ...prev,
          {
            id: `${Date.now()}-user-schedule`,
            role: 'user',
            content: schedulePrompt,
          }
        ]);
        setIsLoading(true);
        aiMutation.mutate(schedulePrompt);
      }
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setChatHistory(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'user',
        content: message,
      }
    ]);
    setIsLoading(true);
    aiMutation.mutate(message);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('assistant')}</h1>
        <p className="text-muted-foreground">{t('assistant-description')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* AI Features */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            {t('ai-features')}
          </h2>
          <div className="grid gap-4">
            {assistantFeatures.map((feature, index) => (
              <Card key={index} className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                    {feature.title}
                  </CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" size="sm" onClick={feature.onClick}>
                    {feature.action}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <Card className="flex flex-col h-[600px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-primary" />
              {t('ai-chat')}
            </CardTitle>
            <CardDescription>{t('ai-chat-description')}</CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 flex flex-col">
            {/* Chat History */}
            <div className="flex-1 space-y-4 mb-4 overflow-y-auto">
              {chatHistory.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>{t('start-conversation')}</p>
                  </div>
                </div>
              ) : (
                chatHistory.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 ${
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-3 py-2 bg-muted text-muted-foreground animate-pulse">
                    {t('ai-typing') || 'AI печатает...'}
                  </div>
                </div>
              )}
              {errorMsg && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] rounded-lg px-3 py-2 bg-destructive/10 text-destructive">
                    {errorMsg}
                  </div>
                </div>
              )}
            </div>
            
            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder={t('type-message')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                className="flex-1"
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} size="icon" disabled={isLoading}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('quick-actions')}</CardTitle>
          <CardDescription>{t('quick-actions-description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={() => {
              const quickPrompt = t('generate-post-idea');
              setChatHistory(prev => [
                ...prev,
                {
                  id: `${Date.now()}-user-quick`,
                  role: 'user',
                  content: quickPrompt,
                }
              ]);
              setIsLoading(true);
              aiMutation.mutate(quickPrompt);
            }}>
              {t('generate-post-idea')}
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={() => {
              const quickPrompt = t('improve-engagement');
              setChatHistory(prev => [
                ...prev,
                {
                  id: `${Date.now()}-user-quick2`,
                  role: 'user',
                  content: quickPrompt,
                }
              ]);
              setIsLoading(true);
              aiMutation.mutate(quickPrompt);
            }}>
              {t('improve-engagement')}
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={() => {
              const quickPrompt = t('analyze-competitors');
              setChatHistory(prev => [
                ...prev,
                {
                  id: `${Date.now()}-user-quick3`,
                  role: 'user',
                  content: quickPrompt,
                }
              ]);
              setIsLoading(true);
              aiMutation.mutate(quickPrompt);
            }}>
              {t('analyze-competitors')}
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={() => {
              const quickPrompt = t('optimize-hashtags');
              setChatHistory(prev => [
                ...prev,
                {
                  id: `${Date.now()}-user-quick4`,
                  role: 'user',
                  content: quickPrompt,
                }
              ]);
              setIsLoading(true);
              aiMutation.mutate(quickPrompt);
            }}>
              {t('optimize-hashtags')}
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground" onClick={() => {
              const quickPrompt = t('create-content-plan');
              setChatHistory(prev => [
                ...prev,
                {
                  id: `${Date.now()}-user-quick5`,
                  role: 'user',
                  content: quickPrompt,
                }
              ]);
              setIsLoading(true);
              aiMutation.mutate(quickPrompt);
            }}>
              {t('create-content-plan')}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
// ... остальные импорты/экспорт как были
