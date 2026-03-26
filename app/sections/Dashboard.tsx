'use client'

import React, { useMemo } from 'react'
import { RiTimeLine, RiFlashlightLine, RiLineChartLine, RiAlertLine, RiArrowRightUpLine, RiShieldLine, RiErrorWarningLine, RiFileTextLine, RiArrowRightSLine, RiLoader4Line, RiCloseCircleLine } from 'react-icons/ri'
import {
  urgencyBadge, cleanText, isHighPriority, deriveFromAnalyses,
  SEEDED_SIGNALS, SEEDED_ACTIONS, SEEDED_OPPORTUNITIES, SEEDED_RISKS, SEEDED_ALERTS, SEEDED_ANALYSES,
  type AnalysisItem, type SeededSignal, type SeededAction, type SeededOpportunity, type SeededRisk, type SeededAlert, type SeededAnalysis,
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
}

export default function Dashboard({ analyses, loading, onNavigate, onViewAnalysis, onOpenDetail, agentLoading, agentError }: DashboardProps) {
  const safeAnalyses = Array.isArray(analyses) ? analyses : []
  const hasRealData = safeAnalyses.length > 0
  const derived = useMemo(() => deriveFromAnalyses(safeAnalyses), [safeAnalyses])

  // When real data exists, show it first; fall back to seeded data only if no real data
  const allSignals = hasRealData && derived.signals.length > 0 ? derived.signals : [...derived.signals, ...SEEDED_SIGNALS]
  const topSignal = allSignals.filter(s => isHighPriority(s.urgency))[0] || allSignals[0]

  const allActions = hasRealData && derived.actions.length > 0 ? derived.actions : [...derived.actions, ...SEEDED_ACTIONS]
  const topAction = allActions.filter(a => isHighPriority(a.priority))[0] || allActions[0]

  const allOpps = hasRealData && derived.opportunities.length > 0 ? derived.opportunities : [...derived.opportunities, ...SEEDED_OPPORTUNITIES]
  const topOpp = allOpps.filter(o => isHighPriority(o.confidence))[0] || allOpps[0]

  const allRisks = hasRealData && derived.risks.length > 0 ? derived.risks : [...derived.risks, ...SEEDED_RISKS]
  const topRisk = allRisks.filter(r => isHighPriority(r.severity))[0] || allRisks[0]

  const allAlerts = hasRealData && derived.alerts.length > 0 ? derived.alerts : [...derived.alerts, ...SEEDED_ALERTS]
  const topAlert = allAlerts.filter(a => isHighPriority(a.severity))[0] || allAlerts[0]

  const recentAnalyses = hasRealData && derived.recentAnalyses.length > 0 ? derived.recentAnalyses : [...derived.recentAnalyses, ...SEEDED_ANALYSES]
  const topAnalysis = recentAnalyses[0]

  const criticalCount = allSignals.filter(s => s.urgency.toLowerCase() === 'critical').length + allRisks.filter(r => r.severity.toLowerCase() === 'critical').length + allAlerts.filter(a => a.severity.toLowerCase() === 'critical').length
  const totalAnalyses = safeAnalyses.length + (hasRealData ? 0 : SEEDED_ANALYSES.length)

  // Click handlers
  const openSignal = (sig: SeededSignal) => {
    onOpenDetail({
      category: 'signal', title: sig.title, brand: sig.brand, market: sig.market, severity: sig.urgency,
      sections: sig.detailSections.length > 0 ? sig.detailSections : [{ label: 'Why It Matters', content: sig.why }, { label: 'Recommended Next Step', content: sig.nextStep }],
      relatedActions: sig.relatedActions,
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
      sections: opp.detailSections.length > 0 ? opp.detailSections : [{ label: 'Why It Matters', content: opp.why }, { label: 'Suggested Move', content: opp.move }],
      relatedActions: opp.relatedActions,
    })
  }

  const openRisk = (risk: SeededRisk) => {
    onOpenDetail({
      category: 'risk', title: risk.title, brand: risk.brand, market: risk.market, severity: risk.severity,
      sections: risk.detailSections.length > 0 ? risk.detailSections : [{ label: 'Likely Cause', content: risk.cause }, { label: 'Immediate Action', content: risk.action }],
      relatedActions: risk.relatedActions,
    })
  }

  const openAlert = (alert: SeededAlert) => {
    onOpenDetail({
      category: 'alert', title: alert.title, brand: alert.brand, market: alert.market, severity: alert.severity,
      sections: alert.detailSections.length > 0 ? alert.detailSections : [{ label: 'Why It Matters', content: alert.why }, { label: 'Recommended Response', content: alert.response }],
      relatedActions: alert.relatedActions,
    })
  }

  const openRecentAnalysis = (ra: SeededAnalysis) => {
    const real = safeAnalyses.find(a => a._id === ra.id)
    if (real) { onViewAnalysis(real); return }
    onOpenDetail({
      category: 'analysis', title: ra.title, brand: ra.brand, market: ra.market,
      sections: [{ label: 'Analysis Summary', content: ra.summary }],
    })
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Agent loading / error banner */}
      {agentLoading && (
        <div className="mx-8 mt-6 bg-primary/5 border border-primary/20 p-3 flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin flex-shrink-0" />
          <div>
            <p className="text-[12px] text-foreground tracking-wide">Searching the web for real-time beauty industry intelligence...</p>
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

      {/* KPI Row */}
      <div className="px-8 pt-7 pb-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Time to Opportunity', value: hasRealData ? '< 2h' : '< 4h', sub: 'Signal-to-insight speed', icon: RiTimeLine },
            { label: 'Time to First Action', value: hasRealData ? '< 8h' : '< 12h', sub: 'Insight-to-recommendation', icon: RiFlashlightLine },
            { label: 'Analyses Generated', value: String(totalAnalyses), sub: hasRealData ? `${safeAnalyses.length} live analyses` : `${SEEDED_ANALYSES.length} seeded scenarios`, icon: RiLineChartLine },
            { label: 'Open Critical Signals', value: String(criticalCount), sub: 'Require immediate attention', icon: RiAlertLine },
          ].map((kpi, i) => {
            const Icon = kpi.icon
            return (
              <div key={i} className="bg-card border border-border p-4">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase leading-tight">{kpi.label}</p>
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <p className="text-2xl font-serif tracking-wide text-foreground">{kpi.value}</p>
                <p className="text-[10px] text-muted-foreground tracking-wide mt-1">{kpi.sub}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Cards Grid - 3 columns x 2 rows + 1 full-width */}
      <div className="px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

          {/* Priority Signal Card */}
          {topSignal && (
            <div className="bg-card border border-border p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <RiAlertLine className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-[11px] text-foreground tracking-wide">Priority Signal</p>
                  <p className="text-[9px] text-muted-foreground tracking-[0.1em] uppercase">{allSignals.filter(s => isHighPriority(s.urgency)).length} active</p>
                </div>
                <span className={`ml-auto text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 ${urgencyBadge(topSignal.urgency)}`}>{topSignal.urgency}</span>
              </div>
              <h4 className="text-[13px] text-foreground tracking-wide leading-snug mb-2">{topSignal.title}</h4>
              <div className="flex gap-3 mb-3 text-[10px] text-muted-foreground tracking-wide">
                <span>{topSignal.brand}</span><span className="text-border">|</span><span>{topSignal.market}</span>
              </div>
              <p className="text-[11px] text-foreground/60 leading-relaxed mb-4 flex-1">{cleanText(topSignal.why, 100)}</p>
              <button onClick={() => openSignal(topSignal)} className="w-full flex items-center justify-between bg-primary/10 hover:bg-primary/20 border border-primary/20 px-4 py-2.5 transition-colors group">
                <span className="text-[11px] text-primary tracking-[0.1em] uppercase">Explore Signal</span>
                <RiArrowRightSLine className="h-4 w-4 text-primary group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Recommended Action Card */}
          {topAction && (
            <div className="bg-card border border-border p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <RiFlashlightLine className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] text-foreground tracking-wide">Recommended Action</p>
                  <p className="text-[9px] text-muted-foreground tracking-[0.1em] uppercase">{allActions.filter(a => isHighPriority(a.priority)).length} high priority</p>
                </div>
                <span className={`ml-auto text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 ${urgencyBadge(topAction.priority)}`}>{topAction.priority}</span>
              </div>
              <h4 className="text-[13px] text-foreground tracking-wide leading-snug mb-2">{topAction.title}</h4>
              <div className="flex gap-3 mb-3 text-[10px] text-muted-foreground tracking-wide">
                <span>{topAction.owner}</span><span className="text-border">|</span><span>{topAction.timeline}</span>
              </div>
              <p className="text-[11px] text-foreground/60 leading-relaxed mb-4 flex-1">{cleanText(topAction.impact, 100)}</p>
              <button onClick={() => openAction(topAction)} className="w-full flex items-center justify-between bg-primary/10 hover:bg-primary/20 border border-primary/20 px-4 py-2.5 transition-colors group">
                <span className="text-[11px] text-primary tracking-[0.1em] uppercase">View Action</span>
                <RiArrowRightSLine className="h-4 w-4 text-primary group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Active Opportunity Card */}
          {topOpp && (
            <div className="bg-card border border-border p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <RiArrowRightUpLine className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[11px] text-foreground tracking-wide">Active Opportunity</p>
                  <p className="text-[9px] text-muted-foreground tracking-[0.1em] uppercase">{allOpps.length} identified</p>
                </div>
                <span className="ml-auto text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">{topOpp.confidence}</span>
              </div>
              <h4 className="text-[13px] text-foreground tracking-wide leading-snug mb-2">{topOpp.title}</h4>
              <div className="flex gap-3 mb-3 text-[10px] text-muted-foreground tracking-wide">
                <span>{topOpp.brand}</span><span className="text-border">|</span><span>{topOpp.market}</span>
              </div>
              <p className="text-[11px] text-foreground/60 leading-relaxed mb-4 flex-1">{cleanText(topOpp.why, 100)}</p>
              <button onClick={() => openOpportunity(topOpp)} className="w-full flex items-center justify-between bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 px-4 py-2.5 transition-colors group">
                <span className="text-[11px] text-emerald-400 tracking-[0.1em] uppercase">Explore Opportunity</span>
                <RiArrowRightSLine className="h-4 w-4 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Launch Risk Card */}
          {topRisk && (
            <div className="bg-card border border-border p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <RiErrorWarningLine className="h-4 w-4 text-red-400" />
                </div>
                <div>
                  <p className="text-[11px] text-foreground tracking-wide">Launch Risk</p>
                  <p className="text-[9px] text-muted-foreground tracking-[0.1em] uppercase">{allRisks.length} flagged</p>
                </div>
                <span className={`ml-auto text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 ${urgencyBadge(topRisk.severity)}`}>{topRisk.severity}</span>
              </div>
              <h4 className="text-[13px] text-foreground tracking-wide leading-snug mb-2">{topRisk.title}</h4>
              <div className="flex gap-3 mb-3 text-[10px] text-muted-foreground tracking-wide">
                <span>{topRisk.brand}</span><span className="text-border">|</span><span>{topRisk.market}</span>
              </div>
              <p className="text-[11px] text-foreground/60 leading-relaxed mb-4 flex-1">{cleanText(topRisk.cause, 100)}</p>
              <button onClick={() => openRisk(topRisk)} className="w-full flex items-center justify-between bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 px-4 py-2.5 transition-colors group">
                <span className="text-[11px] text-red-400 tracking-[0.1em] uppercase">View Risk</span>
                <RiArrowRightSLine className="h-4 w-4 text-red-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Claims / Reputation Alert Card */}
          {topAlert && (
            <div className="bg-card border border-border p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <RiShieldLine className="h-4 w-4 text-red-400" />
                </div>
                <div>
                  <p className="text-[11px] text-foreground tracking-wide">Claims / Reputation</p>
                  <p className="text-[9px] text-muted-foreground tracking-[0.1em] uppercase">{allAlerts.length} alerts</p>
                </div>
                <span className={`ml-auto text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 ${urgencyBadge(topAlert.severity)}`}>{topAlert.severity}</span>
              </div>
              <h4 className="text-[13px] text-foreground tracking-wide leading-snug mb-2">{topAlert.title}</h4>
              <div className="flex gap-3 mb-3 text-[10px] text-muted-foreground tracking-wide">
                <span>{topAlert.brand}</span><span className="text-border">|</span><span>{topAlert.market}</span>
              </div>
              <p className="text-[11px] text-foreground/60 leading-relaxed mb-4 flex-1">{cleanText(topAlert.why, 100)}</p>
              <button onClick={() => openAlert(topAlert)} className="w-full flex items-center justify-between bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 px-4 py-2.5 transition-colors group">
                <span className="text-[11px] text-red-400 tracking-[0.1em] uppercase">View Alert</span>
                <RiArrowRightSLine className="h-4 w-4 text-red-400 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

          {/* Recent Analysis Card */}
          {topAnalysis && (
            <div className="bg-card border border-border p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <RiFileTextLine className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-[11px] text-foreground tracking-wide">Recent Analysis</p>
                  <p className="text-[9px] text-muted-foreground tracking-[0.1em] uppercase">{totalAnalyses} total</p>
                </div>
                {topAnalysis.timestamp && (
                  <span className="ml-auto text-[9px] text-muted-foreground tracking-wide">
                    {new Date(topAnalysis.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
              <h4 className="text-[13px] text-foreground tracking-wide leading-snug mb-2">{topAnalysis.title}</h4>
              <div className="flex gap-3 mb-3 text-[10px] text-muted-foreground tracking-wide">
                <span>{topAnalysis.brand}</span><span className="text-border">|</span><span>{topAnalysis.market}</span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4 flex-1">
                <div className="bg-secondary/50 border border-border/60 p-2 text-center">
                  <p className="text-[15px] font-serif text-foreground">{allSignals.length}</p>
                  <p className="text-[8px] text-muted-foreground tracking-[0.1em] uppercase mt-0.5">Signals</p>
                </div>
                <div className="bg-secondary/50 border border-border/60 p-2 text-center">
                  <p className="text-[15px] font-serif text-foreground">{allActions.filter(a => isHighPriority(a.priority)).length}</p>
                  <p className="text-[8px] text-muted-foreground tracking-[0.1em] uppercase mt-0.5">Actions</p>
                </div>
                <div className="bg-secondary/50 border border-border/60 p-2 text-center">
                  <p className="text-[15px] font-serif text-foreground">{safeAnalyses.length}</p>
                  <p className="text-[8px] text-muted-foreground tracking-[0.1em] uppercase mt-0.5">Live</p>
                </div>
              </div>
              <button onClick={() => openRecentAnalysis(topAnalysis)} className="w-full flex items-center justify-between bg-primary/10 hover:bg-primary/20 border border-primary/20 px-4 py-2.5 transition-colors group">
                <span className="text-[11px] text-primary tracking-[0.1em] uppercase">View Analysis</span>
                <RiArrowRightSLine className="h-4 w-4 text-primary group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
