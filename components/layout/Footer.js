import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="mt-auto py-10" style={{ borderTop: '1px solid var(--border-ghost)' }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg btn-gradient flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 1L8 10M8 10L4.5 6.5M8 10L11.5 6.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M2 12L2 13C2 14.1046 2.89543 15 4 15L12 15C13.1046 15 14 14.1046 14 13L14 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              Dropit
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link href="/tools" className="text-sm transition-colors" style={{ color: 'var(--text-tertiary)' }}>
              Tools
            </Link>
            <Link href="/about" className="text-sm transition-colors" style={{ color: 'var(--text-tertiary)' }}>
              About
            </Link>
            <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>
              Privacy-first file conversion
            </span>
          </div>

          {/* Copyright */}
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            © {new Date().getFullYear()} Dropit. All conversions happen in your browser.
          </p>
        </div>
      </div>
    </footer>
  )
}
