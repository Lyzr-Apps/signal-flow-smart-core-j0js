import dynamic from 'next/dynamic'

export const revalidate = 0

const AppShell = dynamic(() => import('./sections/AppShell'), {
  ssr: false,
  loading: () => (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        width: 20, height: 20,
        border: '2px solid rgba(0,0,0,0.1)',
        borderTopColor: '#000',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  ),
})

export default function Page() {
  return <AppShell />
}
