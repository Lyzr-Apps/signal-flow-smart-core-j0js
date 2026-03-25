'use client'

import React from 'react'
import { RiArrowLeftLine, RiFlashlightLine, RiUserLine, RiTimeLine, RiBarChartLine, RiLinksLine, RiFileTextLine, RiAlertLine, RiArrowRightUpLine, RiShieldLine, RiErrorWarningLine } from 'react-icons/ri'
import { urgencyBadge, severityDot, SEEDED_SIGNALS, SEEDED_RISKS, SEEDED_ALERTS, SEEDED_OPPORTUNITIES } from '../data/seededScenarios'
import type { DetailItem } from '../DetailView'

function findOriginatingContext(title: string): { type: string; scenario: string; icon: any; color: string } | null {
  const t = title.toLowerCase()
  for (const s of SEEDED_SIGNALS) {
    for (const a of s.relatedActions) {
      if (a.action.toLowerCase().includes(t.slice(0, 30).toLowerCase()) || t.includes(a.action.slice(0, 30).toLowerCase())) {
        return { type: 'Priority Signal', scenario: s.title, icon: RiAlertLine, color: 'text-amber-400' }
      }
    }
  }
  for (const r of SEEDED_RISKS) {
    for (const a of r.relatedActions) {
      if (a.action.toLowerCase().includes(t.slice(0, 30).toLowerCase()) || t.includes(a.action.slice(0, 30).toLowerCase())) {
        return { type: 'Launch Risk', scenario: r.title, icon: RiErrorWarningLine, color: 'text-red-400' }
      }
    }
  }
  for (const al of SEEDED_ALERTS) {
    for (const a of al.relatedActions) {
      if (a.action.toLowerCase().includes(t.slice(0, 30).toLowerCase()) || t.includes(a.action.slice(0, 30).toLowerCase())) {
        return { type: 'Claims / Reputation Alert', scenario: al.title, icon: RiShieldLine, color: 'text-red-400' }
      }
    }
  }
  for (const o of SEEDED_OPPORTUNITIES) {
    for (const a of o.relatedActions) {
      if (a.action.toLowerCase().includes(t.slice(0, 30).toLowerCase()) || t.includes(a.action.slice(0, 30).toLowerCase())) {
        return { type: 'Active Opportunity', scenario: o.title, icon: RiArrowRightUpLine, color: 'text-emerald-400' }
      }
    }
  }
  return null
}

function deriveActionMetrics(item: DetailItem) {
  const t = (item.title || '').toLowerCase()
  if (t.includes('retinol') || t.includes('usage guidance')) return { urgencyScore: 95, businessImpact: 'Critical -- prevents potential brand reputation crisis', dependencies: ['Medical Affairs France', 'Digital Marketing France', 'Consumer Relations'], timeline: 'Immediate (24-48h)', readiness: 30 }
  if (t.includes('accelerate') || t.includes('brightening')) return { urgencyScore: 90, businessImpact: 'Critical -- SOV window closing in 3-4 weeks', dependencies: ['Brand Management UK', 'Medical Affairs / PR', 'Commercial UK'], timeline: '3-4 weeks', readiness: 45 }
  if (t.includes('scalp') || t.includes('consumer research')) return { urgencyScore: 70, businessImpact: 'High -- validates $340M market opportunity', dependencies: ['Consumer Insights APAC', 'R&D Hair Care', 'Strategy APAC'], timeline: '6-8 weeks', readiness: 20 }
  if (t.includes('ux audit') || t.includes('e-commerce')) return { urgencyScore: 75, businessImpact: 'High -- conversion rate at 44% of benchmark', dependencies: ['Digital Commerce Germany', 'Influencer Marketing', 'E-Commerce Team'], timeline: '2 weeks', readiness: 35 }
  if (t.includes('reposition') || t.includes('eye-care')) return { urgencyScore: 80, businessImpact: 'High -- differentiation critical before launch', dependencies: ['Brand Strategy', 'Medical Affairs / PR', 'Brand Management'], timeline: 'Before launch (2-3 weeks)', readiness: 25 }
  if (t.includes('exosome')) return { urgencyScore: 65, businessImpact: 'High -- defines premium anti-aging category', dependencies: ['R&D Skincare Innovation', 'Regulatory Affairs', 'Medical Affairs'], timeline: 'Q3 2026 review', readiness: 15 }
  return { urgencyScore: 50, businessImpact: 'Medium -- contributes to strategic positioning', dependencies: ['Primary owner', 'Supporting team'], timeline: 'As scheduled', readiness: 40 }
}

export default function ActionWorkspace({ item, onBack }: { item: DetailItem; onBack: () => void }) {
  const context = findOriginatingContext(item.title)
  const m = deriveActionMetrics(item)
  const ownerSection = item.sections.find(s => s.label.toLowerCase().includes('owner'))
  const timelineSection = item.sections.find(s => s.label.toLowerCase().includes('timeline'))
  const impactSection = item.sections.find(s => s.label.toLowerCase().includes('impact'))
  const owner = ownerSection?.content || ''
  const timeline = timelineSection?.content || m.timeline
  const impact = impactSection?.content || m.businessImpact

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-7xl mx-auto px-8 py-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[11px] text-muted-foreground tracking-[0.1em] uppercase hover:text-foreground transition-colors mb-5">
          <RiArrowLeftLine className="h-3.5 w-3.5" /> Back
        </button>

        <div className="flex items-center gap-2 mb-3">
          <RiFlashlightLine className="h-4 w-4 text-primary" />
          <span className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground">Recommended Action Workspace</span>
        </div>
        <div className="flex items-start justify-between gap-4 mb-6">
          <h2 className="font-serif text-xl tracking-wide text-foreground leading-snug">{item.title}</h2>
          {item.severity && <span className={`text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 whitespace-nowrap ${urgencyBadge(item.severity)}`}>{item.severity}</span>}
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
          <div className="bg-card border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <RiUserLine className="h-4 w-4 text-primary" />
              <h3 className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Owner</h3>
            </div>
            <p className="text-[14px] font-serif text-foreground">{owner}</p>
            {m.dependencies.length > 1 && (
              <div className="mt-3 pt-3 border-t border-border/60">
                <p className="text-[9px] tracking-[0.12em] text-muted-foreground uppercase mb-2">Dependencies</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.dependencies.map((dep, i) => (
                    <span key={i} className="text-[9px] tracking-[0.1em] text-foreground/60 border border-border/60 px-2 py-0.5">{dep}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="bg-card border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <RiTimeLine className="h-4 w-4 text-primary" />
              <h3 className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Timeline</h3>
            </div>
            <p className="text-[14px] font-serif text-foreground">{timeline}</p>
            <div className="mt-3 pt-3 border-t border-border/60">
              <p className="text-[9px] tracking-[0.12em] text-muted-foreground uppercase mb-2">Urgency Score</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-secondary overflow-hidden">
                  <div className="h-full" style={{ width: `${m.urgencyScore}%`, background: m.urgencyScore >= 80 ? 'rgb(239,68,68)' : m.urgencyScore >= 60 ? 'rgb(245,158,11)' : 'hsl(40,50%,55%)' }} />
                </div>
                <span className="text-[11px] text-muted-foreground">{m.urgencyScore}/100</span>
              </div>
            </div>
          </div>
          <div className="bg-card border border-border p-5">
            <div className="flex items-center gap-2 mb-3">
              <RiBarChartLine className="h-4 w-4 text-primary" />
              <h3 className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Expected Impact</h3>
            </div>
            <p className="text-[13px] text-foreground/80 leading-relaxed tracking-wide">{impact}</p>
            <div className="mt-3 pt-3 border-t border-border/60">
              <p className="text-[9px] tracking-[0.12em] text-muted-foreground uppercase mb-2">Readiness</p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-secondary overflow-hidden">
                  <div className="h-full bg-primary/60" style={{ width: `${m.readiness}%` }} />
                </div>
                <span className="text-[11px] text-muted-foreground">{m.readiness}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Originating Context */}
        {context && (
          <div className="bg-card border border-primary/20 p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <RiLinksLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Originating Intelligence</h3>
            </div>
            <div className="flex items-start gap-3">
              <context.icon className={`h-5 w-5 ${context.color} flex-shrink-0 mt-0.5`} />
              <div>
                <p className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase mb-1">{context.type}</p>
                <p className="text-[14px] text-foreground tracking-wide leading-snug">{context.scenario}</p>
                <p className="text-[11px] text-foreground/50 mt-2">This action was generated from the above intelligence signal. Completing it addresses one of the key recommendations from that assessment.</p>
              </div>
            </div>
          </div>
        )}

        {/* Additional context sections */}
        {item.sections.filter(s => !['owner', 'timeline', 'expected impact'].includes(s.label.toLowerCase())).length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {item.sections.filter(s => !['owner', 'timeline', 'expected impact'].includes(s.label.toLowerCase())).map((section, i) => (
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
              <RiFileTextLine className="h-4 w-4 text-primary" />
              <h3 className="text-[11px] tracking-[0.14em] text-muted-foreground uppercase">Related Actions from Same Assessment</h3>
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
