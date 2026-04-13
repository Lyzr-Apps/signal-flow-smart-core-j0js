'use client'

import React, { useMemo, useState } from 'react'
import { RiFlashlightLine, RiArrowRightSLine, RiTeamLine } from 'react-icons/ri'
import {
  urgencyBadge, severityDot, cleanText, isHighPriority, deriveFromAnalyses, applyActionFilters,
  SEEDED_ACTIONS, OWNER_TEAMS, KPI_OUTCOMES,
  type AnalysisItem, type SeededAction, type FilterState,
} from './data/seededScenarios'
import type { DetailItem } from './DetailView'

interface CategoryListViewProps {
  analyses: AnalysisItem[]
  onOpenDetail: (item: DetailItem) => void
  hasRunAnalysis?: boolean
  filters: FilterState
}

type GroupBy = 'ownerTeam' | 'urgency' | 'kpiOutcome'

export default function CategoryListView({ analyses, onOpenDetail, hasRunAnalysis, filters }: CategoryListViewProps) {
  const [groupBy, setGroupBy] = useState<GroupBy>('ownerTeam')
  const safeAnalyses = Array.isArray(analyses) ? analyses : []
  const derived = useMemo(() => deriveFromAnalyses(safeAnalyses), [safeAnalyses])
  const useReal = !!hasRunAnalysis && safeAnalyses.length > 0

  const rawActions = useReal && derived.actions.length > 0 ? derived.actions : SEEDED_ACTIONS
  const actions = applyActionFilters(rawActions, filters)

  const openAction = (act: SeededAction) => {
    onOpenDetail({
      category: 'action', title: act.title, severity: act.priority,
      sections: [
        { label: 'Expected Impact', content: act.impact },
        { label: 'Owner', content: act.ownerTeam || act.owner },
        { label: 'Timeline', content: act.timeline },
        { label: 'KPI Outcome', content: act.kpiOutcome || 'Increased Sales' },
      ],
    })
  }

  const grouped = useMemo(() => {
    const groups: Record<string, SeededAction[]> = {}
    for (const act of actions) {
      let key = ''
      if (groupBy === 'ownerTeam') key = act.ownerTeam || act.owner || 'Other'
      else if (groupBy === 'urgency') key = act.priority || 'Medium'
      else if (groupBy === 'kpiOutcome') key = act.kpiOutcome || 'Increased Sales'
      if (!groups[key]) groups[key] = []
      groups[key].push(act)
    }
    // Sort groups by priority
    const sortedKeys = Object.keys(groups).sort((a, b) => {
      if (groupBy === 'urgency') {
        const order: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 }
        return (order[a] ?? 4) - (order[b] ?? 4)
      }
      return a.localeCompare(b)
    })
    return sortedKeys.map(key => ({ key, items: groups[key] }))
  }, [actions, groupBy])

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-8 py-7">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <RiFlashlightLine className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-lg tracking-[0.1em] text-foreground uppercase">Actions</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] tracking-[0.12em] text-muted-foreground uppercase">Group by:</span>
            {([
              { key: 'ownerTeam' as GroupBy, label: 'Owner Team' },
              { key: 'urgency' as GroupBy, label: 'Urgency' },
              { key: 'kpiOutcome' as GroupBy, label: 'KPI Outcome' },
            ]).map(opt => (
              <button
                key={opt.key}
                onClick={() => setGroupBy(opt.key)}
                className={`px-2.5 py-1 text-[10px] tracking-wide border transition-colors ${
                  groupBy === opt.key
                    ? 'bg-primary/15 text-primary border-primary/30'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/30'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-4">{actions.length} actions</p>

        <div className="space-y-6">
          {grouped.map(group => (
            <div key={group.key}>
              <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase mb-3">{group.key}</p>
              <div className="bg-card border border-border divide-y divide-border/60">
                {group.items.map((act, i) => (
                  <button key={i} onClick={() => openAction(act)} className="w-full flex items-start gap-4 px-5 py-4 text-left hover:bg-secondary/30 transition-colors group">
                    <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${severityDot(act.priority)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h4 className="text-[13px] text-foreground tracking-wide group-hover:text-primary transition-colors">{act.title}</h4>
                        <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap flex-shrink-0 ${urgencyBadge(act.priority)}`}>{act.priority}</span>
                      </div>
                      <div className="flex gap-4 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                        <span className="flex items-center gap-1">
                          <RiTeamLine className="h-3 w-3" />
                          {act.ownerTeam || act.owner}
                        </span>
                        <span className="text-border">|</span>
                        <span>{act.timeline}</span>
                        {act.kpiOutcome && (
                          <>
                            <span className="text-border">|</span>
                            <span className="text-primary">{act.kpiOutcome}</span>
                          </>
                        )}
                      </div>
                      <p className="text-[11px] text-foreground/60 mt-1 leading-relaxed">{cleanText(act.impact, 120)}</p>
                    </div>
                    <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
