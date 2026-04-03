import ToolGrid from '@/components/tools/ToolGrid'

export const metadata = {
  title: 'All Conversion Tools — Dropit',
  description: 'Browse 40+ free file conversion tools. Convert images, videos, audio, documents, and eBooks instantly in your browser.',
}

export default function ToolsPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] px-6 py-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#3B82F6' }}>
            Tools
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            Every conversion you need
          </h1>
          <p className="text-base max-w-lg" style={{ color: 'var(--text-secondary)' }}>
            Pick a specific tool for your conversion. Each one is optimized for that exact format pair.
          </p>
        </div>

        {/* Tools grid */}
        <ToolGrid />
      </div>
    </div>
  )
}
