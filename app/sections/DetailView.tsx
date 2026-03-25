'use client'

import React from 'react'
import SignalWorkspace from './detail/SignalWorkspace'
import RiskWorkspace from './detail/RiskWorkspace'
import AlertWorkspace from './detail/AlertWorkspace'
import ActionWorkspace from './detail/ActionWorkspace'

export interface DetailItem {
  category: 'signal' | 'action' | 'opportunity' | 'risk' | 'alert' | 'analysis'
  title: string
  brand?: string
  market?: string
  severity?: string
  sections: { label: string; content: string }[]
  relatedActions?: { action: string; priority: string; owner?: string; rationale?: string }[]
  sourceAnalysisId?: string
}

interface DetailViewProps {
  item: DetailItem
  onBack: () => void
  onViewAnalysis?: (id: string) => void
}

export default function DetailView({ item, onBack }: DetailViewProps) {
  switch (item.category) {
    case 'signal':
    case 'opportunity':
      return <SignalWorkspace item={item} onBack={onBack} />
    case 'risk':
      return <RiskWorkspace item={item} onBack={onBack} />
    case 'alert':
      return <AlertWorkspace item={item} onBack={onBack} />
    case 'action':
      return <ActionWorkspace item={item} onBack={onBack} />
    case 'analysis':
      return <SignalWorkspace item={item} onBack={onBack} />
    default:
      return <SignalWorkspace item={item} onBack={onBack} />
  }
}
