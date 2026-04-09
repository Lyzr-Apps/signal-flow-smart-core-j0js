import dynamic from 'next/dynamic'
import { headers } from 'next/headers'

const AppShell = dynamic(() => import('./sections/AppShell'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
    </div>
  ),
})

export default function Page() {
  // Force dynamic rendering to prevent static prerender errors
  headers()
  return <AppShell />
}
