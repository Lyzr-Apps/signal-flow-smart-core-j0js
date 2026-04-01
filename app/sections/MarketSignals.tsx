'use client'

import React, { useMemo } from 'react'
import {
  RiSearchLine, RiChat3Line, RiStarLine, RiShoppingCartLine,
  RiStoreLine, RiSpyLine, RiArrowRightSLine, RiSignalTowerLine,
} from 'react-icons/ri'
import {
  urgencyBadge, cleanText, deriveFromAnalyses,
  SEEDED_SIGNALS,
  type AnalysisItem, type SeededSignal,
} from './data/seededScenarios'
import type { DetailItem } from './DetailView'

interface MarketSignalsProps {
  analyses: AnalysisItem[]
  onOpenDetail: (item: DetailItem) => void
  hasRunAnalysis?: boolean
}

const SOURCE_META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  search: { label: 'Search Trends', icon: RiSearchLine, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20' },
  social: { label: 'Social Conversations', icon: RiChat3Line, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20' },
  reviews: { label: 'Product Reviews', icon: RiStarLine, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20' },
  ecommerce: { label: 'E-Commerce Activity', icon: RiShoppingCartLine, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  retail: { label: 'Retail Performance', icon: RiStoreLine, color: 'text-primary', bg: 'bg-primary/10 border-primary/20' },
  competitor: { label: 'Competitor Activity', icon: RiSpyLine, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20' },
}

const classifySource = (sig: SeededSignal): string => {
  const t = (sig.title + ' ' + sig.why).toLowerCase()
  if (t.includes('search') || t.includes('google') || t.includes('volume')) return 'search'
  if (t.includes('social') || t.includes('tiktok') || t.includes('reddit') || t.includes('creator') || t.includes('instagram')) return 'social'
  if (t.includes('review') || t.includes('rating') || t.includes('feedback')) return 'reviews'
  if (t.includes('e-commerce') || t.includes('ecommerce') || t.includes('online') || t.includes('conversion') || t.includes('product page')) return 'ecommerce'
  if (t.includes('retail') || t.includes('store') || t.includes('shelf') || t.includes('boots') || t.includes('placement')) return 'retail'
  if (t.includes('competitor') || t.includes('competitive') || t.includes('rival') || t.includes('share of voice')) return 'competitor'
  return 'search'
}

export default function MarketSignals({ analyses, onOpenDetail, hasRunAnalysis }: MarketSignalsProps) {
  const safeAnalyses = Array.isArray(analyses) ? analyses : []
  const derived = useMemo(() => deriveFromAnalyses(safeAnalyses), [safeAnalyses])
  const useReal = !!hasRunAnalysis && safeAnalyses.length > 0
  const allSignals = useReal && derived.signals.length > 0 ? derived.signals : SEEDED_SIGNALS

  const openSignal = (sig: SeededSignal) => {
    onOpenDetail({
      category: 'signal', title: sig.title, brand: sig.brand, market: sig.market, severity: sig.urgency,
      sections: sig.detailSections.length > 0 ? sig.detailSections : [
        { label: 'What Changed', content: sig.why },
        { label: 'Recommended Next Step', content: sig.nextStep },
      ],
      relatedActions: sig.relatedActions,
    })
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-7">
        <div className="flex items-center gap-2 mb-1">
          <RiSignalTowerLine className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-lg tracking-[0.1em] text-foreground uppercase">Market Signals</h2>
        </div>
        <p className="text-[12px] text-muted-foreground tracking-wide mb-6">Evidence layer: source data driving demand intelligence</p>

        <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3">{allSignals.length} signals detected</p>

        <div className="space-y-2">
          {allSignals.map((sig, i) => {
            const sourceId = classifySource(sig)
            const source = SOURCE_META[sourceId] ?? SOURCE_META.search
            const Icon = source.icon
            return (
              <button key={i} onClick={() => openSignal(sig)} className="w-full bg-card border border-border p-4 text-left hover:border-primary/40 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 border ${source.bg}`}>
                    <Icon className={`h-3.5 w-3.5 ${source.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-semibold text-foreground tracking-wide group-hover:text-primary transition-colors leading-snug mb-1">{sig.title}</h4>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground tracking-wide mb-1.5">
                      <span className={`${source.color}`}>{source.label}</span>
                      <span className="text-border">|</span>
                      <span>{sig.brand}</span>
                      <span className="text-border">|</span>
                      <span>{sig.market}</span>
                    </div>
                    <p className="text-[11px] text-foreground/50 leading-relaxed mb-1.5">{cleanText(sig.why, 120)}</p>
                    <p className="text-[10px] text-foreground/40 leading-relaxed">{cleanText(sig.nextStep, 100)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(sig.urgency)}`}>{sig.urgency}</span>
                    <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
