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

export default function ActionWorkspace({ item, onBack }: { item: DetailItem; onBack: () => void }) {
  const context = findOriginatingContext(item.title)
  const ownerSection = item.sections.find(s => s.label.toLowerCase().includes('owner'))
  const timelineSection = item.sections.find(s => s.label.toLowerCase().includes('timeline'))
  const impactSection = item.sections.find(s => s.label.toLowerCase().includes('impact'))
  const owner = ownerSection?.content || ''
  const timeline = timelineSection?.content || ''
  const impact = impactSection?.content || ''
  const otherSections = item.sections.filter(s => !['owner', 'timeline', 'expected impact'].includes(s.label.toLowerCase()))

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-5xl mx-auto px-8 py-6">
        <button onClick={onBack} className="flex items-center gap-2 text-[11px] text-muted-foreground tracking-[0.1em] uppercase hover:text-foreground transition-colors mb-5">
          <RiArrowLeftLine className="h-3.5 w-3.5" /> Back
        </button>

        <div className="flex items-center gap-2 mb-3">
          <RiFlashlightLine className="h-4 w-4 text-primary" />
          <span className="text-[10px] tracking-[0.14em] uppercase text-muted-foreground">Recommended Action</span>
        </div>
        <div className="flex items-start justify-between gap-4 mb-6">
          <h2 className="font-serif text-xl tracking-wide text-foreground leading-snug">{item.title}</h2>
          {item.severity && <span className={`text-[9px] tracking-[0.12em] uppercase px-2.5 py-1 whitespace-nowrap ${urgencyBadge(item.severity)}`}>{item.severity}</span>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mb-6">
          {owner && (
            <div className="bg-card border border-border p-5">
              <div className="flex items-center gap-2 mb-3">
                <RiUserLine className="h-4 w-4 text-primary" />
                <h3 className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Owner</h3>
              </div>
              <p className="text-[14px] font-serif text-foreground">{owner}</p>
            </div>
          )}
          {timeline && (
            <div className="bg-card border border-border p-5">
              <div className="flex items-center gap-2 mb-3">
                <RiTimeLine className="h-4 w-4 text-primary" />
                <h3 className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Timeline</h3>
              </div>
              <p className="text-[14px] font-serif text-foreground">{timeline}</p>
            </div>
          )}
          {impact && (
            <div className="bg-card border border-border p-5">
              <div className="flex items-center gap-2 mb-3">
                <RiBarChartLine className="h-4 w-4 text-primary" />
                <h3 className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase">Expected Impact</h3>
              </div>
              <p className="text-[13px] text-foreground/80 leading-relaxed tracking-wide">{impact}</p>
            </div>
          )}
        </div>

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
              </div>
            </div>
          </div>
        )}

        {otherSections.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {otherSections.map((section, i) => (
              <div key={i} className="bg-card border border-border p-5">
                <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-2">{section.label}</p>
                <p className="text-[12px] text-foreground/80 leading-[1.8] tracking-wide">{section.content}</p>
              </div>
            ))}
          </div>
        )}

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
