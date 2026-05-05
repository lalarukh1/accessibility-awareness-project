import { useEffect, useRef } from 'react'
import { useConversation, useConversationClientTool } from '@elevenlabs/react'
import { useNavigate } from 'react-router-dom'
import { useVoice } from '../contexts/VoiceContext'
import { articles } from '../data/articles'

const AGENT_ID = import.meta.env.VITE_ELEVENLABS_AGENT_ID
const API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY

async function getSignedUrl() {
  const res = await fetch(
    `https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id=${AGENT_ID}`,
    { headers: { 'xi-api-key': API_KEY } }
  )
  if (!res.ok) throw new Error(`Token error: ${res.status}`)
  const { signed_url } = await res.json()
  return signed_url
}

export default function VoiceAssistant() {
  const { updateStatus } = useVoice()
  const navigate = useNavigate()
  const spaceDown = useRef(false)
  const readyToStart = useRef(true) // false briefly after disconnect so socket fully closes

  const conversation = useConversation({
    onConnect: () => {
      console.log('[BMV] onConnect — spaceDown:', spaceDown.current)
      readyToStart.current = true
      if (spaceDown.current) {
        updateStatus('listening')
      } else {
        try { conversation.setMuted(true) } catch (_) {}
        updateStatus('idle')
      }
    },
    onDisconnect: (detail) => {
      console.log('[BMV] onDisconnect — reason:', detail?.reason, '| message:', detail?.message, '| code:', detail?.closeCode)
      readyToStart.current = false
      updateStatus('idle')
      setTimeout(() => { readyToStart.current = true }, 600)
    },
    onError: (err, context) => {
      console.error('[BMV] onError —', err, context)
      readyToStart.current = true
      updateStatus('idle')
    },
  })

  const wasSpeaking = useRef(false)
  const endTimer = useRef(null)

  // Sync pill state. Agent calls end_call itself when done, onDisconnect handles cleanup.
  // Safety-net timer fires only if agent forgets to call end_call (e.g. very long article).
  useEffect(() => {
    if (conversation.status !== 'connected') return

    if (conversation.isSpeaking) {
      console.log('[BMV] isSpeaking → true (AI audio arriving)')
      wasSpeaking.current = true
      updateStatus('speaking')
      if (endTimer.current) { clearTimeout(endTimer.current); endTimer.current = null }
    } else if (wasSpeaking.current) {
      if (!endTimer.current) {
        endTimer.current = setTimeout(() => {
          endTimer.current = null
          wasSpeaking.current = false
          try { conversation.endSession() } catch (_) {}
          updateStatus('idle')
        }, 10000) // 10s safety net, agent's end_call should fire first
      }
    } else if (spaceDown.current) {
      updateStatus('listening')
    }
  }, [conversation.status, conversation.isSpeaking, updateStatus])

  // ── Client tools ──────────────────────────────────────────────────────────

  useConversationClientTool('navigateToArticle', async ({ articleIndex, topic }) => {
    let article = null
    if (articleIndex) article = articles[Number(articleIndex) - 1]
    else if (topic) {
      const lower = topic.toLowerCase()
      article = articles.find(
        (a) =>
          a.title.toLowerCase().includes(lower) ||
          a.category.toLowerCase().includes(lower) ||
          a.excerpt.toLowerCase().includes(lower)
      )
    }
    if (!article) return { success: false, message: 'Article not found.' }
    navigate(`/bemyvoice/article/${article.id}`)
    return {
      success: true,
      message: `Navigated to article: ${article.title}`,
      articleTitle: article.title,
      articleBody: article.body.join(' '),
      imageAlt: article.imageAlt ?? '',
    }
  })

  useConversationClientTool('goHome', async () => {
    navigate('/bemyvoice')
    const titles = articles.map((a, i) => `${i + 1}. ${a.title}`).join('; ')
    return { success: true, message: 'Navigated to home page.', articles: titles }
  })

  useConversationClientTool('getPageContext', async () => {
    const path = window.location.pathname
    if (path === '/' || path === '') {
      const list = articles.map((a, i) => `Article ${i + 1}: ${a.title}, ${a.excerpt}`).join('. ')
      return { page: 'home', description: `Home page. ${articles.length} articles: ${list}` }
    }
    const match = path.match(/\/bemyvoice\/article\/(\d+)/)
    if (match) {
      const article = articles.find((a) => a.id === parseInt(match[1]))
      if (article) return {
        page: 'article',
        title: article.title,
        author: article.author,
        date: article.date,
        imageAlt: article.imageAlt ?? '',
        body: article.body.join(' '),
      }
    }
    return { page: 'unknown' }
  })

  useConversationClientTool('readCurrentArticle', async () => {
    const match = window.location.pathname.match(/\/bemyvoice\/article\/(\d+)/)
    if (!match) return { success: false, message: 'Not on an article page.' }
    const article = articles.find((a) => a.id === parseInt(match[1]))
    if (!article) return { success: false, message: 'Article not found.' }
    return { success: true, title: article.title, author: article.author, date: article.date, imageAlt: article.imageAlt ?? '', body: article.body.join(' ') }
  })

  // ── Spacebar ──────────────────────────────────────────────────────────────

  useEffect(() => {
    const onKeyDown = async (e) => {
      if (e.code !== 'Space') return
      const tag = document.activeElement?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || document.activeElement?.isContentEditable) return
      e.preventDefault()
      if (spaceDown.current) return
      spaceDown.current = true

      // AI is speaking → kill it immediately
      if (conversation.status === 'connected' && conversation.isSpeaking) {
        try { conversation.endSession() } catch (_) {}
        return
      }

      // Session open and waiting → unmute so user can speak
      if (conversation.status === 'connected') {
        try { conversation.setMuted(false) } catch (_) {}
        updateStatus('listening')
        return
      }

      // No session → start one, mic starts muted, unmutes only after connect
      if (!readyToStart.current) return // socket still closing from previous session
      updateStatus('listening')
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
      } catch {
        updateStatus('idle')
        spaceDown.current = false
        return
      }
      try {
        console.log('[BMV] fetching signed URL...')
        const signedUrl = await getSignedUrl()
        console.log('[BMV] got signed URL, starting session')
        conversation.startSession({ signedUrl })
      } catch (err) {
        console.error('[BMV] Session start failed:', err)
        updateStatus('idle')
        spaceDown.current = false
      }
    }

    const onKeyUp = (e) => {
      if (e.code !== 'Space') return
      e.preventDefault()
      if (!spaceDown.current) return
      spaceDown.current = false

      if (conversation.status === 'connected') {
        // Mute mic → VAD on server detects end of speech → AI processes and responds
        try { conversation.setMuted(true) } catch (_) {}
        updateStatus('thinking')
      } else {
        updateStatus('idle')
      }
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [conversation, updateStatus])

  return null
}
