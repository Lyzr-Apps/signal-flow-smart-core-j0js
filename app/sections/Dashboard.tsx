'use client'

import React from 'react'
import { RiTimeLine, RiFlashlightLine, RiLineChartLine, RiAlertLine, RiArrowRightUpLine, RiShieldLine, RiRocketLine, RiErrorWarningLine, RiFileTextLine, RiArrowRightSLine } from 'react-icons/ri'

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
}

const SAMPLE_SIGNALS = [
  { title: 'Sustainable Packaging Shift in APAC', brand: 'Garnier', market: 'APAC', urgency: 'High', why: 'Consumer willingness to pay premium for eco-packaging up 68%. Competitors announcing refillable lines for Q3.', nextStep: 'Commission packaging feasibility study with R&D' },
  { title: 'Retinol Claims Under EU Scrutiny', brand: 'La Roche-Posay', market: 'Europe', urgency: 'Critical', why: 'New EU regulation requires clinical substantiation for anti-aging claims. Enforcement starts Q2 2026.', nextStep: 'Initiate portfolio-wide claims audit immediately' },
  { title: 'Skinimalism Trend Accelerating', brand: 'Maybelline', market: 'North America', urgency: 'Medium', why: 'TikTok mentions up 340% YoY. Gen Z actively rejecting multi-step routines.', nextStep: 'Brief innovation team on multi-benefit SKU development' },
]

const SAMPLE_ACTIONS = [
  { title: 'Audit EU anti-aging claims portfolio', priority: 'Critical', owner: 'Regulatory Affairs', impact: 'Prevents non-compliance penalties and product withdrawal', timeline: 'Complete by Q2 2026' },
  { title: 'Launch refillable packaging pilot', priority: 'High', owner: 'R&D / Packaging', impact: 'First-mover advantage in fastest-growing APAC segment', timeline: '6 months' },
  { title: 'Develop multi-benefit hero SKU', priority: 'High', owner: 'Innovation Lab', impact: 'Capture skinimalism demand before competitors', timeline: 'Q3 2026 target' },
  { title: 'Revise APAC sustainability campaign', priority: 'Medium', owner: 'Marketing APAC', impact: 'Align brand messaging with consumer sustainability expectations', timeline: 'Next campaign cycle' },
]

const SAMPLE_OPPORTUNITIES = [
  { title: 'Refillable Skincare Format', brand: "Garnier / Kiehl's", market: 'APAC', why: 'APAC sustainable beauty market growing at 12% CAGR with strong consumer willingness to pay premium.', confidence: 'High', move: 'Pilot refillable lines in South Korea before scaling regionally' },
  { title: 'Multi-Benefit Skincare for Gen Z', brand: 'Maybelline / NYX', market: 'North America', why: 'Skinimalism trend creates whitespace for simplified routines with fewer, more effective products.', confidence: 'Medium', move: 'Fast-track 3-in-1 product development targeting social-first launch' },
]

const SAMPLE_RISKS = [
  { title: 'Retinol Product Launch Delay Risk', brand: 'La Roche-Posay', market: 'EU / Global', severity: 'Critical', cause: 'New EU cosmetics regulation requiring clinical evidence for anti-wrinkle claims; current substantiation insufficient.', action: 'Halt new retinol launches in EU until claims are re-substantiated' },
  { title: 'Competitive Window Closing in APAC', brand: 'Garnier', market: 'South Korea / Japan', severity: 'High', cause: 'Shiseido and Amorepacific refillable launches in Q3 will erode first-mover positioning.', action: 'Accelerate sustainable packaging R&D timeline by 2 months' },
]

const SAMPLE_ALERTS = [
  { title: 'Anti-Aging Claims Non-Compliance', brand: 'La Roche-Posay / Vichy', market: 'European Union', severity: 'Critical', why: 'EU Cosmetic Regulation update mandates clinical evidence for anti-wrinkle claims. Portfolio-wide exposure.', response: 'Immediate audit of all anti-aging marketing materials and product labels' },
  { title: 'Clean Beauty Perception Gap', brand: "L'Or\u00e9al Paris", market: 'North America', severity: 'Medium', why: 'Consumer surveys show 42% perceive brand as less clean than indie competitors despite reformulation efforts.', response: 'Launch transparency campaign with ingredient sourcing storytelling' },
]

function urgencyBadge(urgency: string) {
  const u = urgency.toLowerCase()
  if (u === 'critical') return 'bg-red-500/15 text-red-400 border border-red-500/30'
  if (u === 'high') return 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
  if (u === 'medium') return 'bg-blue-400/15 text-blue-400 border border-blue-400/30'
  return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
}

function severityDot(sev: string) {
  const s = sev.toLowerCase()
  if (s === 'critical') return 'bg-red-500'
  if (s === 'high') return 'bg-amber-500'
  if (s === 'medium') return 'bg-blue-400'
  return 'bg-emerald-500'
}

function cleanSummary(text: string, maxLen = 90): string {
  if (!text) return ''
  const clean = text.replace(/\*\*/g, '').replace(/[#\-]/g, '').replace(/\n/g, ' ').trim()
  return clean.length > maxLen ? clean.slice(0, maxLen) + '...' : clean
}

export default function Dashboard({ analyses, loading, onNavigate, onViewAnalysis }: DashboardProps) {
  const safeAnalyses = Array.isArray(analyses) ? analyses : []

  return (
    <div className="flex-1 overflow-y-auto">
      {/* KPI Row */}
      <div className="px-8 pt-7 pb-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Time to Opportunity', value: '< 4h', sub: 'Avg. detection speed', icon: RiTimeLine },
            { label: 'Time to First Action', value: '< 12h', sub: 'Avg. recommendation to brief', icon: RiFlashlightLine },
            { label: 'Early SOV', value: '73%', sub: 'Share of voice on key signals', icon: RiLineChartLine },
            { label: 'Open Critical Signals', value: String(SAMPLE_SIGNALS.filter(s => s.urgency === 'Critical').length + SAMPLE_RISKS.filter(r => r.severity === 'Critical').length), sub: 'Require immediate attention', icon: RiAlertLine },
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
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {SAMPLE_SIGNALS.map((sig, i) => (
              <div key={i} className="bg-card border border-border p-5 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug pr-2">{sig.title}</h4>
                  <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(sig.urgency)}`}>{sig.urgency}</span>
                </div>
                <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                  <span>{sig.brand}</span>
                  <span className="text-border">|</span>
                  <span>{sig.market}</span>
                </div>
                <p className="text-[12px] text-foreground/70 leading-relaxed mb-3 flex-1">{sig.why}</p>
                <div className="pt-3 border-t border-border/60">
                  <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Recommended Next Step</p>
                  <p className="text-[12px] text-primary leading-relaxed">{sig.nextStep}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* B. Recommended Actions */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <RiFlashlightLine className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Recommended Actions</h3>
          </div>
          <div className="bg-card border border-border divide-y divide-border/60">
            {SAMPLE_ACTIONS.map((act, i) => (
              <div key={i} className="flex items-start gap-5 px-5 py-4">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${severityDot(act.priority)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h4 className="text-[13px] text-foreground tracking-wide">{act.title}</h4>
                    <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap flex-shrink-0 ${urgencyBadge(act.priority)}`}>{act.priority}</span>
                  </div>
                  <div className="flex gap-4 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                    <span>{act.owner}</span>
                    <span className="text-border">|</span>
                    <span>{act.timeline}</span>
                  </div>
                  <p className="text-[11px] text-foreground/60 mt-1.5 leading-relaxed">{act.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* C. Active Opportunities */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <RiArrowRightUpLine className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Active Opportunities</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {SAMPLE_OPPORTUNITIES.map((opp, i) => (
              <div key={i} className="bg-card border border-border p-5">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug">{opp.title}</h4>
                  <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ml-3 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30`}>{opp.confidence} confidence</span>
                </div>
                <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                  <span>{opp.brand}</span>
                  <span className="text-border">|</span>
                  <span>{opp.market}</span>
                </div>
                <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{opp.why}</p>
                <div className="pt-3 border-t border-border/60">
                  <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Suggested Move</p>
                  <p className="text-[12px] text-primary leading-relaxed">{opp.move}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* D. Launch Risks */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <RiErrorWarningLine className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Launch Risks</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {SAMPLE_RISKS.map((risk, i) => (
              <div key={i} className="bg-card border border-border p-5">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug pr-2">{risk.title}</h4>
                  <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(risk.severity)}`}>{risk.severity}</span>
                </div>
                <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                  <span>{risk.brand}</span>
                  <span className="text-border">|</span>
                  <span>{risk.market}</span>
                </div>
                <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Likely Cause</p>
                <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{risk.cause}</p>
                <div className="pt-3 border-t border-border/60">
                  <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Immediate Action</p>
                  <p className="text-[12px] text-primary leading-relaxed">{risk.action}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* E. Claims / Reputation Alerts */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <RiShieldLine className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Claims / Reputation Alerts</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {SAMPLE_ALERTS.map((alert, i) => (
              <div key={i} className="bg-card border border-border p-5">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug pr-2">{alert.title}</h4>
                  <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(alert.severity)}`}>{alert.severity}</span>
                </div>
                <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                  <span>{alert.brand}</span>
                  <span className="text-border">|</span>
                  <span>{alert.market}</span>
                </div>
                <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{alert.why}</p>
                <div className="pt-3 border-t border-border/60">
                  <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Recommended Response</p>
                  <p className="text-[12px] text-primary leading-relaxed">{alert.response}</p>
                </div>
              </div>
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
                    className="w-full text-left flex items-start gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors"
                    onClick={() => onViewAnalysis(analysis)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1.5">
                        <p className="text-[13px] text-foreground tracking-wide leading-snug">
                          {cleanSummary(analysis?.orchestrator_summary ?? '', 100)}
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
                    <RiArrowRightSLine className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" />
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
