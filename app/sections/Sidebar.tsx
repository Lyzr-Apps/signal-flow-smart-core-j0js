'use client'

import React from 'react'
import { LayoutDashboard, PlusCircle, History, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  currentView: string
  onNavigate: (view: string) => void
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'new-signal', label: 'New Signal', icon: PlusCircle },
  { id: 'history', label: 'Analysis History', icon: History },
]

export default function Sidebar({ currentView, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <h1 className="font-serif text-lg tracking-widest text-foreground">
          L&apos;OR&Eacute;AL
        </h1>
        <p className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase mt-1">
          Dynamic Foresight System
        </p>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          return (
            <Button
              key={item.id}
              variant={isActive ? 'secondary' : 'ghost'}
              className={`w-full justify-start gap-3 text-sm tracking-wide ${isActive ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => onNavigate(item.id)}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          )
        })}
      </nav>
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Activity className="h-3 w-3" />
          <span className="tracking-wide">Signal Orchestrator</span>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1 tracking-wide">
          Powered by AI Foresight
        </p>
      </div>
    </aside>
  )
}
