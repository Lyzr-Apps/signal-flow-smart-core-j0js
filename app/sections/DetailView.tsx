'use client'

import React from 'react'
import InsightWorkspace from './detail/InsightWorkspace'
import ActionWorkspace from './detail/ActionWorkspace'
import type { InsightMetrics } from './data/seededScenarios'

export interface DetailItem {
  category: 'signal' | 'action' | 'opportunity' | 'risk' | 'alert' | 'analysis'
  title: string
  brand?: string
  market?: string
  severity?: string
  sections: { label: string; content: string }[]
  relatedActions?: { action: string; priority: string; owner?: string; rationale?: string }[]
  sourceAnalysisId?: string
  metrics?: InsightMetrics
}

interface DetailViewProps {
  item: DetailItem
  onBack: () => void
  onViewAnalysis?: (id: string) => void
}

export default function DetailView({ item, onBack }: DetailViewProps) {
  switch (item.category) {
    case 'action':
      return <ActionWorkspace item={item} onBack={onBack} />
    case 'signal':
    case 'opportunity':
    case 'risk':
    case 'alert':
    case 'analysis':
    default:
      return <InsightWorkspace item={item} onBack={onBack} />
  }
}
