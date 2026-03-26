'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { RiDashboardLine, RiFlashlightLine, RiArrowRightUpLine, RiErrorWarningLine, RiShieldLine, RiFileTextLine, RiRadarLine, RiGlobalLine, RiLoader4Line } from 'react-icons/ri'

interface SidebarProps {
  currentView: string
  onNavigate: (view: string) => void
  onRunAnalysis?: () => void
  agentLoading?: boolean
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Intelligence Hub', icon: RiDashboardLine },
  { id: 'actions-list', label: 'Recommended Actions', icon: RiFlashlightLine },
  { id: 'opportunities-list', label: 'Active Opportunities', icon: RiArrowRightUpLine },
  { id: 'risks-list', label: 'Launch Risks', icon: RiErrorWarningLine },
  { id: 'alerts-list', label: 'Claims / Reputation', icon: RiShieldLine },
  { id: 'history', label: 'Recent Analyses', icon: RiFileTextLine },
]

export default function Sidebar({ currentView, onNavigate, onRunAnalysis, agentLoading }: SidebarProps) {
  return (
    <aside className="w-60 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="px-5 pt-7 pb-5 border-b border-border">
        <h1 className="font-serif text-[17px] tracking-[0.22em] text-foreground leading-tight">
          L&apos;OR&Eacute;AL
        </h1>
        <p className="text-[17px] font-serif tracking-[0.14em] text-primary mt-0.5 leading-tight">
          Foresight
        </p>
        <div className="flex items-center gap-1.5 mt-2.5">
          <RiRadarLine className="h-3 w-3 text-muted-foreground" />
          <p className="text-[9px] tracking-[0.18em] text-muted-foreground uppercase">
            Powered by BlueVerse
          </p>
        </div>
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
              Searching...
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
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <Button
              key={item.id}
              variant={isActive ? 'secondary' : 'ghost'}
              className={`w-full justify-start gap-3 text-[12px] tracking-wide h-9 ${isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="h-[14px] w-[14px]" />
              {item.label}
            </Button>
          )
        })}
      </nav>
      <div className="px-5 py-4 border-t border-border">
        <p className="text-[9px] text-muted-foreground tracking-[0.15em] uppercase">
          Strategic Intelligence Platform
        </p>
      </div>
    </aside>
  )
}
