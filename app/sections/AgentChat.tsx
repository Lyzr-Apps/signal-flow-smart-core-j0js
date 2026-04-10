'use client'

import React, { useState, useRef, useEffect } from 'react'
import { RiChat3Line, RiCloseLine, RiSendPlaneLine, RiLoader4Line, RiRadarLine, RiLinkM, RiArrowDownSLine } from 'react-icons/ri'
import parseLLMJson from '@/lib/jsonParser'

const POLL_TIMEOUT_MS = 5 * 60 * 1000

interface Source {
  title: string
  url: string
}

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
}

async function callChatAgent(message: string, sessionId: string): Promise<{ answer: string; sources: Source[] }> {
  // Submit
  const submitRes = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, session_id: sessionId }),
  })
  const submitData = await submitRes.json()

  if (!submitData.task_id) {
    throw new Error(submitData.error || 'Failed to submit question')
  }

  const { task_id } = submitData

  // Poll
  const startTime = Date.now()
  let attempt = 0

  while (Date.now() - startTime < POLL_TIMEOUT_MS) {
    const delay = Math.min(400 * Math.pow(1.4, attempt), 3000)
    await new Promise(r => setTimeout(r, delay))
    attempt++

    const pollRes = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ task_id }),
    })
    const pollData = await pollRes.json()

    if (pollData.status === 'processing') continue

    if (!pollData.success) {
      throw new Error(pollData.error || 'Chat request failed')
    }

    // Extract answer from the response
    const raw = pollData.response
    const parsed = parseLLMJson(raw)
    const data = parsed?.result ?? parsed ?? raw

    // Try to get structured answer + sources
    let answer = ''
    let sources: Source[] = []

    if (typeof data === 'object' && data !== null) {
      // JSON schema response: { answer, sources }
      answer = data.answer || data.text || data.message || data.response || data.content || ''
      if (Array.isArray(data.sources)) {
        sources = data.sources.filter((s: any) => s?.title && s?.url)
      }
    } else if (typeof data === 'string') {
      answer = data
    }

    // Fallback: try extracting from nested response structures
    if (!answer && typeof raw === 'object') {
      answer = raw?.result?.answer || raw?.result?.text || raw?.message || ''
      if (Array.isArray(raw?.result?.sources)) {
        sources = raw.result.sources.filter((s: any) => s?.title && s?.url)
      }
    }

    if (!answer) {
      answer = typeof raw === 'string' ? raw : JSON.stringify(raw)
    }

    return { answer, sources }
  }

  throw new Error('Request timed out after 5 minutes')
}

export default function AgentChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => `chat-${Date.now().toString(36)}`)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus()
    }
  }, [open])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const q = text.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)

    try {
      const { answer, sources } = await callChatAgent(q, sessionId)
      setMessages(prev => [...prev, { role: 'assistant', content: answer, sources }])
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Error: ${err?.message || 'Something went wrong. Please try again.'}`,
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleSend = () => sendMessage(input)

  const handleSuggestion = (prompt: string) => {
    sendMessage(prompt)
  }

  const suggestions = [
    "What US competitor moves should L'Oreal respond to first?",
    "Which North America demand signals show the highest growth?",
    "What are the top risks to US product launches right now?",
    "What skincare ingredient trends are emerging in the US market?",
  ]

  return (
    <>
      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
        >
          <RiChat3Line className="h-5 w-5" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[560px] bg-card border border-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <RiRadarLine className="h-4 w-4 text-primary" />
              <div>
                <p className="text-[12px] text-foreground tracking-wide font-medium">Demand Intelligence</p>
                <p className="text-[9px] text-muted-foreground tracking-[0.1em] uppercase">Web-powered research assistant</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <RiCloseLine className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="py-4">
                <RiRadarLine className="h-8 w-8 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3 text-center">Suggested Questions</p>
                <div className="grid grid-cols-2 gap-2">
                  {suggestions.map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestion(prompt)}
                      disabled={loading}
                      className="bg-secondary/50 border border-border hover:border-primary/40 hover:bg-secondary transition-all p-3 text-left disabled:opacity-50"
                    >
                      <span className="text-[11px] text-foreground/70 tracking-wide leading-relaxed">{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[88%] ${msg.role === 'user' ? '' : ''}`}>
                  <div className={`px-3 py-2 text-[12px] leading-relaxed tracking-wide ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground/80 border border-border/60'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
                  {/* Sources */}
                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-1.5 space-y-1">
                      <p className="text-[9px] text-muted-foreground tracking-[0.12em] uppercase flex items-center gap-1">
                        <RiLinkM className="h-3 w-3" />
                        Sources
                      </p>
                      {msg.sources.map((src, si) => (
                        <a
                          key={si}
                          href={src.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-[10px] text-primary/80 hover:text-primary truncate tracking-wide transition-colors"
                          title={src.url}
                        >
                          {src.title || src.url}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary border border-border/60 px-3 py-2 flex items-center gap-2">
                  <RiLoader4Line className="h-3 w-3 animate-spin text-primary" />
                  <span className="text-[11px] text-muted-foreground tracking-wide">Researching the web...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3 bg-card">
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask about any market trend or insight..."
                className="flex-1 bg-secondary border border-border px-3 py-2 text-[12px] text-foreground tracking-wide placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-9 h-9 bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <RiSendPlaneLine className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
