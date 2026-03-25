'use client'

import React, { useMemo } from 'react'
import { RiTimeLine, RiFlashlightLine, RiLineChartLine, RiAlertLine, RiArrowRightUpLine, RiShieldLine, RiErrorWarningLine, RiFileTextLine, RiArrowRightSLine } from 'react-icons/ri'
import {
  urgencyBadge, severityDot, cleanText, isHighPriority, deriveFromAnalyses,
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
}

export default function Dashboard({ analyses, loading, onNavigate, onViewAnalysis, onOpenDetail }: DashboardProps) {
  const safeAnalyses = Array.isArray(analyses) ? analyses : []
  const hasRealData = safeAnalyses.length > 0
  const derived = useMemo(() => deriveFromAnalyses(safeAnalyses), [safeAnalyses])

  // Merge and filter: only Critical & High for dashboard
  const allSignals = [...derived.signals, ...SEEDED_SIGNALS]
  const displaySignals = allSignals.filter(s => isHighPriority(s.urgency)).slice(0, 3)

  const allActions = [...derived.actions, ...SEEDED_ACTIONS]
  const displayActions = allActions.filter(a => isHighPriority(a.priority)).slice(0, 6)

  const allOpps = [...derived.opportunities, ...SEEDED_OPPORTUNITIES]
  const displayOpps = allOpps.filter(o => isHighPriority(o.confidence)).slice(0, 3)

  const allRisks = [...derived.risks, ...SEEDED_RISKS]
  const displayRisks = allRisks.filter(r => isHighPriority(r.severity)).slice(0, 2)

  const allAlerts = [...derived.alerts, ...SEEDED_ALERTS]
  const displayAlerts = allAlerts.filter(a => isHighPriority(a.severity)).slice(0, 2)

  const displayRecentAnalyses = [...derived.recentAnalyses, ...SEEDED_ANALYSES].slice(0, 4)

  // KPIs
  const criticalCount = allSignals.filter(s => s.urgency.toLowerCase() === 'critical').length + allRisks.filter(r => r.severity.toLowerCase() === 'critical').length + allAlerts.filter(a => a.severity.toLowerCase() === 'critical').length
  const totalAnalyses = safeAnalyses.length + SEEDED_ANALYSES.length

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
      {/* KPI Row */}
      <div className="px-8 pt-7 pb-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Time to Opportunity', value: hasRealData ? '< 2h' : '< 4h', sub: 'Avg. signal-to-insight speed', icon: RiTimeLine },
            { label: 'Time to First Action', value: hasRealData ? '< 8h' : '< 12h', sub: 'Avg. insight-to-recommendation', icon: RiFlashlightLine },
            { label: 'Analyses Generated', value: String(totalAnalyses), sub: `${safeAnalyses.length} live + ${SEEDED_ANALYSES.length} seeded`, icon: RiLineChartLine },
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

      <div className="px-8 pb-10 space-y-8 mt-4">

        {/* Priority Signals */}
        {displaySignals.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <RiAlertLine className="h-4 w-4 text-primary" />
              <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Priority Signals</h3>
              <span className="text-[9px] text-muted-foreground tracking-[0.1em] uppercase ml-2">Critical & High</span>
              {hasRealData && <span className="text-[9px] text-primary tracking-[0.1em] uppercase ml-auto">Live</span>}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {displaySignals.map((sig, i) => (
                <button key={i} onClick={() => openSignal(sig)} className="bg-card border border-border p-5 flex flex-col text-left hover:border-primary/40 hover:bg-card/80 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug pr-2 group-hover:text-primary transition-colors">{sig.title}</h4>
                    <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(sig.urgency)}`}>{sig.urgency}</span>
                  </div>
                  <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                    <span>{sig.brand}</span><span className="text-border">|</span><span>{sig.market}</span>
                  </div>
                  <p className="text-[12px] text-foreground/70 leading-relaxed mb-3 flex-1">{cleanText(sig.why, 140)}</p>
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    <div><p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Next Step</p><p className="text-[12px] text-primary leading-relaxed">{cleanText(sig.nextStep, 80)}</p></div>
                    <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Recommended Actions */}
        {displayActions.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <RiFlashlightLine className="h-4 w-4 text-primary" />
              <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Recommended Actions</h3>
              <span className="text-[9px] text-muted-foreground tracking-[0.1em] uppercase ml-2">Critical & High</span>
              <button onClick={() => onNavigate('actions-list')} className="flex items-center gap-1 text-[11px] text-primary tracking-wide hover:text-primary/80 transition-colors ml-auto">
                View all <RiArrowRightSLine className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="bg-card border border-border divide-y divide-border/60">
              {displayActions.map((act, i) => (
                <button key={i} onClick={() => openAction(act)} className="w-full flex items-start gap-5 px-5 py-4 text-left hover:bg-secondary/30 transition-colors group">
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${severityDot(act.priority)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="text-[13px] text-foreground tracking-wide group-hover:text-primary transition-colors">{act.title}</h4>
                      <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap flex-shrink-0 ${urgencyBadge(act.priority)}`}>{act.priority}</span>
                    </div>
                    <div className="flex gap-4 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                      <span>{act.owner}</span><span className="text-border">|</span><span>{act.timeline}</span>
                    </div>
                  </div>
                  <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Active Opportunities */}
        {displayOpps.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <RiArrowRightUpLine className="h-4 w-4 text-primary" />
              <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Active Opportunities</h3>
              <span className="text-[9px] text-muted-foreground tracking-[0.1em] uppercase ml-2">High Confidence</span>
              <button onClick={() => onNavigate('opportunities-list')} className="flex items-center gap-1 text-[11px] text-primary tracking-wide hover:text-primary/80 transition-colors ml-auto">
                View all <RiArrowRightSLine className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {displayOpps.map((opp, i) => (
                <button key={i} onClick={() => openOpportunity(opp)} className="bg-card border border-border p-5 text-left hover:border-primary/40 hover:bg-card/80 transition-all group">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug group-hover:text-primary transition-colors">{opp.title}</h4>
                    <span className="text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ml-3 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">{opp.confidence}</span>
                  </div>
                  <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                    <span>{opp.brand}</span><span className="text-border">|</span><span>{opp.market}</span>
                  </div>
                  <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{cleanText(opp.why, 120)}</p>
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    <p className="text-[12px] text-primary leading-relaxed">{cleanText(opp.move, 80)}</p>
                    <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Launch Risks */}
        {displayRisks.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <RiErrorWarningLine className="h-4 w-4 text-primary" />
              <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Launch Risks</h3>
              <span className="text-[9px] text-muted-foreground tracking-[0.1em] uppercase ml-2">High Severity</span>
              <button onClick={() => onNavigate('risks-list')} className="flex items-center gap-1 text-[11px] text-primary tracking-wide hover:text-primary/80 transition-colors ml-auto">
                View all <RiArrowRightSLine className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {displayRisks.map((risk, i) => (
                <button key={i} onClick={() => openRisk(risk)} className="bg-card border border-border p-5 text-left hover:border-primary/40 hover:bg-card/80 transition-all group">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug pr-2 group-hover:text-primary transition-colors">{risk.title}</h4>
                    <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(risk.severity)}`}>{risk.severity}</span>
                  </div>
                  <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                    <span>{risk.brand}</span><span className="text-border">|</span><span>{risk.market}</span>
                  </div>
                  <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{cleanText(risk.cause, 130)}</p>
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    <p className="text-[12px] text-primary leading-relaxed">{cleanText(risk.action, 80)}</p>
                    <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Claims / Reputation Alerts */}
        {displayAlerts.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <RiShieldLine className="h-4 w-4 text-primary" />
              <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Claims / Reputation Alerts</h3>
              <button onClick={() => onNavigate('alerts-list')} className="flex items-center gap-1 text-[11px] text-primary tracking-wide hover:text-primary/80 transition-colors ml-auto">
                View all <RiArrowRightSLine className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {displayAlerts.map((alert, i) => (
                <button key={i} onClick={() => openAlert(alert)} className="bg-card border border-border p-5 text-left hover:border-primary/40 hover:bg-card/80 transition-all group">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug pr-2 group-hover:text-primary transition-colors">{alert.title}</h4>
                    <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(alert.severity)}`}>{alert.severity}</span>
                  </div>
                  <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                    <span>{alert.brand}</span><span className="text-border">|</span><span>{alert.market}</span>
                  </div>
                  <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{cleanText(alert.why, 130)}</p>
                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    <p className="text-[12px] text-primary leading-relaxed">{cleanText(alert.response, 80)}</p>
                    <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Recent Analyses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <RiFileTextLine className="h-4 w-4 text-primary" />
              <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Recent Analyses</h3>
            </div>
            <button onClick={() => onNavigate('history')} className="flex items-center gap-1 text-[11px] text-primary tracking-wide hover:text-primary/80 transition-colors">
              View all <RiArrowRightSLine className="h-3.5 w-3.5" />
            </button>
          </div>
          {loading ? (
            <div className="bg-card border border-border p-10 flex items-center justify-center">
              <div className="flex items-center gap-3 text-muted-foreground text-[12px] tracking-wide">
                <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                Loading intelligence...
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border divide-y divide-border/60">
              {displayRecentAnalyses.map((ra, idx) => (
                <button key={ra.id + idx} className="w-full text-left flex items-start gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors group" onClick={() => openRecentAnalysis(ra)}>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <p className="text-[13px] text-foreground tracking-wide leading-snug group-hover:text-primary transition-colors">{ra.title}</p>
                      <span className="text-[9px] text-muted-foreground tracking-wide whitespace-nowrap flex-shrink-0 mt-0.5">
                        {ra.timestamp ? new Date(ra.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {ra.signalTypes.map((t, ti) => (
                        <span key={ti} className="text-[9px] tracking-[0.1em] uppercase text-primary border border-primary/30 px-1.5 py-0.5">{t}</span>
                      ))}
                      <span className="text-[9px] text-muted-foreground tracking-wide ml-1">{ra.brand} | {ra.market}</span>
                    </div>
                  </div>
                  <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </button>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
