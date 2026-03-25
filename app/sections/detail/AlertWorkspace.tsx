'use client'

import React from 'react'
import { RiArrowLeftLine, RiShieldLine, RiAlarmWarningLine, RiSpeedLine, RiEyeLine, RiFlashlightLine, RiCheckboxCircleLine, RiLoader4Line, RiTimeLine, RiArrowRightSLine, RiRadarLine } from 'react-icons/ri'
import { urgencyBadge, severityDot } from '../data/seededScenarios'
import type { DetailItem } from '../DetailView'

function deriveAlertMetrics(item: DetailItem) {
  const t = (item.title || '').toLowerCase()
  if (t.includes('retinol')) return {
    velocity: 'Rising', reach: '340K+', escalation: 78,
    stages: [{ name: 'Individual Reports', active: true, done: true }, { name: 'Social Amplification', active: true, done: true }, { name: 'Creator Commentary', active: true, done: false }, { name: 'Media Coverage', active: false, done: false }, { name: 'Regulatory Review', active: false, done: false }],
    sources: [{ name: 'Social Media', pct: 45, color: 'bg-red-400' }, { name: 'Product Reviews', pct: 28, color: 'bg-amber-400' }, { name: 'Beauty Forums', pct: 15, color: 'bg-blue-400' }, { name: 'Direct Complaints', pct: 12, color: 'bg-emerald-400' }],
    playbook: [{ step: 'Assess scope of irritation reports', status: 'done' as const }, { step: 'Issue updated usage guidance', status: 'in_progress' as const }, { step: 'Deploy dermatologist-backed content', status: 'pending' as const }, { step: 'Brief customer service teams', status: 'pending' as const }, { step: 'Monitor for media escalation', status: 'in_progress' as const }],
    mitigation: [{ item: 'Usage guidance update', progress: 65 }, { item: 'Derm content programme', progress: 25 }, { item: 'CS team briefing', progress: 10 }, { item: 'Sentiment monitoring', progress: 80 }],
  }
  if (t.includes('spicule')) return {
    velocity: 'Surging', reach: '520K+', escalation: 62,
    stages: [{ name: 'Individual Reports', active: true, done: true }, { name: 'Social Amplification', active: true, done: true }, { name: 'Creator Commentary', active: true, done: true }, { name: 'Media Coverage', active: false, done: false }, { name: 'Regulatory Review', active: false, done: false }],
    sources: [{ name: 'TikTok / Reels', pct: 52, color: 'bg-red-400' }, { name: 'Reddit / Forums', pct: 22, color: 'bg-amber-400' }, { name: 'YouTube', pct: 16, color: 'bg-blue-400' }, { name: 'News Outlets', pct: 10, color: 'bg-emerald-400' }],
    playbook: [{ step: 'Assess portfolio exposure to spicule ingredients', status: 'done' as const }, { step: 'Prepare safety communication framework', status: 'in_progress' as const }, { step: 'Engage dermatology KOLs', status: 'pending' as const }, { step: 'Monitor for brand mention escalation', status: 'in_progress' as const }],
    mitigation: [{ item: 'Portfolio exposure audit', progress: 90 }, { item: 'Safety communication draft', progress: 40 }, { item: 'KOL engagement plan', progress: 15 }, { item: 'Monitoring dashboard', progress: 70 }],
  }
  return {
    velocity: 'Moderate', reach: '180K', escalation: 45,
    stages: [{ name: 'Detection', active: true, done: true }, { name: 'Assessment', active: true, done: false }, { name: 'Response', active: false, done: false }, { name: 'Monitoring', active: false, done: false }],
    sources: [{ name: 'Social', pct: 40, color: 'bg-red-400' }, { name: 'Reviews', pct: 30, color: 'bg-amber-400' }, { name: 'Forums', pct: 20, color: 'bg-blue-400' }, { name: 'Other', pct: 10, color: 'bg-emerald-400' }],
    playbook: [{ step: 'Assess situation', status: 'in_progress' as const }, { step: 'Prepare response', status: 'pending' as const }, { step: 'Deploy communications', status: 'pending' as const }],
    mitigation: [{ item: 'Assessment', progress: 50 }, { item: 'Response preparation', progress: 20 }, { item: 'Monitoring', progress: 60 }],
  }
}

export default function AlertWorkspace({ item, onBack }: { item: DetailItem; onBack: () => void }) {
  const m = deriveAlertMetrics(item)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[11px] text-muted-foreground tracking-[0.1em] uppercase hover:text-foreground transition-colors mb-5">
          <RiArrowLeftLine className="h-3.5 w-3.5" /> Back
        </button>

        <div className="flex items-center gap-2 mb-3">
          <RiShieldLine className="h-4 w-4 text-red-400" />
          <span className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground">Claims / Reputation Alert Workspace</span>
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

        {/* Alert KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-card border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Severity Level</p>
              <RiAlarmWarningLine className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${item.severity?.toLowerCase() === 'critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'}`} />
              <p className="text-xl font-serif text-foreground">{item.severity || 'High'}</p>
            </div>
          </div>
          <div className="bg-card border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Velocity</p>
              <RiSpeedLine className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className={`text-xl font-serif ${m.velocity === 'Surging' ? 'text-red-400' : m.velocity === 'Rising' ? 'text-amber-400' : 'text-foreground'}`}>{m.velocity}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Spread rate</p>
          </div>
          <div className="bg-card border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Estimated Reach</p>
              <RiEyeLine className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="text-xl font-serif text-foreground">{m.reach}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Impressions</p>
          </div>
          <div className="bg-card border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Escalation Risk</p>
              <RiRadarLine className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className={`text-xl font-serif ${m.escalation >= 70 ? 'text-red-400' : m.escalation >= 50 ? 'text-amber-400' : 'text-emerald-400'}`}>{m.escalation}%</p>
            <div className="h-1.5 bg-secondary mt-2 overflow-hidden">
              <div className="h-full" style={{ width: `${m.escalation}%`, background: m.escalation >= 70 ? 'rgb(239,68,68)' : m.escalation >= 50 ? 'rgb(245,158,11)' : 'rgb(34,197,94)' }} />
            </div>
          </div>
        </div>

        {/* Spread Pipeline + Source Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Spread Status */}
          <div className="bg-card border border-border p-5">
            <div className="flex items-center gap-2 mb-5">
              <RiTimeLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Spread Status Pipeline</h3>
            </div>
            <div className="space-y-0">
              {m.stages.map((stage, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${stage.done ? 'border-red-400 bg-red-500/30' : stage.active ? 'border-amber-400 bg-amber-400/20 animate-pulse' : 'border-border bg-secondary'}`}>
                      {stage.done && <div className="w-1.5 h-1.5 rounded-full bg-red-400" />}
                    </div>
                    {i < m.stages.length - 1 && <div className={`w-0.5 h-6 ${stage.done ? 'bg-red-400/40' : 'bg-border'}`} />}
                  </div>
                  <div className="flex items-center gap-2 pb-4">
                    <p className={`text-[12px] tracking-wide ${stage.done ? 'text-red-400' : stage.active ? 'text-amber-400' : 'text-muted-foreground'}`}>{stage.name}</p>
                    {stage.active && !stage.done && <span className="text-[8px] tracking-[0.12em] uppercase px-1.5 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/30">Active</span>}
                  </div>
                </div>
              ))}
            </div>

            {/* Context */}
            {item.sections[0] && (
              <div className="mt-4 pt-4 border-t border-border/60">
                <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-1.5">{item.sections[0].label}</p>
                <p className="text-[12px] text-foreground/70 leading-[1.7]">{item.sections[0].content}</p>
              </div>
            )}
          </div>

          {/* Source Breakdown + Sentiment */}
          <div className="bg-card border border-border p-5">
            <div className="flex items-center gap-2 mb-5">
              <RiEyeLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Source Breakdown</h3>
            </div>
            <div className="space-y-3 mb-6">
              {m.sources.map((src, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-foreground/80 tracking-wide">{src.name}</span>
                    <span className="text-muted-foreground">{src.pct}%</span>
                  </div>
                  <div className="h-2.5 bg-secondary overflow-hidden">
                    <div className={`h-full ${src.color}`} style={{ width: `${src.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Additional context sections */}
            {item.sections.slice(1, 3).map((section, i) => (
              <div key={i} className={`${i > 0 ? 'mt-4 pt-4 border-t border-border/60' : 'pt-4 border-t border-border/60'}`}>
                <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-1.5">{section.label}</p>
                <p className="text-[12px] text-foreground/70 leading-[1.7]">{section.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Response Playbook */}
        <div className="bg-card border border-border p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <RiFlashlightLine className="h-4 w-4 text-primary" />
            <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Response Playbook</h3>
            <span className="ml-auto text-[10px] text-muted-foreground">
              {m.playbook.filter(p => p.status === 'done').length}/{m.playbook.length} steps complete
            </span>
          </div>
          <div className="space-y-2">
            {m.playbook.map((p, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 border ${p.status === 'done' ? 'border-emerald-500/30 bg-emerald-500/5' : p.status === 'in_progress' ? 'border-primary/30 bg-primary/5' : 'border-border/60'}`}>
                <span className="text-[10px] text-muted-foreground w-5">{i + 1}.</span>
                {p.status === 'done' ? <RiCheckboxCircleLine className="h-4 w-4 text-emerald-400 flex-shrink-0" /> : p.status === 'in_progress' ? <RiLoader4Line className="h-4 w-4 text-primary animate-spin flex-shrink-0" /> : <div className="w-4 h-4 rounded-full border border-border flex-shrink-0" />}
                <p className={`text-[12px] tracking-wide flex-1 ${p.status === 'done' ? 'text-foreground/50 line-through' : 'text-foreground/80'}`}>{p.step}</p>
                <span className={`text-[9px] tracking-[0.1em] uppercase ${p.status === 'done' ? 'text-emerald-400' : p.status === 'in_progress' ? 'text-primary' : 'text-muted-foreground'}`}>
                  {p.status === 'done' ? 'Complete' : p.status === 'in_progress' ? 'Active' : 'Queued'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Mitigation Tracking */}
        <div className="bg-card border border-border p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <RiShieldLine className="h-4 w-4 text-primary" />
            <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Mitigation Progress</h3>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {m.mitigation.map((mit, i) => (
              <div key={i} className="border border-border/60 p-3">
                <div className="flex justify-between text-[11px] mb-2">
                  <span className="text-foreground/80">{mit.item}</span>
                  <span className={`${mit.progress >= 70 ? 'text-emerald-400' : mit.progress >= 40 ? 'text-amber-400' : 'text-red-400'}`}>{mit.progress}%</span>
                </div>
                <div className="h-2 bg-secondary overflow-hidden">
                  <div className="h-full transition-all" style={{ width: `${mit.progress}%`, background: mit.progress >= 70 ? 'hsl(142,50%,45%)' : mit.progress >= 40 ? 'hsl(40,80%,50%)' : 'hsl(0,70%,55%)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Linked Actions */}
        {Array.isArray(item.relatedActions) && item.relatedActions.length > 0 && (
          <div className="bg-card border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <RiFlashlightLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Linked Recommendations</h3>
            </div>
            <div className="divide-y divide-border/60">
              {item.relatedActions.map((act, i) => (
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
