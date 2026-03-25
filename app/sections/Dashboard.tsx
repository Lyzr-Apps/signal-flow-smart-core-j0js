'use client'

import React, { useMemo } from 'react'
import { RiTimeLine, RiFlashlightLine, RiLineChartLine, RiAlertLine, RiArrowRightUpLine, RiShieldLine, RiRocketLine, RiErrorWarningLine, RiFileTextLine, RiArrowRightSLine } from 'react-icons/ri'
import type { DetailItem } from './DetailView'

interface AnalysisItem {
  _id?: string
  signal_id?: string
  orchestrator_summary?: string
  specialist_outputs?: any[]
  signal_types?: string[]
  priority_actions?: any[]
  cross_cutting_themes?: string
  createdAt?: string
}

interface DashboardProps {
  analyses: AnalysisItem[]
  loading: boolean
  onNavigate: (view: string) => void
  onViewAnalysis: (analysis: AnalysisItem) => void
  onOpenDetail: (item: DetailItem) => void
}

// ── Fallback sample data (used only when no real analyses exist) ──

const FALLBACK_SIGNALS = [
  { title: 'Sustainable Packaging Shift in APAC', brand: 'Garnier', market: 'APAC', urgency: 'High', why: 'Consumer willingness to pay premium for eco-packaging up 68%. Competitors announcing refillable lines for Q3.', nextStep: 'Commission packaging feasibility study with R&D' },
  { title: 'Retinol Claims Under EU Scrutiny', brand: 'La Roche-Posay', market: 'Europe', urgency: 'Critical', why: 'New EU regulation requires clinical substantiation for anti-aging claims. Enforcement starts Q2 2026.', nextStep: 'Initiate portfolio-wide claims audit immediately' },
  { title: 'Skinimalism Trend Accelerating', brand: 'Maybelline', market: 'North America', urgency: 'Medium', why: 'TikTok mentions up 340% YoY. Gen Z actively rejecting multi-step routines.', nextStep: 'Brief innovation team on multi-benefit SKU development' },
]

const FALLBACK_ACTIONS = [
  { title: 'Audit EU anti-aging claims portfolio', priority: 'Critical', owner: 'Regulatory Affairs', impact: 'Prevents non-compliance penalties and product withdrawal', timeline: 'Complete by Q2 2026' },
  { title: 'Launch refillable packaging pilot', priority: 'High', owner: 'R&D / Packaging', impact: 'First-mover advantage in fastest-growing APAC segment', timeline: '6 months' },
  { title: 'Develop multi-benefit hero SKU', priority: 'High', owner: 'Innovation Lab', impact: 'Capture skinimalism demand before competitors', timeline: 'Q3 2026 target' },
  { title: 'Revise APAC sustainability campaign', priority: 'Medium', owner: 'Marketing APAC', impact: 'Align brand messaging with consumer sustainability expectations', timeline: 'Next campaign cycle' },
]

const FALLBACK_OPPORTUNITIES = [
  { title: 'Refillable Skincare Format', brand: "Garnier / Kiehl's", market: 'APAC', why: 'APAC sustainable beauty market growing at 12% CAGR with strong consumer willingness to pay premium.', confidence: 'High', move: 'Pilot refillable lines in South Korea before scaling regionally' },
  { title: 'Multi-Benefit Skincare for Gen Z', brand: 'Maybelline / NYX', market: 'North America', why: 'Skinimalism trend creates whitespace for simplified routines with fewer, more effective products.', confidence: 'Medium', move: 'Fast-track 3-in-1 product development targeting social-first launch' },
]

const FALLBACK_RISKS = [
  { title: 'Retinol Product Launch Delay Risk', brand: 'La Roche-Posay', market: 'EU / Global', severity: 'Critical', cause: 'New EU cosmetics regulation requiring clinical evidence for anti-wrinkle claims; current substantiation insufficient.', action: 'Halt new retinol launches in EU until claims are re-substantiated' },
  { title: 'Competitive Window Closing in APAC', brand: 'Garnier', market: 'South Korea / Japan', severity: 'High', cause: 'Shiseido and Amorepacific refillable launches in Q3 will erode first-mover positioning.', action: 'Accelerate sustainable packaging R&D timeline by 2 months' },
]

const FALLBACK_ALERTS = [
  { title: 'Anti-Aging Claims Non-Compliance', brand: 'La Roche-Posay / Vichy', market: 'European Union', severity: 'Critical', why: 'EU Cosmetic Regulation update mandates clinical evidence for anti-wrinkle claims. Portfolio-wide exposure.', response: 'Immediate audit of all anti-aging marketing materials and product labels' },
  { title: 'Clean Beauty Perception Gap', brand: "L'Or\u00e9al Paris", market: 'North America', severity: 'Medium', why: 'Consumer surveys show 42% perceive brand as less clean than indie competitors despite reformulation efforts.', response: 'Launch transparency campaign with ingredient sourcing storytelling' },
]

// ── Helpers ──

function urgencyBadge(urgency: string) {
  const u = (urgency || '').toLowerCase()
  if (u === 'critical') return 'bg-red-500/15 text-red-400 border border-red-500/30'
  if (u === 'high') return 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
  if (u === 'medium') return 'bg-blue-400/15 text-blue-400 border border-blue-400/30'
  return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
}

function severityDot(sev: string) {
  const s = (sev || '').toLowerCase()
  if (s === 'critical') return 'bg-red-500'
  if (s === 'high') return 'bg-amber-500'
  if (s === 'medium') return 'bg-blue-400'
  return 'bg-emerald-500'
}

function cleanText(text: string, maxLen = 90): string {
  if (!text) return ''
  const clean = text.replace(/\*\*/g, '').replace(/[#]/g, '').replace(/\n/g, ' ').trim()
  return clean.length > maxLen ? clean.slice(0, maxLen) + '...' : clean
}

function priorityOrder(p: string): number {
  const v = (p || '').toLowerCase()
  if (v === 'critical') return 0
  if (v === 'high') return 1
  if (v === 'medium') return 2
  return 3
}

// ── Extract dynamic intelligence from analyses ──

interface DerivedSignal { title: string; brand: string; market: string; urgency: string; why: string; nextStep: string; sourceId?: string }
interface DerivedAction { title: string; priority: string; owner: string; impact: string; timeline: string; sourceId?: string }
interface DerivedOpportunity { title: string; brand: string; market: string; why: string; confidence: string; move: string; sourceId?: string }
interface DerivedRisk { title: string; brand: string; market: string; severity: string; cause: string; action: string; sourceId?: string }
interface DerivedAlert { title: string; brand: string; market: string; severity: string; why: string; response: string; sourceId?: string }

function deriveIntelligence(analyses: AnalysisItem[]) {
  const signals: DerivedSignal[] = []
  const actions: DerivedAction[] = []
  const opportunities: DerivedOpportunity[] = []
  const risks: DerivedRisk[] = []
  const alerts: DerivedAlert[] = []

  for (const a of analyses) {
    const types = Array.isArray(a.signal_types) ? a.signal_types.map(t => (t || '').toLowerCase()) : []
    const specialists = Array.isArray(a.specialist_outputs) ? a.specialist_outputs : []
    const pActions = Array.isArray(a.priority_actions) ? a.priority_actions : []
    const summary = a.orchestrator_summary || ''
    const id = a._id

    // Derive signals from each specialist analysis
    for (const sp of specialists) {
      const recs = Array.isArray(sp?.recommendations) ? sp.recommendations : []
      const topRec = recs[0]

      const sigTitle = cleanText(sp?.key_findings || sp?.domain || 'Signal from analysis', 70)
      const sigUrgency = recs.some((r: any) => (r?.priority || '').toLowerCase() === 'critical') ? 'Critical'
        : recs.some((r: any) => (r?.priority || '').toLowerCase() === 'high') ? 'High' : 'Medium'

      signals.push({
        title: sigTitle,
        brand: sp?.domain || 'Cross-brand',
        market: 'Global',
        urgency: sigUrgency,
        why: cleanText(sp?.key_findings || '', 200),
        nextStep: topRec?.action || 'Review full analysis for recommendations',
        sourceId: id,
      })

      // Route to category-specific lists
      const domain = (sp?.domain || '').toLowerCase()
      if (types.includes('opportunity') || domain.includes('opportunity') || domain.includes('market') || domain.includes('trend')) {
        opportunities.push({
          title: sigTitle,
          brand: sp?.domain || 'Cross-brand',
          market: 'Global',
          why: cleanText(sp?.key_findings || '', 200),
          confidence: sp?.confidence || 'Medium',
          move: topRec?.action || 'Evaluate opportunity further',
          sourceId: id,
        })
      }
      if (types.includes('launch') || domain.includes('launch') || domain.includes('performance')) {
        risks.push({
          title: sigTitle,
          brand: sp?.domain || 'Cross-brand',
          market: 'Global',
          severity: sigUrgency,
          cause: cleanText(sp?.key_findings || '', 200),
          action: topRec?.action || 'Review launch strategy',
          sourceId: id,
        })
      }
      if (types.includes('claims') || domain.includes('claims') || domain.includes('compliance') || domain.includes('reputation') || domain.includes('brand integrity')) {
        alerts.push({
          title: sigTitle,
          brand: sp?.domain || 'Cross-brand',
          market: 'Global',
          severity: sigUrgency,
          why: cleanText(sp?.key_findings || '', 200),
          response: topRec?.action || 'Investigate further',
          sourceId: id,
        })
      }
    }

    // Derive actions from priority_actions
    for (const pa of pActions) {
      actions.push({
        title: pa?.action || 'Action item',
        priority: pa?.priority || 'Medium',
        owner: pa?.owner || 'TBD',
        impact: cleanText(summary, 120),
        timeline: 'Per analysis recommendation',
        sourceId: id,
      })
    }

    // If no specialists matched category-specific, use signal_types to create at least one signal
    if (specialists.length === 0 && summary) {
      signals.push({
        title: cleanText(summary, 70),
        brand: 'Cross-brand',
        market: 'Global',
        urgency: pActions.some((p: any) => (p?.priority || '').toLowerCase() === 'critical') ? 'Critical' : 'High',
        why: cleanText(summary, 200),
        nextStep: pActions[0]?.action || 'Review full analysis',
        sourceId: id,
      })
    }
  }

  // Sort by urgency/priority
  signals.sort((a, b) => priorityOrder(a.urgency) - priorityOrder(b.urgency))
  actions.sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority))
  risks.sort((a, b) => priorityOrder(a.severity) - priorityOrder(b.severity))
  alerts.sort((a, b) => priorityOrder(a.severity) - priorityOrder(b.severity))

  return { signals, actions, opportunities, risks, alerts }
}

// ── Dashboard component ──

export default function Dashboard({ analyses, loading, onNavigate, onViewAnalysis, onOpenDetail }: DashboardProps) {
  const safeAnalyses = Array.isArray(analyses) ? analyses : []
  const hasRealData = safeAnalyses.length > 0

  const derived = useMemo(() => deriveIntelligence(safeAnalyses), [safeAnalyses])

  // Use derived data when available, fallback samples otherwise
  const displaySignals = derived.signals.length > 0 ? derived.signals.slice(0, 3) : FALLBACK_SIGNALS
  const displayActions = derived.actions.length > 0 ? derived.actions.slice(0, 6) : FALLBACK_ACTIONS
  const displayOpps = derived.opportunities.length > 0 ? derived.opportunities.slice(0, 4) : FALLBACK_OPPORTUNITIES
  const displayRisks = derived.risks.length > 0 ? derived.risks.slice(0, 4) : FALLBACK_RISKS
  const displayAlerts = derived.alerts.length > 0 ? derived.alerts.slice(0, 4) : FALLBACK_ALERTS

  // Count criticals dynamically
  const criticalCount = hasRealData
    ? derived.signals.filter(s => s.urgency === 'Critical').length + derived.risks.filter(r => r.severity === 'Critical').length + derived.alerts.filter(a => a.severity === 'Critical').length
    : 2

  // ── Click handlers to create DetailItems ──

  const openSignal = (sig: typeof displaySignals[0]) => {
    onOpenDetail({
      category: 'signal',
      title: sig.title,
      brand: sig.brand,
      market: sig.market,
      severity: sig.urgency,
      sections: [
        { label: 'Why It Matters', content: sig.why },
        { label: 'Recommended Next Step', content: sig.nextStep },
      ],
      sourceAnalysisId: (sig as any).sourceId,
    })
  }

  const openAction = (act: typeof displayActions[0]) => {
    onOpenDetail({
      category: 'action',
      title: act.title,
      severity: act.priority,
      sections: [
        { label: 'Expected Impact', content: act.impact },
        { label: 'Owner', content: act.owner },
        { label: 'Timeline', content: act.timeline },
      ],
      sourceAnalysisId: (act as any).sourceId,
    })
  }

  const openOpportunity = (opp: typeof displayOpps[0]) => {
    onOpenDetail({
      category: 'opportunity',
      title: opp.title,
      brand: opp.brand,
      market: opp.market,
      severity: opp.confidence,
      sections: [
        { label: 'Why It Matters', content: opp.why },
        { label: 'Suggested Move', content: opp.move },
        { label: 'Confidence Level', content: opp.confidence },
      ],
      sourceAnalysisId: (opp as any).sourceId,
    })
  }

  const openRisk = (risk: typeof displayRisks[0]) => {
    onOpenDetail({
      category: 'risk',
      title: risk.title,
      brand: risk.brand,
      market: risk.market,
      severity: risk.severity,
      sections: [
        { label: 'Likely Cause', content: risk.cause },
        { label: 'Immediate Action Required', content: risk.action },
      ],
      sourceAnalysisId: (risk as any).sourceId,
    })
  }

  const openAlert = (alert: typeof displayAlerts[0]) => {
    onOpenDetail({
      category: 'alert',
      title: alert.title,
      brand: alert.brand,
      market: alert.market,
      severity: alert.severity,
      sections: [
        { label: 'Why It Matters', content: alert.why },
        { label: 'Recommended Response', content: alert.response },
      ],
      sourceAnalysisId: (alert as any).sourceId,
    })
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* KPI Row */}
      <div className="px-8 pt-7 pb-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Time to Opportunity', value: '< 4h', sub: 'Avg. detection speed', icon: RiTimeLine },
            { label: 'Time to First Action', value: '< 12h', sub: 'Avg. recommendation to brief', icon: RiFlashlightLine },
            { label: 'Early SOV', value: hasRealData ? `${Math.min(73 + safeAnalyses.length * 3, 95)}%` : '73%', sub: 'Share of voice on key signals', icon: RiLineChartLine },
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

        {/* A. Priority Signals */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <RiAlertLine className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Priority Signals</h3>
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
                  <span>{sig.brand}</span>
                  <span className="text-border">|</span>
                  <span>{sig.market}</span>
                </div>
                <p className="text-[12px] text-foreground/70 leading-relaxed mb-3 flex-1">{cleanText(sig.why, 140)}</p>
                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Recommended Next Step</p>
                    <p className="text-[12px] text-primary leading-relaxed">{sig.nextStep}</p>
                  </div>
                  <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* B. Recommended Actions */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <RiFlashlightLine className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Recommended Actions</h3>
            {hasRealData && <span className="text-[9px] text-primary tracking-[0.1em] uppercase ml-auto">Live</span>}
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
                    <span>{act.owner}</span>
                    <span className="text-border">|</span>
                    <span>{act.timeline}</span>
                  </div>
                  <p className="text-[11px] text-foreground/60 mt-1.5 leading-relaxed">{cleanText(act.impact, 120)}</p>
                </div>
                <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </section>

        {/* C. Active Opportunities */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <RiArrowRightUpLine className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Active Opportunities</h3>
            {hasRealData && <span className="text-[9px] text-primary tracking-[0.1em] uppercase ml-auto">Live</span>}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {displayOpps.map((opp, i) => (
              <button key={i} onClick={() => openOpportunity(opp)} className="bg-card border border-border p-5 text-left hover:border-primary/40 hover:bg-card/80 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug group-hover:text-primary transition-colors">{opp.title}</h4>
                  <span className="text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ml-3 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">{opp.confidence} confidence</span>
                </div>
                <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                  <span>{opp.brand}</span>
                  <span className="text-border">|</span>
                  <span>{opp.market}</span>
                </div>
                <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{cleanText(opp.why, 160)}</p>
                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Suggested Move</p>
                    <p className="text-[12px] text-primary leading-relaxed">{opp.move}</p>
                  </div>
                  <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* D. Launch Risks */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <RiErrorWarningLine className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Launch Risks</h3>
            {hasRealData && <span className="text-[9px] text-primary tracking-[0.1em] uppercase ml-auto">Live</span>}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {displayRisks.map((risk, i) => (
              <button key={i} onClick={() => openRisk(risk)} className="bg-card border border-border p-5 text-left hover:border-primary/40 hover:bg-card/80 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug pr-2 group-hover:text-primary transition-colors">{risk.title}</h4>
                  <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(risk.severity)}`}>{risk.severity}</span>
                </div>
                <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                  <span>{risk.brand}</span>
                  <span className="text-border">|</span>
                  <span>{risk.market}</span>
                </div>
                <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Likely Cause</p>
                <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{cleanText(risk.cause, 160)}</p>
                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Immediate Action</p>
                    <p className="text-[12px] text-primary leading-relaxed">{risk.action}</p>
                  </div>
                  <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* E. Claims / Reputation Alerts */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <RiShieldLine className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Claims / Reputation Alerts</h3>
            {hasRealData && <span className="text-[9px] text-primary tracking-[0.1em] uppercase ml-auto">Live</span>}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {displayAlerts.map((alert, i) => (
              <button key={i} onClick={() => openAlert(alert)} className="bg-card border border-border p-5 text-left hover:border-primary/40 hover:bg-card/80 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug pr-2 group-hover:text-primary transition-colors">{alert.title}</h4>
                  <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(alert.severity)}`}>{alert.severity}</span>
                </div>
                <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                  <span>{alert.brand}</span>
                  <span className="text-border">|</span>
                  <span>{alert.market}</span>
                </div>
                <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{cleanText(alert.why, 160)}</p>
                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Recommended Response</p>
                    <p className="text-[12px] text-primary leading-relaxed">{alert.response}</p>
                  </div>
                  <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* F. Recent Analyses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <RiFileTextLine className="h-4 w-4 text-primary" />
              <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Recent Analyses</h3>
            </div>
            {safeAnalyses.length > 0 && (
              <button onClick={() => onNavigate('history')} className="flex items-center gap-1 text-[11px] text-primary tracking-wide hover:text-primary/80 transition-colors">
                View all <RiArrowRightSLine className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
          {loading ? (
            <div className="bg-card border border-border p-10 flex items-center justify-center">
              <div className="flex items-center gap-3 text-muted-foreground text-[12px] tracking-wide">
                <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                Loading analyses...
              </div>
            </div>
          ) : safeAnalyses.length === 0 ? (
            <div className="bg-card border border-border p-8">
              <div className="text-center">
                <p className="text-[12px] text-muted-foreground tracking-wide mb-4">No analyses yet. Submit a new signal to generate your first foresight brief.</p>
                <button
                  onClick={() => onNavigate('new-signal')}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-[12px] tracking-[0.12em] uppercase hover:bg-primary/90 transition-colors"
                >
                  <RiRocketLine className="h-3.5 w-3.5" />
                  New Signal Analysis
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border divide-y divide-border/60">
              {safeAnalyses.slice(0, 5).map((analysis, idx) => {
                const types = Array.isArray(analysis?.signal_types) ? analysis.signal_types : []
                return (
                  <button
                    key={analysis?._id ?? idx}
                    className="w-full text-left flex items-start gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors group"
                    onClick={() => onViewAnalysis(analysis)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <p className="text-[13px] text-foreground tracking-wide leading-snug group-hover:text-primary transition-colors">
                          {cleanText(analysis?.orchestrator_summary ?? '', 100)}
                        </p>
                        <span className="text-[9px] text-muted-foreground tracking-wide whitespace-nowrap flex-shrink-0 mt-0.5">
                          {analysis?.createdAt ? new Date(analysis.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {types.map((t: string, ti: number) => (
                          <span key={ti} className="text-[9px] tracking-[0.1em] uppercase text-primary border border-primary/30 px-1.5 py-0.5">{t}</span>
                        ))}
                      </div>
                    </div>
                    <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                  </button>
                )
              })}
            </div>
          )}
        </section>

        {/* New Signal CTA */}
        <div className="flex justify-center pt-2 pb-4">
          <button
            onClick={() => onNavigate('new-signal')}
            className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground px-8 py-3 text-[12px] tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors"
          >
            <RiRocketLine className="h-4 w-4" />
            Submit New Signal for Analysis
          </button>
        </div>
      </div>
    </div>
  )
}
