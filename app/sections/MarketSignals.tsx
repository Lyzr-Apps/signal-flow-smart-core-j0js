'use client'

import React, { useMemo, useState } from 'react'
import {
  RiSearchLine, RiChat3Line, RiShoppingCartLine,
  RiStoreLine, RiSpyLine, RiArrowUpSLine, RiArrowDownSLine,
  RiSignalTowerLine, RiArrowRightSLine,
} from 'react-icons/ri'
import {
  urgencyBadge, cleanText, applyFilters,
  SEEDED_SIGNALS, SEEDED_OPPORTUNITIES, SEEDED_RISKS, SEEDED_ALERTS,
  SIGNAL_TYPES,
  type AnalysisItem, type SeededSignal, type FilterState,
} from './data/seededScenarios'
import type { DetailItem } from './DetailView'

interface MarketSignalsProps {
  analyses: AnalysisItem[]
  onOpenDetail: (item: DetailItem) => void
  hasRunAnalysis?: boolean
  filters: FilterState
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
  signalType?: string
  category?: string
  country?: string
  region?: string
}

const SOURCE_META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; bg: string; dot: string }> = {
  search: { label: 'Search Trends', icon: RiSearchLine, color: 'text-blue-400', bg: 'bg-blue-400/10 border-blue-400/20', dot: 'bg-blue-400' },
  social: { label: 'Social Conversations', icon: RiChat3Line, color: 'text-purple-400', bg: 'bg-purple-400/10 border-purple-400/20', dot: 'bg-purple-400' },
  ecommerce: { label: 'E-Commerce Activity', icon: RiShoppingCartLine, color: 'text-emerald-400', bg: 'bg-emerald-400/10 border-emerald-400/20', dot: 'bg-emerald-400' },
  retail: { label: 'Retail Performance', icon: RiStoreLine, color: 'text-primary', bg: 'bg-primary/10 border-primary/20', dot: 'bg-primary' },
  competitor: { label: 'Competitor Activity', icon: RiSpyLine, color: 'text-red-400', bg: 'bg-red-400/10 border-red-400/20', dot: 'bg-red-400' },
}

const SEEDED_MARKET_SIGNALS: MarketEvidence[] = [
  {
    title: '"Peptide serum" US search volume +180% YoY',
    source: 'search', metric: '+180% YoY', direction: 'up',
    brand: 'CeraVe / L\'Oreal Paris', market: 'United States', urgency: 'High',
    summary: 'Google Trends shows accelerating US consumer interest in peptide-based skincare. The Ordinary Buffet dominates current peptide search results.',
    linkedInsight: 'Peptide Skincare Demand Growing 180% YoY in US Market',
    linkedSignalId: 's4', trend: [15, 22, 35, 52, 68, 85],
    signalType: 'Ingredient Trend Surge', category: 'Skincare', country: 'United States', region: 'National',
  },
  {
    title: 'Cetaphil US moisturizer share surged from 11.3% to 16.1%',
    source: 'competitor', metric: '+4.8pp share', direction: 'up',
    brand: 'CeraVe', market: 'United States', urgency: 'Critical',
    summary: 'Galderma invested $40M in US dermatologist campaign for Cetaphil relaunch. CeraVe share dropped from 18.2% to 14.8%.',
    linkedInsight: 'CeraVe Losing US Moisturizer Share to Cetaphil Relaunch',
    linkedSignalId: 's1', trend: [48, 55, 62, 70, 78, 85], isNegative: true,
    signalType: 'Competitor Launch/Relaunch', category: 'Skincare', country: 'United States', region: 'National',
  },
  {
    title: 'e.l.f. Halo Glow TikTok views surpass 2.1B in US',
    source: 'social', metric: '2.1B views', direction: 'up',
    brand: 'Maybelline', market: 'United States', urgency: 'Critical',
    summary: 'e.l.f. Halo Glow Liquid Filter dominating US TikTok beauty with 500+ creator partnerships. Maybelline SuperStay SOV dropped from 22% to 16%.',
    linkedInsight: 'Maybelline SuperStay Foundation Losing Share to e.l.f. Halo Glow in US',
    linkedSignalId: 's2', trend: [20, 35, 50, 68, 82, 95], isNegative: true,
    signalType: 'Creator Traction Shift', category: 'Color Cosmetics', country: 'United States', region: 'National',
  },
  {
    title: 'Garnier Fructis lost 6 SKU facings at Target Q1 shelf reset',
    source: 'retail', metric: '-6 facings', direction: 'down',
    brand: 'Garnier', market: 'United States', urgency: 'High',
    summary: 'Target Q1 2026 shelf reset removed 6 Garnier Fructis SKUs. Native Hair Care (P&G) gained 4 facings and Function of Beauty gained 5.',
    linkedInsight: 'Garnier Fructis Losing US Shelf Space to Native and Function of Beauty',
    linkedSignalId: 's3', trend: [52, 48, 42, 38, 35, 30],
    signalType: 'Stockout / Shelf Loss', category: 'Hair Care', country: 'United States', region: 'National',
  },
  {
    title: '"PFAS-free makeup" US searches +420% as state bans take effect',
    source: 'search', metric: '+420% YoY', direction: 'up',
    brand: 'Maybelline / L\'Oreal Paris / NYX', market: 'United States', urgency: 'Critical',
    summary: 'California, New York, and Washington PFAS bans driving consumer awareness surge. e.l.f. Beauty proactively certified PFAS-free across full US line.',
    linkedInsight: 'PFAS-Free Claims Pressure Building on US Cosmetics Brands',
    linkedSignalId: 's9', trend: [15, 25, 40, 58, 78, 95], isNegative: true,
    signalType: 'Regulatory / Claims Pressure', category: 'Color Cosmetics', country: 'United States', region: 'National',
  },
  {
    title: 'Olaplex No.3 holds 48% US bond repair share at Ulta',
    source: 'ecommerce', metric: '48% share', direction: 'flat',
    brand: 'Elvive', market: 'United States', urgency: 'High',
    summary: 'Elvive Bond Repair conversion at 2.4% vs 5.1% US category benchmark. Reviews show confusion vs Olaplex pricing ($8.99 vs $30).',
    linkedInsight: 'Elvive Bond Repair Underperforming vs Olaplex at US Retailers',
    linkedSignalId: 's8', trend: [48, 48, 49, 48, 48, 48],
    signalType: 'Price Gap Shift', category: 'Hair Care', country: 'United States', region: 'National',
  },
  {
    title: '"Mineral sunscreen" US searches +140% following FDA study update',
    source: 'search', metric: '+140% YoY', direction: 'up',
    brand: 'La Roche-Posay / CeraVe', market: 'United States', urgency: 'High',
    summary: 'FDA updated study data on chemical sunscreen absorption. Consumer preference shifting toward mineral/hybrid formulations.',
    linkedInsight: 'Sunscreen Chemical Filter Safety Debate Resurging in US Media',
    linkedSignalId: 's10', trend: [25, 32, 42, 55, 68, 82],
    signalType: 'Regulatory / Claims Pressure', category: 'Skincare', country: 'United States', region: 'National',
  },
  {
    title: 'Olay Regenerist US anti-aging SOV grew from 18% to 24% in 6 months',
    source: 'competitor', metric: '+6pp SOV', direction: 'up',
    brand: 'L\'Oreal Paris', market: 'United States', urgency: 'High',
    summary: 'Olay Regenerist Micro-Sculpting Cream reformulation and $60M US media spend driving share gains. Revitalift US SOV declined from 19% to 15%.',
    linkedInsight: 'L\'Oreal Paris Revitalift Declining vs Olay Regenerist and Neutrogena in US Anti-Aging',
    linkedSignalId: 's7', trend: [18, 19, 20, 21, 23, 24], isNegative: true,
    signalType: 'Competitor Launch/Relaunch', category: 'Skincare', country: 'United States', region: 'National',
  },
]

function Sparkline({ data, negative }: { data: number[]; negative?: boolean }) {
  if (!Array.isArray(data) || data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const w = 48; const h = 20; const pad = 1
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

function findLinkedContext(id: string) {
  const sig = SEEDED_SIGNALS.find(s => s.id === id)
  if (sig) return { type: 'signal' as const, data: sig }
  const opp = SEEDED_OPPORTUNITIES.find(o => o.scenarioId === id)
  if (opp) return { type: 'opportunity' as const, data: opp }
  const risk = SEEDED_RISKS.find(r => r.scenarioId === id)
  if (risk) return { type: 'risk' as const, data: risk }
  const alert = SEEDED_ALERTS.find(a => a.scenarioId === id)
  if (alert) return { type: 'alert' as const, data: alert }
  return null
}

export default function MarketSignals({ analyses, onOpenDetail, hasRunAnalysis, filters }: MarketSignalsProps) {
  const [activeSignalType, setActiveSignalType] = useState<string | null>(null)

  // Apply filters to market signals
  const filteredSignals = useMemo(() => {
    let signals = SEEDED_MARKET_SIGNALS.filter(ev => {
      if (filters.brand && filters.brand !== 'All Brands' && !ev.brand.includes(filters.brand)) return false
      if (filters.category && filters.category !== 'All Categories' && ev.category && ev.category !== filters.category) return false
      if (filters.region && filters.region !== 'All Regions' && ev.region && ev.region !== filters.region) return false
      return true
    })
    if (activeSignalType) {
      signals = signals.filter(ev => ev.signalType === activeSignalType)
    }
    return signals
  }, [filters, activeSignalType])

  // Get unique signal types from current filtered signals for chips
  const availableSignalTypes = useMemo(() => {
    const types = new Set<string>()
    for (const s of SEEDED_MARKET_SIGNALS) {
      if (s.signalType) types.add(s.signalType)
    }
    return Array.from(types)
  }, [])

  const openSignal = (ev: MarketEvidence) => {
    const ctx = findLinkedContext(ev.linkedSignalId)
    if (ctx) {
      const d = ctx.data
      if (ctx.type === 'signal') {
        const sig = d as SeededSignal
        onOpenDetail({
          category: 'signal', title: sig.title, brand: sig.brand, market: sig.market, severity: sig.urgency,
          sections: sig.detailSections.length > 0 ? sig.detailSections : [{ label: 'What Changed', content: sig.why }, { label: 'Recommended Next Step', content: sig.nextStep }],
          relatedActions: sig.relatedActions, metrics: sig.metrics,
        })
      } else if (ctx.type === 'opportunity') {
        const opp = d as typeof SEEDED_OPPORTUNITIES[number]
        onOpenDetail({
          category: 'opportunity', title: opp.title, brand: opp.brand, market: opp.market, severity: opp.confidence,
          sections: opp.detailSections.length > 0 ? opp.detailSections : [{ label: 'Why Now', content: opp.why }, { label: 'Recommended Move', content: opp.move }],
          relatedActions: opp.relatedActions, metrics: opp.metrics,
        })
      } else if (ctx.type === 'risk') {
        const risk = d as typeof SEEDED_RISKS[number]
        onOpenDetail({
          category: 'risk', title: risk.title, brand: risk.brand, market: risk.market, severity: risk.severity,
          sections: risk.detailSections.length > 0 ? risk.detailSections : [{ label: 'Root Cause', content: risk.cause }, { label: 'Mitigation', content: risk.action }],
          relatedActions: risk.relatedActions, metrics: risk.metrics,
        })
      } else {
        const alert = d as typeof SEEDED_ALERTS[number]
        onOpenDetail({
          category: 'alert', title: alert.title, brand: alert.brand, market: alert.market, severity: alert.severity,
          sections: alert.detailSections.length > 0 ? alert.detailSections : [{ label: 'Why This Matters', content: alert.why }, { label: 'Recommended Response', content: alert.response }],
          relatedActions: alert.relatedActions, metrics: alert.metrics,
        })
      }
    } else {
      onOpenDetail({
        category: 'signal', title: ev.linkedInsight, brand: ev.brand, market: ev.market, severity: ev.urgency,
        sections: [{ label: 'Evidence', content: ev.summary }, { label: 'Metric', content: ev.metric }],
        relatedActions: [],
      })
    }
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-7">
        <div className="flex items-center gap-2 mb-1">
          <RiSignalTowerLine className="h-5 w-5 text-primary" />
          <h2 className="font-serif text-lg tracking-[0.1em] text-foreground uppercase">Signals</h2>
        </div>
        <p className="text-[12px] text-muted-foreground tracking-wide mb-5">North America demand evidence by signal type</p>

        {/* Signal Type Filter Chips */}
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <button
            onClick={() => setActiveSignalType(null)}
            className={`px-2.5 py-1 text-[10px] tracking-wide border transition-colors ${
              !activeSignalType
                ? 'bg-primary/15 text-primary border-primary/30'
                : 'bg-card text-muted-foreground border-border hover:border-primary/30'
            }`}
          >
            All Types
          </button>
          {availableSignalTypes.map(type => (
            <button
              key={type}
              onClick={() => setActiveSignalType(activeSignalType === type ? null : type)}
              className={`px-2.5 py-1 text-[10px] tracking-wide border transition-colors ${
                activeSignalType === type
                  ? 'bg-primary/15 text-primary border-primary/30'
                  : 'bg-card text-muted-foreground border-border hover:border-primary/30'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3">{filteredSignals.length} signals detected</p>

        <div className="space-y-2">
          {filteredSignals.map((ev, i) => {
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
                      {ev.signalType && <><span className="text-border">|</span><span className="text-primary">{ev.signalType}</span></>}
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
