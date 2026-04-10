'use client'

import React, { useState, useRef, useEffect, useMemo } from 'react'
import { RiChat3Line, RiCloseLine, RiSendPlaneLine, RiLoader4Line, RiRadarLine, RiLinkM } from 'react-icons/ri'
import { callAIAgent } from '@/lib/aiAgent'
import parseLLMJson from '@/lib/jsonParser'
import {
  SEEDED_SIGNALS, SEEDED_OPPORTUNITIES, SEEDED_RISKS, SEEDED_ALERTS, SEEDED_ACTIONS,
  type AnalysisItem,
} from './data/seededScenarios'

// Try these agent IDs in order — first MCP-created, then original sub-agents
const AGENT_IDS = [
  '69d8fbc177affb93352c126d', // MCP-created chat agent
  '69c4230638f7fd77009ae10a', // Opportunity sub-agent
  '69c423061b19ba3adafaf1a0', // Competitive sub-agent
  '69c4231c4d9b1d0c43a2101b', // Manager agent
]

interface Source { title: string; url: string }

interface Message {
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
}

interface AgentChatProps {
  analyses?: AnalysisItem[]
}

// ── Dashboard data search ──

function searchDashboardData(query: string): string {
  const q = query.toLowerCase()
  const results: string[] = []

  // Search signals
  for (const s of SEEDED_SIGNALS) {
    const searchText = `${s.title} ${s.brand} ${s.market} ${s.why} ${s.nextStep} ${s.crossCutting} ${s.detailSections?.map(d => d.content).join(' ') || ''}`.toLowerCase()
    if (q.split(' ').some(word => word.length > 2 && searchText.includes(word))) {
      results.push(`SIGNAL [${s.urgency}]: ${s.title}\nBrand: ${s.brand} | Market: ${s.market}\nWhy: ${s.why}\nNext Step: ${s.nextStep}`)
      if (s.metrics) {
        results.push(`  Competitor: ${s.metrics.competitorName} (${s.metrics.competitorProduct})\n  Gap: ${s.metrics.gapVsCompetitor}\n  Reason: ${s.metrics.gapReason}\n  Demand Impact: ${s.metrics.demandImplication}\n  Confidence: ${s.metrics.confidence}`)
        if (s.metrics.teamActions) {
          results.push(`  Marketing Action: ${s.metrics.teamActions.marketing}\n  Product Action: ${s.metrics.teamActions.product}\n  Planning: ${s.metrics.teamActions.planning}`)
        }
      }
      if (s.detailSections) {
        for (const ds of s.detailSections) {
          results.push(`  ${ds.label}: ${ds.content}`)
        }
      }
      if (s.relatedActions) {
        for (const ra of s.relatedActions) {
          results.push(`  Action: ${ra.action} [${ra.priority}] - ${ra.owner}`)
        }
      }
    }
  }

  // Search opportunities
  for (const o of SEEDED_OPPORTUNITIES) {
    const searchText = `${o.title} ${o.brand} ${o.market} ${o.why} ${o.move}`.toLowerCase()
    if (q.split(' ').some(word => word.length > 2 && searchText.includes(word))) {
      results.push(`OPPORTUNITY: ${o.title}\nBrand: ${o.brand} | Market: ${o.market} | Confidence: ${o.confidence}\nWhy: ${o.why}\nMove: ${o.move}`)
      if (o.detailSections) {
        for (const ds of o.detailSections) {
          results.push(`  ${ds.label}: ${ds.content}`)
        }
      }
    }
  }

  // Search risks
  for (const r of SEEDED_RISKS) {
    const searchText = `${r.title} ${r.brand} ${r.market} ${r.cause} ${r.action}`.toLowerCase()
    if (q.split(' ').some(word => word.length > 2 && searchText.includes(word))) {
      results.push(`RISK [${r.severity}]: ${r.title}\nBrand: ${r.brand} | Market: ${r.market}\nCause: ${r.cause}\nAction: ${r.action}`)
      if (r.detailSections) {
        for (const ds of r.detailSections) {
          results.push(`  ${ds.label}: ${ds.content}`)
        }
      }
    }
  }

  // Search alerts
  for (const a of SEEDED_ALERTS) {
    const searchText = `${a.title} ${a.brand} ${a.market} ${a.why} ${a.response}`.toLowerCase()
    if (q.split(' ').some(word => word.length > 2 && searchText.includes(word))) {
      results.push(`ALERT [${a.severity}]: ${a.title}\nBrand: ${a.brand} | Market: ${a.market}\nWhy: ${a.why}\nResponse: ${a.response}`)
    }
  }

  // Search actions
  for (const ac of SEEDED_ACTIONS) {
    const searchText = `${ac.title} ${ac.owner} ${ac.impact}`.toLowerCase()
    if (q.split(' ').some(word => word.length > 2 && searchText.includes(word))) {
      results.push(`ACTION [${ac.priority}]: ${ac.title}\nOwner: ${ac.owner} | Timeline: ${ac.timeline}\nImpact: ${ac.impact}`)
    }
  }

  return results.join('\n\n')
}

function buildFullDashboardSummary(): string {
  const parts: string[] = []

  parts.push('=== KEY SIGNALS ===')
  for (const s of SEEDED_SIGNALS) {
    parts.push(`[${s.urgency}] ${s.title} — ${s.brand} (${s.market}): ${s.why}`)
    if (s.metrics) {
      parts.push(`  vs ${s.metrics.competitorName}: ${s.metrics.gapVsCompetitor}. ${s.metrics.demandImplication}`)
    }
  }

  parts.push('\n=== OPPORTUNITIES ===')
  for (const o of SEEDED_OPPORTUNITIES) {
    parts.push(`${o.title} — ${o.brand} (${o.market}): ${o.why} [${o.confidence}]`)
  }

  parts.push('\n=== RISKS ===')
  for (const r of SEEDED_RISKS) {
    parts.push(`[${r.severity}] ${r.title} — ${r.brand}: ${r.cause}`)
  }

  parts.push('\n=== PRIORITY ACTIONS ===')
  for (const a of SEEDED_ACTIONS.slice(0, 8)) {
    parts.push(`[${a.priority}] ${a.title} — ${a.owner} (${a.timeline})`)
  }

  return parts.join('\n')
}

function generateDashboardAnswer(query: string, analyses: AnalysisItem[]): string {
  const relevant = searchDashboardData(query)

  if (relevant.length > 0) {
    return relevant
  }

  // Generic questions — return summary
  const q = query.toLowerCase()
  if (q.includes('competitor') || q.includes('respond') || q.includes('threat')) {
    return SEEDED_SIGNALS.filter(s => s.urgency === 'Critical' || s.urgency === 'High')
      .map(s => {
        let text = `[${s.urgency}] ${s.title}\nBrand: ${s.brand} | Market: ${s.market}\n${s.why}`
        if (s.metrics) {
          text += `\nCompetitor: ${s.metrics.competitorName} — Gap: ${s.metrics.gapVsCompetitor}\nAction needed: ${s.nextStep}`
        }
        return text
      }).join('\n\n')
  }

  if (q.includes('risk') || q.includes('danger') || q.includes('concern')) {
    return SEEDED_RISKS.map(r => `[${r.severity}] ${r.title}\nBrand: ${r.brand}\nCause: ${r.cause}\nAction: ${r.action}`).join('\n\n')
  }

  if (q.includes('opportunity') || q.includes('growth') || q.includes('potential')) {
    return SEEDED_OPPORTUNITIES.map(o => `${o.title}\nBrand: ${o.brand} | Market: ${o.market}\nWhy: ${o.why}\nMove: ${o.move}`).join('\n\n')
  }

  if (q.includes('action') || q.includes('what should') || q.includes('recommend') || q.includes('priority')) {
    return SEEDED_ACTIONS.slice(0, 8).map(a => `[${a.priority}] ${a.title}\nOwner: ${a.owner} | Timeline: ${a.timeline}\nImpact: ${a.impact}`).join('\n\n')
  }

  // Add recent analyses
  if (analyses.length > 0) {
    const analysisText = analyses.slice(0, 2).map(a => {
      let text = a.orchestrator_summary || ''
      if (Array.isArray(a.specialist_outputs)) {
        for (const so of a.specialist_outputs.slice(0, 3)) {
          text += `\n- ${so.domain || so.title || ''}: ${(so.key_findings || '').substring(0, 200)}`
        }
      }
      return text
    }).join('\n\n')
    if (analysisText) return analysisText
  }

  return buildFullDashboardSummary()
}

function extractAnswer(raw: any): { answer: string; sources: Source[] } {
  const parsed = parseLLMJson(raw)
  const data = parsed?.result ?? parsed ?? raw

  let answer = ''
  let sources: Source[] = []

  if (typeof data === 'object' && data !== null) {
    answer = data.answer || data.text || data.message || data.response || data.content || data.summary || ''
    if (!answer && data.result && typeof data.result === 'object') {
      answer = data.result.answer || data.result.text || data.result.message || ''
    }
    if (!answer && typeof data.result === 'string') answer = data.result

    const srcArray = data.sources || data.result?.sources || data.citations
    if (Array.isArray(srcArray)) {
      sources = srcArray.filter((s: any) => s && (s.title || s.url)).map((s: any) => ({
        title: s.title || s.name || s.url || '',
        url: s.url || s.link || '',
      }))
    }
  } else if (typeof data === 'string') {
    answer = data
  }

  if (!answer && typeof raw === 'string') answer = raw
  if (!answer && raw) answer = JSON.stringify(raw).substring(0, 2000)

  answer = answer.replace(/\*\*/g, '').replace(/#{1,3}\s/g, '')
  return { answer, sources }
}

export default function AgentChat({ analyses = [] }: AgentChatProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [workingAgentIdx, setWorkingAgentIdx] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, loading])

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return
    const q = text.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: q }])
    setLoading(true)

    // Always get dashboard data first
    const dashboardAnswer = generateDashboardAnswer(q, analyses)

    // Try calling the AI agent for web-enhanced answers
    let agentWorked = false
    for (let idx = workingAgentIdx; idx < AGENT_IDS.length; idx++) {
      try {
        const dashboardContext = buildFullDashboardSummary()
        const prompt = `You are a demand intelligence assistant for L'Oreal, focused on North America (United States and Canada).

DASHBOARD DATA (the user can see this on their screen — reference specific signals/cards when relevant):
${dashboardContext}

RELEVANT DASHBOARD RESULTS FOR THIS QUESTION:
${dashboardAnswer.substring(0, 2000)}

INSTRUCTIONS:
1. First answer from the DASHBOARD DATA above when it contains relevant information. Reference the specific signal/card titles.
2. Then supplement with real-time web search data for the latest context, numbers, and developments.
3. Be concise, specific, and action-oriented. Keep responses under 300 words.
4. Name specific L'Oreal brands and competitor brands/products.
5. End with 1-2 specific recommended actions.

USER QUESTION: ${q}`

        const result = await callAIAgent(prompt, AGENT_IDS[idx])

        if (result?.success) {
          const { answer, sources } = extractAnswer(result.response)
          if (answer && !answer.includes('403') && !answer.includes('permission')) {
            setMessages(prev => [...prev, { role: 'assistant', content: answer, sources }])
            setWorkingAgentIdx(idx)
            agentWorked = true
            break
          }
        }

        // If this agent failed with 403, try the next one
        const errMsg = result?.error || ''
        if (errMsg.includes('403') || errMsg.includes('permission')) {
          continue
        }
      } catch {
        continue
      }
    }

    // Fallback: use dashboard data directly if no agent worked
    if (!agentWorked) {
      const fallbackAnswer = dashboardAnswer || buildFullDashboardSummary()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: fallbackAnswer,
        sources: [],
      }])
    }

    setLoading(false)
  }

  const handleSend = () => sendMessage(input)

  const suggestions = [
    "What US competitor moves should L'Oreal respond to first?",
    "Tell me about the CeraVe vs Cetaphil situation",
    "What are the top risks to US product launches?",
    "What skincare ingredient trends are emerging?",
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
                  <div className={`px-3 py-2.5 text-[12px] leading-relaxed tracking-wide ${
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
                  <span className="text-[11px] text-muted-foreground tracking-wide">Analyzing...</span>
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
