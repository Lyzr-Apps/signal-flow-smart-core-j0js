'use client'

import React from 'react'
import { RiFilterLine } from 'react-icons/ri'
import {
  extractBrands, extractCategories, extractCountries, extractRegions,
  type FilterState,
} from './data/seededScenarios'

interface FilterBarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  const brands = extractBrands()
  const categories = extractCategories()
  const countries = extractCountries()
  const regions = extractRegions()

  const update = (key: keyof FilterState, value: string) => {
    onChange({ ...filters, [key]: value })
  }

  const selectClass = "bg-secondary/50 border border-border text-[11px] tracking-wide text-foreground px-2.5 py-1.5 focus:outline-none focus:border-primary/40 transition-colors appearance-none cursor-pointer"

  return (
    <div className="px-6 py-2.5 border-b border-border bg-card/50 flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-1.5 text-[10px] tracking-[0.12em] text-muted-foreground uppercase flex-shrink-0">
        <RiFilterLine className="h-3.5 w-3.5" />
        <span>Filters</span>
      </div>

      <select value={filters.brand} onChange={e => update('brand', e.target.value)} className={selectClass}>
        {brands.map(b => <option key={b} value={b}>{b}</option>)}
      </select>

      <select value={filters.category} onChange={e => update('category', e.target.value)} className={selectClass}>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select value={filters.country} onChange={e => update('country', e.target.value)} className={selectClass}>
        {countries.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      <select value={filters.region} onChange={e => update('region', e.target.value)} className={selectClass}>
        {regions.map(r => <option key={r} value={r}>{r}</option>)}
      </select>

      {(filters.brand !== 'All Brands' || filters.category !== 'All Categories' || filters.country !== 'All Countries' || filters.region !== 'All Regions') && (
        <button
          onClick={() => onChange({ brand: 'All Brands', category: 'All Categories', country: 'All Countries', region: 'All Regions' })}
          className="text-[10px] tracking-[0.1em] text-primary uppercase hover:text-primary/80 transition-colors ml-1"
        >
          Clear All
        </button>
      )}
    </div>
  )
}
