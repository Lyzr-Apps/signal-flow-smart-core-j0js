'use client'

import React, { useMemo } from 'react'
import {
  RiArrowRightUpLine, RiErrorWarningLine, RiFlashlightLine,
  RiArrowRightSLine, RiCloseCircleLine, RiSearchLine,
  RiBarChartGroupedLine, RiLineChartLine, RiShieldCheckLine,
  RiLightbulbLine, RiTeamLine, RiAlertLine,
} from 'react-icons/ri'
import {
  urgencyBadge, cleanText, deriveFromAnalyses, applyFilters, applyActionFilters,
  buildDashboardStory,
  SEEDED_SIGNALS, SEEDED_ACTIONS, SEEDED_OPPORTUNITIES, SEEDED_RISKS,
  type AnalysisItem, type SeededSignal, type SeededAction,
  type FilterState,
} from './data/seededScenarios'
import type { DetailItem } from './DetailView'

interface DashboardProps {
  analyses: AnalysisItem[]
  loading: boolean
  onNavigate: (view: string) => void
  onViewAnalysis: (analysis: AnalysisItem) => void
  onOpenDetail: (item: DetailItem) => void
  agentLoading?: boolean
  agentError?: string | null
  hasRunAnalysis?: boolean
  searchFilter?: string
  filters: FilterState
}

function matchesQuery(query: string, ...fields: string[]): boolean {
  if (!query) return true
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  const text = fields.join(' ').toLowerCase()
  return terms.some(term => text.includes(term))
}

export default function Dashboard({
  analyses, loading, onNavigate, onViewAnalysis, onOpenDetail,
  agentLoading, agentError, hasRunAnalysis, searchFilter = '', filters,
}: DashboardProps) {
  const safeAnalyses = Array.isArray(analyses) ? analyses : []
  const derived = useMemo(() => deriveFromAnalyses(safeAnalyses), [safeAnalyses])
  const useReal = !!hasRunAnalysis && safeAnalyses.length > 0

  const q = searchFilter
  const rawSignals = useReal && derived.signals.length > 0 ? derived.signals : SEEDED_SIGNALS
  const rawActions = useReal && derived.actions.length > 0 ? derived.actions : SEEDED_ACTIONS
  const rawOpps = useReal && derived.opportunities.length > 0 ? derived.opportunities : SEEDED_OPPORTUNITIES
  const rawRisks = useReal && derived.risks.length > 0 ? derived.risks : SEEDED_RISKS

  const allSignals = applyFilters(rawSignals, filters).filter(s => matchesQuery(q, s.title, s.brand, s.market, s.why))
  const allActions = applyActionFilters(rawActions, filters).filter(a => matchesQuery(q, a.title, a.owner, a.impact))
  const allOpps = applyFilters(rawOpps, filters).filter(o => matchesQuery(q, o.title, o.brand, o.market, o.why))
  const allRisks = applyFilters(rawRisks, filters).filter(r => matchesQuery(q, r.title, r.brand, r.market, r.cause))

  const story = useMemo(
    () => buildDashboardStory(allSignals, allActions, allOpps, allRisks, filters),
    [allSignals, allActions, allOpps, allRisks, filters]
  )

  const isPortfolio = !filters.brand || filters.brand === 'All Brands'

  const openSignal = (sig: SeededSignal) => {
    onOpenDetail({
      category: 'signal', title: sig.title, brand: sig.brand, market: sig.market, severity: sig.urgency,
      sections: sig.detailSections.length > 0 ? sig.detailSections : [{ label: 'What Changed', content: sig.why }, { label: 'What Teams Should Do', content: sig.nextStep }],
      relatedActions: sig.relatedActions, metrics: sig.metrics,
    })
  }

  const openAction = (act: SeededAction) => {
    onOpenDetail({
      category: 'action', title: act.title, severity: act.priority,
      sections: [
        { label: 'Expected Impact', content: act.impact },
        { label: 'Owner', content: act.ownerTeam || act.owner },
        { label: 'Timeline', content: act.timeline },
        { label: 'KPI Outcome', content: act.kpiOutcome || 'Increased Sales' },
      ],
    })
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {agentLoading && (
        <div className="mx-8 mt-6 bg-primary/5 border border-primary/20 p-3 flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin flex-shrink-0" />
          <div>
            <p className="text-[12px] text-foreground tracking-wide">Scanning North America market intelligence...</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">This typically takes 30-60 seconds. Results will appear across all sections.</p>
          </div>
        </div>
      )}
      {agentError && (
        <div className="mx-8 mt-6 bg-red-500/5 border border-red-500/20 p-3 flex items-center gap-3">
          <RiCloseCircleLine className="h-4 w-4 text-red-400 flex-shrink-0" />
          <p className="text-[12px] text-red-400 tracking-wide flex-1">{agentError}</p>
        </div>
      )}
      {q && (
        <div className="mx-8 mt-6 bg-primary/5 border border-primary/20 p-3 flex items-center gap-3">
          <RiSearchLine className="h-3.5 w-3.5 text-primary flex-shrink-0" />
          <p className="text-[12px] text-foreground tracking-wide flex-1">
            Filtering results for: <span className="text-primary font-medium">&ldquo;{q}&rdquo;</span>
          </p>
        </div>
      )}

      <div className="px-8 py-6 space-y-6">
        {/* 1. Top-line Insight */}
        <div className="bg-card border border-primary/30 p-6">
          <div className="flex items-center gap-2 mb-3">
            <RiLightbulbLine className="h-4 w-4 text-primary" />
            <p className="text-[10px] tracking-[0.14em] text-primary uppercase">
              {isPortfolio ? 'Portfolio Insight' : `${filters.brand} Insight`}
            </p>
          </div>
          <p className="text-[15px] text-foreground leading-relaxed tracking-wide font-serif">
            {story.topLineInsight}
          </p>
        </div>

        {/* 2. Why It Matters */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <RiAlertLine className="h-4 w-4 text-amber-400" />
            <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Why It Matters</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {story.whyItMatters.map((item, i) => (
              <div key={i} className="bg-card border border-border p-4">
                <h4 className="text-[13px] text-foreground tracking-wide leading-snug mb-2">{item.title}</h4>
                <p className="text-[11px] text-foreground/60 leading-relaxed">{item.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* 3. How to Act */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <RiFlashlightLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">How to Act</h3>
            </div>
            <button onClick={() => onNavigate('actions')} className="text-[10px] text-primary tracking-[0.1em] uppercase hover:text-primary/80 transition-colors flex items-center gap-1">
              All Actions <RiArrowRightSLine className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            {story.howToAct.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  const matched = allActions.find(a => a.title === item.action)
                  if (matched) openAction(matched)
                }}
                className="bg-card border border-border p-4 text-left hover:border-primary/40 transition-colors group"
              >
                <h4 className="text-[13px] text-foreground tracking-wide leading-snug mb-2 group-hover:text-primary transition-colors">{item.action}</h4>
                <div className="flex items-center gap-2 text-[10px] text-muted-foreground tracking-wide">
                  <RiTeamLine className="h-3 w-3" />
                  <span>{item.ownerTeam}</span>
                  <span className="text-border">|</span>
                  <span className="text-primary">{item.kpiOutcome}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 4. KPI Outcomes */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <RiBarChartGroupedLine className="h-4 w-4 text-emerald-400" />
            <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">KPI Outcomes</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <div className="bg-card border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <RiArrowRightUpLine className="h-3.5 w-3.5 text-emerald-400" />
                <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Increased Sales</p>
              </div>
              <p className="text-[12px] text-foreground tracking-wide">{story.kpiOutcomes.sales}</p>
            </div>
            <div className="bg-card border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <RiShieldCheckLine className="h-3.5 w-3.5 text-amber-400" />
                <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Out-of-Stocks Prevented</p>
              </div>
              <p className="text-[12px] text-foreground tracking-wide">{story.kpiOutcomes.stockouts}</p>
            </div>
            <div className="bg-card border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <RiLineChartLine className="h-3.5 w-3.5 text-primary" />
                <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Forecast Accuracy</p>
              </div>
              <p className="text-[12px] text-foreground tracking-wide">{story.kpiOutcomes.forecast}</p>
            </div>
          </div>
        </div>

        {/* Top Signals Preview */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <RiErrorWarningLine className="h-4 w-4 text-amber-400" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Top Signals</h3>
            </div>
            <button onClick={() => onNavigate('signals')} className="text-[10px] text-primary tracking-[0.1em] uppercase hover:text-primary/80 transition-colors flex items-center gap-1">
              All Signals <RiArrowRightSLine className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {allSignals.slice(0, 2).map((sig, i) => (
              <button key={i} onClick={() => openSignal(sig)} className="bg-card border border-border p-4 text-left hover:border-primary/40 transition-colors group">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-[13px] text-foreground tracking-wide leading-snug group-hover:text-primary transition-colors">{sig.title}</h4>
                  <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 whitespace-nowrap flex-shrink-0 ${urgencyBadge(sig.urgency)}`}>{sig.urgency}</span>
                </div>
                <div className="flex gap-3 mb-2 text-[10px] text-muted-foreground tracking-wide">
                  <span>{sig.brand}</span><span className="text-border">|</span><span>{sig.market}</span>
                  {sig.signalType && <><span className="text-border">|</span><span className="text-primary">{sig.signalType}</span></>}
                </div>
                <p className="text-[11px] text-foreground/60 leading-relaxed">{cleanText(sig.why, 120)}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
