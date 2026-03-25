'use client'

import React from 'react'
import { RiArrowLeftLine, RiAlertLine, RiArrowRightUpLine, RiGroupLine, RiBarChartLine, RiLineChartLine, RiFlashlightLine, RiCompassLine, RiArrowUpLine, RiSearchLine, RiGlobalLine, RiLightbulbLine } from 'react-icons/ri'
import { urgencyBadge, severityDot } from '../data/seededScenarios'
import type { DetailItem } from '../DetailView'

function deriveMetrics(item: DetailItem) {
  const t = (item.title || '').toLowerCase()
  if (t.includes('peptide scalp')) return { growth: 280, sov: 12, engagement: '3.5x', momentum: 'Accelerating', trend: [20,28,35,42,55,68,82,95], audience: [{name:'Gen Z (18-24)',fit:72},{name:'Millennials (25-34)',fit:88},{name:'Gen X (35-44)',fit:45}], whitespace: 85, channels: [{name:'TikTok',val:82},{name:'Instagram',val:68},{name:'YouTube',val:45},{name:'Search',val:92}] }
  if (t.includes('competitor') || t.includes('brightening')) return { growth: -18, sov: 38, engagement: '2.1x', momentum: 'Competitor-Led', trend: [40,42,48,55,65,72,80,85], audience: [{name:'Millennials (25-34)',fit:82},{name:'Gen X (35-44)',fit:75},{name:'Boomers (45-54)',fit:55}], whitespace: 15, channels: [{name:'Creator',val:85},{name:'Retail',val:78},{name:'Search',val:72},{name:'PR',val:65}] }
  if (t.includes('exosome')) return { growth: 190, sov: 8, engagement: '4.2x', momentum: 'Early Stage', trend: [10,12,18,25,35,50,70,92], audience: [{name:'Premium 30-40',fit:78},{name:'Luxury 40-55',fit:85},{name:'Clinical 55+',fit:60}], whitespace: 92, channels: [{name:'KOL/Derm',val:70},{name:'Search',val:55},{name:'Reddit',val:48},{name:'Retail',val:20}] }
  if (t.includes('ectoin')) return { growth: 120, sov: 15, engagement: '2.8x', momentum: 'Emerging', trend: [25,28,32,38,44,52,60,68], audience: [{name:'Sensitive Skin 20-30',fit:65},{name:'Barrier Care 30-45',fit:80},{name:'Anti-Pollution 45+',fit:58}], whitespace: 70, channels: [{name:'Dermatology',val:75},{name:'Search',val:62},{name:'Social',val:50},{name:'Retail',val:35}] }
  if (t.includes('copper')) return { growth: 95, sov: 10, engagement: '2.2x', momentum: 'Niche Rising', trend: [15,18,20,24,28,35,42,50], audience: [{name:'Longevity 35-45',fit:72},{name:'Anti-Aging 45-55',fit:85},{name:'Wellness 55+',fit:68}], whitespace: 65, channels: [{name:'Wellness Media',val:60},{name:'Search',val:45},{name:'Creator',val:38},{name:'Clinical',val:55}] }
  return { growth: 150, sov: 20, engagement: '2.5x', momentum: 'Stable', trend: [30,35,38,42,48,52,58,62], audience: [{name:'25-34',fit:70},{name:'35-44',fit:75},{name:'45-54',fit:50}], whitespace: 55, channels: [{name:'Social',val:60},{name:'Search',val:55},{name:'Retail',val:45},{name:'PR',val:40}] }
}

export default function SignalWorkspace({ item, onBack }: { item: DetailItem; onBack: () => void }) {
  const isOpp = item.category === 'opportunity'
  const m = deriveMetrics(item)
  const trendPts = m.trend.map((v, i) => `${i * (240 / (m.trend.length - 1))},${60 - (v / 100) * 55}`).join(' ')
  const fillPts = `${trendPts} 240,60 0,60`
  const isNegativeGrowth = m.growth < 0

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-8 py-6">
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

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {[
            { label: 'Search Growth', value: `${isNegativeGrowth ? '' : '+'}${m.growth}%`, sub: 'QoQ volume change', icon: RiArrowUpLine, accent: isNegativeGrowth ? 'text-red-400' : 'text-emerald-400' },
            { label: 'Share of Voice', value: `${m.sov}%`, sub: 'Current category SOV', icon: RiBarChartLine, accent: 'text-primary' },
            { label: 'Social Engagement', value: m.engagement, sub: 'vs. category average', icon: RiGroupLine, accent: 'text-primary' },
            { label: 'Momentum', value: m.momentum, sub: 'Trend direction', icon: RiCompassLine, accent: 'text-primary' },
          ].map((k, i) => {
            const Icon = k.icon
            return (
              <div key={i} className="bg-card border border-border p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">{k.label}</p>
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <p className={`text-xl font-serif ${k.accent}`}>{k.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{k.sub}</p>
              </div>
            )
          })}
        </div>

        {/* Main 2-column */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
          <div className="lg:col-span-3 space-y-4">
            {/* Trend Chart */}
            <div className="bg-card border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <RiLineChartLine className="h-4 w-4 text-primary" />
                <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Trend Momentum</h3>
                <span className="ml-auto text-[9px] text-muted-foreground">8-week view</span>
              </div>
              <svg viewBox="0 0 240 65" className="w-full h-24" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="tG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(40,50%,55%)" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="hsl(40,50%,55%)" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon points={fillPts} fill="url(#tG)" />
                <polyline points={trendPts} fill="none" stroke="hsl(40,50%,55%)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                {m.trend.map((v, i) => (
                  <circle key={i} cx={i * (240 / (m.trend.length - 1))} cy={60 - (v / 100) * 55} r="3" fill="hsl(30,8%,6%)" stroke="hsl(40,50%,55%)" strokeWidth="1.5" />
                ))}
              </svg>
              <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                <span>8 weeks ago</span><span>Current</span>
              </div>
            </div>

            {/* Channel Signal Strength */}
            <div className="bg-card border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <RiGlobalLine className="h-4 w-4 text-primary" />
                <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Channel Signal Strength</h3>
              </div>
              <div className="space-y-3">
                {m.channels.map((ch, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className="text-foreground/80 tracking-wide">{ch.name}</span>
                      <span className="text-muted-foreground">{ch.val}%</span>
                    </div>
                    <div className="h-2 bg-secondary overflow-hidden">
                      <div className="h-full bg-primary/60 transition-all" style={{ width: `${ch.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Audience Fit */}
            <div className="bg-card border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <RiGroupLine className="h-4 w-4 text-primary" />
                <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Audience Fit Analysis</h3>
              </div>
              <div className="space-y-3">
                {m.audience.map((seg, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <span className="text-[11px] text-foreground/80 w-36 flex-shrink-0">{seg.name}</span>
                    <div className="flex-1 h-2 bg-secondary overflow-hidden">
                      <div className="h-full transition-all" style={{ width: `${seg.fit}%`, background: seg.fit > 75 ? 'hsl(142,50%,45%)' : seg.fit > 50 ? 'hsl(40,50%,55%)' : 'hsl(215,50%,55%)' }} />
                    </div>
                    <span className="text-[11px] text-muted-foreground w-10 text-right">{seg.fit}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Whitespace (opportunities only) */}
            {isOpp && (
              <div className="bg-card border border-border p-5">
                <div className="flex items-center gap-2 mb-4">
                  <RiSearchLine className="h-4 w-4 text-emerald-400" />
                  <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Whitespace Indicator</h3>
                </div>
                <div className="flex items-center gap-5">
                  <div className="flex-1">
                    <div className="h-4 bg-secondary overflow-hidden relative">
                      <div className="h-full bg-emerald-500/50 transition-all" style={{ width: `${m.whitespace}%` }} />
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-foreground/70 tracking-wide">
                        {m.whitespace > 70 ? 'Strong first-mover window' : m.whitespace > 40 ? 'Moderate opportunity' : 'Crowded space'}
                      </div>
                    </div>
                  </div>
                  <span className="text-2xl font-serif text-emerald-400">{m.whitespace}%</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">Category whitespace score -- higher values indicate greater first-mover advantage potential</p>
              </div>
            )}
          </div>

          {/* Right: Strategic Context + Insight */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-card border border-primary/20 p-5">
              <div className="flex items-center gap-2 mb-3">
                <RiLightbulbLine className="h-4 w-4 text-primary" />
                <h3 className="text-[11px] tracking-[0.14em] text-primary uppercase">Key Insight</h3>
              </div>
              <p className="text-[13px] text-foreground/90 leading-[1.8] tracking-wide">
                {item.sections[0]?.content || 'No insight available.'}
              </p>
            </div>

            {item.sections.slice(1).map((section, i) => (
              <div key={i} className="bg-card border border-border p-5">
                <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-2">{section.label}</p>
                <p className="text-[12px] text-foreground/80 leading-[1.8] tracking-wide">{section.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Actions Panel */}
        {Array.isArray(item.relatedActions) && item.relatedActions.length > 0 && (
          <div className="bg-card border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <RiFlashlightLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Recommended Actions</h3>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {item.relatedActions.map((act, i) => (
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
