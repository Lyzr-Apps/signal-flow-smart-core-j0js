'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import parseLLMJson from '@/lib/jsonParser'
import fetchWrapper from '@/lib/fetchWrapper'
import { Badge } from '@/components/ui/badge'
import { RiRadarLine, RiLoader4Line, RiSearchLine } from 'react-icons/ri'
import {
  SEEDED_SIGNALS, SEEDED_ACTIONS, SEEDED_OPPORTUNITIES, SEEDED_RISKS, SEEDED_ALERTS,
  type FilterState,
} from './data/seededScenarios'

import Sidebar from './Sidebar'
import Dashboard from './Dashboard'
import CategoryListView from './CategoryListView'
import AnalysisResult from './AnalysisResult'
import DetailView from './DetailView'
import MarketSignals from './MarketSignals'
import FilterBar from './FilterBar'
import AgentChat from './AgentChat'
import type { DetailItem } from './DetailView'

const MANAGER_AGENT_ID = '69dd164973b4b622c99ebd9e'
const LYZR_TASK_URL = 'https://agent-prod.studio.lyzr.ai/v3/inference/chat/task'
const POLL_TIMEOUT_MS = 5 * 60 * 1000

function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

async function pollUntilDone(taskId: string, apiKey: string): Promise<any> {
  const startTime = Date.now()
  let attempt = 0
  while (Date.now() - startTime < POLL_TIMEOUT_MS) {
    const delay = Math.min(500 * Math.pow(1.4, attempt), 4000)
    await new Promise(r => setTimeout(r, delay))
    attempt++
    try {
      const pollRes = await fetch(`${LYZR_TASK_URL}/${taskId}`, {
        headers: { 'accept': 'application/json', 'x-api-key': apiKey },
      })
      if (!pollRes.ok) continue
      const task = await pollRes.json()
      if (task.status === 'processing') continue
      if (task.status === 'completed' || task.response) {
        return { success: true, response: task.response }
      }
      if (task.status === 'failed') {
        return { success: false, error: task.error || 'Task failed' }
      }
    } catch { continue }
  }
  return { success: false, error: 'Polling timed out' }
}

async function callAnalyzeAgent(message: string): Promise<any> {
  const apiKey = 'sk-default-e1XB361JQq9V80uRmog4ZQalVEJKkB0h'
  const userId = 'raoshreya2020@gmail.com'

  // Approach 1: Try /api/analyze (server-side proxy route)
  try {
    const submitRes = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    if (submitRes.ok) {
      const submitData = await submitRes.json()
      if (submitData.task_id) {
        const result = await pollUntilDone(submitData.task_id, apiKey)
        if (result.success) return result
      }
    }
  } catch {}

  // Approach 2: Try /api/agent (generic agent route)
  try {
    const result = await callAIAgent(message, MANAGER_AGENT_ID)
    if (result?.success) {
      const errStr = JSON.stringify(result.response || '')
      if (!errStr.includes('403') && !errStr.includes('permission')) return result
    }
  } catch {}

  // Approach 3: Call Lyzr API directly (bypass proxy entirely)
  try {
    const sessionId = `analyze-${generateUUID().substring(0, 12)}`
    const submitRes = await fetch(LYZR_TASK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey },
      body: JSON.stringify({
        message,
        agent_id: MANAGER_AGENT_ID,
        user_id: userId,
        session_id: sessionId,
      }),
    })
    if (submitRes.ok) {
      const { task_id } = await submitRes.json()
      if (task_id) {
        const result = await pollUntilDone(task_id, apiKey)
        if (result.success) return result
      }
    }
  } catch {}

  return { success: false, error: 'All agent connections failed. Dashboard data is still available.' }
}

interface AnalysisData {
  _id?: string
  signal_id?: string
  orchestrator_summary?: string
  specialist_outputs?: any[]
  signal_types?: string[]
  priority_actions?: any[]
  cross_cutting_themes?: string
  createdAt?: string
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: string }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: '' }
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error: error.message }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4 text-sm">{this.state.error}</p>
            <button onClick={() => this.setState({ hasError: false, error: '' })} className="px-4 py-2 bg-primary text-primary-foreground text-sm">
              Try again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

const DEFAULT_FILTERS: FilterState = {
  brand: 'All Brands',
  category: 'All Categories',
  region: 'All Regions',
  state: '',
}

export default function AppShell() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [analyses, setAnalyses] = useState<AnalysisData[]>([])
  const [loadingAnalyses, setLoadingAnalyses] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisData | null>(null)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [detailItem, setDetailItem] = useState<DetailItem | null>(null)
  const [agentLoading, setAgentLoading] = useState(false)
  const [agentError, setAgentError] = useState<string | null>(null)
  const [hasRunAnalysis, setHasRunAnalysis] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS)

  const displayAnalyses = analyses

  const fetchAnalyses = useCallback(async () => {
    setLoadingAnalyses(true)
    try {
      const res = await fetchWrapper('/api/analyses')
      if (!res) { setLoadingAnalyses(false); return }
      const contentType = res.headers.get('content-type') || ''
      if (!contentType.includes('application/json')) { setLoadingAnalyses(false); return }
      const data = await res.json()
      if (data?.success && Array.isArray(data?.data)) {
        setAnalyses(data.data)
      }
    } catch (err) {
      console.error('Failed to fetch analyses:', err)
    } finally {
      setLoadingAnalyses(false)
    }
  }, [])

  useEffect(() => {
    fetchAnalyses()
  }, [fetchAnalyses])

  // Determine if FilterBar should show (Dashboard, Signals, Actions - not History or Detail)
  const showFilterBar = ['dashboard', 'signals', 'actions'].includes(currentView)

  const runWebAnalysis = async (query?: string) => {
    setAgentError(null)
    setAgentLoading(true)
    setActiveAgentId('analyzing')

    try {
      // Build filter context for the prompt
      const filterContext = []
      if (filters.brand !== 'All Brands') filterContext.push(`Brand focus: ${filters.brand}`)
      if (filters.category !== 'All Categories') filterContext.push(`Category: ${filters.category}`)
      if (filters.region !== 'All Regions') filterContext.push(`Region: ${filters.region}`)
      if (filters.state) filterContext.push(`State: ${filters.state}`)
      const hasBrandFilter = filters.brand !== 'All Brands'
      const hasCategoryFilter = filters.category !== 'All Categories'
      let filterStr = ''
      if (filterContext.length > 0) {
        filterStr = `\n\nCurrent filter context: ${filterContext.join(', ')}.`
        if (hasBrandFilter) {
          filterStr += ` CRITICAL: Only return insights, actions, and signals specifically about ${filters.brand}. Do NOT include actions or insights about other L'Oreal brands. Every action must be relevant to ${filters.brand} specifically.`
        }
        if (hasCategoryFilter) {
          filterStr += ` Only include ${filters.category} category signals. Do not surface signals from other categories unless directly relevant.`
        }
      }

      const geoLabel = filters.state && !filters.state.startsWith('All ')
        ? filters.state
        : filters.region && filters.region !== 'All Regions' && filters.region !== 'National'
          ? `the ${filters.region} United States`
          : 'the United States'

      const brandFocus = hasBrandFilter ? `${filters.brand}` : "L'Oreal portfolio brands"
      const basePrompt = query
        ? `Search the web for real-time beauty and cosmetics industry intelligence related to: "${query}". Focus on ${brandFocus} and their competitive landscape in ${geoLabel}.${filterStr}`
        : `Conduct a comprehensive real-time beauty and cosmetics industry demand sensing analysis for ${brandFocus} in ${geoLabel}. Search the web for the latest developments as of today.${filterStr}`

      const message = `${basePrompt}

You MUST respond in valid JSON format with this exact structure:
{
  "selected_context": {"brand": "...", "category": "...", "region": "...", "state": "..."},
  "top_line_insight": "Single sentence business conclusion for the selected brand, category, and geography. Must be specific, credible, concise. Use grounded business wording. Never use inflated phrasing like 'multiple major disruptions' or 'immediate market-wide transformation'.",
  "why_it_matters": [
    {"title": "Short distinct title — must be different from other titles", "explanation": "Why this matters for demand — plain language, business-relevant, tied to selected context"},
    {"title": "Short distinct title — must be different from other titles", "explanation": "A different supporting reason behind the top-line insight"},
    {"title": "Short distinct title — must be different from other titles", "explanation": "A third unique supporting reason — no duplicates allowed"}
  ],
  "recommended_actions": [
    {"action": "Short, immediate, operational action tied to selected context — e.g. 'increase allocation in priority markets', 'revise short-term forecast assumptions', 'prioritize retail support in selected states'", "owner_team": "Marketing|Product/R&D|Planning|Manufacturing/Supply", "kpi_outcome": "Increased Sales|Out-of-Stocks Prevented|Forecast Accuracy", "priority": "Critical/High/Medium", "timeline": "When to act"},
    {"action": "...", "owner_team": "...", "kpi_outcome": "...", "priority": "...", "timeline": "..."},
    {"action": "...", "owner_team": "...", "kpi_outcome": "...", "priority": "...", "timeline": "..."}
  ],
  "kpi_sales": "Summary of actions targeting increased sales — must be consistent with recommended_actions",
  "kpi_stockouts": "Summary of actions preventing out-of-stocks — must be consistent with recommended_actions",
  "kpi_forecast": "Summary of actions improving forecast accuracy — must be consistent with recommended_actions",
  "executive_summary": "2-3 sentence overview",
  "signal_classifications": [
    {"type": "Competitor Launch/Relaunch|Stockout / Shelf Loss|Creator Traction Shift|Ingredient Trend Surge|Regulatory / Claims Pressure|Price Gap Shift|Channel Mix Change|Consumer Sentiment Shift|New Entrant Disruption|Reformulation Signal|Seasonal Demand Shift|Retailer Strategy Change|Supply Chain Risk", "description": "..."}
  ],
  "specialist_analyses": [
    {
      "domain": "Domain name",
      "title": "Short action-oriented title",
      "brand": "Relevant L'Oreal brand(s)",
      "market": "${geoLabel}",
      "key_findings": "Detailed findings with specific data points",
      "confidence": "High/Medium/Low",
      "signal_type": "One of the 13 signal types above",
      "category": "Skincare/Color Cosmetics/Hair Care/Sun Care/Body Care",
      "recommendations": [
        {"action": "Short operational action — never use monitor/watch/review", "priority": "Critical/High/Medium/Low", "owner": "Marketing|Product/R&D|Planning|Manufacturing/Supply", "rationale": "Why this matters", "timeline": "When to act", "kpi_outcome": "Increased Sales|Out-of-Stocks Prevented|Forecast Accuracy"}
      ]
    }
  ],
  "priority_actions": [
    {"action": "Most urgent action", "priority": "Critical", "owner": "Team", "impact": "Expected outcome", "timeline": "Timeframe", "owner_team": "Marketing|Product/R&D|Planning|Manufacturing/Supply", "kpi_outcome": "Increased Sales|Out-of-Stocks Prevented|Forecast Accuracy"}
  ],
  "supporting_signals": ["Signal 1 evidence", "Signal 2 evidence"],
  "cross_cutting_themes": "Key themes spanning multiple domains",
  "unified_brief": "Executive brief tying all findings together"
}

CONTENT DISCIPLINE RULES — FOLLOW STRICTLY:
GEOGRAPHY: The market is the United States only. Use "${geoLabel}" as geography. Never say "North America", "global", "international", or "multi-country". Use only United States geography wording matching the selected context.
FILTER DISCIPLINE: Respect the selected Brand, Category, Region, and State strictly. Do not mix in unrelated categories, brands, or geographies. If a specific Brand is selected, only surface signals affecting that brand, its direct competitors, and its category. Do not drift into unrelated portfolio stories.
WHY IT MATTERS: Exactly 3 distinct points. No duplicates. Each must explain a different reason behind the top-line insight. Short, plain language, business-relevant.
ACTIONS: Exactly 3 actions. Short, immediate, operational. No long strategic program names. No "execute growth acceleration program" or "capitalize on long-term momentum". Each action names an owner team and KPI outcome.
KPI CONSISTENCY: KPI status, description, top-line insight, why-it-matters, and actions must all tell the same coherent story. No contradictions like "Needs adjustment" paired with "current forecast aligned".
TOP-LINE INSIGHT: Specific, credible, concise, aligned to selected filters. No inflated phrasing like "7 rising sales opportunities" or "multiple major disruptions".
- EVERY action must name a specific owner team: Marketing, Product/R&D, Planning, or Manufacturing/Supply
- EVERY action must link to a KPI outcome: Increased Sales, Out-of-Stocks Prevented, or Forecast Accuracy
- NO vague actions like "monitor trends", "watch competitor", "review performance" — actions must be concrete and operational
- Include L'Oreal brand performance, specific competitor brand + product, gap vs competitor, reason for gap, and demand implication
- Provide at least 6 specialist analyses covering different domains`

      const result = await callAnalyzeAgent(message)

      if (!result?.success) {
        setAgentError(result?.error ?? 'Analysis failed. Please try again.')
        setAgentLoading(false)
        setActiveAgentId(null)
        return
      }

      const parsed = parseLLMJson(result.response)
      const agentData = parsed?.result ?? parsed ?? {}

      const signalTypes = Array.isArray(agentData?.signal_classifications)
        ? agentData.signal_classifications.map((s: any) => s?.type || s?.category).filter(Boolean)
        : []

      const defaultTypes = ['Opportunity', 'Competitive', 'Launch', 'Claims', 'Consumer Insight']
      const mergedTypes = [...new Set([...signalTypes, ...defaultTypes])]

      const specialistOutputs = Array.isArray(agentData?.specialist_analyses)
        ? agentData.specialist_analyses
        : Array.isArray(agentData?.analyses) ? agentData.analyses : []

      const priorityActions = Array.isArray(agentData?.priority_actions)
        ? agentData.priority_actions
        : Array.isArray(agentData?.actions) ? agentData.actions
        : Array.isArray(agentData?.recommendations) ? agentData.recommendations : []

      const analysisPayload = {
        signal_id: query || '',
        orchestrator_summary: agentData?.executive_summary || agentData?.top_line_insight || agentData?.summary || '',
        specialist_outputs: specialistOutputs,
        signal_types: mergedTypes,
        priority_actions: priorityActions,
        cross_cutting_themes: agentData?.cross_cutting_themes || agentData?.themes || '',
      }

      try {
        const analysisRes = await fetchWrapper('/api/analyses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(analysisPayload),
        })
        if (analysisRes) {
          const ct = analysisRes.headers.get('content-type') || ''
          if (ct.includes('application/json')) {
            await analysisRes.json()
          }
        }
      } catch (e) {
        console.error('Failed to save analysis:', e)
      }

      setHasRunAnalysis(true)
      await fetchAnalyses()
    } catch (err: any) {
      setAgentError(err?.message ?? 'An unexpected error occurred.')
    } finally {
      setAgentLoading(false)
      setActiveAgentId(null)
      setSearchLoading(false)
    }
  }

  const handleRunAnalysis = () => {
    setSearchFilter('')
    runWebAnalysis()
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim() || agentLoading) return
    setSearchLoading(true)
    setSearchFilter(searchQuery.trim())
    setCurrentView('dashboard')
    runWebAnalysis(searchQuery.trim())
  }

  const handleViewAnalysis = (analysis: AnalysisData) => {
    setSelectedAnalysis(analysis)
    setCurrentView('result')
  }

  const handleBackFromResult = () => {
    setSelectedAnalysis(null)
    setCurrentView('dashboard')
  }

  const handleOpenDetail = (item: DetailItem) => {
    setDetailItem(item)
    setCurrentView('detail')
  }

  const handleBackFromDetail = () => {
    setDetailItem(null)
    setCurrentView('dashboard')
  }

  const handleDetailViewAnalysis = (analysisId: string) => {
    const found = analyses.find(a => a._id === analysisId)
    if (found) {
      setSelectedAnalysis(found)
      setCurrentView('result')
      setDetailItem(null)
    }
  }

  const handleNavigate = (view: string) => {
    setDetailItem(null)
    setSelectedAnalysis(null)
    setCurrentView(view)
  }

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            analyses={displayAnalyses}
            loading={loadingAnalyses}
            onNavigate={handleNavigate}
            onViewAnalysis={handleViewAnalysis}
            onOpenDetail={handleOpenDetail}
            agentLoading={agentLoading}
            agentError={agentError}
            hasRunAnalysis={hasRunAnalysis}
            searchFilter={searchFilter}
            filters={filters}
          />
        )
      case 'detail':
        return detailItem ? (
          <DetailView
            item={detailItem}
            onBack={handleBackFromDetail}
            onViewAnalysis={handleDetailViewAnalysis}
          />
        ) : (
          <Dashboard
            analyses={displayAnalyses}
            loading={loadingAnalyses}
            onNavigate={handleNavigate}
            onViewAnalysis={handleViewAnalysis}
            onOpenDetail={handleOpenDetail}
            agentLoading={agentLoading}
            agentError={agentError}
            hasRunAnalysis={hasRunAnalysis}
            searchFilter={searchFilter}
            filters={filters}
          />
        )
      case 'signals':
        return (
          <MarketSignals
            analyses={displayAnalyses}
            onOpenDetail={handleOpenDetail}
            hasRunAnalysis={hasRunAnalysis}
            filters={filters}
          />
        )
      case 'actions':
        return (
          <CategoryListView
            analyses={displayAnalyses}
            onOpenDetail={handleOpenDetail}
            hasRunAnalysis={hasRunAnalysis}
            filters={filters}
          />
        )
      case 'result':
        return (
          <AnalysisResult
            analysis={selectedAnalysis}
            onBack={handleBackFromResult}
          />
        )
      default:
        return (
          <Dashboard
            analyses={displayAnalyses}
            loading={loadingAnalyses}
            onNavigate={handleNavigate}
            onViewAnalysis={handleViewAnalysis}
            onOpenDetail={handleOpenDetail}
            agentLoading={agentLoading}
            agentError={agentError}
            hasRunAnalysis={hasRunAnalysis}
            searchFilter={searchFilter}
            filters={filters}
          />
        )
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground flex">
        <Sidebar currentView={currentView} onNavigate={handleNavigate} />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card gap-4">
            <div className="flex items-center gap-3 flex-shrink-0">
              <h2 className="font-serif text-sm tracking-[0.18em] text-foreground uppercase">
                L&apos;Or&eacute;al White Space Finder
              </h2>
              {activeAgentId && (
                <Badge variant="outline" className="text-[10px] tracking-wider border-primary/40 text-primary animate-pulse">
                  <RiLoader4Line className="h-3 w-3 mr-1 animate-spin" />
                  Scanning
                </Badge>
              )}
            </div>

            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
              <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search United States trends, brands, competitors, or market signals..."
                  className="w-full bg-secondary/50 border border-border pl-9 pr-4 py-1.5 text-[12px] text-foreground tracking-wide placeholder:text-muted-foreground focus:outline-none focus:border-primary/40 transition-colors"
                  disabled={agentLoading}
                />
                {searchLoading && (
                  <RiLoader4Line className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-primary animate-spin" />
                )}
              </div>
            </form>

            <div className="flex items-center gap-3 text-[10px] text-muted-foreground tracking-wide flex-shrink-0">
              <RiRadarLine className="h-3.5 w-3.5 text-primary" />
              <span className={activeAgentId ? 'text-primary' : ''}>{activeAgentId ? 'Scanning the web...' : 'System ready'}</span>
            </div>
          </header>
          {showFilterBar && <FilterBar filters={filters} onChange={setFilters} onRunAnalysis={handleRunAnalysis} agentLoading={agentLoading} />}
          {renderContent()}
          <div className="px-6 py-2.5 border-t border-border bg-card flex items-center justify-between">
            <p className="text-[9px] text-muted-foreground tracking-[0.15em] uppercase">
              Whitespace Intelligence Platform
            </p>
            <p className="text-[9px] text-muted-foreground tracking-[0.12em]">
              L&apos;Or&eacute;al Market Intelligence
            </p>
          </div>
        </div>
        <AgentChat analyses={displayAnalyses} />
      </div>
    </ErrorBoundary>
  )
}
