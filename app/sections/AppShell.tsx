'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import parseLLMJson from '@/lib/jsonParser'
import fetchWrapper from '@/lib/fetchWrapper'
import { Badge } from '@/components/ui/badge'
import { RiRadarLine, RiLoader4Line, RiSearchLine } from 'react-icons/ri'
import {
  SEEDED_SIGNALS, SEEDED_ACTIONS, SEEDED_OPPORTUNITIES, SEEDED_RISKS, SEEDED_ALERTS,
} from './sections/data/seededScenarios'

import Sidebar from './sections/Sidebar'
import Dashboard from './sections/Dashboard'
import CategoryListView from './sections/CategoryListView'
import AnalysisResult from './sections/AnalysisResult'
import AnalysisHistory from './sections/AnalysisHistory'
import DetailView from './sections/DetailView'
import MarketSignals from './sections/MarketSignals'
import DemandView from './sections/DemandView'
import AgentChat from './sections/AgentChat'
import type { DetailItem } from './sections/DetailView'

const AGENT_ID = '69c4231c4d9b1d0c43a2101b'
const WEB_AGENT_ID = '69c5630b37c96c3d3ffadec1'

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

  // Filter seeded data by search query relevance
  const [searchFilter, setSearchFilter] = useState('')
  const displayAnalyses = analyses

  const runWebAnalysis = async (query?: string) => {
    setAgentError(null)
    setAgentLoading(true)
    setActiveAgentId(WEB_AGENT_ID)

    try {
      const basePrompt = query
        ? `Search the web for real-time beauty and cosmetics industry intelligence related to: "${query}". Focus on L'Oreal portfolio brands and their competitive landscape in North America (United States and Canada) unless another market is explicitly mentioned in the query.`
        : `Conduct a comprehensive real-time beauty and cosmetics industry demand sensing analysis for L'Oreal in North America (United States and Canada). Search the web for the latest developments as of today.`

      const message = `${basePrompt}

You MUST respond in valid JSON format with this exact structure:
{
  "executive_summary": "2-3 sentence overview of the most important findings",
  "signal_classifications": [
    {"type": "Opportunity", "description": "..."},
    {"type": "Competitive", "description": "..."},
    {"type": "Launch", "description": "..."},
    {"type": "Claims", "description": "..."},
    {"type": "Consumer Insight", "description": "..."}
  ],
  "specialist_analyses": [
    {
      "domain": "Ingredient Trends & Innovation",
      "title": "Short action-oriented title for this finding",
      "brand": "Relevant L'Oreal brand(s)",
      "market": "Geographic market (use full names like Southeast Asia, not abbreviations)",
      "key_findings": "Detailed findings with specific data points from web search",
      "confidence": "High/Medium/Low",
      "recommendations": [
        {"action": "Specific action to take", "priority": "Critical/High/Medium/Low", "owner": "Team responsible (Product, Marketing, Planning, or Manufacturing)", "rationale": "Why this matters", "timeline": "When to act"}
      ]
    },
    {
      "domain": "Competitive Intelligence & Market Threats",
      "title": "Short title",
      "brand": "Relevant brand",
      "market": "Market",
      "key_findings": "Competitive landscape findings with data",
      "recommendations": [{"action": "...", "priority": "High", "owner": "...", "rationale": "..."}]
    },
    {
      "domain": "Consumer Sentiment & Social Trends",
      "title": "Short title",
      "brand": "Relevant brand",
      "market": "Market",
      "key_findings": "Social media and consumer sentiment data",
      "recommendations": [{"action": "...", "priority": "High", "owner": "...", "rationale": "..."}]
    },
    {
      "domain": "Claims Safety & Regulatory Compliance",
      "title": "Short title about safety/regulatory concern",
      "brand": "Affected brand",
      "market": "Market",
      "key_findings": "Safety concerns, regulatory changes, or claims risks",
      "recommendations": [{"action": "...", "priority": "Critical", "owner": "...", "rationale": "..."}]
    },
    {
      "domain": "Launch Performance & Market Response",
      "title": "Short title about launch/performance",
      "brand": "Brand with launch",
      "market": "Market",
      "key_findings": "Product launch data and market reception",
      "recommendations": [{"action": "...", "priority": "High", "owner": "...", "rationale": "..."}]
    },
    {
      "domain": "Market Opportunity & Whitespace",
      "title": "Short title about opportunity",
      "brand": "Best positioned brand",
      "market": "Target market",
      "key_findings": "Whitespace and growth opportunity analysis",
      "confidence": "High",
      "recommendations": [{"action": "...", "priority": "High", "owner": "...", "rationale": "..."}]
    }
  ],
  "priority_actions": [
    {"action": "Most urgent action", "priority": "Critical", "owner": "Team", "impact": "Expected outcome", "timeline": "Timeframe"},
    {"action": "Second action", "priority": "High", "owner": "Team", "impact": "Expected outcome", "timeline": "Timeframe"},
    {"action": "Third action", "priority": "High", "owner": "Team", "impact": "Expected outcome", "timeline": "Timeframe"},
    {"action": "Fourth action", "priority": "Medium", "owner": "Team", "impact": "Expected outcome", "timeline": "Timeframe"}
  ],
  "cross_cutting_themes": "Key themes spanning multiple domains"
}

IMPORTANT LANGUAGE RULES:
- Default market is North America (United States and Canada) unless another market is explicitly requested
- Use full geographic names: "United States" not "US", "North America" not "NA"
- Use short, action-oriented titles: "Format Fix Needed" not "Product Format Optimization Required"
- Make recommendations team-specific: Marketing, Product/R&D, Planning, or Manufacturing/Supply
- Include confidence levels and supporting evidence with percentages
- For every insight, include: L'Oreal brand performance, specific competitor brand + product name, gap vs competitor, reason for gap, and demand implication

Cover these areas with REAL current data from web search, focusing on North America:
1. Emerging ingredient trends in US market (peptides, retinoids, niacinamide, ceramides, bakuchiol, etc.)
2. Competitor launches and campaigns in US/Canada (P&G/Olay, Estee Lauder/The Ordinary, Unilever, e.l.f., Kenvue/Neutrogena, Galderma/Cetaphil)
3. Product launch performance and US consumer reception
4. Ingredient safety concerns, US regulatory changes (PFAS, FDA sunscreen rules), and claims risks
5. Consumer sentiment on US TikTok, Reddit, and beauty forums
6. US market whitespace and growth opportunities

For each specialist analysis, clearly state:
- Which specific L'Oreal brand is impacted
- Which specific competitor brand and product is relevant
- How L'Oreal is performing vs the competitor (with data)
- Why there is a gap
- What this means for demand in North America

Provide at least 6 specialist analyses covering ALL the domains above. Include specific data, brand names, percentages, and web sources.`

      const result = await callAIAgent(message, WEB_AGENT_ID)

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
        orchestrator_summary: agentData?.executive_summary || agentData?.summary || '',
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
          />
        )
      case 'market-signals':
        return (
          <MarketSignals
            analyses={displayAnalyses}
            onOpenDetail={handleOpenDetail}
            hasRunAnalysis={hasRunAnalysis}
          />
        )
      case 'demand-overview':
        return (
          <DemandView
            subView="overview"
            analyses={displayAnalyses}
            onOpenDetail={handleOpenDetail}
            hasRunAnalysis={hasRunAnalysis}
          />
        )
      case 'demand-opportunities':
        return (
          <DemandView
            subView="opportunities"
            analyses={displayAnalyses}
            onOpenDetail={handleOpenDetail}
            hasRunAnalysis={hasRunAnalysis}
          />
        )
      case 'demand-risks':
        return (
          <DemandView
            subView="risks"
            analyses={displayAnalyses}
            onOpenDetail={handleOpenDetail}
            hasRunAnalysis={hasRunAnalysis}
          />
        )
      case 'actions-list':
        return (
          <CategoryListView
            category="actions"
            analyses={displayAnalyses}
            onOpenDetail={handleOpenDetail}
            hasRunAnalysis={hasRunAnalysis}
          />
        )
      case 'result':
        return (
          <AnalysisResult
            analysis={selectedAnalysis}
            onBack={handleBackFromResult}
          />
        )
      case 'history':
        return (
          <AnalysisHistory
            analyses={displayAnalyses}
            loading={loadingAnalyses}
            onViewAnalysis={handleViewAnalysis}
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
          />
        )
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground flex">
        <Sidebar currentView={currentView} onNavigate={handleNavigate} onRunAnalysis={handleRunAnalysis} agentLoading={agentLoading} />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card gap-4">
            <div className="flex items-center gap-3 flex-shrink-0">
              <h2 className="font-serif text-sm tracking-[0.18em] text-foreground uppercase">
                L&apos;Or&eacute;al Demand Sensor
              </h2>
              {activeAgentId && (
                <Badge variant="outline" className="text-[10px] tracking-wider border-primary/40 text-primary animate-pulse">
                  <RiLoader4Line className="h-3 w-3 mr-1 animate-spin" />
                  Scanning
                </Badge>
              )}
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-xl">
              <div className="relative">
                <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search US trends, brands, competitors, or market signals..."
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
          {renderContent()}
          <div className="px-6 py-2.5 border-t border-border bg-card flex items-center justify-between">
            <p className="text-[9px] text-muted-foreground tracking-[0.15em] uppercase">
              Demand Intelligence Platform
            </p>
            <p className="text-[9px] text-muted-foreground tracking-[0.12em]">
              L&apos;Or&eacute;al Market Intelligence
            </p>
          </div>
        </div>
        <AgentChat />
      </div>
    </ErrorBoundary>
  )
}
