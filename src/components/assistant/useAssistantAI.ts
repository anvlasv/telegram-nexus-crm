
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useAssistantAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const callAI = async (prompt: string) => {
    setErrorMsg(null);
    setIsLoading(true);
    
    try {
      console.log('[AI] Calling with prompt:', prompt);
      
      const { data, error } = await supabase.functions.invoke('generate-with-ai', {
        body: { prompt },
      });

      if (error) {
        console.error('[AI] Supabase function error:', error);
        setErrorMsg(error.message || 'AI generation failed');
        setIsLoading(false);
        return null;
      }

      if (!data || !data.generatedText) {
        console.error('[AI] No generated text in response:', data);
        setErrorMsg('No response from AI');
        setIsLoading(false);
        return null;
      }

      console.log('[AI] Success:', data.generatedText);
      setIsLoading(false);
      return data.generatedText;
    } catch (e: any) {
      console.error('[AI] Unexpected error:', e);
      setErrorMsg(e.message || 'AI generation failed');
      setIsLoading(false);
      return null;
    }
  };

  return { isLoading, errorMsg, setErrorMsg, callAI, setIsLoading };
}
