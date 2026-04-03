import { notFound } from 'next/navigation'
import { getToolBySlug, TOOLS } from '@/lib/tools'
import { CATEGORIES } from '@/lib/formats'
import ConversionEngine from '@/components/converter/ConversionEngine'
import MergePdfEngine from '@/components/converter/MergePdfEngine'
import Link from 'next/link'

export async function generateStaticParams() {
  return TOOLS.map(tool => ({ tool: tool.slug }))
}

export async function generateMetadata({ params }) {
  const { tool: slug } = await params
  const tool = getToolBySlug(slug)
  if (!tool) return {}

  return {
    title: `${tool.title} Converter — Free Online | Dropit`,
    description: tool.metaDescription,
  }
}

export default async function ToolPage({ params }) {
  const { tool: slug } = await params
  const tool = getToolBySlug(slug)

  if (!tool) {
    notFound()
  }

  const categoryInfo = CATEGORIES[tool.category]

  return (
    <div className="min-h-[calc(100vh-64px)] px-6 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/tools" className="text-xs font-medium transition-colors" style={{ color: 'var(--text-tertiary)' }}>
            Tools
          </Link>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-tertiary)' }}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
            {tool.title}
          </span>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: 'rgba(59, 130, 246, 0.08)', color: '#3B82F6' }}
          >
            {categoryInfo?.icon} {categoryInfo?.label}
          </span>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-3"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            {tool.title}
          </h1>
          <p className="text-base max-w-md mx-auto" style={{ color: 'var(--text-secondary)' }}>
            {tool.description}
          </p>
        </div>

        {/* Converter */}
        {slug === 'merge-pdf' ? (
          <MergePdfEngine />
        ) : (
          <ConversionEngine
            lockedInput={tool.inputFormat}
            lockedOutput={tool.outputFormat}
          />
        )}

        {/* SEO content */}
        <div className="mt-16 p-6 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            {slug === 'merge-pdf'
              ? 'How to merge PDF files'
              : slug === 'compress-pdf'
              ? 'How to compress a PDF'
              : `How to convert ${tool.inputFormat.toUpperCase()} to ${tool.outputFormat.toUpperCase()}`}
          </h2>
          <ol className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {slug === 'merge-pdf' ? (
              <>
                <li className="flex gap-2">
                  <span className="font-semibold" style={{ color: '#3B82F6' }}>1.</span>
                  Drop multiple PDF files above or click to browse.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold" style={{ color: '#3B82F6' }}>2.</span>
                  Reorder files using the arrow buttons if needed.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold" style={{ color: '#3B82F6' }}>3.</span>
                  Click &quot;Merge&quot; and wait for the progress bar to complete.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold" style={{ color: '#3B82F6' }}>4.</span>
                  Download your merged PDF — done!
                </li>
              </>
            ) : (
              <>
                <li className="flex gap-2">
                  <span className="font-semibold" style={{ color: '#3B82F6' }}>1.</span>
                  Drop your {tool.inputFormat.toUpperCase()} file above or click to browse.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold" style={{ color: '#3B82F6' }}>2.</span>
                  Adjust any conversion settings if needed.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold" style={{ color: '#3B82F6' }}>3.</span>
                  Click &quot;Convert&quot; and wait for the progress bar to complete.
                </li>
                <li className="flex gap-2">
                  <span className="font-semibold" style={{ color: '#3B82F6' }}>4.</span>
                  Download your {tool.outputFormat.toUpperCase()} file — done!
                </li>
              </>
            )}
          </ol>
        </div>

        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: `${tool.title} Converter — Dropit`,
              description: tool.metaDescription,
              applicationCategory: 'UtilitiesApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
            }),
          }}
        />
      </div>
    </div>
  )
}
