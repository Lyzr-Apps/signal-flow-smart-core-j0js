'use client'

import React from 'react'
import {
  RiArrowLeftLine, RiFlashlightLine, RiLightbulbLine,
  RiAlertLine, RiArrowRightUpLine, RiErrorWarningLine, RiShieldLine,
  RiBarChartLine, RiTeamLine, RiCheckboxCircleLine, RiFileListLine,
  RiShieldCheckLine, RiCloseCircleLine,
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

// ── Source type color mapping ──
const SOURCE_TYPE_COLORS: Record<string, string> = {
  'Google Trends': 'bg-blue-500',
  'Social / Creator Content': 'bg-purple-500',
  'Product Reviews': 'bg-amber-500',
  'Ecommerce / Retailer Data': 'bg-emerald-500',
  'Competitor Filings': 'bg-cyan-500',
  'Real-time Web Research': 'bg-indigo-500',
}

function sourceTypeColor(type: string): string {
  return SOURCE_TYPE_COLORS[type] || 'bg-muted-foreground'
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

// ── Charts ──

function MarketSignalTrendChart({
  lorealTrend,
  competitorTrend,
  competitorName,
}: {
  lorealTrend: number[]
  competitorTrend: number[]
  competitorName: string
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

  // Y-axis tick values
  const yTicks = [minV, minV + range * 0.5, maxV]

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
          Index
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
    </div>
  )
}

function GrowthComparisonChart({
  lorealTrend,
  competitorTrend,
  competitorName,
}: {
  lorealTrend: number[]
  competitorTrend: number[]
  competitorName: string
}) {
  const lorealGrowth = lorealTrend.length >= 2
    ? ((lorealTrend[lorealTrend.length - 1] - lorealTrend[0]) / lorealTrend[0]) * 100
    : 0
  const compGrowth = competitorTrend.length >= 2
    ? ((competitorTrend[competitorTrend.length - 1] - competitorTrend[0]) / competitorTrend[0]) * 100
    : 0

  const maxAbs = Math.max(Math.abs(lorealGrowth), Math.abs(compGrowth), 1)
  const w = 280, barH = 24, gap = 12, padL = 90, padR = 50
  const chartW = w - padL - padR
  const h = barH * 2 + gap + 36

  const barWidth = (val: number) => Math.max(2, (Math.abs(val) / maxAbs) * chartW)

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[100px]" preserveAspectRatio="xMidYMid meet">
        {/* Y-axis labels (brand names) */}
        <text x={padL - 6} y={12 + barH / 2 + 4} textAnchor="end" className="fill-foreground" fontSize="8" fontFamily="sans-serif">
          L&apos;Oreal
        </text>
        <text x={padL - 6} y={12 + barH + gap + barH / 2 + 4} textAnchor="end" className="fill-muted-foreground" fontSize="8" fontFamily="sans-serif">
          {competitorName.length > 14 ? competitorName.slice(0, 14) + '...' : competitorName}
        </text>

        {/* L'Oreal bar */}
        <rect
          x={padL}
          y={12}
          width={barWidth(lorealGrowth)}
          height={barH}
          fill={lorealGrowth >= 0 ? 'hsl(40,50%,55%)' : 'hsl(0,65%,55%)'}
          opacity={0.8}
        />
        <text x={padL + barWidth(lorealGrowth) + 6} y={12 + barH / 2 + 4} className="fill-foreground" fontSize="9" fontFamily="sans-serif" fontWeight="600">
          {lorealGrowth >= 0 ? '+' : ''}{lorealGrowth.toFixed(1)}%
        </text>

        {/* Competitor bar */}
        <rect
          x={padL}
          y={12 + barH + gap}
          width={barWidth(compGrowth)}
          height={barH}
          fill={compGrowth >= 0 ? 'hsl(0,65%,55%)' : 'hsl(40,50%,55%)'}
          opacity={0.8}
        />
        <text x={padL + barWidth(compGrowth) + 6} y={12 + barH + gap + barH / 2 + 4} className="fill-foreground" fontSize="9" fontFamily="sans-serif" fontWeight="600">
          {compGrowth >= 0 ? '+' : ''}{compGrowth.toFixed(1)}%
        </text>

        {/* X-axis label */}
        <text x={padL + chartW / 2} y={h - 2} textAnchor="middle" className="fill-muted-foreground" fontSize="7" fontFamily="sans-serif">
          6-Month Growth Rate (%)
        </text>
      </svg>
    </div>
  )
}

function SourceMixChart({ sources }: { sources: InsightMetrics['sources'] }) {
  if (!Array.isArray(sources) || sources.length === 0) return null
  const typeCounts: Record<string, number> = {}
  for (const s of sources) {
    typeCounts[s.type] = (typeCounts[s.type] || 0) + 1
  }
  const total = sources.length
  const entries = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])

  const w = 280, barH = 18, h = barH + 40
  let offsetX = 0

  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[52px]" preserveAspectRatio="xMidYMid meet">
        {entries.map(([type, count]) => {
          const segW = (count / total) * w
          const x = offsetX
          offsetX += segW
          return (
            <rect key={type} x={x} y={0} width={segW} height={barH} className={sourceTypeColor(type)} opacity={0.75} />
          )
        })}
        {/* X-axis label */}
        <text x={w / 2} y={barH + 28} textAnchor="middle" className="fill-muted-foreground" fontSize="7" fontFamily="sans-serif">
          Contribution to insight by source type
        </text>
      </svg>
      <div className="flex flex-wrap gap-3 mt-1">
        {entries.map(([type, count]) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 ${sourceTypeColor(type)}`} />
            <span className="text-[9px] text-muted-foreground tracking-wide">{type} ({count})</span>
          </div>
        ))}
      </div>
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

// ── Sources Section ──

function SourcesSection({ sources }: { sources: InsightMetrics['sources'] }) {
  if (!Array.isArray(sources) || sources.length === 0) return null
  const verifiedCount = sources.filter(s => s.verified).length
  const allVerified = verifiedCount === sources.length

  return (
    <div className="bg-card border border-border p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <RiFileListLine className="h-4 w-4 text-primary" />
          <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase font-serif">Sources Used</h3>
        </div>
        <div className="flex items-center gap-1.5">
          {allVerified ? (
            <RiShieldCheckLine className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <RiCloseCircleLine className="h-3.5 w-3.5 text-amber-400" />
          )}
          <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 border ${allVerified ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-amber-500/15 text-amber-400 border-amber-500/30'}`}>
            {allVerified ? 'All Verified' : `${verifiedCount}/${sources.length} Verified`}
          </span>
        </div>
      </div>
      <div className="divide-y divide-border/60">
        {sources.map((src, i) => (
          <div key={i} className="flex items-start gap-3 py-2.5">
            <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${src.verified ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <p className="text-[12px] text-foreground tracking-wide">{src.name}</p>
                <span className={`text-[8px] tracking-[0.1em] uppercase px-1.5 py-0.5 whitespace-nowrap border flex-shrink-0 ${src.verified ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25' : 'bg-amber-500/10 text-amber-400 border-amber-500/25'}`}>
                  {src.verified ? 'Verified' : 'Not verified'}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-0.5">
                <div className={`w-1.5 h-1.5 ${sourceTypeColor(src.type)}`} />
                <span className="text-[9px] text-muted-foreground tracking-[0.1em] uppercase">{src.type}</span>
              </div>
              <p className="text-[11px] text-foreground/60 leading-relaxed tracking-wide">{src.claim}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main Component ──

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

    const usedLabels = new Set<string>()
    if (marketSignalSection) usedLabels.add(marketSignalSection.label)
    if (compSection) usedLabels.add(compSection.label)
    if (demandSection) usedLabels.add(demandSection.label)
    const remaining = sections.filter(s => !usedLabels.has(s.label))

    // Parse evidence into bullets
    const evidenceBullets = (metrics.supportingEvidence || '')
      .split(/;\s*/)
      .map(s => s.trim())
      .filter(Boolean)

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

          {/* Sources Used — high up for visibility */}
          <SourcesSection sources={metrics.sources} />

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

          {/* Market Signal Trend — line chart */}
          <div className="bg-card border border-border p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiBarChartLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase font-serif">
                Market Signal Trend
              </h3>
            </div>
            <p className="text-[10px] text-muted-foreground tracking-wide mb-3">
              L&apos;Oreal vs {metrics.competitorName} — signal index over 6 months
            </p>
            <MarketSignalTrendChart
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

          {/* L'Oreal vs Competitor Growth — bar chart */}
          <div className="bg-card border border-border p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiBarChartLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase font-serif">
                L&apos;Oreal vs Competitor Growth
              </h3>
            </div>
            <p className="text-[10px] text-muted-foreground tracking-wide mb-2">
              6-month growth rate comparison
            </p>
            <GrowthComparisonChart
              lorealTrend={metrics.lorealTrend}
              competitorTrend={metrics.competitorTrend}
              competitorName={metrics.competitorName}
            />
          </div>

          {/* Gap / Diagnosis */}
          <div className="bg-card border border-primary/20 p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiErrorWarningLine className="h-4 w-4 text-amber-400" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase font-serif">Gap Diagnosis</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase mb-1">Gap vs Competitor</p>
                <p className="text-[15px] font-serif text-amber-400 tracking-wide">{metrics.gapVsCompetitor}</p>
              </div>
              <div>
                <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase mb-1">Root Cause</p>
                <p className="text-[12px] text-foreground/80 leading-relaxed tracking-wide">{metrics.gapReason}</p>
              </div>
            </div>
          </div>

          {/* Confidence & Evidence — moved below Gap, above actions */}
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

          {/* Signal Source Mix — stacked horizontal bar */}
          {Array.isArray(metrics.sources) && metrics.sources.length > 0 && (
            <div className="bg-card border border-border p-5 mb-4">
              <div className="flex items-center gap-2 mb-3">
                <RiBarChartLine className="h-4 w-4 text-primary" />
                <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase font-serif">Signal Source Mix</h3>
              </div>
              <p className="text-[10px] text-muted-foreground tracking-wide mb-2">
                How sources contribute to this insight
              </p>
              <SourceMixChart sources={metrics.sources} />
            </div>
          )}

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
