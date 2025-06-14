
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TelegramBot {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  supports_inline_queries: boolean;
}

interface ChatMember {
  status: string;
  user: {
    id: number;
    is_bot: boolean;
    first_name: string;
    username?: string;
  };
}

interface Chat {
  id: number;
  type: string;
  title?: string;
  username?: string;
  description?: string;
  invite_link?: string;
  pinned_message?: any;
  permissions?: any;
  slow_mode_delay?: number;
  message_auto_delete_time?: number;
  has_protected_content?: boolean;
  sticker_set_name?: string;
  can_set_sticker_set?: boolean;
  linked_chat_id?: number;
  location?: any;
}

interface ChatMemberCount {
  ok: boolean;
  result: number;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const authHeader = req.headers.get('Authorization')!
    const token = authHeader.replace('Bearer ', '')
    const { data: { user } } = await supabaseClient.auth.getUser(token)

    if (!user) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders })
    }

    const { action, chatId, username, text } = await req.json()
    const botToken = Deno.env.get('TELEGRAM_BOT_TOKEN')

    if (!botToken) {
      return new Response('Bot token not configured', { status: 500, headers: corsHeaders })
    }

    const telegramApiBase = `https://api.telegram.org/bot${botToken}`

    if (action === 'getMe') {
      const response = await fetch(`${telegramApiBase}/getMe`)
      const data = await response.json()
      
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'getChat') {
      if (!chatId && !username) {
        return new Response('Chat ID or username required', { status: 400, headers: corsHeaders })
      }

      const chatIdentifier = chatId || username
      const response = await fetch(`${telegramApiBase}/getChat?chat_id=${chatIdentifier}`)
      const data = await response.json()

      if (data.ok && data.result.photo?.big_file_id) {
        const fileResponse = await fetch(`${telegramApiBase}/getFile?file_id=${data.result.photo.big_file_id}`)
        const fileData = await fileResponse.json()
        if (fileData.ok) {
          data.result.avatar_url = `https://api.telegram.org/file/bot${botToken}/${fileData.result.file_path}`
        }
      }

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: data.ok ? 200 : 400
      })
    }
    
    if (action === 'sendMessage') {
      if (!chatId || !text) {
          return new Response('Chat ID and text required', { status: 400, headers: corsHeaders })
      }

      const response = await fetch(`${telegramApiBase}/sendMessage`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: 'Markdown' }),
      })
      const data = await response.json()

      return new Response(JSON.stringify(data), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: data.ok ? 200 : 400
      })
    }

    if (action === 'getChatMemberCount') {
      if (!chatId && !username) {
        return new Response('Chat ID or username required', { status: 400, headers: corsHeaders })
      }

      const chatIdentifier = chatId || username
      const response = await fetch(`${telegramApiBase}/getChatMemberCount?chat_id=${chatIdentifier}`)
      const data: ChatMemberCount = await response.json()

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    if (action === 'getChatMember') {
      if (!chatId && !username) {
        return new Response('Chat ID or username required', { status: 400, headers: corsHeaders })
      }

      // Get bot info first
      const botResponse = await fetch(`${telegramApiBase}/getMe`)
      const botData = await botResponse.json()
      
      if (!botData.ok) {
        return new Response('Failed to get bot info', { status: 500, headers: corsHeaders })
      }

      const botId = botData.result.id
      const chatIdentifier = chatId || username
      
      const response = await fetch(`${telegramApiBase}/getChatMember?chat_id=${chatIdentifier}&user_id=${botId}`)
      const data = await response.json()

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response('Invalid action', { status: 400, headers: corsHeaders })

  } catch (error) {
    console.error('Error:', error)
    return new Response('Internal server error', { status: 500, headers: corsHeaders })
  }
})
