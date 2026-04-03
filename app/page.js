import ConversionEngine from '@/components/converter/ConversionEngine'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero section */}
      <section className="pt-20 pb-8 px-6">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#3B82F6' }}>
            Free · Private · Instant
          </p>

          {/* Main heading */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            Convert anything.
          </h1>

          {/* Subtitle */}
          <p className="text-lg max-w-lg mx-auto leading-relaxed mb-12" style={{ color: 'var(--text-secondary)' }}>
            Images, videos, audio, documents — converted in your browser.
            Your files never leave your device.
          </p>
        </div>
      </section>

      {/* Converter section */}
      <section className="px-6 pb-16">
        <div className="max-w-xl mx-auto">
          <ConversionEngine />
        </div>
      </section>

      {/* Privacy badges */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                ),
                title: '100% Private',
                description: 'Files never leave your device for image, video, and audio conversions.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                ),
                title: 'Lightning Fast',
                description: 'WebAssembly-powered conversions run at near-native speed, right in your browser.',
              },
              {
                icon: (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                ),
                title: 'No Sign Up',
                description: 'No account required. No limits for browser conversions. Just convert and go.',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl text-center"
                style={{ background: 'var(--bg-surface)' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(59, 130, 246, 0.08)' }}>
                  {item.icon}
                </div>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  {item.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Supported formats overview */}
      <section className="px-6 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#3B82F6' }}>
            Supported Formats
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-8" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            50+ formats. Every category.
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { icon: '🖼️', label: 'Images', formats: 'JPG, PNG, WebP, AVIF, HEIC, GIF, SVG' },
              { icon: '🎬', label: 'Video', formats: 'MP4, WebM, MOV, AVI, MKV, GIF' },
              { icon: '🎵', label: 'Audio', formats: 'MP3, WAV, AAC, OGG, FLAC, M4A' },
              { icon: '📄', label: 'Documents', formats: 'PDF, DOCX, XLSX, CSV, PPTX' },
              { icon: '📚', label: 'eBooks', formats: 'EPUB, MOBI, AZW3' },
              { icon: '📦', label: 'Archives', formats: 'ZIP extract & create' },
            ].map((cat, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl"
                style={{ background: 'var(--bg-surface)' }}
              >
                <span className="text-2xl block mb-2">{cat.icon}</span>
                <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{cat.label}</h3>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>{cat.formats}</p>
              </div>
            ))}
          </div>

          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 mt-8 text-sm font-medium transition-colors"
            style={{ color: '#3B82F6' }}
          >
            View all tools
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  )
}
