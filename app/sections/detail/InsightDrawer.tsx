'use client'

import React, { useState, useEffect } from 'react'
import { RiCloseLine, RiExchangeLine, RiLineChartLine, RiFlashlightLine, RiLinksLine, RiExternalLinkLine } from 'react-icons/ri'
import type { WhyItMattersItem } from '../data/seededScenarios'

const TABS = [
  { id: 'what-changed', label: 'What Changed', icon: RiExchangeLine },
  { id: 'demand-impact', label: 'Demand Impact', icon: RiLineChartLine },
  { id: 'how-to-act', label: 'How to Act', icon: RiFlashlightLine },
  { id: 'sources', label: 'Sources', icon: RiLinksLine },
] as const

type TabId = typeof TABS[number]['id']

interface InsightDrawerProps {
  item: WhyItMattersItem
  onClose: () => void
  initialTab?: TabId
}

export default function InsightDrawer({ item, onClose, initialTab = 'what-changed' }: InsightDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabId>(initialTab)

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab, item])

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full max-w-[480px] h-full bg-card border-l border-border flex flex-col animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex-shrink-0">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] tracking-[0.14em] text-primary uppercase mb-1.5">Insight Detail</p>
              <h3 className="text-[14px] font-serif text-foreground leading-snug tracking-wide">{item.title}</h3>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 mt-1">
              <RiCloseLine className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border flex-shrink-0">
          {TABS.map(tab => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[10px] tracking-[0.1em] uppercase transition-colors border-b-2 ${
                  isActive
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {activeTab === 'what-changed' && (
            <div>
              <h4 className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase mb-3">What Changed</h4>
              <p className="text-[13px] text-foreground/80 leading-relaxed tracking-wide">{item.whatChanged}</p>
              {item.dataPoint && (
                <div className="mt-4 bg-secondary/50 border border-border p-3">
                  <p className="text-[10px] tracking-[0.1em] text-muted-foreground uppercase mb-1">Key Metric</p>
                  <p className="text-[12px] text-primary tracking-wide">{item.dataPoint}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'demand-impact' && (
            <div>
              <h4 className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase mb-3">Demand Impact</h4>
              <p className="text-[13px] text-foreground/80 leading-relaxed tracking-wide">{item.demandImpact}</p>
            </div>
          )}

          {activeTab === 'how-to-act' && (
            <div>
              <h4 className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase mb-3">How to Act</h4>
              <div className="space-y-3">
                {item.howToAct.split('. ').filter(Boolean).map((action, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <RiFlashlightLine className="h-3.5 w-3.5 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-[12px] text-foreground/80 leading-relaxed tracking-wide">{action.endsWith('.') ? action : action + '.'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'sources' && (
            <div>
              <h4 className="text-[11px] tracking-[0.12em] text-muted-foreground uppercase mb-3">Supporting Sources</h4>
              {item.sources.length > 0 ? (
                <div className="space-y-3">
                  {item.sources.map((src, i) => (
                    <div key={i} className="bg-secondary/50 border border-border p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] text-foreground tracking-wide leading-snug">{src.title}</p>
                          <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mt-1">{src.type}</p>
                        </div>
                        {src.url && (
                          <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 flex-shrink-0">
                            <RiExternalLinkLine className="h-3.5 w-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-muted-foreground tracking-wide">No specific sources available for this insight.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
