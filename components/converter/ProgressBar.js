'use client'

export default function ProgressBar({ progress, status = 'Converting...' }) {
  return (
    <div className="p-4 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
      {/* Status text */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          {status}
        </span>
        <span className="text-sm font-semibold" style={{ color: '#3B82F6' }}>
          {progress}%
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface-hover)' }}>
        <div
          className="h-full rounded-full relative progress-shine transition-all duration-300 ease-out"
          style={{
            width: `${progress}%`,
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
          }}
        />
      </div>

      {/* Privacy note */}
      <p className="text-xs mt-3 flex items-center gap-1.5" style={{ color: 'var(--text-tertiary)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
        Processing locally — your file never leaves this device
      </p>
    </div>
  )
}
