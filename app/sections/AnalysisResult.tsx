'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ChevronDown, ChevronUp, ArrowLeft, Target, Layers, AlertTriangle, Users } from 'lucide-react'

interface AnalysisData {
  _id?: string
  orchestrator_summary?: string
  specialist_outputs?: any[]
  signal_types?: string[]
  priority_actions?: any[]
  cross_cutting_themes?: string
  createdAt?: string
}

interface AnalysisResultProps {
  analysis: AnalysisData | null
  onBack: () => void
}

function renderMarkdown(text: string) {
  if (!text) return null
  return (
    <div className="space-y-2">
      {text.split('\n').map((line, i) => {
        if (line.startsWith('### '))
          return <h4 key={i} className="font-semibold text-sm mt-3 mb-1">{line.slice(4)}</h4>
        if (line.startsWith('## '))
          return <h3 key={i} className="font-semibold text-base mt-3 mb-1">{line.slice(3)}</h3>
        if (line.startsWith('# '))
          return <h2 key={i} className="font-bold text-lg mt-4 mb-2">{line.slice(2)}</h2>
        if (line.startsWith('- ') || line.startsWith('* '))
          return <li key={i} className="ml-4 list-disc text-sm">{formatInline(line.slice(2))}</li>
        if (/^\d+\.\s/.test(line))
          return <li key={i} className="ml-4 list-decimal text-sm">{formatInline(line.replace(/^\d+\.\s/, ''))}</li>
        if (!line.trim()) return <div key={i} className="h-1" />
        return <p key={i} className="text-sm leading-relaxed">{formatInline(line)}</p>
      })}
    </div>
  )
}

function formatInline(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g)
  if (parts.length === 1) return text
  return parts.map((part, i) =>
    i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
  )
}

function priorityColor(priority: string): string {
  const p = (priority ?? '').toLowerCase()
  if (p.includes('high') || p.includes('critical') || p.includes('urgent')) return 'border-red-500/50 text-red-400'
  if (p.includes('medium') || p.includes('moderate')) return 'border-yellow-500/50 text-yellow-400'
  return 'border-green-500/50 text-green-400'
}

export default function AnalysisResult({ analysis, onBack }: AnalysisResultProps) {
  const [expandedPanels, setExpandedPanels] = useState<Record<number, boolean>>({})

  if (!analysis) {
    return (
      <div className="flex-1 p-8 flex items-center justify-center">
        <p className="text-muted-foreground">No analysis selected.</p>
      </div>
    )
  }

  const togglePanel = (idx: number) => {
    setExpandedPanels(prev => ({ ...prev, [idx]: !prev[idx] }))
  }

  const signalTypes = Array.isArray(analysis?.signal_types) ? analysis.signal_types : []
  const specialistOutputs = Array.isArray(analysis?.specialist_outputs) ? analysis.specialist_outputs : []
  const priorityActions = Array.isArray(analysis?.priority_actions) ? analysis.priority_actions : []

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={onBack} className="mb-6 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <h2 className="font-serif text-2xl tracking-wide">Analysis Result</h2>
          {analysis?.createdAt && (
            <span className="text-xs text-muted-foreground tracking-wide">
              {new Date(analysis.createdAt).toLocaleString()}
            </span>
          )}
        </div>

        {signalTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {signalTypes.map((t: string, i: number) => (
              <Badge key={i} className="bg-primary/20 text-primary border border-primary/40 tracking-wider text-xs">
                <Target className="h-3 w-3 mr-1" />
                {t}
              </Badge>
            ))}
          </div>
        )}

        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="font-serif text-base tracking-wide flex items-center gap-2">
              <Layers className="h-4 w-4 text-primary" />
              Executive Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            {renderMarkdown(analysis?.orchestrator_summary ?? 'No summary available.')}
          </CardContent>
        </Card>

        {specialistOutputs.length > 0 && (
          <div className="mb-6">
            <h3 className="font-serif text-lg tracking-wide mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Specialist Analyses
            </h3>
            <div className="space-y-3">
              {specialistOutputs.map((specialist: any, idx: number) => {
                const isOpen = expandedPanels[idx] ?? false
                const recs = Array.isArray(specialist?.recommendations) ? specialist.recommendations : []
                return (
                  <Collapsible key={idx} open={isOpen} onOpenChange={() => togglePanel(idx)}>
                    <Card className="bg-card border-border">
                      <CollapsibleTrigger asChild>
                        <button className="w-full p-4 flex items-center justify-between text-left hover:bg-secondary/30 transition-colors">
                          <div>
                            <h4 className="font-serif text-sm tracking-wide">{specialist?.agent_name ?? `Specialist ${idx + 1}`}</h4>
                            <p className="text-xs text-muted-foreground tracking-wide mt-0.5">
                              {specialist?.domain ?? 'General'} | Confidence: {specialist?.confidence ?? 'N/A'}
                            </p>
                          </div>
                          {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0 border-t border-border">
                          <div className="mt-4">
                            <p className="text-xs text-muted-foreground tracking-wider uppercase mb-2">Key Findings</p>
                            {renderMarkdown(specialist?.key_findings ?? '')}
                          </div>
                          {recs.length > 0 && (
                            <div className="mt-4">
                              <p className="text-xs text-muted-foreground tracking-wider uppercase mb-2">Recommendations</p>
                              <div className="space-y-2">
                                {recs.map((rec: any, ri: number) => (
                                  <div key={ri} className="p-3 border border-border bg-secondary/20">
                                    <div className="flex items-start justify-between mb-1">
                                      <p className="text-sm font-medium">{rec?.action ?? ''}</p>
                                      <Badge variant="outline" className={`text-[10px] tracking-wider ${priorityColor(rec?.priority ?? '')}`}>
                                        {rec?.priority ?? 'N/A'}
                                      </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground leading-relaxed">{rec?.rationale ?? ''}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                )
              })}
            </div>
          </div>
        )}

        {analysis?.cross_cutting_themes && (
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="font-serif text-base tracking-wide flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                Cross-Cutting Themes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {renderMarkdown(analysis.cross_cutting_themes)}
            </CardContent>
          </Card>
        )}

        {priorityActions.length > 0 && (
          <Card className="bg-card border-border mb-6">
            <CardHeader>
              <CardTitle className="font-serif text-base tracking-wide flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-primary" />
                Priority Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-border">
                    <TableHead className="text-xs tracking-wider text-muted-foreground">Action</TableHead>
                    <TableHead className="text-xs tracking-wider text-muted-foreground">Priority</TableHead>
                    <TableHead className="text-xs tracking-wider text-muted-foreground">Owner</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {priorityActions.map((action: any, idx: number) => (
                    <TableRow key={idx} className="border-border">
                      <TableCell className="text-sm">{action?.action ?? ''}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`text-[10px] tracking-wider ${priorityColor(action?.priority ?? '')}`}>
                          {action?.priority ?? 'N/A'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{action?.owner ?? ''}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
