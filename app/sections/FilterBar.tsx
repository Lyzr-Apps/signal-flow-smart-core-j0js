'use client'

import React from 'react'
import { RiFilterLine, RiGlobalLine, RiLoader4Line } from 'react-icons/ri'
import {
  BRANDS, CATEGORIES, REGIONS, STATES_BY_REGION,
  type FilterState,
} from './data/seededScenarios'

interface FilterBarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onRunAnalysis?: () => void
  agentLoading?: boolean
}

export default function FilterBar({ filters, onChange, onRunAnalysis, agentLoading }: FilterBarProps) {
  const update = (key: keyof FilterState, value: string) => {
    const next = { ...filters, [key]: value }
    // Reset state when region changes
    if (key === 'region') {
      next.state = ''
    }
    onChange(next)
  }

  const showState = filters.region && filters.region !== 'All Regions' && filters.region !== 'National'
  const stateOptions = showState ? STATES_BY_REGION[filters.region] || [] : []

  const selectClass = "bg-secondary/50 border border-border text-[11px] tracking-wide text-foreground px-2.5 py-1.5 focus:outline-none focus:border-primary/40 transition-colors appearance-none cursor-pointer"

  const hasActiveFilters = filters.brand !== 'All Brands' || filters.category !== 'All Categories' || filters.region !== 'All Regions' || filters.state !== ''

  return (
    <div className="px-6 py-2.5 border-b border-border bg-card/50 flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1.5 text-[10px] tracking-[0.12em] text-muted-foreground uppercase flex-shrink-0">
        <RiFilterLine className="h-3.5 w-3.5" />
        <span>Filters</span>
      </div>

      <select value={filters.brand} onChange={e => update('brand', e.target.value)} className={selectClass}>
        {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
      </select>

      <select value={filters.category} onChange={e => update('category', e.target.value)} className={selectClass}>
        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select value={filters.region} onChange={e => update('region', e.target.value)} className={selectClass}>
        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
      </select>

      {showState && (
        <select value={filters.state} onChange={e => update('state', e.target.value)} className={selectClass}>
          <option value="">All States</option>
          {stateOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      )}

      {hasActiveFilters && (
        <button
          onClick={() => onChange({ brand: 'All Brands', category: 'All Categories', region: 'All Regions', state: '' })}
          className="text-[10px] tracking-[0.1em] text-primary uppercase hover:text-primary/80 transition-colors"
        >
          Clear All
        </button>
      )}

      <div className="ml-auto flex-shrink-0">
        <button
          onClick={onRunAnalysis}
          disabled={agentLoading}
          className={`flex items-center gap-2 px-4 py-1.5 text-[11px] tracking-[0.12em] uppercase transition-colors ${agentLoading ? 'bg-primary/50 text-primary-foreground/70 cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
        >
          {agentLoading ? (
            <>
              <RiLoader4Line className="h-3.5 w-3.5 animate-spin" />
              Scanning...
            </>
          ) : (
            <>
              <RiGlobalLine className="h-3.5 w-3.5" />
              Run Analysis
            </>
          )}
        </button>
      </div>
    </div>
  )
}
