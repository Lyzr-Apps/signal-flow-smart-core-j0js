'use client'

import React from 'react'
import { RiArrowLeftLine, RiLightbulbLine, RiFlashlightLine, RiArrowRightUpLine, RiAlertLine } from 'react-icons/ri'
import { urgencyBadge, severityDot } from '../data/seededScenarios'
import type { DetailItem } from '../DetailView'

function deriveVisualData(title: string) {
  const t = (title ?? '').toLowerCase()
  if (t.includes('peptide') || t.includes('scalp'))
    return { trend: [15,22,30,42,55,68,82,95], sources: [{ name: 'Search', value: 92 }, { name: 'TikTok', value: 78 }, { name: 'Creator', value: 65 }, { name: 'Reviews', value: 42 }] }
  if (t.includes('ordinary') || t.includes('brightening') || t.includes('competitor'))
    return { trend: [30,32,38,48,62,72,82,88], sources: [{ name: 'Creator', value: 85 }, { name: 'Retail', value: 78 }, { name: 'Search', value: 72 }, { name: 'PR', value: 55 }] }
  if (t.includes('exosome'))
    return { trend: [8,10,14,22,35,50,70,92], sources: [{ name: 'Search', value: 68 }, { name: 'Reddit', value: 55 }, { name: 'KOL/Derm', value: 48 }, { name: 'YouTube', value: 35 }] }
  if (t.includes('ectoin') || t.includes('barrier'))
    return { trend: [20,24,28,34,40,48,56,65], sources: [{ name: 'Dermatology', value: 72 }, { name: 'Search', value: 58 }, { name: 'Social', value: 45 }, { name: 'Reviews', value: 38 }] }
  if (t.includes('copper') || t.includes('longevity'))
    return { trend: [12,15,18,22,28,35,42,52], sources: [{ name: 'Reddit', value: 62 }, { name: 'Search', value: 48 }, { name: 'Wellness Media', value: 42 }, { name: 'Creator', value: 30 }] }
  return { trend: [25,30,35,40,48,55,62,70], sources: [{ name: 'Search', value: 60 }, { name: 'Social', value: 50 }, { name: 'Reviews', value: 40 }, { name: 'Retail', value: 30 }] }
}

function TrendLine({ data }: { data: number[] }) {
  const w = 280, h = 80, padX = 0, padY = 4
  const maxV = Math.max(...data)
  const minV = Math.min(...data)
  const range = maxV - minV || 1
  const points = data.map((v, i) => ({
    x: padX + (i / (data.length - 1)) * (w - padX * 2),
    y: padY + (1 - (v - minV) / range) * (h - padY * 2)
  }))
  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
  const area = `${line} L${points[points.length - 1].x},${h} L${points[0].x},${h} Z`
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[80px]" preserveAspectRatio="none">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="hsl(40,50%,55%)" stopOpacity="0.25" />
          <stop offset="100%" stopColor="hsl(40,50%,55%)" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#trendFill)" />
      <path d={line} fill="none" stroke="hsl(40,50%,55%)" strokeWidth="2" />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill="hsl(40,50%,55%)" />
      ))}
    </svg>
  )
}

function SourceBreakdown({ sources }: { sources: { name: string; value: number }[] }) {
  return (
    <div className="space-y-2.5">
      {sources.map((s) => (
        <div key={s.name}>
          <div className="flex justify-between mb-0.5">
            <span className="text-[10px] tracking-[0.1em] text-muted-foreground uppercase">{s.name}</span>
            <span className="text-[10px] text-foreground/70">{s.value}%</span>
          </div>
          <div className="h-1.5 bg-secondary w-full">
            <div className="h-full bg-primary" style={{ width: `${s.value}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function SignalWorkspace({ item, onBack }: { item: DetailItem; onBack: () => void }) {
  const isOpp = item.category === 'opportunity'
  const sections = Array.isArray(item?.sections) ? item.sections : []
  const actions = Array.isArray(item?.relatedActions) ? item.relatedActions : []
  const visual = deriveVisualData(item?.title ?? '')

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[11px] text-muted-foreground tracking-[0.1em] uppercase hover:text-foreground transition-colors mb-5">
          <RiArrowLeftLine className="h-3.5 w-3.5" /> Back to Intelligence Hub
        </button>

        <div className="flex items-center gap-2 mb-3">
          {isOpp ? <RiArrowRightUpLine className="h-4 w-4 text-emerald-400" /> : <RiAlertLine className="h-4 w-4 text-amber-400" />}
          <span className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground">{isOpp ? 'Opportunity Workspace' : 'Signal Workspace'}</span>
        </div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h2 className="font-serif text-xl tracking-wide text-foreground leading-snug">{item.title}</h2>
          {item.severity && <span className={`text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 whitespace-nowrap ${urgencyBadge(item.severity)}`}>{item.severity}</span>}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="bg-card border border-border p-5">
            <h4 className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3 font-serif">Signal Trend</h4>
            <TrendLine data={visual.trend} />
            <div className="flex justify-between mt-2">
              <span className="text-[10px] text-muted-foreground">8 weeks ago</span>
              <span className="text-[10px] text-foreground/70">Current</span>
            </div>
          </div>
          <div className="bg-card border border-border p-5">
            <h4 className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3 font-serif">Signal Source Breakdown</h4>
            <SourceBreakdown sources={visual.sources} />
          </div>
        </div>

        {sections.length > 1 && (
          <div className="space-y-3 mb-6">
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
            <div className="space-y-3">
              {actions.map((act, i) => (
                <div key={i} className="border border-border/60 p-4 flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${severityDot(act.priority)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-[12px] text-foreground tracking-wide">{act.action}</p>
                      <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 whitespace-nowrap flex-shrink-0 ${urgencyBadge(act.priority)}`}>{act.priority}</span>
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
