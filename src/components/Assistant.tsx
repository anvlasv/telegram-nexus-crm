
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

export const Assistant: React.FC = () => {
  const { t } = useLanguage();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{id: string, role: 'user' | 'assistant', content: string}>>([]);

  const assistantFeatures = [
    {
      icon: PenTool,
      title: t('content-generation'),
      description: t('content-generation-desc'),
      action: t('generate-post'),
    },
    {
      icon: Image,
      title: t('image-generation'),
      description: t('image-generation-desc'),
      action: t('create-image'),
    },
    {
      icon: TrendingUp,
      title: t('analytics-insights'),
      description: t('analytics-insights-desc'),
      action: t('analyze-data'),
    },
    {
      icon: Calendar,
      title: t('schedule-optimization'),
      description: t('schedule-optimization-desc'),
      action: t('optimize-schedule'),
    },
  ];

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      role: 'user' as const,
      content: message
    };
    
    setChatHistory(prev => [...prev, newMessage]);
    setMessage('');
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        role: 'assistant' as const,
        content: t('ai-response-placeholder')
      };
      setChatHistory(prev => [...prev, aiResponse]);
    }, 1000);
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
                  <Button variant="outline" size="sm">
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
            </div>
            
            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder={t('type-message')}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} size="icon">
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
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              {t('generate-post-idea')}
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              {t('improve-engagement')}
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              {t('analyze-competitors')}
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              {t('optimize-hashtags')}
            </Badge>
            <Badge variant="secondary" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
              {t('create-content-plan')}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
