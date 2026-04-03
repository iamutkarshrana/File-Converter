'use client'

import { formatFileSize } from '@/lib/formats'

export default function DownloadButton({ file, onReset }) {
  if (!file) return null

  const handleDownload = () => {
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 rounded-2xl text-center" style={{ background: 'var(--bg-surface)' }}>
      {/* Success icon */}
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
        style={{ background: 'rgba(16, 185, 129, 0.1)' }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>

      <p className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
        Conversion complete
      </p>
      <p className="text-sm mb-5" style={{ color: 'var(--text-tertiary)' }}>
        {file.name} · {formatFileSize(file.size)}
      </p>

      {/* Download button */}
      <button
        onClick={handleDownload}
        className="w-full py-3.5 rounded-full text-sm font-semibold text-white btn-gradient hover:shadow-lg transition-all active:scale-[0.98] mb-3"
      >
        <span className="flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download {file.name}
        </span>
      </button>

      {/* Convert another */}
      <button
        onClick={onReset}
        className="w-full py-3 rounded-full text-sm font-medium transition-all"
        style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }}
      >
        Convert another file
      </button>
    </div>
  )
}
