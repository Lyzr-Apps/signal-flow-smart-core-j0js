'use client'

import React from 'react'
import { RiArrowLeftLine, RiLightbulbLine, RiFlashlightLine, RiArrowRightUpLine, RiAlertLine } from 'react-icons/ri'
import { urgencyBadge, severityDot } from '../data/seededScenarios'
import type { DetailItem } from '../DetailView'

export default function SignalWorkspace({ item, onBack }: { item: DetailItem; onBack: () => void }) {
  const isOpp = item.category === 'opportunity'
  const sections = Array.isArray(item?.sections) ? item.sections : []
  const actions = Array.isArray(item?.relatedActions) ? item.relatedActions : []

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-6">
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
