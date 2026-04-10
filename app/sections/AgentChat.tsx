'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { RiChat3Line, RiCloseLine, RiSendPlaneLine, RiLoader4Line, RiRadarLine, RiLinkM } from 'react-icons/ri'
import parseLLMJson from '@/lib/jsonParser'
import {
  SEEDED_SIGNALS, SEEDED_OPPORTUNITIES, SEEDED_RISKS, SEEDED_ALERTS,
  type AnalysisItem,
} from './data/seededScenarios'

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

interface AgentChatProps {
  analyses?: AnalysisItem[]
}

function buildDashboardContext(analyses: AnalysisItem[]): string {
  const parts: string[] = []

  // Seeded signals summary
  parts.push('=== DASHBOARD SIGNALS (Current Insight Cards) ===')
  for (const s of SEEDED_SIGNALS) {
    parts.push(`- [${s.urgency}] ${s.title} | Brand: ${s.brand} | Market: ${s.market}`)
    parts.push(`  Why: ${s.why}`)
    parts.push(`  Next Step: ${s.nextStep}`)
    if (s.metrics) {
      parts.push(`  Gap vs Competitor: ${s.metrics.gapVsCompetitor}`)
      parts.push(`  Competitor: ${s.metrics.competitorName} (${s.metrics.competitorProduct})`)
      parts.push(`  Demand Implication: ${s.metrics.demandImplication}`)
    }
    if (s.detailSections?.length) {
      for (const ds of s.detailSections) {
        parts.push(`  ${ds.label}: ${ds.content.substring(0, 200)}`)
      }
    }
  }

  // Opportunities
  parts.push('\n=== OPPORTUNITIES ===')
  for (const o of SEEDED_OPPORTUNITIES) {
    parts.push(`- ${o.title} | Brand: ${o.brand} | Market: ${o.market} | Confidence: ${o.confidence}`)
    parts.push(`  Why: ${o.why}`)
    parts.push(`  Move: ${o.move}`)
  }

  // Risks
  parts.push('\n=== RISKS ===')
  for (const r of SEEDED_RISKS) {
    parts.push(`- ${r.title} | Brand: ${r.brand} | Severity: ${r.severity}`)
    parts.push(`  Cause: ${r.cause}`)
    parts.push(`  Action: ${r.action}`)
  }

  // Alerts
  parts.push('\n=== ALERTS ===')
  for (const a of SEEDED_ALERTS) {
    parts.push(`- ${a.title} | Brand: ${a.brand} | Severity: ${a.severity}`)
    parts.push(`  Why: ${a.why}`)
    parts.push(`  Response: ${a.response}`)
  }

  // Recent analyses from agent runs
  if (analyses.length > 0) {
    parts.push('\n=== RECENT AGENT ANALYSES ===')
    for (const a of analyses.slice(0, 3)) {
      if (a.orchestrator_summary) {
        parts.push(`Summary: ${a.orchestrator_summary}`)
      }
      if (Array.isArray(a.specialist_outputs)) {
        for (const so of a.specialist_outputs.slice(0, 4)) {
          parts.push(`  - ${so.domain || so.title || 'Analysis'}: ${(so.key_findings || so.title || '').substring(0, 150)}`)
        }
      }
      if (Array.isArray(a.priority_actions)) {
        for (const pa of a.priority_actions.slice(0, 3)) {
          parts.push(`  Action: ${pa.action} [${pa.priority}] - ${pa.owner}`)
        }
      }
    }
  }

  return parts.join('\n')
}

function extractAnswer(raw: any): { answer: string; sources: Source[] } {
  const parsed = parseLLMJson(raw)
  const data = parsed?.result ?? parsed ?? raw

  let answer = ''
  let sources: Source[] = []

  if (typeof data === 'object' && data !== null) {
    // Try structured response
    answer = data.answer || data.text || data.message || data.response || data.content || data.summary || ''

    // Try nested result
    if (!answer && data.result && typeof data.result === 'object') {
      answer = data.result.answer || data.result.text || data.result.message || data.result.response || ''
    }
    if (!answer && typeof data.result === 'string') {
      answer = data.result
    }

    // Extract sources
    const srcArray = data.sources || data.result?.sources || data.citations || data.references
    if (Array.isArray(srcArray)) {
      sources = srcArray
        .filter((s: any) => s && (s.title || s.url || s.name || s.link))
        .map((s: any) => ({
          title: s.title || s.name || s.description || s.url || s.link || '',
          url: s.url || s.link || s.href || '',
        }))
    }
  } else if (typeof data === 'string') {
    answer = data
  }

  // Final fallback
  if (!answer && typeof raw === 'string') {
    answer = raw
  }
  if (!answer && raw) {
    answer = JSON.stringify(raw).substring(0, 2000)
  }

  // Clean up markdown formatting for nicer display
  answer = answer.replace(/\*\*/g, '').replace(/#{1,3}\s/g, '')

  return { answer, sources }
}

async function callChatAPI(message: string, sessionId: string): Promise<{ answer: string; sources: Source[] }> {
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
      body: JSON.stringify({ task_id: submitData.task_id }),
    })
    const pollData = await pollRes.json()

    if (pollData.status === 'processing') continue

    if (!pollData.success) {
      throw new Error(pollData.error || 'Chat request failed')
    }

    return extractAnswer(pollData.response)
  }

  throw new Error('Request timed out after 5 minutes')
}

export default function AgentChat({ analyses = [] }: AgentChatProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [sessionId] = useState(() => `chat-${Date.now().toString(36)}`)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const dashboardContext = useMemo(() => buildDashboardContext(analyses), [analyses])

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
      // Build prompt with dashboard context
      const prompt = `You are a demand intelligence assistant for L'Oreal, focused on North America (United States and Canada). The user is viewing a demand sensing dashboard.

DASHBOARD DATA (use this to answer questions about the dashboard, insight cards, signals, risks, opportunities, and alerts):
${dashboardContext}

INSTRUCTIONS:
1. First check if the question can be answered from the DASHBOARD DATA above. If yes, answer from that data with specifics.
2. If the question needs more detail, current data, or is about a topic not in the dashboard, search the web for real-time information.
3. Be concise, specific, and action-oriented. Use simple business language.
4. Default to US/Canada market context unless another market is explicitly asked about.
5. Name specific competitor brands and products.
6. For each insight, explain: the market signal, L'Oreal performance, competitor performance, the gap, and what teams should do.
7. When citing dashboard data, reference the specific signal or card title.
8. When using web data, cite the sources.

USER QUESTION: ${q}`

      const { answer, sources } = await callChatAPI(prompt, sessionId)
      setMessages(prev => [...prev, { role: 'assistant', content: answer, sources }])
    } catch (err: any) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Something went wrong: ${err?.message || 'Please try again.'}`,
      }])
    } finally {
      setLoading(false)
    }
  }

  const handleSend = () => sendMessage(input)

  const suggestions = [
    "What US competitor moves should L'Oreal respond to first?",
    "Tell me more about the CeraVe vs Cetaphil situation",
    "What are the top risks to US product launches right now?",
    "What skincare ingredient trends are emerging in the US?",
  ]

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
        >
          <RiChat3Line className="h-5 w-5" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] h-[560px] bg-card border border-border shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <RiRadarLine className="h-4 w-4 text-primary" />
              <div>
                <p className="text-[12px] text-foreground tracking-wide font-medium">Demand Intelligence</p>
                <p className="text-[9px] text-muted-foreground tracking-[0.1em] uppercase">Dashboard insights + web research</p>
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
                      onClick={() => sendMessage(prompt)}
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
                <div className="max-w-[88%]">
                  <div className={`px-3 py-2 text-[12px] leading-relaxed tracking-wide ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-foreground/80 border border-border/60'
                  }`}>
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  </div>
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
                  <span className="text-[11px] text-muted-foreground tracking-wide">Analyzing dashboard data + web...</span>
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
                placeholder="Ask about any dashboard insight or trend..."
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
