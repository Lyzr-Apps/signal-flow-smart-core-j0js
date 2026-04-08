'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  RiDashboardLine, RiLineChartLine, RiSignalTowerLine, RiFlashlightLine,
  RiFileTextLine, RiRadarLine, RiGlobalLine, RiLoader4Line,
  RiArrowRightUpLine, RiErrorWarningLine, RiCalendarCheckLine,
  RiArrowDownSLine, RiArrowRightSLine,
} from 'react-icons/ri'

interface SidebarProps {
  currentView: string
  onNavigate: (view: string) => void
  onRunAnalysis?: () => void
  agentLoading?: boolean
}

const DEMAND_SUB_ITEMS = [
  { id: 'demand-overview', label: 'Overview', icon: RiLineChartLine },
  { id: 'demand-opportunities', label: 'Opportunities', icon: RiArrowRightUpLine },
  { id: 'demand-risks', label: 'Risks', icon: RiErrorWarningLine },
]

export default function Sidebar({ currentView, onNavigate, onRunAnalysis, agentLoading }: SidebarProps) {
  const isDemandView = currentView.startsWith('demand-')
  const [demandOpen, setDemandOpen] = useState(isDemandView)

  const handleDemandClick = () => {
    if (!demandOpen) {
      setDemandOpen(true)
      onNavigate('demand-overview')
    } else {
      setDemandOpen(false)
    }
  }

  return (
    <aside className="w-60 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="px-5 pt-7 pb-5 border-b border-border">
        <h1 className="font-serif text-[17px] tracking-[0.22em] text-foreground leading-tight">
          L&apos;OR&Eacute;AL
        </h1>
        <p className="text-[17px] font-serif tracking-[0.14em] text-primary mt-0.5 leading-tight">
          Demand Sensor
        </p>
        <p className="text-[9px] tracking-[0.14em] text-muted-foreground uppercase mt-2.5">
          Market Intelligence
        </p>
      </div>

      {/* Run Analysis Button */}
      <div className="px-3 pt-3 pb-1">
        <button
          onClick={onRunAnalysis}
          disabled={agentLoading}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-[11px] tracking-[0.12em] uppercase transition-colors ${agentLoading ? 'bg-primary/50 text-primary-foreground/70 cursor-not-allowed' : 'bg-primary text-primary-foreground hover:bg-primary/90'}`}
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

      <nav className="flex-1 p-3 space-y-0.5">
        {/* Intelligence Hub */}
        <Button
          variant={currentView === 'dashboard' ? 'secondary' : 'ghost'}
          className={`w-full justify-start gap-3 text-[12px] tracking-wide h-9 ${currentView === 'dashboard' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => onNavigate('dashboard')}
        >
          <RiDashboardLine className="h-[14px] w-[14px]" />
          Intelligence Hub
        </Button>

        {/* Demand View with sub-items */}
        <Button
          variant={isDemandView ? 'secondary' : 'ghost'}
          className={`w-full justify-start gap-3 text-[12px] tracking-wide h-9 ${isDemandView ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={handleDemandClick}
        >
          <RiLineChartLine className="h-[14px] w-[14px]" />
          <span className="flex-1 text-left">Demand View</span>
          {demandOpen || isDemandView ? (
            <RiArrowDownSLine className="h-3.5 w-3.5" />
          ) : (
            <RiArrowRightSLine className="h-3.5 w-3.5" />
          )}
        </Button>

        {(demandOpen || isDemandView) && (
          <div className="pl-4 space-y-0.5">
            {DEMAND_SUB_ITEMS.map((item) => {
              const Icon = item.icon
              const isActive = currentView === item.id
              return (
                <Button
                  key={item.id}
                  variant={isActive ? 'secondary' : 'ghost'}
                  className={`w-full justify-start gap-3 text-[11px] tracking-wide h-8 ${isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                  onClick={() => onNavigate(item.id)}
                >
                  <Icon className="h-[13px] w-[13px]" />
                  {item.label}
                </Button>
              )
            })}
          </div>
        )}

        {/* Market Signals */}
        <Button
          variant={currentView === 'market-signals' ? 'secondary' : 'ghost'}
          className={`w-full justify-start gap-3 text-[12px] tracking-wide h-9 ${currentView === 'market-signals' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => onNavigate('market-signals')}
        >
          <RiSignalTowerLine className="h-[14px] w-[14px]" />
          Market Signals
        </Button>

        {/* Recommended Actions */}
        <Button
          variant={currentView === 'actions-list' ? 'secondary' : 'ghost'}
          className={`w-full justify-start gap-3 text-[12px] tracking-wide h-9 ${currentView === 'actions-list' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => onNavigate('actions-list')}
        >
          <RiFlashlightLine className="h-[14px] w-[14px]" />
          Recommended Actions
        </Button>

        {/* Recent Analyses */}
        <Button
          variant={currentView === 'history' ? 'secondary' : 'ghost'}
          className={`w-full justify-start gap-3 text-[12px] tracking-wide h-9 ${currentView === 'history' ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
          onClick={() => onNavigate('history')}
        >
          <RiFileTextLine className="h-[14px] w-[14px]" />
          Recent Analyses
        </Button>
      </nav>

      <div className="px-5 py-4 border-t border-border">
        <p className="text-[9px] text-muted-foreground tracking-[0.15em] uppercase">
          Demand Intelligence Platform
        </p>
      </div>
    </aside>
  )
}
