'use client'

import React, { useMemo } from 'react'
import {
  RiSearchLine, RiChat3Line, RiStarLine, RiShoppingCartLine,
  RiStoreLine, RiSpyLine, RiArrowUpSLine, RiArrowDownSLine,
  RiSignalTowerLine, RiArrowRightSLine,
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

interface MarketEvidence {
  title: string
  source: 'search' | 'social' | 'reviews' | 'ecommerce' | 'retail' | 'competitor'
  metric: string
  direction: 'up' | 'down' | 'flat'
  brand: string
  market: string
  urgency: string
  summary: string
  linkedInsight: string
  linkedSignalId: string
  trend: number[]
  isNegative?: boolean
}

const SOURCE_META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string; dot: string }> = {
  search: { label: 'Search Trends', icon: RiSearchLine, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', dot: 'bg-blue-400' },
  social: { label: 'Social Conversations', icon: RiChat3Line, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20', dot: 'bg-purple-400' },
  reviews: { label: 'Product Reviews', icon: RiStarLine, color: 'text-amber-400', bg: 'bg-amber-400/10 border-amber-400/20', dot: 'bg-amber-400' },
  ecommerce: { label: 'E-Commerce Activity', icon: RiShoppingCartLine, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', dot: 'bg-emerald-400' },
  retail: { label: 'Retail Performance', icon: RiStoreLine, color: 'text-primary', bg: 'bg-primary/10 border-primary/20', dot: 'bg-primary' },
  competitor: { label: 'Competitor Activity', icon: RiSpyLine, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', dot: 'bg-red-400' },
}

const SEEDED_MARKET_SIGNALS: MarketEvidence[] = [
  {
    title: '"Scalp serum" search volume +280% QoQ in Southeast Asia',
    source: 'search',
    metric: '+280% QoQ',
    direction: 'up',
    brand: 'Garnier / Kerastase',
    market: 'Southeast Asia',
    urgency: 'High',
    summary: 'Google Trends shows accelerating interest in scalp serums across Indonesia, Philippines, and Thailand among 18-34 consumers.',
    linkedInsight: 'Peptide Scalp-Care Opportunity Emerging in Southeast Asia',
    linkedSignalId: 's1',
    trend: [18, 25, 38, 52, 72, 95],
  },
  {
    title: 'The Ordinary Vitamin C SOV surged from 12% to 38% in UK brightening',
    source: 'competitor',
    metric: '38% SOV',
    direction: 'up',
    brand: "L'Oreal Paris",
    market: 'United Kingdom',
    urgency: 'Critical',
    summary: 'DECIEM creator seeding and Boots endcap placement driving rapid share-of-voice gain in UK brightening serums.',
    linkedInsight: 'The Ordinary Vitamin C Suspension Gaining SOV in UK Brightening',
    linkedSignalId: 's2',
    trend: [12, 18, 24, 30, 35, 38],
    isNegative: true,
  },
  {
    title: 'Retinol irritation mentions +340% in French social channels',
    source: 'social',
    metric: '+340%',
    direction: 'up',
    brand: 'La Roche-Posay / Vichy',
    market: 'France',
    urgency: 'Critical',
    summary: 'Negative sentiment around retinol burning and daily-use concerns rising across French social media. 23% of recent reviews mention irritation.',
    linkedInsight: 'Retinol Irritation Concern Building in France',
    linkedSignalId: 's4',
    trend: [15, 22, 35, 52, 78, 98],
    isNegative: true,
  },
  {
    title: 'Elvive Bond Repair conversion 2.1% vs 4.8% benchmark on Douglas.de',
    source: 'ecommerce',
    metric: '2.1% CVR',
    direction: 'down',
    brand: 'Elvive',
    market: 'Germany',
    urgency: 'High',
    summary: 'Product page traffic healthy at 85% of target but add-to-cart rate severely underperforming. Reviews show confusion vs Olaplex.',
    linkedInsight: 'Elvive Bond Repair Launch Underperforming vs Olaplex in Germany',
    linkedSignalId: 's3',
    trend: [85, 76, 64, 56, 48, 42],
  },
  {
    title: '"Peptide eye cream" social mentions +420% globally',
    source: 'social',
    metric: '+420%',
    direction: 'up',
    brand: "L'Oreal Paris / Lancome",
    market: 'Global',
    urgency: 'High',
    summary: 'Estee Lauder ANR Eye, Shiseido Benefiance, and Drunk Elephant intensifying peptide eye-care messaging. Category crowding ahead of launch.',
    linkedInsight: 'Peptide Eye-Care Launch Crowded by Estee Lauder and Shiseido',
    linkedSignalId: 's7',
    trend: [15, 25, 40, 58, 78, 95],
    isNegative: true,
  },
  {
    title: 'Exosome skincare search interest accelerating in Korea and US',
    source: 'search',
    metric: '+1260% YoY',
    direction: 'up',
    brand: 'Lancome',
    market: 'South Korea / US',
    urgency: 'High',
    summary: 'AmorePacific and Sulwhasoo leading clinical channel launches. No global luxury brand has claimed the exosome narrative yet.',
    linkedInsight: 'Exosome Skincare Interest Accelerating in Premium Anti-Aging',
    linkedSignalId: 's5',
    trend: [5, 8, 14, 25, 42, 68],
  },
  {
    title: '"Spicule burn" trending globally with 85M+ TikTok views',
    source: 'social',
    metric: '85M+ views',
    direction: 'up',
    brand: 'Cross-portfolio',
    market: 'Global',
    urgency: 'High',
    summary: 'Viral backlash against spicule exfoliation creating broader consumer hesitation toward clinical-strength actives including retinol and AHA/BHA.',
    linkedInsight: 'Spicule Ingredient Backlash Risks Spillover to Active Skincare Category',
    linkedSignalId: 's8',
    trend: [8, 18, 35, 55, 72, 88],
    isNegative: true,
  },
  {
    title: 'Olaplex No.3 holds 52% bond repair share on Douglas.de',
    source: 'reviews',
    metric: '52% share',
    direction: 'flat',
    brand: 'Elvive',
    market: 'Germany',
    urgency: 'Medium',
    summary: 'Olaplex dominance on Douglas.de remains entrenched. 62 Elvive reviews averaging 3.2/5 with recurring "not sure how different from Olaplex" theme.',
    linkedInsight: 'Elvive Bond Repair Launch Underperforming vs Olaplex in Germany',
    linkedSignalId: 's3',
    trend: [48, 49, 50, 51, 52, 52],
  },
]

function Sparkline({ data, negative }: { data: number[]; negative?: boolean }) {
  if (!Array.isArray(data) || data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 48
  const h = 20
  const pad = 1
  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - pad * 2)
    const y = h - pad - ((v - min) / range) * (h - pad * 2)
    return `${x},${y}`
  }).join(' ')
  const stroke = negative ? '#f87171' : '#4ade80'
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="flex-shrink-0">
      <polyline points={points} fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function findLinkedSignal(id: string): SeededSignal | undefined {
  return SEEDED_SIGNALS.find(s => s.id === id)
}

export default function MarketSignals({ analyses, onOpenDetail, hasRunAnalysis }: MarketSignalsProps) {
  const signals = SEEDED_MARKET_SIGNALS

  const sourceCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const s of signals) {
      counts[s.source] = (counts[s.source] || 0) + 1
    }
    return counts
  }, [signals])

  const openSignal = (ev: MarketEvidence) => {
    const linked = findLinkedSignal(ev.linkedSignalId)
    if (linked) {
      onOpenDetail({
        category: 'signal',
        title: linked.title,
        brand: linked.brand,
        market: linked.market,
        severity: linked.urgency,
        sections: linked.detailSections.length > 0 ? linked.detailSections : [
          { label: 'What Changed', content: linked.why },
          { label: 'Recommended Next Step', content: linked.nextStep },
        ],
        relatedActions: linked.relatedActions,
      })
    } else {
      onOpenDetail({
        category: 'signal',
        title: ev.linkedInsight,
        brand: ev.brand,
        market: ev.market,
        severity: ev.urgency,
        sections: [
          { label: 'Evidence', content: ev.summary },
          { label: 'Metric', content: ev.metric },
        ],
        relatedActions: [],
      })
    }
  }

  const sourceOrder: Array<'search' | 'social' | 'reviews' | 'ecommerce' | 'retail' | 'competitor'> = ['search', 'social', 'reviews', 'ecommerce', 'retail', 'competitor']

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-7">
        <div className="flex items-center gap-2 mb-1">
          <RiSignalTowerLine className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-lg tracking-[0.1em] text-foreground uppercase">Market Signals</h2>
        </div>
        <p className="text-[12px] text-muted-foreground tracking-wide mb-5">External demand evidence driving intelligence</p>

        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {sourceOrder.map(key => {
            const meta = SOURCE_META[key]
            const count = sourceCounts[key] || 0
            if (count === 0) return null
            return (
              <div key={key} className="flex items-center gap-1.5 px-2.5 py-1 bg-card border border-border text-[10px] tracking-wide text-muted-foreground">
                <span className={`w-1.5 h-1.5 ${meta?.dot ?? 'bg-muted-foreground'}`} />
                <span>{meta?.label ?? key}</span>
                <span className="text-foreground font-medium">{count}</span>
              </div>
            )
          })}
        </div>

        <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3">{signals.length} signals detected</p>

        <div className="space-y-2">
          {signals.map((ev, i) => {
            const meta = SOURCE_META[ev.source] ?? SOURCE_META.search
            const Icon = meta.icon
            const isNeg = ev.isNegative || ev.direction === 'down'
            return (
              <button key={i} onClick={() => openSignal(ev)} className="w-full bg-card border border-border p-4 text-left hover:border-primary/40 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 border ${meta.bg}`}>
                    <Icon className={`h-3.5 w-3.5 ${meta.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-semibold text-foreground tracking-wide group-hover:text-primary transition-colors leading-snug mb-1">{ev.title}</h4>
                    <div className="flex items-center gap-1 mb-1.5">
                      <span className={`text-[13px] font-bold ${isNeg ? 'text-red-400' : ev.direction === 'flat' ? 'text-muted-foreground' : 'text-emerald-400'}`}>{ev.metric}</span>
                      {ev.direction === 'up' && !isNeg && <RiArrowUpSLine className="h-3.5 w-3.5 text-emerald-400" />}
                      {ev.direction === 'up' && isNeg && <RiArrowUpSLine className="h-3.5 w-3.5 text-red-400" />}
                      {ev.direction === 'down' && <RiArrowDownSLine className="h-3.5 w-3.5 text-red-400" />}
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground tracking-wide mb-1.5">
                      <span className={meta.color}>{meta.label}</span>
                      <span className="text-border">|</span>
                      <span>{ev.brand}</span>
                      <span className="text-border">|</span>
                      <span>{ev.market}</span>
                    </div>
                    <p className="text-[11px] text-foreground/50 leading-relaxed">{cleanText(ev.summary, 140)}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(ev.urgency)}`}>{ev.urgency}</span>
                    <Sparkline data={ev.trend} negative={isNeg} />
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
