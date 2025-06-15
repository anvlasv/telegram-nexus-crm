
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MessageSquare, Bot, Send } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface AssistantChatProps {
  chatHistory: ChatMessage[];
  isLoading: boolean;
  errorMsg: string | null;
  message: string;
  setMessage: (val: string) => void;
  onSend: () => void;
  t: (x: string) => string;
}

const AssistantChat: React.FC<AssistantChatProps> = ({
  chatHistory, isLoading, errorMsg, message, setMessage, onSend, t
}) => (
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
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && onSend()}
          className="flex-1"
          disabled={isLoading}
        />
        <Button onClick={onSend} size="icon" disabled={isLoading}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </CardContent>
  </Card>
);

export default AssistantChat;
