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

// ── Inline source note ──

function InlineSourceNote({ sources, keywords }: { sources: InsightMetrics['sources']; keywords: string[] }) {
  if (!Array.isArray(sources) || sources.length === 0) return null
  const matched = sources.filter(s => {
    const lower = (s.claim + ' ' + s.name + ' ' + s.type).toLowerCase()
    return keywords.some(k => lower.includes(k.toLowerCase()))
  })
  const display = matched.length > 0 ? matched : sources.slice(0, 2)
  return (
    <div className="mt-3 pt-2.5 border-t border-border/40">
      <p className="text-[9px] tracking-[0.12em] text-muted-foreground uppercase mb-1.5">Sources</p>
      {display.map((src, i) => (
        <div key={i} className="flex items-center gap-2 mb-1">
          <div className={`w-1 h-1 rounded-full flex-shrink-0 ${src.verified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span className="text-[10px] text-muted-foreground tracking-wide">{src.name}</span>
          {!src.verified && (
            <span className="text-[8px] tracking-[0.08em] uppercase px-1 py-px border bg-amber-500/10 text-amber-400 border-amber-500/25">Not verified</span>
          )}
        </div>
      ))}
    </div>
  )
}

// ── Badges ──

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

// ── Market Signal Trend Chart ──

function MarketSignalTrendChart({
  lorealTrend,
  competitorTrend,
  competitorName,
  sources,
}: {
  lorealTrend: number[]
  competitorTrend: number[]
  competitorName: string
  sources: InsightMetrics['sources']
}) {
  const w = 320, h = 140, padL = 40, padR = 12, padT = 16, padB = 32
  const chartW = w - padL - padR
  const chartH = h - padT - padB
  const allVals = [...lorealTrend, ...competitorTrend]
  const maxV = Math.max(...allVals)
  const minV = Math.min(...allVals)
  const range = maxV - minV || 1

  const toX = (i: number, len: number) => padL + (i / (len - 1)) * chartW
  const toY = (v: number) => padT + (1 - (v - minV) / range) * chartH

  const lorealPts = lorealTrend.map((v, i) => ({ x: toX(i, lorealTrend.length), y: toY(v) }))
  const compPts = competitorTrend.map((v, i) => ({ x: toX(i, competitorTrend.length), y: toY(v) }))

  const toLine = (pts: { x: number; y: number }[]) =>
    pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')

  const toArea = (pts: { x: number; y: number }[]) =>
    `${toLine(pts)} L${pts[pts.length - 1].x.toFixed(1)},${padT + chartH} L${pts[0].x.toFixed(1)},${padT + chartH} Z`

  const yTicks = [minV, minV + range * 0.5, maxV]

  // Find chart-relevant sources
  const chartSources = Array.isArray(sources)
    ? sources.filter(s => {
        const lower = (s.type + ' ' + s.name).toLowerCase()
        return lower.includes('trend') || lower.includes('analytics') || lower.includes('tiktok') || lower.includes('google') || lower.includes('circana') || lower.includes('nielsen')
      })
    : []

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[160px]" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="lorealFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(40,50%,55%)" stopOpacity="0.18" />
            <stop offset="100%" stopColor="hsl(40,50%,55%)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="compFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(0,65%,55%)" stopOpacity="0.12" />
            <stop offset="100%" stopColor="hsl(0,65%,55%)" stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {/* Y-axis label */}
        <text x="4" y={padT + chartH / 2} textAnchor="middle" transform={`rotate(-90, 4, ${padT + chartH / 2})`} className="fill-muted-foreground" fontSize="8" fontFamily="sans-serif">
          Signal Index
        </text>

        {/* Y-axis gridlines and labels */}
        {yTicks.map((tick, i) => {
          const y = toY(tick)
          return (
            <g key={i}>
              <line x1={padL} y1={y} x2={padL + chartW} y2={y} stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="3,3" />
              <text x={padL - 4} y={y + 3} textAnchor="end" className="fill-muted-foreground" fontSize="8" fontFamily="sans-serif">
                {Math.round(tick)}
              </text>
            </g>
          )
        })}

        {/* Data */}
        <path d={toArea(compPts)} fill="url(#compFill)" />
        <path d={toLine(compPts)} fill="none" stroke="hsl(0,65%,55%)" strokeWidth="1.5" />
        {compPts.map((p, i) => (
          <circle key={`c${i}`} cx={p.x} cy={p.y} r="2" fill="hsl(0,65%,55%)" />
        ))}
        <path d={toArea(lorealPts)} fill="url(#lorealFill)" />
        <path d={toLine(lorealPts)} fill="none" stroke="hsl(40,50%,55%)" strokeWidth="2" />
        {lorealPts.map((p, i) => (
          <circle key={`l${i}`} cx={p.x} cy={p.y} r="2.5" fill="hsl(40,50%,55%)" />
        ))}

        {/* X-axis labels */}
        {MONTH_LABELS.map((m, i) => {
          const x = toX(i, MONTH_LABELS.length)
          return (
            <text key={m} x={x} y={h - 8} textAnchor="middle" className="fill-muted-foreground" fontSize="8" fontFamily="sans-serif">
              {m}
            </text>
          )
        })}

        {/* X-axis label */}
        <text x={padL + chartW / 2} y={h - 0} textAnchor="middle" className="fill-muted-foreground" fontSize="7" fontFamily="sans-serif">
          Oct 2025 - Mar 2026
        </text>
      </svg>
      <div className="flex items-center gap-5 mt-1">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-[2px]" style={{ backgroundColor: 'hsl(40,50%,55%)' }} />
          <span className="text-[9px] text-muted-foreground tracking-wide">L&apos;Oreal</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-[2px]" style={{ backgroundColor: 'hsl(0,65%,55%)' }} />
          <span className="text-[9px] text-muted-foreground tracking-wide">{competitorName}</span>
        </div>
      </div>
      {/* Inline source legend for chart */}
      {chartSources.length > 0 && (
        <div className="mt-2 pt-2 border-t border-border/40">
          <p className="text-[9px] tracking-[0.12em] text-muted-foreground uppercase mb-1">Chart Sources</p>
          {chartSources.map((src, i) => (
            <div key={i} className="flex items-center gap-2 mb-0.5">
              <div className={`w-1 h-1 rounded-full flex-shrink-0 ${src.verified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span className="text-[10px] text-muted-foreground tracking-wide">{src.name}</span>
              {!src.verified && (
                <span className="text-[8px] tracking-[0.08em] uppercase px-1 py-px border bg-amber-500/10 text-amber-400 border-amber-500/25">Not verified</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Team Action Card ──

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

// ── Main Component ──

export default function InsightWorkspace({ item, onBack }: InsightWorkspaceProps) {
  const sections = Array.isArray(item?.sections) ? item.sections : []
  const actions = Array.isArray(item?.relatedActions) ? item.relatedActions : []
  const metrics = item?.metrics
  const catMeta = CATEGORY_LABELS[item?.category ?? 'signal'] ?? CATEGORY_LABELS.signal
  const CatIcon = catMeta.icon

  if (metrics) {
    const marketSignalSection = findSection(sections, 'market signal') ?? findSection(sections, 'what changed') ?? sections[0]
    const compSection = findSection(sections, 'competitor')
    const lorealSection = findSection(sections, "l'oreal perf") ?? findSection(sections, 'loreal perf')
    const demandSection = findSection(sections, 'demand') ?? findSection(sections, 'impact')
    const gapSection = findSection(sections, 'gap')

    // Parse gapReason into bullets
    const gapBullets = (metrics.gapReason || '')
      .split(/;\s*/)
      .map(s => s.trim())
      .filter(Boolean)

    // Parse gapVsCompetitor into share gap + revenue risk
    const gapParts = (metrics.gapVsCompetitor || '').split(',').map(s => s.trim())
    const shareGap = gapParts[0] || metrics.gapVsCompetitor
    const revenueRisk = gapParts[1] || ''

    // Parse evidence into bullets
    const evidenceBullets = (metrics.supportingEvidence || '')
      .split(/;\s*/)
      .map(s => s.trim())
      .filter(Boolean)

    // Compute growth for inline comparison
    const lorealGrowth = metrics.lorealTrend.length >= 2
      ? ((metrics.lorealTrend[metrics.lorealTrend.length - 1] - metrics.lorealTrend[0]) / metrics.lorealTrend[0]) * 100
      : 0
    const compGrowth = metrics.competitorTrend.length >= 2
      ? ((metrics.competitorTrend[metrics.competitorTrend.length - 1] - metrics.competitorTrend[0]) / metrics.competitorTrend[0]) * 100
      : 0

    const allSources = Array.isArray(metrics.sources) ? metrics.sources : []

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

          {/* 1. Market Signal */}
          {marketSignalSection && (
            <div className="bg-card border border-primary/30 p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <RiLightbulbLine className="h-4 w-4 text-primary" />
                <h3 className="text-[11px] tracking-[0.14em] text-primary uppercase font-serif">{marketSignalSection.label}</h3>
              </div>
              <p className="text-[13px] text-foreground/90 leading-[1.8] tracking-wide">{marketSignalSection.content}</p>
              <InlineSourceNote sources={allSources} keywords={['trend', 'google', 'tiktok', 'search', 'social', 'shelf', 'planogram', 'fda']} />
            </div>
          )}

          {/* 2. Market Signal Trend — line chart */}
          <div className="bg-card border border-border p-5 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <RiBarChartLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase font-serif">
                Market Signal Trend
              </h3>
            </div>
            <p className="text-[10px] text-muted-foreground tracking-wide mb-3">
              Relative performance index comparing L&apos;Oreal and {metrics.competitorName} over 6 months. Higher values indicate stronger market position based on sales share, search volume, and retail presence.
            </p>
            <MarketSignalTrendChart
              lorealTrend={metrics.lorealTrend}
              competitorTrend={metrics.competitorTrend}
              competitorName={metrics.competitorName}
              sources={allSources}
            />
            {metrics.competitorProduct && (
              <p className="text-[10px] text-muted-foreground mt-3 tracking-wide">
                Competitor product: <span className="text-foreground/70">{metrics.competitorProduct}</span>
              </p>
            )}
          </div>

          {/* 3. Competitor Performance — with inline growth comparison */}
          <div className="bg-card border border-border p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiErrorWarningLine className="h-4 w-4 text-red-400" />
              <h3 className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase font-serif">Competitor Performance</h3>
            </div>
            {compSection && (
              <p className="text-[12px] text-foreground/80 leading-[1.8] tracking-wide mb-4">{compSection.content}</p>
            )}
            {/* Inline growth comparison block */}
            <div className="bg-secondary/40 border border-border p-4">
              <p className="text-[9px] tracking-[0.12em] text-muted-foreground uppercase mb-3">6-Month Growth Comparison (Oct 2025 - Mar 2026)</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] text-muted-foreground tracking-wide mb-1">L&apos;Oreal</p>
                  <p className={`text-[18px] font-serif tracking-wide ${lorealGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {lorealGrowth >= 0 ? '+' : ''}{lorealGrowth.toFixed(1)}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-muted-foreground tracking-wide mb-1">{metrics.competitorName}</p>
                  <p className={`text-[18px] font-serif tracking-wide ${compGrowth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {compGrowth >= 0 ? '+' : ''}{compGrowth.toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
            <InlineSourceNote sources={allSources} keywords={['competitor', 'circana', 'nielsen', 'earnings', '10-k', 'investor', 'filing', 'retailer']} />
          </div>

          {/* 4. Gap Diagnosis — split left/right with bullets */}
          <div className="bg-card border border-primary/20 p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiErrorWarningLine className="h-4 w-4 text-amber-400" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase font-serif">Gap Diagnosis</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left: Gap vs Competitor */}
              <div>
                <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase mb-2">Gap vs Competitor</p>
                <div className="space-y-2">
                  <div>
                    <p className="text-[9px] tracking-[0.1em] text-muted-foreground uppercase mb-0.5">Share Gap</p>
                    <p className="text-[16px] font-serif text-amber-400 tracking-wide">{shareGap}</p>
                  </div>
                  {revenueRisk && (
                    <div>
                      <p className="text-[9px] tracking-[0.1em] text-muted-foreground uppercase mb-0.5">Revenue Risk</p>
                      <p className="text-[14px] font-serif text-red-400 tracking-wide">{revenueRisk}</p>
                    </div>
                  )}
                </div>
              </div>
              {/* Right: Root Cause as bullets */}
              <div>
                <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase mb-2">Root Cause</p>
                <ul className="space-y-1.5">
                  {gapBullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-1 h-1 rounded-full bg-amber-400 mt-2 flex-shrink-0" />
                      <span className="text-[11px] text-foreground/80 leading-relaxed tracking-wide">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <InlineSourceNote sources={allSources} keywords={['share', 'shelf', 'audit', 'conversion', 'gap', 'kantar', 'media']} />
          </div>

          {/* 5. Confidence & Evidence */}
          <div className="bg-card border border-border p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiCheckboxCircleLine className="h-4 w-4 text-emerald-400" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase font-serif">Confidence & Evidence</h3>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Confidence Level</p>
              <ConfidenceBadge confidence={metrics.confidence} />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase mb-2">Evidence Sources</p>
              <ul className="space-y-1">
                {evidenceBullets.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <div className="w-1 h-1 rounded-full bg-muted-foreground mt-2 flex-shrink-0" />
                    <span className="text-[11px] text-foreground/75 leading-relaxed tracking-wide">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 6. Demand Implication */}
          <div className="bg-card border border-border p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiAlertLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase font-serif">Demand Implication</h3>
            </div>
            <p className="text-[12px] text-foreground/80 leading-[1.8] tracking-wide">
              {demandSection ? demandSection.content : metrics.demandImplication}
            </p>
            <InlineSourceNote sources={allSources} keywords={['market', 'revenue', 'forecast', 'demand', 'circana', 'category']} />
          </div>

          {/* 7. Team Actions */}
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

  // Fallback: no metrics — render sections as text cards
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
