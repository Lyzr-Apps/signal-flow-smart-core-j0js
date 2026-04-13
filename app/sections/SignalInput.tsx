'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2, Send } from 'lucide-react'

interface SignalInputProps {
  loading: boolean
  error: string | null
  onSubmit: (fields: Record<string, string>, narrative: string) => void
}

const STRUCTURED_FIELDS = [
  { key: 'brand', label: 'Brand', placeholder: 'e.g. Garnier, Maybelline' },
  { key: 'product', label: 'Product', placeholder: 'e.g. Vitamin C Serum' },
  { key: 'ingredient', label: 'Ingredient', placeholder: 'e.g. Niacinamide, Retinol' },
  { key: 'benefit', label: 'Benefit', placeholder: 'e.g. Anti-aging, Hydration' },
  { key: 'market', label: 'Market', placeholder: 'e.g. United States, Northeast, California' },
  { key: 'competitor', label: 'Competitor', placeholder: 'e.g. Estee Lauder, Shiseido' },
  { key: 'performance_issue', label: 'Performance Issue', placeholder: 'e.g. Declining sales in Q4' },
  { key: 'consumer_concern', label: 'Consumer Concern', placeholder: 'e.g. Sustainability, Clean beauty' },
  { key: 'claims_risk', label: 'Claims Risk', placeholder: 'e.g. Efficacy claims under scrutiny' },
]

export default function SignalInput({ loading, error, onSubmit }: SignalInputProps) {
  const [fields, setFields] = useState<Record<string, string>>({})
  const [launchStage, setLaunchStage] = useState('')
  const [narrative, setNarrative] = useState('')

  const updateField = (key: string, value: string) => {
    setFields(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    const allFields = { ...fields }
    if (launchStage) allFields.launch_stage = launchStage
    onSubmit(allFields, narrative)
  }

  const hasContent = Object.values(fields).some(v => v.trim()) || narrative.trim() || launchStage

  return (
    <div className="flex-1 p-8 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-serif text-2xl tracking-wide mb-2">New Signal Analysis</h2>
        <p className="text-sm text-muted-foreground tracking-wide mb-8 leading-relaxed">
          Enter signal details below. All fields are optional -- provide what you have for the most relevant analysis.
        </p>

        {error && (
          <div className="mb-6 p-4 border border-destructive/50 bg-destructive/10 text-sm text-destructive">
            {error}
          </div>
        )}

        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="font-serif text-base tracking-wide">Structured Fields</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {STRUCTURED_FIELDS.map((field) => (
                <div key={field.key}>
                  <Label className="text-xs tracking-wider text-muted-foreground uppercase mb-1.5 block">
                    {field.label}
                  </Label>
                  <Input
                    placeholder={field.placeholder}
                    value={fields[field.key] ?? ''}
                    onChange={(e) => updateField(field.key, e.target.value)}
                    className="bg-secondary/30 border-border"
                    disabled={loading}
                  />
                </div>
              ))}
              <div>
                <Label className="text-xs tracking-wider text-muted-foreground uppercase mb-1.5 block">
                  Launch Stage
                </Label>
                <Select value={launchStage} onValueChange={setLaunchStage} disabled={loading}>
                  <SelectTrigger className="bg-secondary/30 border-border">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pre-Launch">Pre-Launch</SelectItem>
                    <SelectItem value="Launch">Launch</SelectItem>
                    <SelectItem value="Post-Launch">Post-Launch</SelectItem>
                    <SelectItem value="Maturity">Maturity</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border mb-6">
          <CardHeader>
            <CardTitle className="font-serif text-base tracking-wide">Signal Narrative</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Describe the business situation, market signal, or strategic concern in detail..."
              value={narrative}
              onChange={(e) => setNarrative(e.target.value)}
              rows={6}
              className="bg-secondary/30 border-border leading-relaxed"
              disabled={loading}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={loading || !hasContent}
            className="bg-primary text-primary-foreground px-8 tracking-wider"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing Signal...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Analyze Signal
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
