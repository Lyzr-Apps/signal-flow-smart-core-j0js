'use client'

import React from 'react'
import {
  RiArrowLeftLine, RiFlashlightLine, RiLightbulbLine,
  RiAlertLine, RiArrowRightUpLine, RiErrorWarningLine, RiShieldLine,
  RiBarChartLine, RiTeamLine, RiCheckboxCircleLine,
} from 'react-icons/ri'
import { urgencyBadge, severityDot } from '../data/seededScenarios'
import type { DetailItem } from '../DetailView'
import type { InsightMetrics } from '../data/seededScenarios'

interface InsightWorkspaceProps {
  item: DetailItem & { metrics?: InsightMetrics }
  onBack: () => void
}

const CATEGORY_LABELS: Record<string, { label: string; icon: any; color: string }> = {
  signal: { label: 'Market Signal', icon: RiAlertLine, color: 'text-amber-400' },
  opportunity: { label: 'Growth Opportunity', icon: RiArrowRightUpLine, color: 'text-emerald-400' },
  risk: { label: 'Demand Risk', icon: RiErrorWarningLine, color: 'text-red-400' },
  alert: { label: 'Market Alert', icon: RiShieldLine, color: 'text-red-400' },
  analysis: { label: 'Analysis', icon: RiLightbulbLine, color: 'text-primary' },
}

const MONTH_LABELS = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']

function SignalStrengthBadge({ strength }: { strength: string }) {
  const s = (strength || '').toLowerCase()
  let cls = 'bg-blue-400/15 text-blue-400 border-blue-400/30'
  if (s === 'strong') cls = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
  else if (s === 'moderate') cls = 'bg-amber-500/15 text-amber-400 border-amber-500/30'
  return (
    <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 border ${cls}`}>
      {strength}
    </span>
  )
}

function ConfidenceBadge({ confidence }: { confidence: string }) {
  const c = (confidence || '').toLowerCase()
  let cls = 'bg-blue-400/15 text-blue-400 border-blue-400/30'
  if (c === 'high' || c === 'very high') cls = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
  else if (c === 'medium' || c === 'moderate') cls = 'bg-amber-500/15 text-amber-400 border-amber-500/30'
  else if (c === 'low') cls = 'bg-red-500/15 text-red-400 border-red-500/30'
  return (
    <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 border ${cls}`}>
      {confidence}
    </span>
  )
}

function TrendComparisonChart({ lorealTrend, competitorTrend, competitorName }: { lorealTrend: number[]; competitorTrend: number[]; competitorName: string }) {
  const w = 280, h = 100, padX = 8, padY = 10
  const allVals = [...lorealTrend, ...competitorTrend]
  const maxV = Math.max(...allVals)
  const minV = Math.min(...allVals)
  const range = maxV - minV || 1

  const toPoints = (data: number[]) =>
    data.map((v, i) => ({
      x: padX + (i / (data.length - 1)) * (w - padX * 2),
      y: padY + (1 - (v - minV) / range) * (h - padY * 2),
    }))

  const lorealPts = toPoints(lorealTrend)
  const compPts = toPoints(competitorTrend)

  const toLine = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  const toArea = (pts: { x: number; y: number }[]) =>
    `${toLine(pts)} L${pts[pts.length - 1].x.toFixed(1)},${h} L${pts[0].x.toFixed(1)},${h} Z`

  const lorealLine = toLine(lorealPts)
  const lorealArea = toArea(lorealPts)
  const compLine = toLine(compPts)
  const compArea = toArea(compPts)

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[100px]" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lorealFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(40,50%,55%)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="hsl(40,50%,55%)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="compFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(0,65%,55%)" stopOpacity="0.15" />
            <stop offset="100%" stopColor="hsl(0,65%,55%)" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <path d={compArea} fill="url(#compFill)" />
        <path d={compLine} fill="none" stroke="hsl(0,65%,55%)" strokeWidth="1.5" />
        {compPts.map((p, i) => (
          <circle key={`c${i}`} cx={p.x} cy={p.y} r="2" fill="hsl(0,65%,55%)" />
        ))}
        <path d={lorealArea} fill="url(#lorealFill)" />
        <path d={lorealLine} fill="none" stroke="hsl(40,50%,55%)" strokeWidth="2" />
        {lorealPts.map((p, i) => (
          <circle key={`l${i}`} cx={p.x} cy={p.y} r="2.5" fill="hsl(40,50%,55%)" />
        ))}
      </svg>
      <div className="flex justify-between mt-1">
        {MONTH_LABELS.map((m) => (
          <span key={m} className="text-[9px] text-muted-foreground">{m}</span>
        ))}
      </div>
      <div className="flex items-center gap-5 mt-2">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-[2px]" style={{ backgroundColor: 'hsl(40,50%,55%)' }} />
          <span className="text-[9px] text-muted-foreground tracking-wide">L&apos;Oreal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-[2px]" style={{ backgroundColor: 'hsl(0,65%,55%)' }} />
          <span className="text-[9px] text-muted-foreground tracking-wide">{competitorName}</span>
        </div>
      </div>
    </div>
  )
}

function GapIndicatorBar({ gap, competitorName }: { gap: string; competitorName: string }) {
  // Parse gap string for visual. Try to extract numeric value
  const numMatch = gap.match(/-?(\d+)/)
  const gapNum = numMatch ? parseInt(numMatch[1]) : 12
  const lorealShare = Math.max(10, 50 - Math.floor(gapNum / 2))
  const compShare = Math.min(90, 50 + Math.floor(gapNum / 2))

  return (
    <div>
      <div className="flex h-4 w-full mb-1.5">
        <div className="h-full flex items-center justify-center" style={{ width: `${lorealShare}%`, backgroundColor: 'hsl(40,50%,55%,0.6)' }}>
          <span className="text-[8px] text-foreground font-medium">{lorealShare}%</span>
        </div>
        <div className="h-full flex items-center justify-center" style={{ width: `${compShare}%`, backgroundColor: 'hsl(0,65%,55%,0.5)' }}>
          <span className="text-[8px] text-foreground font-medium">{compShare}%</span>
        </div>
      </div>
      <div className="flex justify-between">
        <span className="text-[9px] text-muted-foreground">L&apos;Oreal</span>
        <span className="text-[9px] text-muted-foreground">{competitorName}</span>
      </div>
    </div>
  )
}

function TeamActionCard({ label, content, icon }: { label: string; content: string; icon: string }) {
  const iconMap: Record<string, string> = {
    marketing: 'M',
    product: 'P',
    planning: 'D',
    manufacturing: 'S',
  }
  const letter = iconMap[icon] ?? icon.charAt(0).toUpperCase()

  return (
    <div className="bg-card border border-border p-4">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-5 h-5 flex items-center justify-center bg-primary/15 border border-primary/30">
          <span className="text-[9px] text-primary font-medium">{letter}</span>
        </div>
        <h4 className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase font-serif">{label}</h4>
      </div>
      <p className="text-[11px] text-foreground/80 leading-[1.7] tracking-wide">{content}</p>
    </div>
  )
}

function findSection(sections: { label: string; content: string }[], keyword: string) {
  return sections.find(s => s.label.toLowerCase().includes(keyword.toLowerCase()))
}

export default function InsightWorkspace({ item, onBack }: InsightWorkspaceProps) {
  const sections = Array.isArray(item?.sections) ? item.sections : []
  const actions = Array.isArray(item?.relatedActions) ? item.relatedActions : []
  const metrics = item?.metrics
  const catMeta = CATEGORY_LABELS[item?.category ?? 'signal'] ?? CATEGORY_LABELS.signal
  const CatIcon = catMeta.icon

  // If metrics available, use structured layout
  if (metrics) {
    const marketSignalSection = findSection(sections, 'market signal') ?? findSection(sections, 'what changed') ?? sections[0]
    const compSection = findSection(sections, 'competitor')
    const demandSection = findSection(sections, 'demand') ?? findSection(sections, 'impact')

    // Collect sections not explicitly used
    const usedLabels = new Set<string>()
    if (marketSignalSection) usedLabels.add(marketSignalSection.label)
    if (compSection) usedLabels.add(compSection.label)
    if (demandSection) usedLabels.add(demandSection.label)
    const remaining = sections.filter(s => !usedLabels.has(s.label))

    return (
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-6">
          {/* Back + Header */}
          <button onClick={onBack} className="flex items-center gap-2 text-[11px] text-muted-foreground tracking-[0.1em] uppercase hover:text-foreground transition-colors mb-5">
            <RiArrowLeftLine className="h-3.5 w-3.5" /> Back
          </button>

          <div className="flex items-center gap-2 mb-3">
            <CatIcon className={`h-4 w-4 ${catMeta.color}`} />
            <span className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground">{catMeta.label}</span>
          </div>

          <div className="flex items-start justify-between gap-4 mb-2">
            <h2 className="font-serif text-xl tracking-wide text-foreground leading-snug">{item.title}</h2>
            {item.severity && (
              <span className={`text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 whitespace-nowrap ${urgencyBadge(item.severity)}`}>
                {item.severity}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6">
            {(item.brand || item.market) && (
              <div className="flex gap-5 text-[11px] text-muted-foreground tracking-[0.1em] uppercase">
                {item.brand && <span>Brand: <span className="text-foreground/80">{item.brand}</span></span>}
                {item.market && <span>Market: <span className="text-foreground/80">{item.market}</span></span>}
              </div>
            )}
            <SignalStrengthBadge strength={metrics.signalStrength} />
          </div>

          {/* Market Signal section */}
          {marketSignalSection && (
            <div className="bg-card border border-primary/30 p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <RiLightbulbLine className="h-4 w-4 text-primary" />
                <h3 className="text-[11px] tracking-[0.14em] text-primary uppercase font-serif">{marketSignalSection.label}</h3>
              </div>
              <p className="text-[13px] text-foreground/90 leading-[1.8] tracking-wide">{marketSignalSection.content}</p>
            </div>
          )}

          {/* Trend Comparison Chart */}
          <div className="bg-card border border-border p-5 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <RiBarChartLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase font-serif">
                L&apos;Oreal vs {metrics.competitorName} Trend
              </h3>
            </div>
            <TrendComparisonChart
              lorealTrend={metrics.lorealTrend}
              competitorTrend={metrics.competitorTrend}
              competitorName={metrics.competitorName}
            />
            {metrics.competitorProduct && (
              <p className="text-[10px] text-muted-foreground mt-3 tracking-wide">
                Competitor product: <span className="text-foreground/70">{metrics.competitorProduct}</span>
              </p>
            )}
          </div>

          {/* Competitor Performance */}
          {compSection && (
            <div className="bg-card border border-border p-5 mb-4">
              <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-2 font-serif">{compSection.label}</p>
              <p className="text-[12px] text-foreground/80 leading-[1.8] tracking-wide">{compSection.content}</p>
            </div>
          )}

          {/* Gap / Diagnosis */}
          <div className="bg-card border border-primary/20 p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiErrorWarningLine className="h-4 w-4 text-amber-400" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase font-serif">Gap Diagnosis</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase mb-1">Gap vs Competitor</p>
                <p className="text-[15px] font-serif text-amber-400 tracking-wide">{metrics.gapVsCompetitor}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase mb-1">Root Cause</p>
                <p className="text-[12px] text-foreground/80 leading-relaxed tracking-wide">{metrics.gapReason}</p>
              </div>
            </div>
            <GapIndicatorBar gap={metrics.gapVsCompetitor} competitorName={metrics.competitorName} />
          </div>

          {/* Demand Implication */}
          <div className="bg-card border border-border p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiAlertLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase font-serif">Demand Implication</h3>
            </div>
            <p className="text-[12px] text-foreground/80 leading-[1.8] tracking-wide">
              {demandSection ? demandSection.content : metrics.demandImplication}
            </p>
          </div>

          {/* Remaining sections not yet used */}
          {remaining.length > 0 && (
            <div className="space-y-3 mb-4">
              {remaining.map((section, i) => (
                <div key={i} className="bg-card border border-border p-5">
                  <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-2 font-serif">{section.label}</p>
                  <p className="text-[12px] text-foreground/80 leading-[1.8] tracking-wide">{section.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Team Actions Grid */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiTeamLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase font-serif">Team Actions</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <TeamActionCard label="Marketing" content={metrics.teamActions.marketing} icon="marketing" />
              <TeamActionCard label="Product / R&D" content={metrics.teamActions.product} icon="product" />
              <TeamActionCard label="Planning" content={metrics.teamActions.planning} icon="planning" />
              <TeamActionCard label="Manufacturing / Supply" content={metrics.teamActions.manufacturing} icon="manufacturing" />
            </div>
          </div>

          {/* Confidence & Evidence */}
          <div className="bg-card border border-border p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiCheckboxCircleLine className="h-4 w-4 text-emerald-400" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase font-serif">Confidence & Evidence</h3>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Confidence Level</p>
              <ConfidenceBadge confidence={metrics.confidence} />
            </div>
            <p className="text-[12px] text-foreground/80 leading-[1.8] tracking-wide">{metrics.supportingEvidence}</p>
          </div>

          {/* Related Actions */}
          {actions.length > 0 && (
            <div className="bg-card border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <RiFlashlightLine className="h-4 w-4 text-primary" />
                <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase font-serif">Related Actions</h3>
              </div>
              <div className="divide-y divide-border/60">
                {actions.map((act, i) => (
                  <div key={i} className="flex items-start gap-3 py-3">
                    <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${severityDot(act.priority)}`} />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-[12px] text-foreground tracking-wide">{act.action}</p>
                        <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(act.priority)}`}>{act.priority}</span>
                      </div>
                      {act.owner && <p className="text-[10px] text-muted-foreground mt-1">{act.owner}</p>}
                      {act.rationale && <p className="text-[11px] text-foreground/50 mt-1 leading-relaxed">{act.rationale}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Fallback: no metrics — render sections as text cards (legacy/web analysis results)
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[11px] text-muted-foreground tracking-[0.1em] uppercase hover:text-foreground transition-colors mb-5">
          <RiArrowLeftLine className="h-3.5 w-3.5" /> Back
        </button>

        <div className="flex items-center gap-2 mb-3">
          <CatIcon className={`h-4 w-4 ${catMeta.color}`} />
          <span className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground">{catMeta.label}</span>
        </div>

        <div className="flex items-start justify-between gap-4 mb-2">
          <h2 className="font-serif text-xl tracking-wide text-foreground leading-snug">{item.title}</h2>
          {item.severity && (
            <span className={`text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 whitespace-nowrap ${urgencyBadge(item.severity)}`}>
              {item.severity}
            </span>
          )}
        </div>

        {(item.brand || item.market) && (
          <div className="flex gap-5 mb-6 text-[11px] text-muted-foreground tracking-[0.1em] uppercase">
            {item.brand && <span>Brand: <span className="text-foreground/80">{item.brand}</span></span>}
            {item.market && <span>Market: <span className="text-foreground/80">{item.market}</span></span>}
          </div>
        )}

        {sections.length > 0 && (
          <div className="bg-card border border-primary/30 p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiLightbulbLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-primary uppercase font-serif">Key Insight</h3>
            </div>
            <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-1.5">{sections[0].label}</p>
            <p className="text-[13px] text-foreground/90 leading-[1.8] tracking-wide">{sections[0].content}</p>
          </div>
        )}

        {sections.length > 1 && (
          <div className="space-y-3 mb-4">
            {sections.slice(1).map((section, i) => (
              <div key={i} className="bg-card border border-border p-5">
                <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-2 font-serif">{section.label}</p>
                <p className="text-[12px] text-foreground/80 leading-[1.8] tracking-wide">{section.content}</p>
              </div>
            ))}
          </div>
        )}

        {actions.length > 0 && (
          <div className="bg-card border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <RiFlashlightLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase font-serif">What Teams Should Do</h3>
            </div>
            <div className="divide-y divide-border/60">
              {actions.map((act, i) => (
                <div key={i} className="flex items-start gap-3 py-3">
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${severityDot(act.priority)}`} />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-[12px] text-foreground tracking-wide">{act.action}</p>
                      <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(act.priority)}`}>{act.priority}</span>
                    </div>
                    {act.owner && <p className="text-[10px] text-muted-foreground mt-1">{act.owner}</p>}
                    {act.rationale && <p className="text-[11px] text-foreground/50 mt-1 leading-relaxed">{act.rationale}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
