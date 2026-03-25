'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AuthProvider, ProtectedRoute, UserMenu } from 'lyzr-architect/client'
import { callAIAgent } from '@/lib/aiAgent'
import parseLLMJson from '@/lib/jsonParser'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Activity, Loader2 } from 'lucide-react'

import AuthScreen from './sections/AuthScreen'
import Sidebar from './sections/Sidebar'
import Dashboard from './sections/Dashboard'
import SignalInput from './sections/SignalInput'
import AnalysisResult from './sections/AnalysisResult'
import AnalysisHistory from './sections/AnalysisHistory'

const AGENT_ID = '69c4231c4d9b1d0c43a2101b'

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

const SAMPLE_ANALYSES: AnalysisData[] = [
  {
    _id: 'sample-1',
    orchestrator_summary: '**Market Opportunity Detected**: Rising consumer demand for sustainable packaging in the APAC skincare market. Key competitors are shifting to refillable formats, creating both a threat and an opportunity for brand repositioning.',
    signal_types: ['Opportunity', 'Competitive'],
    specialist_outputs: [
      { agent_name: 'Market Intelligence Analyst', domain: 'Market Trends', key_findings: 'APAC sustainable beauty market growing at 12% CAGR. Consumer surveys indicate 68% willingness to pay premium for eco-packaging.', confidence: 'High', recommendations: [{ action: 'Launch refillable packaging pilot in South Korea', priority: 'High', rationale: 'First-mover advantage in fastest-growing segment' }] },
      { agent_name: 'Competitive Intelligence Specialist', domain: 'Competitor Analysis', key_findings: 'Shiseido and Amorepacific have announced refillable lines for Q3 launch. Window for first-mover positioning is narrowing.', confidence: 'Medium', recommendations: [{ action: 'Accelerate sustainable packaging R&D timeline', priority: 'High', rationale: 'Competitive window closing within 6 months' }] },
    ],
    priority_actions: [
      { action: 'Commission refillable packaging feasibility study', priority: 'High', owner: 'R&D / Packaging' },
      { action: 'Develop APAC sustainability marketing campaign', priority: 'Medium', owner: 'Marketing APAC' },
    ],
    cross_cutting_themes: 'Sustainability as both a consumer demand driver and competitive differentiator. Speed to market is critical given competitor timelines.',
    createdAt: '2026-03-20T14:30:00Z',
  },
  {
    _id: 'sample-2',
    orchestrator_summary: '**Claims Risk Alert**: New EU regulations on anti-aging claims require substantiation updates for retinol-based products. Immediate review of current marketing materials recommended.',
    signal_types: ['Claims', 'Risk'],
    specialist_outputs: [
      { agent_name: 'Regulatory Affairs Analyst', domain: 'Claims Compliance', key_findings: 'EU Cosmetic Regulation update requires clinical evidence for "anti-wrinkle" claims. Enforcement begins Q2 2026.', confidence: 'High', recommendations: [{ action: 'Audit all anti-aging claims across EU portfolio', priority: 'Critical', rationale: 'Non-compliance risk after Q2 deadline' }] },
    ],
    priority_actions: [
      { action: 'Conduct claims audit for EU retinol portfolio', priority: 'Critical', owner: 'Regulatory Affairs' },
      { action: 'Update product labeling and marketing copy', priority: 'High', owner: 'Brand Management' },
    ],
    cross_cutting_themes: 'Regulatory compliance intersects with brand trust. Proactive claims management protects market position.',
    createdAt: '2026-03-18T09:15:00Z',
  },
  {
    _id: 'sample-3',
    orchestrator_summary: '**Consumer Sentiment Shift**: Social listening reveals growing demand for "skinimalism" -- simplified routines with multi-benefit products. This challenges current multi-step regimen positioning.',
    signal_types: ['Consumer', 'Launch'],
    specialist_outputs: [
      { agent_name: 'Consumer Insights Analyst', domain: 'Consumer Behavior', key_findings: 'TikTok mentions of "skinimalism" up 340% YoY. Gen Z consumers actively rejecting 10-step routines in favor of 3-step approaches.', confidence: 'High', recommendations: [{ action: 'Develop multi-benefit hero SKU for Gen Z', priority: 'High', rationale: 'Capitalize on skinimalism trend before competitors' }] },
    ],
    priority_actions: [
      { action: 'Brief innovation team on multi-benefit product development', priority: 'High', owner: 'Innovation Lab' },
      { action: 'Adjust Gen Z digital marketing strategy', priority: 'Medium', owner: 'Digital Marketing' },
    ],
    cross_cutting_themes: 'Consumer simplification trend requires product innovation and marketing pivot simultaneously.',
    createdAt: '2026-03-15T11:00:00Z',
  },
]

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
  const [agentLoading, setAgentLoading] = useState(false)
  const [agentError, setAgentError] = useState<string | null>(null)
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisData | null>(null)
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null)
  const [sampleMode, setSampleMode] = useState(false)

  const fetchAnalyses = useCallback(async () => {
    setLoadingAnalyses(true)
    try {
      const res = await fetch('/api/analyses')
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

  const displayAnalyses = sampleMode ? [...SAMPLE_ANALYSES, ...analyses] : analyses

  const handleSignalSubmit = async (fields: Record<string, string>, narrative: string) => {
    setAgentError(null)
    setAgentLoading(true)
    setActiveAgentId(AGENT_ID)

    try {
      const signalRes = await fetch('/api/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input_text: narrative,
          structured_fields: fields,
          signal_types: [],
          status: 'pending',
        }),
      })
      const signalData = await signalRes.json()
      const signalId = signalData?.data?._id ?? ''

      const fieldParts = Object.entries(fields)
        .filter(([, v]) => v.trim())
        .map(([k, v]) => `${k.replace(/_/g, ' ')}: ${v}`)
        .join('\n')
      const message = [fieldParts, narrative].filter(Boolean).join('\n\n')

      const result = await callAIAgent(message, AGENT_ID)

      if (!result?.success) {
        setAgentError(result?.error ?? 'Agent call failed.')
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
        signal_id: signalId,
        orchestrator_summary: agentData?.executive_summary ?? '',
        specialist_outputs: Array.isArray(agentData?.specialist_analyses) ? agentData.specialist_analyses : [],
        signal_types: signalTypes,
        priority_actions: Array.isArray(agentData?.priority_actions) ? agentData.priority_actions : [],
        cross_cutting_themes: agentData?.cross_cutting_themes ?? '',
      }

      const analysisRes = await fetch('/api/analyses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(analysisPayload),
      })
      const analysisData = await analysisRes.json()

      const savedAnalysis = analysisData?.data ?? { ...analysisPayload, createdAt: new Date().toISOString() }
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

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            analyses={displayAnalyses}
            loading={loadingAnalyses}
            onNavigate={setCurrentView}
            onViewAnalysis={handleViewAnalysis}
          />
        )
      case 'new-signal':
        return (
          <SignalInput
            loading={agentLoading}
            error={agentError}
            onSubmit={handleSignalSubmit}
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
            onNavigate={setCurrentView}
            onViewAnalysis={handleViewAnalysis}
          />
        )
    }
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ProtectedRoute unauthenticatedFallback={<AuthScreen />}>
          <div className="min-h-screen bg-background text-foreground flex">
            <Sidebar currentView={currentView} onNavigate={setCurrentView} />
            <div className="flex-1 flex flex-col min-h-screen">
              <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-card">
                <div className="flex items-center gap-3">
                  <h2 className="font-serif text-sm tracking-widest text-foreground uppercase">
                    Foresight System
                  </h2>
                  {activeAgentId && (
                    <Badge variant="outline" className="text-[10px] tracking-wider border-primary/40 text-primary animate-pulse">
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Analyzing
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      id="sample-toggle"
                      checked={sampleMode}
                      onCheckedChange={setSampleMode}
                    />
                    <Label htmlFor="sample-toggle" className="text-xs text-muted-foreground tracking-wide cursor-pointer">
                      Sample Data
                    </Label>
                  </div>
                  <UserMenu />
                </div>
              </header>
              {renderContent()}
              <div className="px-6 py-3 border-t border-border bg-card flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground tracking-wider">
                  <Activity className="h-3 w-3" />
                  <span>Signal Orchestrator Manager</span>
                  <span className="mx-1">|</span>
                  <span className={activeAgentId ? 'text-primary' : 'text-muted-foreground'}>
                    {activeAgentId ? 'Processing' : 'Ready'}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground tracking-wider">
                  Agent ID: {AGENT_ID.slice(0, 8)}...
                </span>
              </div>
            </div>
          </div>
        </ProtectedRoute>
      </AuthProvider>
    </ErrorBoundary>
  )
}
