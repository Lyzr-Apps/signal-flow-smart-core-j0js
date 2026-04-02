'use client'

import React from 'react'
import { RiArrowLeftLine, RiErrorWarningLine, RiFlashlightLine, RiLightbulbLine } from 'react-icons/ri'
import { urgencyBadge, severityDot } from '../data/seededScenarios'
import type { DetailItem } from '../DetailView'

function findSection(sections: { label: string; content: string }[], keyword: string) {
  return sections.find(s => s.label.toLowerCase().includes(keyword.toLowerCase()))
}

function deriveRiskMetrics(title: string) {
  const t = (title ?? '').toLowerCase()
  if (t.includes('elvive') || t.includes('bond') || t.includes('olaplex') || t.includes('germany'))
    return { conversion: { actual: 2.1, benchmark: 4.8 }, sov: { competitor: 52, loreal: 28 }, weeks: 3 }
  if (t.includes('eye') || t.includes('peptide') || t.includes('crowding'))
    return { conversion: { actual: 3.2, benchmark: 5.5 }, sov: { competitor: 45, loreal: 22 }, weeks: 2 }
  return { conversion: { actual: 3.0, benchmark: 5.0 }, sov: { competitor: 35, loreal: 30 }, weeks: 4 }
}

function RiskMetrics({ title }: { title: string }) {
  const m = deriveRiskMetrics(title)
  const convPct = (m.conversion.actual / m.conversion.benchmark) * 100
  const weekColor = m.weeks > 4 ? 'text-emerald-400' : m.weeks >= 2 ? 'text-amber-400' : 'text-red-400'
  const weekBg = m.weeks > 4 ? 'bg-emerald-400' : m.weeks >= 2 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div className="bg-card border border-border p-4">
        <h4 className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3 font-serif">Conversion Gap</h4>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-[16px] font-serif text-red-400">{m.conversion.actual}%</span>
          <span className="text-[10px] text-muted-foreground">vs {m.conversion.benchmark}% benchmark</span>
        </div>
        <div className="relative h-2 bg-secondary w-full">
          <div className="absolute h-full bg-red-400/70" style={{ width: `${convPct}%` }} />
          <div className="absolute top-0 h-full w-0.5 bg-foreground/40" style={{ left: '100%' }} />
        </div>
      </div>
      <div className="bg-card border border-border p-4">
        <h4 className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3 font-serif">Competitor SOV</h4>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className="text-[16px] font-serif text-red-400">{m.sov.competitor}%</span>
          <span className="text-[10px] text-muted-foreground">vs {m.sov.loreal}%</span>
        </div>
        <div className="flex h-2 w-full">
          <div className="h-full bg-red-400/70" style={{ width: `${m.sov.competitor}%` }} />
          <div className="h-full bg-primary/60" style={{ width: `${m.sov.loreal}%` }} />
          <div className="h-full bg-secondary flex-1" />
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[9px] text-red-400/80">Competitor</span>
          <span className="text-[9px] text-primary/80">L&apos;Oreal</span>
        </div>
      </div>
      <div className="bg-card border border-border p-4">
        <h4 className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3 font-serif">Intervention Window</h4>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className={`text-[16px] font-serif ${weekColor}`}>{m.weeks}</span>
          <span className="text-[10px] text-muted-foreground">weeks remaining</span>
        </div>
        <div className="h-2 bg-secondary w-full">
          <div className={`h-full ${weekBg}`} style={{ width: `${Math.min(m.weeks / 6 * 100, 100)}%` }} />
        </div>
      </div>
    </div>
  )
}

export default function RiskWorkspace({ item, onBack }: { item: DetailItem; onBack: () => void }) {
  const sections = Array.isArray(item?.sections) ? item.sections : []
  const actions = Array.isArray(item?.relatedActions) ? item.relatedActions : []

  const whatChanged = findSection(sections, 'what changed')
  const whyFlagged = findSection(sections, 'why it was flagged') || findSection(sections, 'why')
  const demandImpact = findSection(sections, 'demand') || findSection(sections, 'impact') || findSection(sections, 'market')
  const teamAction = findSection(sections, 'teams should do') || findSection(sections, 'what to do') || findSection(sections, 'next')

  const usedLabels = new Set(
    [whatChanged, whyFlagged, demandImpact, teamAction]
      .filter(Boolean)
      .map(s => s!.label)
  )
  const remaining = sections.filter(s => !usedLabels.has(s.label))

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[11px] text-muted-foreground tracking-[0.1em] uppercase hover:text-foreground transition-colors mb-5">
          <RiArrowLeftLine className="h-3.5 w-3.5" /> Back
        </button>

        <div className="flex items-center gap-2 mb-3">
          <RiErrorWarningLine className="h-4 w-4 text-red-400" />
          <span className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground">Launch Risk</span>
        </div>
        <div className="flex items-start justify-between gap-4 mb-2">
          <h2 className="font-serif text-xl tracking-wide text-foreground leading-snug">{item.title}</h2>
          {item.severity && <span className={`text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 whitespace-nowrap ${urgencyBadge(item.severity)}`}>{item.severity}</span>}
        </div>
        {(item.brand || item.market) && (
          <div className="flex gap-5 mb-8 text-[11px] text-muted-foreground tracking-[0.1em] uppercase">
            {item.brand && <span>Brand: <span className="text-foreground/80">{item.brand}</span></span>}
            {item.market && <span>Market: <span className="text-foreground/80">{item.market}</span></span>}
          </div>
        )}

        <RiskMetrics title={item?.title ?? ''} />

        {whatChanged && (
          <div className="bg-card border border-primary/30 p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiErrorWarningLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">{whatChanged.label}</h3>
            </div>
            <p className="text-[13px] text-foreground/85 leading-[1.8] tracking-wide">{whatChanged.content}</p>
          </div>
        )}

        {whyFlagged && (
          <div className="bg-card border border-border p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiLightbulbLine className="h-4 w-4 text-amber-400" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">{whyFlagged.label}</h3>
            </div>
            <p className="text-[13px] text-foreground/80 leading-[1.8] tracking-wide">{whyFlagged.content}</p>
          </div>
        )}

        {demandImpact && (
          <div className="bg-card border border-border p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiErrorWarningLine className="h-4 w-4 text-red-400" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">{demandImpact.label}</h3>
            </div>
            <p className="text-[13px] text-foreground/80 leading-[1.8] tracking-wide">{demandImpact.content}</p>
          </div>
        )}

        {teamAction && (
          <div className="bg-card border border-border p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiFlashlightLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">{teamAction.label}</h3>
            </div>
            <p className="text-[13px] text-foreground/80 leading-[1.8] tracking-wide">{teamAction.content}</p>
          </div>
        )}

        {remaining.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiLightbulbLine className="h-3.5 w-3.5 text-muted-foreground" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Supporting Evidence</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {remaining.map((section, i) => (
                <div key={i} className={`bg-card border p-5 ${i === 0 ? 'border-primary/30' : 'border-border'}`}>
                  <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-2">{section.label}</p>
                  <p className="text-[12px] text-foreground/80 leading-[1.8] tracking-wide">{section.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {actions.length > 0 && (
          <div className="bg-card border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <RiFlashlightLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Linked Recommendations</h3>
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
