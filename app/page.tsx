'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { callAIAgent } from '@/lib/aiAgent'
import parseLLMJson from '@/lib/jsonParser'
import fetchWrapper from '@/lib/fetchWrapper'
import { Badge } from '@/components/ui/badge'
import { RiRadarLine, RiLoader4Line } from 'react-icons/ri'

import Sidebar from './sections/Sidebar'
import Dashboard from './sections/Dashboard'
import CategoryListView from './sections/CategoryListView'
import AnalysisResult from './sections/AnalysisResult'
import AnalysisHistory from './sections/AnalysisHistory'
import DetailView from './sections/DetailView'
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

export default function Page() {
  const [currentView, setCurrentView] = useState('dashboard')
  const [analyses, setAnalyses] = useState<AnalysisData[]>([])
  const [loadingAnalyses, setLoadingAnalyses] = useState(false)
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisData | null>(null)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [detailItem, setDetailItem] = useState<DetailItem | null>(null)
  const [agentLoading, setAgentLoading] = useState(false)
  const [agentError, setAgentError] = useState<string | null>(null)

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

  const displayAnalyses = analyses

  const handleRunAnalysis = async () => {
    setAgentError(null)
    setAgentLoading(true)
    setActiveAgentId(WEB_AGENT_ID)

    try {
      const message = `Conduct a comprehensive real-time beauty and cosmetics industry foresight analysis for L'Oreal. Search the web for the latest developments as of today.

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
      "title": "Short title for this finding",
      "brand": "Relevant L'Oreal brand(s)",
      "market": "Geographic market",
      "key_findings": "Detailed findings with specific data points from web search",
      "confidence": "High/Medium/Low",
      "recommendations": [
        {"action": "Specific action to take", "priority": "Critical/High/Medium/Low", "owner": "Team responsible", "rationale": "Why this matters", "timeline": "When to act"}
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

Cover these areas with REAL current data from web search:
1. Emerging ingredient trends (peptides, retinoids, exosomes, niacinamide, ceramides, bakuchiol, etc.)
2. Competitor launches and campaigns (Estee Lauder, P&G Beauty, Unilever, Shiseido, Beiersdorf, indie brands)
3. Product launch performance and consumer reception
4. Ingredient safety concerns, regulatory changes, and claims risks
5. Consumer sentiment on TikTok, Reddit, and beauty forums
6. Market whitespace and growth opportunities

Provide at least 6 specialist analyses covering ALL the domains above. Include specific data, brand names, percentages, and web sources. Every specialist analysis must have a clear "title", "brand", "market", and at least 2 recommendations.`

      const result = await callAIAgent(message, WEB_AGENT_ID)

      if (!result?.success) {
        setAgentError(result?.error ?? 'Web analysis failed. Please try again.')
        setAgentLoading(false)
        setActiveAgentId(null)
        return
      }

      const parsed = parseLLMJson(result.response)
      const agentData = parsed?.result ?? parsed ?? {}

      const signalTypes = Array.isArray(agentData?.signal_classifications)
        ? agentData.signal_classifications.map((s: any) => s?.type || s?.category).filter(Boolean)
        : []

      // Ensure signal types cover all categories for proper routing in deriveFromAnalyses
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
        signal_id: '',
        orchestrator_summary: agentData?.executive_summary || agentData?.summary || '',
        specialist_outputs: specialistOutputs,
        signal_types: mergedTypes,
        priority_actions: priorityActions,
        cross_cutting_themes: agentData?.cross_cutting_themes || agentData?.themes || '',
      }

      let savedAnalysis: any = { ...analysisPayload, createdAt: new Date().toISOString() }
      try {
        const analysisRes = await fetchWrapper('/api/analyses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(analysisPayload),
        })
        if (analysisRes) {
          const ct = analysisRes.headers.get('content-type') || ''
          if (ct.includes('application/json')) {
            const analysisData = await analysisRes.json()
            if (analysisData?.data) {
              savedAnalysis = analysisData.data
            }
          }
        }
      } catch (e) {
        console.error('Failed to save analysis:', e)
      }

      await fetchAnalyses()
    } catch (err: any) {
      setAgentError(err?.message ?? 'An unexpected error occurred.')
    } finally {
      setAgentLoading(false)
      setActiveAgentId(null)
    }
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
          />
        )
      case 'actions-list':
        return (
          <CategoryListView
            category="actions"
            analyses={displayAnalyses}
            onOpenDetail={handleOpenDetail}
          />
        )
      case 'opportunities-list':
        return (
          <CategoryListView
            category="opportunities"
            analyses={displayAnalyses}
            onOpenDetail={handleOpenDetail}
          />
        )
      case 'risks-list':
        return (
          <CategoryListView
            category="risks"
            analyses={displayAnalyses}
            onOpenDetail={handleOpenDetail}
          />
        )
      case 'alerts-list':
        return (
          <CategoryListView
            category="alerts"
            analyses={displayAnalyses}
            onOpenDetail={handleOpenDetail}
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
          />
        )
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground flex">
        <Sidebar currentView={currentView} onNavigate={handleNavigate} onRunAnalysis={handleRunAnalysis} agentLoading={agentLoading} />
        <div className="flex-1 flex flex-col min-h-screen">
          <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
            <div className="flex items-center gap-3">
              <h2 className="font-serif text-sm tracking-[0.18em] text-foreground uppercase">
                L&apos;Or&eacute;al Foresight
              </h2>
              <span className="text-[9px] tracking-[0.15em] text-muted-foreground uppercase">Powered by BlueVerse</span>
              {activeAgentId && (
                <Badge variant="outline" className="text-[10px] tracking-wider border-primary/40 text-primary animate-pulse">
                  <RiLoader4Line className="h-3 w-3 mr-1 animate-spin" />
                  Analyzing
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground tracking-wide">
              <RiRadarLine className="h-3.5 w-3.5 text-primary" />
              <span className={activeAgentId ? 'text-primary' : ''}>{activeAgentId ? 'Searching the web...' : 'System ready'}</span>
            </div>
          </header>
          {renderContent()}
          <div className="px-6 py-2.5 border-t border-border bg-card flex items-center justify-between">
            <p className="text-[9px] text-muted-foreground tracking-[0.15em] uppercase">
              Strategic Intelligence Platform
            </p>
            <p className="text-[9px] text-muted-foreground tracking-[0.12em]">
              BlueVerse Signal Orchestration
            </p>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}
