
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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    console.log('[auto-publish-posts] Начинаем проверку постов для автоматической публикации')

    // Получаем все посты, которые должны быть опубликованы
    const now = new Date().toISOString()
    const { data: postsToPublish, error: fetchError } = await supabaseClient
      .from('scheduled_posts')
      .select(`
        *,
        telegram_channels (
          channel_id,
          username,
          name
        )
      `)
      .eq('status', 'pending')
      .lte('scheduled_for', now)
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
      return new Response(JSON.stringify({ message: 'No posts to publish' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const results = []

    // Публикуем каждый пост
    for (const post of postsToPublish) {
      try {
        console.log(`[auto-publish-posts] Публикуем пост ${post.id}`)

        // Определяем тип сообщения и параметры
        let requestBody: any = {
          chatId: post.telegram_channels.channel_id || `@${post.telegram_channels.username}`,
        }

        switch (post.post_type) {
          case 'poll':
            requestBody.action = 'sendPoll'
            requestBody.question = post.content
            requestBody.options = post.poll_options || []
            break
          
          case 'photo':
            requestBody.action = 'sendPhoto'
            requestBody.text = post.content || ''
            requestBody.mediaUrls = post.media_urls
            break
            
          case 'video':
            requestBody.action = 'sendVideo'
            requestBody.text = post.content || ''
            requestBody.mediaUrls = post.media_urls
            break
            
          case 'audio':
            requestBody.action = 'sendAudio'
            requestBody.text = post.content || ''
            requestBody.mediaUrls = post.media_urls
            break
            
          case 'document':
            requestBody.action = 'sendDocument'
            requestBody.text = post.content || ''
            requestBody.mediaUrls = post.media_urls
            break
            
          default:
            requestBody.action = 'sendMessage'
            requestBody.text = post.content
            break
        }

        // Отправляем пост через Telegram API
        const { data: telegramResponse, error: telegramError } = await supabaseClient.functions.invoke('telegram-api', {
          body: requestBody,
        })

        if (telegramError || !telegramResponse?.ok) {
          console.error(`[auto-publish-posts] Ошибка публикации поста ${post.id}:`, telegramError || telegramResponse)
          results.push({ 
            postId: post.id, 
            status: 'error', 
            error: telegramError?.message || telegramResponse?.description || 'Unknown error' 
          })
          continue
        }

        // Обновляем статус поста
        const { error: updateError } = await supabaseClient
          .from('scheduled_posts')
          .update({ status: 'sent' })
          .eq('id', post.id)

        if (updateError) {
          console.error(`[auto-publish-posts] Ошибка обновления статуса поста ${post.id}:`, updateError)
          results.push({ postId: post.id, status: 'published_but_not_updated', error: updateError.message })
        } else {
          console.log(`[auto-publish-posts] Пост ${post.id} успешно опубликован`)
          results.push({ postId: post.id, status: 'success' })
        }

      } catch (error: any) {
        console.error(`[auto-publish-posts] Общая ошибка при публикации поста ${post.id}:`, error)
        results.push({ postId: post.id, status: 'error', error: error.message })
      }
    }

    return new Response(JSON.stringify({ 
      message: 'Auto-publish completed',
      results: results,
      processed: postsToPublish.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error: any) {
    console.error('[auto-publish-posts] Общая ошибка:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
