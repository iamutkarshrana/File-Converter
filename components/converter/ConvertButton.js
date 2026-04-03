'use client'

export default function ConvertButton({ onClick, disabled = false, loading = false }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        w-full py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300
        ${disabled || loading
          ? 'opacity-40 cursor-not-allowed'
          : 'btn-gradient hover:shadow-lg active:scale-[0.98]'
        }
      `}
      style={disabled || loading ? { background: 'var(--bg-surface-hover)', color: 'var(--text-tertiary)' } : {}}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
          </svg>
          Converting...
        </span>
      ) : (
        'Convert'
      )}
    </button>
  )
}
