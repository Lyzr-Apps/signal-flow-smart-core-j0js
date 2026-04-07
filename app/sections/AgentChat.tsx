'use client'

import React, { useState, useRef, useEffect } from 'react'
import { RiChat3Line, RiCloseLine, RiSendPlaneLine, RiLoader4Line, RiRadarLine } from 'react-icons/ri'
import { callAIAgent } from '@/lib/aiAgent'

const WEB_AGENT_ID = '69c5630b37c96c3d3ffadec1'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function AgentChat() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    const q = input.trim()
    if (!q || loading) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)

    try {
      const prompt = `You are a demand intelligence assistant for L'Oreal, focused on North America (United States and Canada). The user is viewing a demand sensing dashboard. Answer their question using real-time web data. Be concise, specific, and action-oriented. Use simple business language. Default to US/Canada market context unless another market is explicitly asked about. Name specific competitor brands and products. For each insight, explain: the market signal, L'Oreal performance, competitor performance, the gap, and what teams should do. Question: ${q}`
      const result = await callAIAgent(prompt, WEB_AGENT_ID)
      const text = result?.response?.result?.text
        || result?.response?.message
        || (typeof result?.response === 'string' ? result.response : '')
        || 'I was unable to retrieve an answer. Please try rephrasing your question.'
      const cleaned = typeof text === 'string' ? text.replace(/\*\*/g, '').replace(/#{1,3}\s/g, '') : String(text)
      setMessages(prev => [...prev, { role: 'assistant', content: cleaned }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
    } finally {
      setLoading(false)
    }
  }

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
        <div className="fixed bottom-6 right-6 z-50 w-[380px] h-[520px] bg-card border border-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <RiRadarLine className="h-4 w-4 text-primary" />
              <div>
                <p className="text-[12px] text-foreground tracking-wide">Demand Intelligence</p>
                <p className="text-[9px] text-muted-foreground tracking-[0.1em] uppercase">Ask about any insight or trend</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <RiCloseLine className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="py-6">
                <RiRadarLine className="h-8 w-8 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3 text-center">Suggested Questions</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    "What US competitor moves should L'Or\u00e9al respond to first?",
                    "Which North America demand signals show the highest growth?",
                    "What are the top risks to US product launches right now?",
                    "What skincare ingredient trends are emerging in the US market?"
                  ].map((prompt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setInput(prompt)
                        setMessages(prev => [...prev, { role: 'user', content: prompt }])
                        setLoading(true)
                        const systemPrompt = `You are a demand intelligence assistant for L'Oreal, focused on North America (United States and Canada). The user is viewing a demand sensing dashboard. Answer their question using real-time web data. Be concise, specific, and action-oriented. Use simple business language. Default to US/Canada market context unless another market is explicitly asked about. Name specific competitor brands and products. For each insight, explain: the market signal, L'Oreal performance, competitor performance, the gap, and what teams should do. Question: ${prompt}`
                        callAIAgent(systemPrompt, WEB_AGENT_ID).then(result => {
                          const text = result?.response?.result?.text
                            || result?.response?.message
                            || (typeof result?.response === 'string' ? result.response : '')
                            || 'I was unable to retrieve an answer. Please try rephrasing your question.'
                          const cleaned = typeof text === 'string' ? text.replace(/\*\*/g, '').replace(/#{1,3}\s/g, '') : String(text)
                          setMessages(prev => [...prev, { role: 'assistant', content: cleaned }])
                        }).catch(() => {
                          setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Please try again.' }])
                        }).finally(() => {
                          setLoading(false)
                          setInput('')
                        })
                      }}
                      className="bg-secondary/50 border border-border hover:border-primary/40 hover:bg-secondary transition-all p-3 text-left"
                    >
                      <span className="text-[11px] text-foreground/70 tracking-wide leading-relaxed">{prompt}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 text-[12px] leading-relaxed tracking-wide ${msg.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-foreground/80 border border-border/60'}`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-secondary border border-border/60 px-3 py-2 flex items-center gap-2">
                  <RiLoader4Line className="h-3 w-3 animate-spin text-primary" />
                  <span className="text-[11px] text-muted-foreground tracking-wide">Searching the web...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-border p-3">
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask about any market trend..."
                className="flex-1 bg-secondary border border-border px-3 py-2 text-[12px] text-foreground tracking-wide placeholder:text-muted-foreground focus:outline-none focus:border-primary/40"
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
