'use client'

import React, { useState } from 'react'
import { LoginForm, RegisterForm } from 'lyzr-architect/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AuthScreen() {
  const [mode, setMode] = useState<'login' | 'register'>('login')

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl tracking-widest text-foreground mb-2">
            L&apos;OR&Eacute;AL
          </h1>
          <p className="text-muted-foreground text-sm tracking-widest uppercase">
            Demand Sensor
          </p>
        </div>
        <Card className="border-border bg-card">
          <CardHeader className="text-center">
            <CardTitle className="font-serif text-xl tracking-wide">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {mode === 'login' ? (
              <LoginForm onSwitchToRegister={() => setMode('register')} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setMode('login')} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
