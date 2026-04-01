'use client'

import React from 'react'
import { RiArrowLeftLine, RiErrorWarningLine, RiFlashlightLine, RiLightbulbLine } from 'react-icons/ri'
import { urgencyBadge, severityDot } from '../data/seededScenarios'
import type { DetailItem } from '../DetailView'

function findSection(sections: { label: string; content: string }[], keyword: string) {
  return sections.find(s => s.label.toLowerCase().includes(keyword.toLowerCase()))
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
