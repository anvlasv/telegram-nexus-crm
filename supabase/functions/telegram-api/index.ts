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

// Функция для загрузки файла через URL
async function uploadFileFromUrl(botToken: string, fileUrl: string): Promise<string | null> {
  try {
    // Скачиваем файл
    const fileResponse = await fetch(fileUrl)
    if (!fileResponse.ok) {
      console.error('[uploadFileFromUrl] Ошибка скачивания файла:', fileResponse.statusText)
      return null
    }
    
    const fileBlob = await fileResponse.blob()
    const formData = new FormData()
    formData.append('document', fileBlob)
    
    // Загружаем файл в Telegram
    const uploadResponse = await fetch(`https://api.telegram.org/bot${botToken}/uploadStickerFile`, {
      method: 'POST',
      body: formData
    })
    
    const uploadData = await uploadResponse.json()
    if (uploadData.ok) {
      return uploadData.result.file_id
    } else {
      console.error('[uploadFileFromUrl] Ошибка загрузки в Telegram:', uploadData)
      return null
    }
  } catch (error) {
    console.error('[uploadFileFromUrl] Общая ошибка загрузки файла:', error)
    return null
  }
}

// Функция для отправки медиафайлов
async function sendMediaMessage(botToken: string, chatId: string, action: string, text: string, mediaUrls?: string[]) {
  const telegramApiBase = `https://api.telegram.org/bot${botToken}`
  
  if (!mediaUrls || mediaUrls.length === 0) {
    // Если нет медиафайлов, отправляем как обычное сообщение с иконкой
    const iconMap: Record<string, string> = {
      'sendPhoto': '📷',
      'sendVideo': '🎥', 
      'sendAudio': '🎵',
      'sendDocument': '📄'
    }
    
    const icon = iconMap[action] || '📎'
    const messageText = text || 'Медиафайл'
    
    const response = await fetch(`${telegramApiBase}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: chatId, 
        text: `${icon} ${messageText}\n\n[Медиафайлы будут поддерживаться в следующих обновлениях]`,
        parse_mode: 'Markdown' 
      }),
    })
    return await response.json()
  }

  // Если есть медиафайлы, пытаемся их отправить
  try {
    if (mediaUrls.length === 1) {
      // Отправляем один файл
      const mediaUrl = mediaUrls[0]
      
      let endpoint = ''
      let mediaField = ''
      
      switch (action) {
        case 'sendPhoto':
          endpoint = 'sendPhoto'
          mediaField = 'photo'
          break
        case 'sendVideo':
          endpoint = 'sendVideo'
          mediaField = 'video'
          break
        case 'sendAudio':
          endpoint = 'sendAudio'
          mediaField = 'audio'
          break
        case 'sendDocument':
          endpoint = 'sendDocument'
          mediaField = 'document'
          break
        default:
          endpoint = 'sendDocument'
          mediaField = 'document'
      }
      
      const requestBody: any = {
        chat_id: chatId,
        [mediaField]: mediaUrl
      }
      
      if (text) {
        requestBody.caption = text
      }
      
      const response = await fetch(`${telegramApiBase}/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      })
      
      return await response.json()
      
    } else {
      // Отправляем альбом медиафайлов (для фото и документов)
      if (action === 'sendPhoto') {
        const media = mediaUrls.map((url, index) => ({
          type: 'photo',
          media: url,
          caption: index === 0 && text ? text : undefined
        }))
        
        const response = await fetch(`${telegramApiBase}/sendMediaGroup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            media: media
          }),
        })
        
        return await response.json()
      } else {
        // Для других типов отправляем по одному
        const results = []
        for (const [index, mediaUrl] of mediaUrls.entries()) {
          const requestBody: any = {
            chat_id: chatId,
            document: mediaUrl
          }
          
          if (index === 0 && text) {
            requestBody.caption = text
          }
          
          const response = await fetch(`${telegramApiBase}/sendDocument`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
          })
          
          results.push(await response.json())
        }
        return results[0] // Возвращаем результат первого сообщения
      }
    }
  } catch (error) {
    console.error('[sendMediaMessage] Ошибка отправки медиафайлов:', error)
    // Fallback: отправляем как текст с иконкой
    const iconMap: Record<string, string> = {
      'sendPhoto': '📷',
      'sendVideo': '🎥', 
      'sendAudio': '🎵',
      'sendDocument': '📄'
    }
    
    const icon = iconMap[action] || '📎'
    const messageText = text || 'Медиафайл'
    
    const response = await fetch(`${telegramApiBase}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        chat_id: chatId, 
        text: `${icon} ${messageText}\n\n[Ошибка загрузки медиафайла]`,
        parse_mode: 'Markdown' 
      }),
    })
    return await response.json()
  }
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

    const requestBody = await req.json()
    const { action, chatId, username, text, question, options, mediaFiles, mediaUrls } = requestBody
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
        body: JSON.stringify({ 
          chat_id: chatId, 
          text: text, 
          parse_mode: 'Markdown' 
        }),
      })
      const data = await response.json()

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: data.ok ? 200 : 400
      })
    }

    if (action === 'sendPoll') {
      if (!chatId || !question || !options || options.length < 2) {
        return new Response('Chat ID, question and at least 2 options required', { status: 400, headers: corsHeaders })
      }

      const response = await fetch(`${telegramApiBase}/sendPoll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          chat_id: chatId, 
          question: question,
          options: options,
          is_anonymous: true
        }),
      })
      const data = await response.json()

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: data.ok ? 200 : 400
      })
    }

    if (['sendPhoto', 'sendVideo', 'sendAudio', 'sendDocument'].includes(action)) {
      if (!chatId) {
        return new Response('Chat ID required', { status: 400, headers: corsHeaders })
      }

      const data = await sendMediaMessage(botToken, chatId, action, text || '', mediaUrls)

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
