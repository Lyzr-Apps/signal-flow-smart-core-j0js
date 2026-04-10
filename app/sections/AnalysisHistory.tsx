'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Filter, Loader2 } from 'lucide-react'

interface AnalysisItem {
  _id?: string
  signal_id?: string
  orchestrator_summary?: string
  specialist_outputs?: any[]
  signal_types?: string[]
  priority_actions?: any[]
  cross_cutting_themes?: string
  createdAt?: string
}

interface AnalysisHistoryProps {
  analyses: AnalysisItem[]
  loading: boolean
  onViewAnalysis: (analysis: AnalysisItem) => void
}

const FILTER_TYPES = ['All', 'Opportunity', 'Competitive', 'Launch', 'Claims', 'Risk', 'Consumer']

function renderMarkdownPreview(text: string, maxLen: number = 180) {
  if (!text) return ''
  const clean = text.replace(/[#*\-]/g, '').replace(/\[(\d+)\]/g, '').replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim()
  if (maxLen > 0 && clean.length > maxLen) {
    const sentenceEnd = clean.lastIndexOf('.', maxLen)
    if (sentenceEnd > maxLen * 0.5) return clean.slice(0, sentenceEnd + 1).trim()
    const wordEnd = clean.lastIndexOf(' ', maxLen)
    return clean.slice(0, wordEnd > maxLen * 0.5 ? wordEnd : maxLen).trim()
  }
  return clean
}

export default function AnalysisHistory({ analyses, loading, onViewAnalysis }: AnalysisHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')

  const safeAnalyses = Array.isArray(analyses) ? analyses : []

  const filtered = safeAnalyses.filter((a) => {
    const matchesSearch = !searchQuery ||
      (a?.orchestrator_summary ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(a?.signal_types) && a.signal_types.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())))

    const matchesFilter = activeFilter === 'All' ||
      (Array.isArray(a?.signal_types) && a.signal_types.some((t: string) => t.toLowerCase().includes(activeFilter.toLowerCase())))

    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-2xl tracking-wide mb-8">Analysis History</h2>

        <div className="mb-6 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search analyses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-secondary/30 border-border"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="h-3.5 w-3.5 text-muted-foreground" />
            {FILTER_TYPES.map((ft) => (
              <Button
                key={ft}
                variant={activeFilter === ft ? 'default' : 'outline'}
                size="sm"
                className={`text-xs tracking-wider ${activeFilter === ft ? 'bg-primary text-primary-foreground' : 'border-border text-muted-foreground hover:text-foreground'}`}
                onClick={() => setActiveFilter(ft)}
              >
                {ft}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground text-sm tracking-wide">
                {searchQuery || activeFilter !== 'All' ? 'No analyses match your filters.' : 'No analyses found.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filtered.map((analysis, idx) => (
                <button
                  key={analysis?._id ?? idx}
                  className="w-full text-left"
                  onClick={() => onViewAnalysis(analysis)}
                >
                  <Card className="bg-card border-border hover:bg-secondary/30 transition-colors">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex flex-wrap gap-1.5">
                          {Array.isArray(analysis?.signal_types) && analysis.signal_types.map((t: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-[10px] tracking-wider border-primary/40 text-primary">
                              {t}
                            </Badge>
                          ))}
                        </div>
                        <span className="text-[10px] text-muted-foreground tracking-wide whitespace-nowrap ml-4">
                          {analysis?.createdAt ? new Date(analysis.createdAt).toLocaleDateString() : ''}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80 leading-relaxed">
                        {renderMarkdownPreview(analysis?.orchestrator_summary ?? '')}
                      </p>
                      {(analysis?.priority_actions?.length ?? 0) > 0 && (
                        <p className="text-[10px] text-muted-foreground mt-2 tracking-wide">
                          {analysis?.priority_actions?.length} priority action{(analysis?.priority_actions?.length ?? 0) > 1 ? 's' : ''}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </button>
              ))}
            </div>
          </ScrollArea>
        )}
      </div>
    </div>
  )
}
