'use client'

import React from 'react'
import { RiArrowLeftLine, RiErrorWarningLine, RiBarChartLine, RiTimeLine, RiExchangeLine, RiAlarmWarningLine, RiFlashlightLine, RiPieChartLine, RiCheckboxCircleLine, RiCloseCircleLine, RiLoader4Line } from 'react-icons/ri'
import { urgencyBadge, severityDot } from '../data/seededScenarios'
import type { DetailItem } from '../DetailView'

function deriveRiskMetrics(item: DetailItem) {
  const t = (item.title || '').toLowerCase()
  if (t.includes('hair repair') || t.includes('germany')) return {
    traction: 85, conversion: 2.1, benchmark: 4.8, timingWeek: 3, riskScore: 72,
    channels: [{ name: 'E-Commerce', perf: 65, target: 85 }, { name: 'Social Organic', perf: 30, target: 60 }, { name: 'Creator Content', perf: 22, target: 55 }, { name: 'Paid Media', perf: 70, target: 75 }],
    causes: [{ cause: 'Weak benefit differentiation vs. existing range', impact: 85 }, { cause: 'Generic creator briefs lacking demo protocols', impact: 70 }, { cause: 'Price-expectation gap in messaging', impact: 55 }],
    actions: [{ step: 'Rapid e-commerce UX audit', status: 'in_progress' as string }, { step: 'Rebrief creator programme', status: 'pending' as string }, { step: 'A/B test product page copy', status: 'pending' as string }, { step: 'Review trial pricing option', status: 'pending' as string }],
  }
  if (t.includes('eye-care') || t.includes('peptide') || t.includes('crowding')) return {
    traction: 60, conversion: 3.2, benchmark: 5.5, timingWeek: 2, riskScore: 68,
    channels: [{ name: 'Social Discussion', perf: 42, target: 70 }, { name: 'Search Volume', perf: 55, target: 80 }, { name: 'Creator Pipeline', perf: 35, target: 65 }, { name: 'Retail Pre-Order', perf: 48, target: 60 }],
    causes: [{ cause: 'Narrative crowding from 3 competitor launches', impact: 90 }, { cause: 'Generic peptide claims lacking differentiation', impact: 80 }, { cause: 'Clinical data not reflected in launch comms', impact: 65 }],
    actions: [{ step: 'Reposition launch messaging', status: 'in_progress' as string }, { step: 'Activate clinical differentiation data', status: 'pending' as string }, { step: 'Evaluate 2-3 week timeline delay', status: 'pending' as string }, { step: 'Refresh creative assets', status: 'pending' as string }],
  }
  return {
    traction: 70, conversion: 3.0, benchmark: 5.0, timingWeek: 4, riskScore: 60,
    channels: [{ name: 'Digital', perf: 55, target: 70 }, { name: 'Social', perf: 45, target: 65 }, { name: 'Retail', perf: 60, target: 75 }, { name: 'PR', perf: 50, target: 60 }],
    causes: [{ cause: 'Market positioning unclear', impact: 70 }, { cause: 'Launch timing pressure', impact: 55 }, { cause: 'Resource allocation gap', impact: 45 }],
    actions: [{ step: 'Conduct market analysis', status: 'in_progress' as string }, { step: 'Reposition messaging', status: 'pending' as string }, { step: 'Adjust timeline', status: 'pending' as string }],
  }
}

export default function RiskWorkspace({ item, onBack }: { item: DetailItem; onBack: () => void }) {
  const m = deriveRiskMetrics(item)
  const convRatio = Math.round((m.conversion / m.benchmark) * 100)

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[11px] text-muted-foreground tracking-[0.1em] uppercase hover:text-foreground transition-colors mb-5">
          <RiArrowLeftLine className="h-3.5 w-3.5" /> Back
        </button>

        <div className="flex items-center gap-2 mb-3">
          <RiErrorWarningLine className="h-4 w-4 text-red-400" />
          <span className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground">Launch Risk Workspace</span>
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

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          <div className="bg-card border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Traction vs Target</p>
              <RiBarChartLine className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className={`text-xl font-serif ${m.traction >= 80 ? 'text-emerald-400' : m.traction >= 60 ? 'text-amber-400' : 'text-red-400'}`}>{m.traction}%</p>
            <div className="h-1.5 bg-secondary mt-2 overflow-hidden">
              <div className="h-full bg-amber-400/60" style={{ width: `${m.traction}%` }} />
            </div>
          </div>
          <div className="bg-card border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Conversion Rate</p>
              <RiExchangeLine className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="text-xl font-serif text-red-400">{m.conversion}%</p>
            <p className="text-[10px] text-muted-foreground mt-1">vs. {m.benchmark}% benchmark ({convRatio}%)</p>
          </div>
          <div className="bg-card border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Launch Week</p>
              <RiTimeLine className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className="text-xl font-serif text-foreground">Week {m.timingWeek}</p>
            <p className="text-[10px] text-muted-foreground mt-1">{m.timingWeek <= 2 ? 'Early stage -- correctable' : 'Intervention window narrowing'}</p>
          </div>
          <div className="bg-card border border-border p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Overall Risk</p>
              <RiAlarmWarningLine className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <p className={`text-xl font-serif ${m.riskScore >= 70 ? 'text-red-400' : m.riskScore >= 50 ? 'text-amber-400' : 'text-emerald-400'}`}>{m.riskScore}/100</p>
            <div className="h-1.5 bg-secondary mt-2 overflow-hidden">
              <div className="h-full" style={{ width: `${m.riskScore}%`, background: m.riskScore >= 70 ? 'rgb(239,68,68)' : m.riskScore >= 50 ? 'rgb(245,158,11)' : 'rgb(34,197,94)' }} />
            </div>
          </div>
        </div>

        {/* 2-Column: Channels + Root Cause */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* Channel Performance */}
          <div className="bg-card border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <RiPieChartLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Channel Performance vs Target</h3>
            </div>
            <div className="space-y-4">
              {m.channels.map((ch, i) => {
                const ratio = Math.round((ch.perf / ch.target) * 100)
                return (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] mb-1.5">
                      <span className="text-foreground/80 tracking-wide">{ch.name}</span>
                      <span className="text-muted-foreground">{ch.perf}% / {ch.target}% target</span>
                    </div>
                    <div className="h-3 bg-secondary overflow-hidden relative">
                      <div className="h-full absolute inset-y-0 left-0 border-r-2 border-foreground/30" style={{ width: `${ch.target}%` }} />
                      <div className="h-full relative z-10" style={{ width: `${ch.perf}%`, background: ratio >= 80 ? 'hsl(142,50%,45%)' : ratio >= 50 ? 'hsl(40,80%,50%)' : 'hsl(0,70%,55%)' }} />
                    </div>
                    <div className="flex justify-end mt-0.5">
                      <span className={`text-[9px] ${ratio >= 80 ? 'text-emerald-400' : ratio >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{ratio}% of target</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Root Cause Analysis */}
          <div className="bg-card border border-border p-5">
            <div className="flex items-center gap-2 mb-4">
              <RiAlarmWarningLine className="h-4 w-4 text-red-400" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Root Cause Analysis</h3>
            </div>
            <div className="space-y-4">
              {m.causes.map((c, i) => (
                <div key={i} className="border border-border/60 p-3">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <p className="text-[12px] text-foreground/80 tracking-wide leading-relaxed">{c.cause}</p>
                    <span className={`text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 whitespace-nowrap flex-shrink-0 ${c.impact >= 80 ? 'bg-red-500/15 text-red-400 border border-red-500/30' : c.impact >= 60 ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' : 'bg-blue-400/15 text-blue-400 border border-blue-400/30'}`}>
                      Impact: {c.impact}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-secondary overflow-hidden">
                    <div className="h-full" style={{ width: `${c.impact}%`, background: c.impact >= 80 ? 'rgb(239,68,68)' : c.impact >= 60 ? 'rgb(245,158,11)' : 'rgb(96,165,250)' }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Context sections */}
            {item.sections.slice(0, 2).map((section, i) => (
              <div key={i} className="mt-4 pt-4 border-t border-border/60">
                <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-1.5">{section.label}</p>
                <p className="text-[12px] text-foreground/70 leading-[1.7] tracking-wide">{section.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Corrective Action Tracker */}
        <div className="bg-card border border-border p-5 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <RiFlashlightLine className="h-4 w-4 text-primary" />
            <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Corrective Action Tracker</h3>
            <span className="ml-auto text-[10px] text-muted-foreground">
              {m.actions.filter(a => a.status === 'done').length}/{m.actions.length} complete
            </span>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {m.actions.map((a, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 border ${a.status === 'done' ? 'border-emerald-500/30 bg-emerald-500/5' : a.status === 'in_progress' ? 'border-primary/30 bg-primary/5' : 'border-border/60'}`}>
                {a.status === 'done' ? <RiCheckboxCircleLine className="h-4 w-4 text-emerald-400 flex-shrink-0" /> : a.status === 'in_progress' ? <RiLoader4Line className="h-4 w-4 text-primary animate-spin flex-shrink-0" /> : <RiCloseCircleLine className="h-4 w-4 text-muted-foreground flex-shrink-0" />}
                <div className="flex-1">
                  <p className={`text-[12px] tracking-wide ${a.status === 'done' ? 'text-foreground/50 line-through' : 'text-foreground/80'}`}>{a.step}</p>
                  <p className="text-[9px] tracking-[0.1em] uppercase text-muted-foreground mt-0.5">
                    {a.status === 'done' ? 'Completed' : a.status === 'in_progress' ? 'In Progress' : 'Pending'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Remaining context sections */}
        {item.sections.length > 2 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {item.sections.slice(2).map((section, i) => (
              <div key={i} className="bg-card border border-border p-5">
                <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-2">{section.label}</p>
                <p className="text-[12px] text-foreground/80 leading-[1.8] tracking-wide">{section.content}</p>
              </div>
            ))}
          </div>
        )}

        {/* Related Actions */}
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
