
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      console.error("[generate-with-ai] OPENAI_API_KEY not found");
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { prompt } = await req.json();
    console.log("[generate-with-ai] Received prompt:", prompt);
    
    if (!prompt) {
      return new Response(
        JSON.stringify({ error: "Prompt is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[generate-with-ai] Calling OpenAI API...");
    const aiResp = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Ты полезный AI-ассистент, который помогает с созданием контента для Telegram каналов. Отвечай на русском языке." },
          { role: "user", content: prompt }
        ],
        max_tokens: 1000,
        temperature: 0.7
      }),
    });

    if (!aiResp.ok) {
      const errText = await aiResp.text();
      console.error("[generate-with-ai] OpenAI API error:", errText);
      return new Response(
        JSON.stringify({ error: "OpenAI API error: " + errText }),
        { status: aiResp.status, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await aiResp.json();
    const generatedText = data.choices?.[0]?.message?.content || "";
    
    console.log("[generate-with-ai] Generated text:", generatedText);
    
    return new Response(
      JSON.stringify({ generatedText }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[generate-with-ai] Server error:", error);
    return new Response(
      JSON.stringify({ error: "AI generation failed: " + (error?.message || error) }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
