'use client'

import React from 'react'
import { RiArrowLeftLine, RiShieldLine, RiFlashlightLine, RiLightbulbLine, RiArrowRightUpLine } from 'react-icons/ri'
import { urgencyBadge, severityDot } from '../data/seededScenarios'
import type { DetailItem } from '../DetailView'

function deriveAlertMetrics(title: string) {
  const t = (title ?? '').toLowerCase()
  if (t.includes('retinol') || t.includes('irritation'))
    return { sentiment: '+340%', distribution: [{ name: 'Social', value: 45 }, { name: 'Reviews', value: 28 }, { name: 'Forums', value: 15 }, { name: 'Direct', value: 12 }], escalation: 78 }
  if (t.includes('spicule'))
    return { sentiment: '85M+ views', distribution: [{ name: 'TikTok', value: 52 }, { name: 'Reddit', value: 22 }, { name: 'YouTube', value: 16 }, { name: 'News', value: 10 }], escalation: 62 }
  return { sentiment: '+180%', distribution: [{ name: 'Social', value: 40 }, { name: 'Reviews', value: 30 }, { name: 'Forums', value: 20 }, { name: 'Other', value: 10 }], escalation: 50 }
}

function AlertVelocity({ title }: { title: string }) {
  const m = deriveAlertMetrics(title)
  const escColor = m.escalation >= 70 ? 'bg-red-400' : m.escalation >= 40 ? 'bg-amber-400' : 'bg-emerald-400'
  const escText = m.escalation >= 70 ? 'text-red-400' : m.escalation >= 40 ? 'text-amber-400' : 'text-emerald-400'
  return (
    <div className="grid grid-cols-3 gap-3 mb-4">
      <div className="bg-card border border-border p-4">
        <h4 className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3 font-serif">Sentiment Change</h4>
        <div className="flex items-baseline gap-1.5">
          <span className="text-[18px] font-serif text-red-400">{m.sentiment}</span>
          <RiArrowRightUpLine className="h-3.5 w-3.5 text-red-400" />
        </div>
        <span className="text-[10px] text-muted-foreground">negative mentions</span>
      </div>
      <div className="bg-card border border-border p-4">
        <h4 className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3 font-serif">Source Distribution</h4>
        <div className="flex h-3 w-full mb-2">
          {m.distribution.map((d, i) => (
            <div key={d.name} className="h-full" style={{ width: `${d.value}%`, backgroundColor: i === 0 ? 'hsl(40,50%,55%)' : i === 1 ? 'hsl(40,40%,45%)' : i === 2 ? 'hsl(40,30%,35%)' : 'hsl(40,20%,28%)' }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5">
          {m.distribution.map((d) => (
            <span key={d.name} className="text-[9px] text-muted-foreground">{d.name} {d.value}%</span>
          ))}
        </div>
      </div>
      <div className="bg-card border border-border p-4">
        <h4 className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3 font-serif">Escalation Risk</h4>
        <div className="flex items-baseline gap-1.5 mb-2">
          <span className={`text-[18px] font-serif ${escText}`}>{m.escalation}</span>
          <span className="text-[10px] text-muted-foreground">/ 100</span>
        </div>
        <div className="h-2 bg-secondary w-full">
          <div className={`h-full ${escColor}`} style={{ width: `${m.escalation}%` }} />
        </div>
      </div>
    </div>
  )
}

export default function AlertWorkspace({ item, onBack }: { item: DetailItem; onBack: () => void }) {
  const sections = item.sections || []
  const firstSection = sections[0]
  const remainingSections = sections.slice(1)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto px-8 py-6">

        <button onClick={onBack} className="flex items-center gap-2 text-[11px] text-muted-foreground tracking-[0.1em] uppercase hover:text-foreground transition-colors mb-5">
          <RiArrowLeftLine className="h-3.5 w-3.5" /> Back
        </button>

        <div className="flex items-center gap-2 mb-3">
          <RiShieldLine className="h-4 w-4 text-red-400" />
          <span className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground">Claims / Reputation Alert</span>
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

        <AlertVelocity title={item?.title ?? ''} />

        {firstSection && (
          <div className="bg-card border border-border p-5 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <RiFlashlightLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">{firstSection.label}</h3>
            </div>
            <p className="text-[13px] text-foreground/80 leading-[1.8]">{firstSection.content}</p>
          </div>
        )}

        {remainingSections.map((section, i) => {
          const isFlag = section.label?.toLowerCase().includes('flag')
          return (
            <div key={i} className={`bg-card border p-5 mb-4 ${isFlag ? 'border-primary/20' : 'border-border'}`}>
              <div className="flex items-center gap-2 mb-3">
                {isFlag
                  ? <RiLightbulbLine className="h-4 w-4 text-primary" />
                  : <RiShieldLine className="h-4 w-4 text-muted-foreground" />}
                <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">{section.label}</h3>
              </div>
              <p className="text-[13px] text-foreground/70 leading-[1.8]">{section.content}</p>
            </div>
          )
        })}

        {Array.isArray(item.relatedActions) && item.relatedActions.length > 0 && (
          <div className="bg-card border border-border p-5 mt-2">
            <div className="flex items-center gap-2 mb-4">
              <RiFlashlightLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">What Teams Should Do</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {item.relatedActions.map((act, i) => (
                <div key={i} className="border border-border/60 p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <div className={`w-1.5 h-1.5 mt-1.5 flex-shrink-0 ${severityDot(act.priority)}`} />
                    <p className="text-[12px] text-foreground tracking-wide leading-relaxed">{act.action}</p>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 ${urgencyBadge(act.priority)}`}>{act.priority}</span>
                    {act.owner && <span className="text-[10px] text-muted-foreground">{act.owner}</span>}
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
