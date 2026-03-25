'use client'

import React from 'react'
import { RiArrowLeftLine, RiAlertLine, RiFlashlightLine, RiArrowRightUpLine, RiErrorWarningLine, RiShieldLine, RiFileTextLine } from 'react-icons/ri'

export interface DetailItem {
  category: 'signal' | 'action' | 'opportunity' | 'risk' | 'alert' | 'analysis'
  title: string
  brand?: string
  market?: string
  severity?: string
  sections: { label: string; content: string }[]
  relatedActions?: { action: string; priority: string; owner?: string; rationale?: string }[]
  sourceAnalysisId?: string
}

interface DetailViewProps {
  item: DetailItem
  onBack: () => void
  onViewAnalysis?: (id: string) => void
}

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

const CATEGORY_META: Record<string, { label: string; icon: React.ComponentType<any>; color: string }> = {
  signal: { label: 'Priority Signal', icon: RiAlertLine, color: 'text-amber-400' },
  action: { label: 'Recommended Action', icon: RiFlashlightLine, color: 'text-primary' },
  opportunity: { label: 'Active Opportunity', icon: RiArrowRightUpLine, color: 'text-emerald-400' },
  risk: { label: 'Launch Risk', icon: RiErrorWarningLine, color: 'text-red-400' },
  alert: { label: 'Claims / Reputation Alert', icon: RiShieldLine, color: 'text-red-400' },
  analysis: { label: 'Analysis Brief', icon: RiFileTextLine, color: 'text-primary' },
}

export default function DetailView({ item, onBack, onViewAnalysis }: DetailViewProps) {
  const meta = CATEGORY_META[item.category] || CATEGORY_META.analysis
  const Icon = meta.icon

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-8">
        {/* Back button */}
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-[11px] text-muted-foreground tracking-[0.1em] uppercase hover:text-foreground transition-colors mb-6"
        >
          <RiArrowLeftLine className="h-3.5 w-3.5" />
          Back to Intelligence Hub
        </button>

        {/* Category badge */}
        <div className="flex items-center gap-2 mb-4">
          <Icon className={`h-4 w-4 ${meta.color}`} />
          <span className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground">{meta.label}</span>
          {item.severity && (
            <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 ml-2 ${urgencyBadge(item.severity)}`}>{item.severity}</span>
          )}
        </div>

        {/* Title */}
        <h2 className="font-serif text-xl tracking-wide text-foreground mb-4 leading-snug">{item.title}</h2>

        {/* Brand / Market meta row */}
        {(item.brand || item.market) && (
          <div className="flex gap-5 mb-6 text-[11px] text-muted-foreground tracking-[0.1em] uppercase">
            {item.brand && <span>Brand: <span className="text-foreground/80">{item.brand}</span></span>}
            {item.market && <span>Market: <span className="text-foreground/80">{item.market}</span></span>}
          </div>
        )}

        {/* Content sections */}
        <div className="space-y-6 mb-8">
          {item.sections.map((section, i) => (
            <div key={i} className="bg-card border border-border p-5">
              <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-2">{section.label}</p>
              <p className="text-[13px] text-foreground/85 leading-[1.8] tracking-wide">{section.content}</p>
            </div>
          ))}
        </div>

        {/* Related actions */}
        {Array.isArray(item.relatedActions) && item.relatedActions.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <RiFlashlightLine className="h-4 w-4 text-primary" />
              <h3 className="font-serif text-[14px] tracking-[0.1em] text-foreground uppercase">Related Actions</h3>
            </div>
            <div className="bg-card border border-border divide-y divide-border/60">
              {item.relatedActions.map((act, i) => (
                <div key={i} className="flex items-start gap-4 px-5 py-4">
                  <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${severityDot(act.priority)}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="text-[13px] text-foreground tracking-wide">{act.action}</h4>
                      <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap flex-shrink-0 ${urgencyBadge(act.priority)}`}>{act.priority}</span>
                    </div>
                    {act.owner && (
                      <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase">{act.owner}</p>
                    )}
                    {act.rationale && (
                      <p className="text-[11px] text-foreground/60 mt-1.5 leading-relaxed">{act.rationale}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Source analysis link */}
        {item.sourceAnalysisId && onViewAnalysis && (
          <div className="pt-4 border-t border-border">
            <button
              onClick={() => onViewAnalysis(item.sourceAnalysisId!)}
              className="flex items-center gap-2 text-[11px] text-primary tracking-[0.1em] uppercase hover:text-primary/80 transition-colors"
            >
              <RiFileTextLine className="h-3.5 w-3.5" />
              View Full Analysis Brief
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
