'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PlusCircle, BarChart3, TrendingUp, Loader2 } from 'lucide-react'

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

interface DashboardProps {
  analyses: AnalysisItem[]
  loading: boolean
  onNavigate: (view: string) => void
  onViewAnalysis: (analysis: AnalysisItem) => void
}

function renderMarkdownPreview(text: string, maxLen: number = 150) {
  if (!text) return ''
  const clean = text.replace(/[#*\-]/g, '').replace(/\n/g, ' ').trim()
  return clean.length > maxLen ? clean.slice(0, maxLen) + '...' : clean
}

export default function Dashboard({ analyses, loading, onNavigate, onViewAnalysis }: DashboardProps) {
  const safeAnalyses = Array.isArray(analyses) ? analyses : []

  const signalTypeCounts: Record<string, number> = {}
  safeAnalyses.forEach((a) => {
    if (Array.isArray(a?.signal_types)) {
      a.signal_types.forEach((t: string) => {
        signalTypeCounts[t] = (signalTypeCounts[t] || 0) + 1
      })
    }
  })
  const topTypes = Object.entries(signalTypeCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-serif text-2xl tracking-wide mb-8">Dashboard</h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="font-serif text-lg tracking-wide">Recent Analyses</CardTitle>
                <Badge variant="secondary" className="text-xs">{safeAnalyses.length} total</Badge>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : safeAnalyses.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-sm tracking-wide mb-4">
                      No analyses yet. Submit your first signal to get started.
                    </p>
                    <Button onClick={() => onNavigate('new-signal')} className="bg-primary text-primary-foreground">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      New Signal
                    </Button>
                  </div>
                ) : (
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {safeAnalyses.slice(0, 10).map((analysis, idx) => (
                        <button
                          key={analysis?._id ?? idx}
                          className="w-full text-left p-4 border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors"
                          onClick={() => onViewAnalysis(analysis)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex flex-wrap gap-1">
                              {Array.isArray(analysis?.signal_types) && analysis.signal_types.map((t: string, i: number) => (
                                <Badge key={i} variant="outline" className="text-[10px] tracking-wider border-primary/40 text-primary">
                                  {t}
                                </Badge>
                              ))}
                            </div>
                            <span className="text-[10px] text-muted-foreground tracking-wide">
                              {analysis?.createdAt ? new Date(analysis.createdAt).toLocaleDateString() : ''}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/80 leading-relaxed">
                            {renderMarkdownPreview(analysis?.orchestrator_summary ?? '')}
                          </p>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="text-center">
                  <PlusCircle className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h3 className="font-serif text-base tracking-wide mb-2">New Signal</h3>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed tracking-wide">
                    Submit a beauty business signal for multi-agent foresight analysis
                  </p>
                  <Button onClick={() => onNavigate('new-signal')} className="w-full bg-primary text-primary-foreground">
                    Analyze Signal
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="font-serif text-sm tracking-wide flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground tracking-wide">Total Analyses</span>
                  <span className="text-lg font-serif text-foreground">{safeAnalyses.length}</span>
                </div>
                {topTypes.length > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground tracking-wide mb-2 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      Top Signal Types
                    </p>
                    <div className="space-y-1">
                      {topTypes.map(([type, count]) => (
                        <div key={type} className="flex justify-between items-center text-xs">
                          <span className="text-foreground/80">{type}</span>
                          <Badge variant="secondary" className="text-[10px]">{count}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
