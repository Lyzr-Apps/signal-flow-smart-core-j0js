'use client'

import React, { useMemo } from 'react'
import { RiArrowRightUpLine, RiErrorWarningLine, RiFlashlightLine, RiAlertLine, RiArrowRightSLine, RiCloseCircleLine, RiSearchLine, RiBarChartGroupedLine, RiLineChartLine } from 'react-icons/ri'
import {
  urgencyBadge, cleanText, isHighPriority, deriveFromAnalyses,
  SEEDED_SIGNALS, SEEDED_ACTIONS, SEEDED_OPPORTUNITIES, SEEDED_RISKS, SEEDED_ALERTS,
  type AnalysisItem, type SeededSignal, type SeededAction, type SeededOpportunity, type SeededRisk, type SeededAlert,
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
}

function matchesQuery(query: string, ...fields: string[]): boolean {
  if (!query) return true
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean)
  const text = fields.join(' ').toLowerCase()
  return terms.some(term => text.includes(term))
}

// Business dataset baselines (from L'Oréal sample data)
const BASELINES: Record<string, { salesLift: number; captureRate: number; forecastAcc: number; position: string }> = {
  s1: { salesLift: 2.5, captureRate: 60, forecastAcc: 68, position: 'Underperforming' },
  s2: { salesLift: 3.0, captureRate: 62, forecastAcc: 70, position: 'Matching' },
  s3: { salesLift: 2.2, captureRate: 58, forecastAcc: 67, position: 'Underperforming' },
  s4: { salesLift: 3.8, captureRate: 66, forecastAcc: 69, position: 'Underperforming' },
  s5: { salesLift: 2.9, captureRate: 64, forecastAcc: 71, position: 'Matching' },
  s6: { salesLift: 2.4, captureRate: 57, forecastAcc: 66, position: 'Underperforming' },
  s7: { salesLift: 2.1, captureRate: 59, forecastAcc: 68, position: 'Matching' },
  s8: { salesLift: 2.7, captureRate: 61, forecastAcc: 70, position: 'Outperforming' },
}

function computeKPIs(signals: SeededSignal[]) {
  if (signals.length === 0) {
    return { salesLift: 3.1, demandCapture: 61, forecastImprovement: 8 }
  }

  let totalSalesLift = 0, totalCapture = 0, totalForecast = 0, count = 0

  for (const sig of signals) {
    const m = sig.metrics
    if (!m) continue
    const baselineKey = sig.id?.toLowerCase()
    const base = baselineKey ? BASELINES[baselineKey] : null
    if (!base) continue

    // Signal strength multiplier
    const strengthMult = m.signalStrength === 'Strong' ? 1.4 : m.signalStrength === 'Moderate' ? 1.15 : 1.0
    // Confidence multiplier
    const confMult = m.confidence === 'High' ? 1.3 : m.confidence === 'Medium' ? 1.1 : 0.9
    // Position multiplier (underperforming = more room to grow)
    const posMult = base.position === 'Underperforming' ? 1.25 : base.position === 'Matching' ? 1.1 : 1.0

    totalSalesLift += base.salesLift * strengthMult * confMult * posMult
    totalCapture += base.captureRate * (confMult * 0.85 + strengthMult * 0.15)
    totalForecast += (base.forecastAcc * strengthMult * confMult - base.forecastAcc)
    count++
  }

  if (count === 0) return { salesLift: 3.1, demandCapture: 61, forecastImprovement: 8 }

  return {
    salesLift: Math.round((totalSalesLift / count) * 10) / 10,
    demandCapture: Math.round(totalCapture / count),
    forecastImprovement: Math.round(totalForecast / count),
  }
}

export default function Dashboard({ analyses, loading, onNavigate, onViewAnalysis, onOpenDetail, agentLoading, agentError, hasRunAnalysis, searchFilter = '' }: DashboardProps) {
  const safeAnalyses = Array.isArray(analyses) ? analyses : []
  const derived = useMemo(() => deriveFromAnalyses(safeAnalyses), [safeAnalyses])
  const useReal = !!hasRunAnalysis && safeAnalyses.length > 0

  const q = searchFilter
  const allSignals = (useReal && derived.signals.length > 0 ? derived.signals : SEEDED_SIGNALS).filter(s => matchesQuery(q, s.title, s.brand, s.market, s.why))
  const allActions = (useReal && derived.actions.length > 0 ? derived.actions : SEEDED_ACTIONS).filter(a => matchesQuery(q, a.title, a.owner, a.impact))
  const allOpps = (useReal && derived.opportunities.length > 0 ? derived.opportunities : SEEDED_OPPORTUNITIES).filter(o => matchesQuery(q, o.title, o.brand, o.market, o.why))
  const allRisks = (useReal && derived.risks.length > 0 ? derived.risks : SEEDED_RISKS).filter(r => matchesQuery(q, r.title, r.brand, r.market, r.cause))
  const allAlerts = (useReal && derived.alerts.length > 0 ? derived.alerts : SEEDED_ALERTS).filter(a => matchesQuery(q, a.title, a.brand, a.market, a.why))

  const kpis = useMemo(() => computeKPIs(allSignals), [allSignals])

  const topSignal = allSignals.filter(s => isHighPriority(s.urgency))[0] || allSignals[0]
  const topAction = allActions.filter(a => isHighPriority(a.priority))[0] || allActions[0]
  const topOpp = allOpps.filter(o => isHighPriority(o.confidence))[0] || allOpps[0]
  const topRisk = allRisks.filter(r => isHighPriority(r.severity))[0] || allRisks[0]

  const openSignal = (sig: SeededSignal) => {
    onOpenDetail({
      category: 'signal', title: sig.title, brand: sig.brand, market: sig.market, severity: sig.urgency,
      sections: sig.detailSections.length > 0 ? sig.detailSections : [{ label: 'What Changed', content: sig.why }, { label: 'What Teams Should Do', content: sig.nextStep }],
      relatedActions: sig.relatedActions,
      metrics: sig.metrics,
    })
  }

  const openAction = (act: SeededAction) => {
    onOpenDetail({
      category: 'action', title: act.title, severity: act.priority,
      sections: [{ label: 'Expected Impact', content: act.impact }, { label: 'Owner', content: act.owner }, { label: 'Timeline', content: act.timeline }],
    })
  }

  const openOpportunity = (opp: SeededOpportunity) => {
    onOpenDetail({
      category: 'opportunity', title: opp.title, brand: opp.brand, market: opp.market, severity: opp.confidence,
      sections: opp.detailSections.length > 0 ? opp.detailSections : [{ label: 'What Changed', content: opp.why }, { label: 'What Teams Should Do', content: opp.move }],
      relatedActions: opp.relatedActions,
      metrics: opp.metrics,
    })
  }

  const openRisk = (risk: SeededRisk) => {
    onOpenDetail({
      category: 'risk', title: risk.title, brand: risk.brand, market: risk.market, severity: risk.severity,
      sections: risk.detailSections.length > 0 ? risk.detailSections : [{ label: 'What Changed', content: risk.cause }, { label: 'What Teams Should Do', content: risk.action }],
      relatedActions: risk.relatedActions,
      metrics: risk.metrics,
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
            {allSignals.length + allOpps.length + allRisks.length === 0 && ' — no local matches. Web results loading...'}
          </p>
        </div>
      )}

      {/* Business KPI Row */}
      <div className="px-8 pt-7 pb-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            {
              label: 'Sales Lift from Signal-Led Actions',
              value: `+${kpis.salesLift}%`,
              sub: 'Measures sales improvement after acting on surfaced market insights',
              icon: RiArrowRightUpLine,
              accent: 'text-emerald-400',
            },
            {
              label: 'Demand Opportunity Capture',
              value: `${kpis.demandCapture}%`,
              sub: 'Measures how well L\'Oréal converts identified market opportunities into business results',
              icon: RiLineChartLine,
              accent: 'text-primary',
            },
            {
              label: 'Forecast Accuracy Improvement',
              value: `+${kpis.forecastImprovement}pp`,
              sub: 'Measures how much signal-led insights improve demand planning accuracy',
              icon: RiBarChartGroupedLine,
              accent: 'text-amber-400',
            },
          ].map((kpi, i) => {
            const Icon = kpi.icon
            return (
              <div key={i} className="bg-card border border-border p-4">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase leading-tight">{kpi.label}</p>
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <p className={`text-2xl font-serif tracking-wide ${kpi.accent}`}>{kpi.value}</p>
                <p className="text-[10px] text-muted-foreground tracking-wide mt-1">{kpi.sub}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="px-8 py-6">
        {/* Top Market Changes */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <RiAlertLine className="h-4 w-4 text-amber-400" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Top Market Changes</h3>
            </div>
            <button onClick={() => onNavigate('market-signals')} className="text-[10px] text-primary tracking-[0.1em] uppercase hover:text-primary/80 transition-colors flex items-center gap-1">
              View All <RiArrowRightSLine className="h-3 w-3" />
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
                </div>
                <p className="text-[11px] text-foreground/60 leading-relaxed">{cleanText(sig.why, 120)}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Growth Opportunities + Demand Risks side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <RiArrowRightUpLine className="h-4 w-4 text-emerald-400" />
                <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Growth Opportunities</h3>
              </div>
              <button onClick={() => onNavigate('demand-opportunities')} className="text-[10px] text-primary tracking-[0.1em] uppercase hover:text-primary/80 transition-colors flex items-center gap-1">
                View All <RiArrowRightSLine className="h-3 w-3" />
              </button>
            </div>
            {topOpp && (
              <button onClick={() => openOpportunity(topOpp)} className="w-full bg-card border border-border p-4 text-left hover:border-emerald-500/40 transition-colors group">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-[13px] text-foreground tracking-wide leading-snug group-hover:text-emerald-400 transition-colors">{topOpp.title}</h4>
                  <span className="text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 whitespace-nowrap bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">{topOpp.confidence}</span>
                </div>
                <div className="flex gap-3 mb-2 text-[10px] text-muted-foreground tracking-wide">
                  <span>{topOpp.brand}</span><span className="text-border">|</span><span>{topOpp.market}</span>
                </div>
                <p className="text-[11px] text-foreground/60 leading-relaxed mb-3">{cleanText(topOpp.why, 100)}</p>
                <div className="pt-2 border-t border-border/60">
                  <p className="text-[10px] text-emerald-400 tracking-wide">{cleanText(topOpp.move, 80)}</p>
                </div>
              </button>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <RiErrorWarningLine className="h-4 w-4 text-red-400" />
                <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Demand Risks</h3>
              </div>
              <button onClick={() => onNavigate('demand-risks')} className="text-[10px] text-primary tracking-[0.1em] uppercase hover:text-primary/80 transition-colors flex items-center gap-1">
                View All <RiArrowRightSLine className="h-3 w-3" />
              </button>
            </div>
            {topRisk && (
              <button onClick={() => openRisk(topRisk)} className="w-full bg-card border border-border p-4 text-left hover:border-red-500/40 transition-colors group">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="text-[13px] text-foreground tracking-wide leading-snug group-hover:text-red-400 transition-colors">{topRisk.title}</h4>
                  <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(topRisk.severity)}`}>{topRisk.severity}</span>
                </div>
                <div className="flex gap-3 mb-2 text-[10px] text-muted-foreground tracking-wide">
                  <span>{topRisk.brand}</span><span className="text-border">|</span><span>{topRisk.market}</span>
                </div>
                <p className="text-[11px] text-foreground/60 leading-relaxed mb-3">{cleanText(topRisk.cause, 100)}</p>
                <div className="pt-2 border-t border-border/60">
                  <p className="text-[10px] text-red-400 tracking-wide">{cleanText(topRisk.action, 80)}</p>
                </div>
              </button>
            )}
          </div>
        </div>

        {/* Teams Need to Act */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <RiFlashlightLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Teams Need to Act</h3>
            </div>
            <button onClick={() => onNavigate('actions-list')} className="text-[10px] text-primary tracking-[0.1em] uppercase hover:text-primary/80 transition-colors flex items-center gap-1">
              View All <RiArrowRightSLine className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {allActions.filter(a => isHighPriority(a.priority)).slice(0, 4).map((act, i) => (
              <button key={i} onClick={() => openAction(act)} className="bg-card border border-border p-4 text-left hover:border-primary/40 transition-colors group">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h4 className="text-[13px] text-foreground tracking-wide group-hover:text-primary transition-colors">{act.title}</h4>
                  <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 whitespace-nowrap flex-shrink-0 ${urgencyBadge(act.priority)}`}>{act.priority}</span>
                </div>
                <div className="flex gap-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                  <span>{act.owner}</span><span className="text-border">|</span><span>{act.timeline}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
