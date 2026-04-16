'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  RiDashboardLine, RiSignalTowerLine, RiFlashlightLine,
} from 'react-icons/ri'

interface SidebarProps {
  currentView: string
  onNavigate: (view: string) => void
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: RiDashboardLine },
  { id: 'signals', label: 'Signals', icon: RiSignalTowerLine },
  { id: 'actions', label: 'Actions', icon: RiFlashlightLine },
]

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <aside className="w-60 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="px-5 pt-7 pb-5 border-b border-border">
        <h1 className="font-serif text-[17px] tracking-[0.22em] text-foreground leading-tight">
          L&apos;OR&Eacute;AL
        </h1>
        <p className="text-[17px] font-serif tracking-[0.14em] text-primary mt-0.5 leading-tight">
          White Space Finder
        </p>
        <p className="text-[9px] tracking-[0.14em] text-muted-foreground uppercase mt-2.5">
          Market Intelligence
        </p>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {NAV_ITEMS.map(item => {
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
          Whitespace Intelligence Platform
        </p>
      </div>
    </aside>
  )
}
