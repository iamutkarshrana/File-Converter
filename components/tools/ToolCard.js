import Link from 'next/link'

const categoryColors = {
  image: { bg: 'rgba(59, 130, 246, 0.08)', text: '#3B82F6', border: 'rgba(59, 130, 246, 0.15)' },
  video: { bg: 'rgba(139, 92, 246, 0.08)', text: '#8B5CF6', border: 'rgba(139, 92, 246, 0.15)' },
  audio: { bg: 'rgba(245, 158, 11, 0.08)', text: '#F59E0B', border: 'rgba(245, 158, 11, 0.15)' },
  document: { bg: 'rgba(16, 185, 129, 0.08)', text: '#10B981', border: 'rgba(16, 185, 129, 0.15)' },
  ebook: { bg: 'rgba(236, 72, 153, 0.08)', text: '#EC4899', border: 'rgba(236, 72, 153, 0.15)' },
  archive: { bg: 'rgba(107, 114, 128, 0.08)', text: '#6B7280', border: 'rgba(107, 114, 128, 0.15)' },
}

const categoryIcons = {
  image: '🖼️',
  video: '🎬',
  audio: '🎵',
  document: '📄',
  ebook: '📚',
  archive: '📦',
}

export default function ToolCard({ tool }) {
  const colors = categoryColors[tool.category] || categoryColors.document

  return (
    <Link href={`/tools/${tool.slug}`} className="block group">
      <div
        className="p-5 rounded-2xl transition-all duration-200 h-full surface-hover"
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-ghost)',
        }}
      >
        {/* Category badge */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full capitalize"
            style={{ background: colors.bg, color: colors.text }}
          >
            {categoryIcons[tool.category]} {tool.category}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-semibold mb-1.5 group-hover:text-blue-500 transition-colors" style={{ color: 'var(--text-primary)' }}>
          {tool.title}
        </h3>

        {/* Description */}
        <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
          {tool.description}
        </p>

        {/* Arrow */}
        <div className="mt-3 flex items-center gap-1 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#3B82F6' }}>
          Convert now
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
