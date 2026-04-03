'use client'

import { useMemo } from 'react'
import { getExtension, getOutputFormats, CATEGORIES } from '@/lib/formats'

export default function FormatSelector({ file, outputFormat, onOutputChange, lockedOutput = null }) {
  const inputExt = file ? getExtension(file.name) : null

  const formatInfo = useMemo(() => {
    if (!inputExt) return null
    return getOutputFormats(inputExt)
  }, [inputExt])

  if (!file || !formatInfo) return null

  const { category, formats } = formatInfo
  const categoryInfo = CATEGORIES[category]

  // If output is locked (from tool page), just show it
  if (lockedOutput) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
        <div className="flex items-center gap-2 flex-1">
          <span className="text-xs font-medium uppercase px-2 py-1 rounded-lg" style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-tertiary)' }}>
            {inputExt}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-tertiary)' }}>
            <polyline points="9 18 15 12 9 6" />
          </svg>
          <span className="text-xs font-bold uppercase px-2 py-1 rounded-lg text-white" style={{ background: '#3B82F6' }}>
            {lockedOutput}
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
          {categoryInfo?.icon} {categoryInfo?.label}
        </span>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs font-medium" style={{ color: 'var(--text-tertiary)' }}>
          {categoryInfo?.icon} Convert to
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {formats.map(fmt => (
          <button
            key={fmt}
            onClick={() => onOutputChange(fmt)}
            className={`
              px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase transition-all duration-200
              ${outputFormat === fmt ? 'text-white shadow-lg' : ''}
            `}
            style={outputFormat === fmt
              ? { background: 'linear-gradient(135deg, #3B82F6, #2563EB)' }
              : { background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }
            }
          >
            {fmt}
          </button>
        ))}
      </div>
    </div>
  )
}
