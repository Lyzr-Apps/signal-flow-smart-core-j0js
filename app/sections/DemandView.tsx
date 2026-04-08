'use client'

import React, { useMemo } from 'react'
import {
  RiLineChartLine, RiArrowRightUpLine, RiErrorWarningLine, RiCalendarCheckLine,
  RiArrowRightSLine, RiFlashlightLine,
} from 'react-icons/ri'
import {
  urgencyBadge, cleanText, isHighPriority, deriveFromAnalyses, severityDot,
  SEEDED_SIGNALS, SEEDED_ACTIONS, SEEDED_OPPORTUNITIES, SEEDED_RISKS, SEEDED_ALERTS,
  type AnalysisItem, type SeededOpportunity, type SeededRisk, type SeededAction,
} from './data/seededScenarios'
import type { DetailItem } from './DetailView'

interface DemandViewProps {
  subView: 'overview' | 'opportunities' | 'risks'
  analyses: AnalysisItem[]
  onOpenDetail: (item: DetailItem) => void
  hasRunAnalysis?: boolean
}

export default function DemandView({ subView, analyses, onOpenDetail, hasRunAnalysis }: DemandViewProps) {
  const safeAnalyses = Array.isArray(analyses) ? analyses : []
  const derived = useMemo(() => deriveFromAnalyses(safeAnalyses), [safeAnalyses])
  const useReal = !!hasRunAnalysis && safeAnalyses.length > 0

  const allOpps = useReal && derived.opportunities.length > 0 ? derived.opportunities : SEEDED_OPPORTUNITIES
  const allRisks = useReal && derived.risks.length > 0 ? derived.risks : SEEDED_RISKS
  const allActions = useReal && derived.actions.length > 0 ? derived.actions : SEEDED_ACTIONS
  const allSignals = useReal && derived.signals.length > 0 ? derived.signals : SEEDED_SIGNALS

  const openOpp = (opp: SeededOpportunity) => {
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

  const openAction = (act: SeededAction) => {
    onOpenDetail({
      category: 'action', title: act.title, severity: act.priority,
      sections: [{ label: 'Expected Impact', content: act.impact }, { label: 'Owner', content: act.owner }, { label: 'Timeline', content: act.timeline }],
    })
  }

  if (subView === 'overview') {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-7">
          <div className="flex items-center gap-2 mb-2">
            <RiLineChartLine className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-lg tracking-[0.1em] text-foreground uppercase">Demand Overview</h2>
          </div>
          <p className="text-[12px] text-muted-foreground tracking-wide mb-6">A consolidated view of demand opportunities, risks, and actions requiring attention.</p>

          {/* Summary KPIs */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-card border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <RiArrowRightUpLine className="h-4 w-4 text-emerald-400" />
                <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Opportunities</p>
              </div>
              <p className="text-2xl font-serif text-emerald-400">{allOpps.length}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{allOpps.filter(o => isHighPriority(o.confidence)).length} high confidence</p>
            </div>
            <div className="bg-card border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <RiErrorWarningLine className="h-4 w-4 text-red-400" />
                <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Demand Risks</p>
              </div>
              <p className="text-2xl font-serif text-red-400">{allRisks.length}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{allRisks.filter(r => r.severity.toLowerCase() === 'critical').length} need escalation</p>
            </div>
            <div className="bg-card border border-border p-4">
              <div className="flex items-center gap-2 mb-2">
                <RiFlashlightLine className="h-4 w-4 text-primary" />
                <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Actions Pending</p>
              </div>
              <p className="text-2xl font-serif text-primary">{allActions.filter(a => isHighPriority(a.priority)).length}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{allActions.length} total recommendations</p>
            </div>
          </div>

          {/* Top items from each */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Opportunities */}
            <div className="bg-card border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <RiArrowRightUpLine className="h-4 w-4 text-emerald-400" />
                <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Top Opportunities</h3>
              </div>
              <div className="space-y-3">
                {allOpps.slice(0, 3).map((opp, i) => (
                  <button key={i} onClick={() => openOpp(opp)} className="w-full text-left p-3 border border-border/60 hover:border-primary/30 transition-colors group">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-[12px] text-foreground tracking-wide group-hover:text-primary transition-colors">{opp.title}</h4>
                      <span className="text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 whitespace-nowrap bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">{opp.confidence}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground tracking-wide">{opp.brand} | {opp.market}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Top Risks */}
            <div className="bg-card border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <RiErrorWarningLine className="h-4 w-4 text-red-400" />
                <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Top Demand Risks</h3>
              </div>
              <div className="space-y-3">
                {allRisks.slice(0, 3).map((risk, i) => (
                  <button key={i} onClick={() => openRisk(risk)} className="w-full text-left p-3 border border-border/60 hover:border-primary/30 transition-colors group">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="text-[12px] text-foreground tracking-wide group-hover:text-primary transition-colors">{risk.title}</h4>
                      <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(risk.severity)}`}>{risk.severity}</span>
                    </div>
                    <p className="text-[10px] text-muted-foreground tracking-wide">{risk.brand} | {risk.market}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (subView === 'opportunities') {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-7">
          <div className="flex items-center gap-2 mb-2">
            <RiArrowRightUpLine className="h-5 w-5 text-emerald-400" />
            <h2 className="font-serif text-lg tracking-[0.1em] text-foreground uppercase">Growth Opportunities</h2>
          </div>
          <p className="text-[12px] text-muted-foreground tracking-wide mb-6">Demand opportunities identified from market data, consumer trends, and competitive whitespace.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {allOpps.map((opp, i) => (
              <button key={i} onClick={() => openOpp(opp)} className="bg-card border border-border p-5 text-left hover:border-primary/40 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug group-hover:text-primary transition-colors">{opp.title}</h4>
                  <span className="text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ml-3 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">{opp.confidence}</span>
                </div>
                <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                  <span>{opp.brand}</span><span className="text-border">|</span><span>{opp.market}</span>
                </div>
                <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{cleanText(opp.why, 160)}</p>
                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <div><p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">What Teams Should Do</p><p className="text-[12px] text-primary leading-relaxed">{cleanText(opp.move, 80)}</p></div>
                  <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (subView === 'risks') {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="px-8 py-7">
          <div className="flex items-center gap-2 mb-2">
            <RiErrorWarningLine className="h-5 w-5 text-red-400" />
            <h2 className="font-serif text-lg tracking-[0.1em] text-foreground uppercase">Demand Risks</h2>
          </div>
          <p className="text-[12px] text-muted-foreground tracking-wide mb-6">Identified risks to demand from competitive pressure, market shifts, or underperforming launches.</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {allRisks.map((risk, i) => (
              <button key={i} onClick={() => openRisk(risk)} className="bg-card border border-border p-5 text-left hover:border-primary/40 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug pr-2 group-hover:text-primary transition-colors">{risk.title}</h4>
                  <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(risk.severity)}`}>{risk.severity}</span>
                </div>
                <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                  <span>{risk.brand}</span><span className="text-border">|</span><span>{risk.market}</span>
                </div>
                <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{cleanText(risk.cause, 160)}</p>
                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <div><p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Immediate Action</p><p className="text-[12px] text-primary leading-relaxed">{cleanText(risk.action, 80)}</p></div>
                  <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Planning Actions
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-7">
        <div className="flex items-center gap-2 mb-2">
          <RiCalendarCheckLine className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-lg tracking-[0.1em] text-foreground uppercase">Planning Actions</h2>
        </div>
        <p className="text-[12px] text-muted-foreground tracking-wide mb-6">Recommended actions based on demand intelligence, organized by priority and team ownership.</p>

        {/* Critical / High */}
        {(() => {
          const critical = allActions.filter(a => isHighPriority(a.priority))
          const other = allActions.filter(a => !isHighPriority(a.priority))
          return (
            <>
              {critical.length > 0 && (
                <div className="mb-6">
                  <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3">Urgent Actions</p>
                  <div className="bg-card border border-border divide-y divide-border/60">
                    {critical.map((act, i) => (
                      <button key={i} onClick={() => openAction(act)} className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-secondary/30 transition-colors group">
                        <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${severityDot(act.priority)}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3 mb-1">
                            <h4 className="text-[13px] text-foreground tracking-wide group-hover:text-primary transition-colors">{act.title}</h4>
                            <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap flex-shrink-0 ${urgencyBadge(act.priority)}`}>{act.priority}</span>
                          </div>
                          <div className="flex gap-4 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                            <span>{act.owner}</span><span className="text-border">|</span><span>{act.timeline}</span>
                          </div>
                          <p className="text-[11px] text-foreground/60 mt-1 leading-relaxed">{cleanText(act.impact, 120)}</p>
                        </div>
                        <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {other.length > 0 && (
                <div>
                  <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3">Other Actions</p>
                  <div className="bg-card border border-border divide-y divide-border/60">
                    {other.map((act, i) => (
                      <button key={i} onClick={() => openAction(act)} className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-secondary/30 transition-colors group">
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
                </div>
              )}
            </>
          )
        })()}
      </div>
    </div>
  )
}
