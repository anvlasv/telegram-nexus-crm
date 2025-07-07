
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('[auto-publish-posts] Начинаем проверку постов для автоматической публикации')

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Получаем текущее время в UTC
    const now = new Date()
    const nowUTC = now.toISOString()
    console.log('[auto-publish-posts] Текущее время UTC:', nowUTC)

    // Получаем все посты, которые должны быть опубликованы
    const { data: postsToPublish, error: fetchError } = await supabaseClient
      .from('scheduled_posts')
      .select(`
        *,
        telegram_channels (
          channel_id,
          username,
          name,
          timezone
        )
      `)
      .eq('status', 'pending')
      .lte('scheduled_for', nowUTC)
      .limit(10) // Обрабатываем не более 10 постов за раз

    if (fetchError) {
      console.error('[auto-publish-posts] Ошибка получения постов:', fetchError)
      return new Response(JSON.stringify({ error: fetchError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    console.log(`[auto-publish-posts] Найдено ${postsToPublish?.length || 0} постов для публикации`)

    if (!postsToPublish || postsToPublish.length === 0) {
      return new Response(JSON.stringify({ 
        message: 'No posts to publish',
        processed: 0,
        results: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const results = []

    // Публикуем каждый пост
    for (const post of postsToPublish) {
      try {
        console.log(`[auto-publish-posts] Публикуем пост ${post.id} для канала ${post.telegram_channels.name}`)

        // Проверяем наличие необходимых данных канала
        if (!post.telegram_channels.channel_id && !post.telegram_channels.username) {
          console.error(`[auto-publish-posts] У канала ${post.telegram_channels.name} нет channel_id или username`)
          results.push({ 
            postId: post.id, 
            status: 'error', 
            error: 'Отсутствует channel_id или username у канала' 
          })
          continue
        }

        // Определяем chat_id для Telegram
        let chatId: string
        if (post.telegram_channels.channel_id) {
          chatId = post.telegram_channels.channel_id.toString()
        } else {
          chatId = `@${post.telegram_channels.username}`
        }

        // Определяем тип сообщения и параметры
        let requestBody: any = {
          chatId: chatId,
        }

        switch (post.post_type) {
          case 'poll':
            if (!post.poll_options || post.poll_options.length < 2) {
              throw new Error('Опрос должен содержать минимум 2 варианта ответа')
            }
            requestBody.action = 'sendPoll'
            requestBody.question = post.content
            requestBody.options = post.poll_options
            break
          
          case 'photo':
            requestBody.action = 'sendPhoto'
            requestBody.text = post.content || ''
            requestBody.mediaUrls = post.media_urls || []
            break
            
          case 'video':
            requestBody.action = 'sendVideo'
            requestBody.text = post.content || ''
            requestBody.mediaUrls = post.media_urls || []
            break
            
          case 'audio':
            requestBody.action = 'sendAudio'
            requestBody.text = post.content || ''
            requestBody.mediaUrls = post.media_urls || []
            break
            
          case 'document':
            requestBody.action = 'sendDocument'
            requestBody.text = post.content || ''
            requestBody.mediaUrls = post.media_urls || []
            break
            
          default:
            if (!post.content) {
              throw new Error('Текст сообщения не может быть пустым')
            }
            requestBody.action = 'sendMessage'
            requestBody.text = post.content
            break
        }

        console.log(`[auto-publish-posts] Отправляем запрос для поста ${post.id}:`, requestBody)

        // Отправляем пост через Telegram API
        const { data: telegramResponse, error: telegramError } = await supabaseClient.functions.invoke('telegram-api', {
          body: requestBody,
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
          },
        })

        if (telegramError) {
          console.error(`[auto-publish-posts] Ошибка вызова функции для поста ${post.id}:`, telegramError)
          results.push({ 
            postId: post.id, 
            status: 'error', 
            error: telegramError.message 
          })
          continue
        }

        if (!telegramResponse || !telegramResponse.ok) {
          const errorMsg = telegramResponse?.description || telegramResponse?.error_code || 'Неизвестная ошибка Telegram API'
          console.error(`[auto-publish-posts] Ошибка Telegram API для поста ${post.id}:`, telegramResponse)
          results.push({ 
            postId: post.id, 
            status: 'error', 
            error: errorMsg 
          })
          continue
        }

        // Обновляем статус поста
        const { error: updateError } = await supabaseClient
          .from('scheduled_posts')
          .update({ 
            status: 'sent',
            updated_at: new Date().toISOString()
          })
          .eq('id', post.id)

        if (updateError) {
          console.error(`[auto-publish-posts] Ошибка обновления статуса поста ${post.id}:`, updateError)
          results.push({ 
            postId: post.id, 
            status: 'published_but_not_updated', 
            error: updateError.message 
          })
        } else {
          console.log(`[auto-publish-posts] Пост ${post.id} успешно опубликован`)
          results.push({ 
            postId: post.id, 
            status: 'success' 
          })
        }

      } catch (error: any) {
        console.error(`[auto-publish-posts] Общая ошибка при публикации поста ${post.id}:`, error)
        results.push({ 
          postId: post.id, 
          status: 'error', 
          error: error.message 
        })
      }
    }

    const successCount = results.filter(r => r.status === 'success').length
    const errorCount = results.filter(r => r.status === 'error').length

    console.log(`[auto-publish-posts] Завершено. Успешно: ${successCount}, Ошибок: ${errorCount}`)

    return new Response(JSON.stringify({ 
      message: 'Auto-publish completed',
      results: results,
      processed: postsToPublish.length,
      successful: successCount,
      failed: errorCount
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('[auto-publish-posts] Общая ошибка:', error)
    return new Response(JSON.stringify({ 
      error: error.message,
      details: 'Ошибка в функции автоматической публикации постов'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
