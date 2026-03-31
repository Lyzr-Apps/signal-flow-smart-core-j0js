'use client'

import React, { useMemo } from 'react'
import { RiFlashlightLine, RiArrowRightUpLine, RiErrorWarningLine, RiShieldLine, RiArrowRightSLine } from 'react-icons/ri'
import {
  urgencyBadge, severityDot, cleanText, isHighPriority, deriveFromAnalyses,
  SEEDED_ACTIONS, SEEDED_OPPORTUNITIES, SEEDED_RISKS, SEEDED_ALERTS,
  type AnalysisItem, type SeededAction, type SeededOpportunity, type SeededRisk, type SeededAlert,
} from './data/seededScenarios'
import type { DetailItem } from './DetailView'

type CategoryType = 'actions' | 'opportunities' | 'risks' | 'alerts'

interface CategoryListViewProps {
  category: CategoryType
  analyses: AnalysisItem[]
  onOpenDetail: (item: DetailItem) => void
  hasRunAnalysis?: boolean
}

const CATEGORY_META: Record<CategoryType, { title: string; icon: any; color: string }> = {
  actions: { title: 'Recommended Actions', icon: RiFlashlightLine, color: 'text-primary' },
  opportunities: { title: 'Growth Opportunities', icon: RiArrowRightUpLine, color: 'text-emerald-400' },
  risks: { title: 'Demand Risks', icon: RiErrorWarningLine, color: 'text-red-400' },
  alerts: { title: 'Market Alerts', icon: RiShieldLine, color: 'text-red-400' },
}

export default function CategoryListView({ category, analyses, onOpenDetail, hasRunAnalysis }: CategoryListViewProps) {
  const meta = CATEGORY_META[category]
  const Icon = meta.icon
  const safeAnalyses = Array.isArray(analyses) ? analyses : []
  const derived = useMemo(() => deriveFromAnalyses(safeAnalyses), [safeAnalyses])
  const useReal = !!hasRunAnalysis && safeAnalyses.length > 0

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

  const renderActions = () => {
    const items = useReal && derived.actions.length > 0 ? derived.actions : SEEDED_ACTIONS
    const critical = items.filter(a => isHighPriority(a.priority))
    const other = items.filter(a => !isHighPriority(a.priority))
    return (
      <>
        {critical.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3">Critical & High Priority</p>
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
            <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3">Medium & Low Priority</p>
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
  }

  const renderOpportunities = () => {
    const items = useReal && derived.opportunities.length > 0 ? derived.opportunities : SEEDED_OPPORTUNITIES
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((opp, i) => (
          <button key={i} onClick={() => openOpportunity(opp)} className="bg-card border border-border p-5 text-left hover:border-primary/40 hover:bg-card/80 transition-all group">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug group-hover:text-primary transition-colors">{opp.title}</h4>
              <span className="text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ml-3 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">{opp.confidence}</span>
            </div>
            <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
              <span>{opp.brand}</span><span className="text-border">|</span><span>{opp.market}</span>
            </div>
            <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{cleanText(opp.why, 160)}</p>
            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div><p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Suggested Move</p><p className="text-[12px] text-primary leading-relaxed">{opp.move}</p></div>
              <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
            </div>
          </button>
        ))}
      </div>
    )
  }

  const renderRisks = () => {
    const items = useReal && derived.risks.length > 0 ? derived.risks : SEEDED_RISKS
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((risk, i) => (
          <button key={i} onClick={() => openRisk(risk)} className="bg-card border border-border p-5 text-left hover:border-primary/40 hover:bg-card/80 transition-all group">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug pr-2 group-hover:text-primary transition-colors">{risk.title}</h4>
              <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(risk.severity)}`}>{risk.severity}</span>
            </div>
            <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
              <span>{risk.brand}</span><span className="text-border">|</span><span>{risk.market}</span>
            </div>
            <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{cleanText(risk.cause, 160)}</p>
            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div><p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Immediate Action</p><p className="text-[12px] text-primary leading-relaxed">{risk.action}</p></div>
              <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
            </div>
          </button>
        ))}
      </div>
    )
  }

  const renderAlerts = () => {
    const items = useReal && derived.alerts.length > 0 ? derived.alerts : SEEDED_ALERTS
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {items.map((alert, i) => (
          <button key={i} onClick={() => openAlert(alert)} className="bg-card border border-border p-5 text-left hover:border-primary/40 hover:bg-card/80 transition-all group">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug pr-2 group-hover:text-primary transition-colors">{alert.title}</h4>
              <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(alert.severity)}`}>{alert.severity}</span>
            </div>
            <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
              <span>{alert.brand}</span><span className="text-border">|</span><span>{alert.market}</span>
            </div>
            <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{cleanText(alert.why, 160)}</p>
            <div className="pt-3 border-t border-border/60 flex items-center justify-between">
              <div><p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Recommended Response</p><p className="text-[12px] text-primary leading-relaxed">{alert.response}</p></div>
              <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
            </div>
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-7">
        <div className="flex items-center gap-2 mb-6">
          <Icon className={`h-5 w-5 ${meta.color}`} />
          <h2 className="font-serif text-lg tracking-[0.1em] text-foreground uppercase">{meta.title}</h2>
        </div>
        {category === 'actions' && renderActions()}
        {category === 'opportunities' && renderOpportunities()}
        {category === 'risks' && renderRisks()}
        {category === 'alerts' && renderAlerts()}
      </div>
    </div>
  )
}
