
import { useState } from 'react';

async function generateWithAI(prompt: string): Promise<string> {
  const resp = await fetch('/functions/v1/generate-with-ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });
  if (!resp.ok) {
    let errorText = 'AI generation failed';
    let bodyText = '';
    try {
      bodyText = await resp.text();
      try {
        const data = JSON.parse(bodyText);
        if (data && data.error) {
          errorText = data.error;
        } else {
          errorText = bodyText;
        }
        console.error('[AI Error]', data);
      } catch {
        errorText = bodyText;
        console.error('[AI Error, not JSON]', errorText);
      }
    } catch (e) {
      errorText = (e instanceof Error && e.message) ? e.message : 'AI generation failed';
      console.error('[AI Error, unhandled]', errorText);
    }
    throw new Error(errorText);
  }
  const data = await resp.json();
  return data.generatedText || '';
}

export function useAssistantAI() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const callAI = async (prompt: string) => {
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const text = await generateWithAI(prompt);
      setIsLoading(false);
      return text;
    } catch (e: any) {
      setErrorMsg(e.message || 'AI generation failed');
      setIsLoading(false);
      return null;
    }
  };

  return { isLoading, errorMsg, setErrorMsg, callAI, setIsLoading };
}
