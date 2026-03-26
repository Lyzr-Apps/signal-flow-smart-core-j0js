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
      const message = `Conduct a comprehensive real-time beauty and cosmetics industry foresight analysis for L'Oreal. Search the web for the latest developments as of today. Cover:

1. Emerging skincare and haircare ingredient trends (peptides, retinoids, exosomes, niacinamide, ceramides, etc.)
2. Competitor brand launches and campaigns (Estee Lauder, P&G Beauty, Unilever, Shiseido, Beiersdorf, and indie brands)
3. Recent product launch performance and consumer reception
4. Ingredient safety concerns, regulatory changes, and claims risks
5. Consumer sentiment shifts on social media, TikTok, Reddit, and beauty forums
6. Market opportunities and whitespace areas

Provide specific, data-backed findings from current web sources. Include signal classifications, specialist analyses across at least 4 domains, and prioritized action recommendations for L'Oreal portfolio brands.`

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
        ? agentData.signal_classifications.map((s: any) => s?.type).filter(Boolean)
        : []

      const analysisPayload = {
        signal_id: '',
        orchestrator_summary: agentData?.executive_summary ?? '',
        specialist_outputs: Array.isArray(agentData?.specialist_analyses) ? agentData.specialist_analyses : [],
        signal_types: signalTypes,
        priority_actions: Array.isArray(agentData?.priority_actions) ? agentData.priority_actions : [],
        cross_cutting_themes: agentData?.cross_cutting_themes ?? '',
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

      setSelectedAnalysis(savedAnalysis)
      setCurrentView('result')
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
            onRunAnalysis={handleRunAnalysis}
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
            onRunAnalysis={handleRunAnalysis}
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
            onRunAnalysis={handleRunAnalysis}
            agentLoading={agentLoading}
            agentError={agentError}
          />
        )
    }
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground flex">
        <Sidebar currentView={currentView} onNavigate={handleNavigate} />
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
