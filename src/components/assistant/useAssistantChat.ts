
import { useState } from 'react';
import { useAssistantAI } from './useAssistantAI';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export const useAssistantChat = () => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const { isLoading, errorMsg, setErrorMsg, callAI, setIsLoading } = useAssistantAI();

  const addUserMessage = (content: string) => {
    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      content
    };
    setChatHistory(prev => [...prev, userMessage]);
  };

  const addAIMessage = (content: string) => {
    const aiMessage: ChatMessage = {
      id: `${Date.now()}-ai`,
      role: 'assistant',
      content
    };
    setChatHistory(prev => [...prev, aiMessage]);
  };

  const sendMessage = async (prompt: string, t: (key: string) => string) => {
    if (!prompt.trim()) return;
    
    addUserMessage(prompt);
    setIsLoading(true);
    
    const aiReply = await callAI(prompt);
    if (aiReply !== null) {
      addAIMessage(aiReply || t('ai-response-placeholder'));
      if (prompt === message) {
        setMessage('');
      }
    }
  };

  const handleSendMessage = async (t: (key: string) => string) => {
    await sendMessage(message, t);
  };

  return {
    message,
    setMessage,
    chatHistory,
    isLoading,
    errorMsg,
    sendMessage,
    handleSendMessage
  };
};
