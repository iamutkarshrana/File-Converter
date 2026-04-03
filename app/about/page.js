import Link from 'next/link'

export const metadata = {
  title: 'About — Dropit',
  description: 'Learn how Dropit converts your files privately in the browser using WebAssembly. No uploads, no accounts, no tracking.',
}

export default function AboutPage() {
  return (
    <div className="min-h-[calc(100vh-64px)] px-6 py-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: '#3B82F6' }}>
            About
          </p>
          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}
          >
            Privacy-first file conversion
          </h1>
          <p className="text-base leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Dropit converts your files directly in your browser using WebAssembly technology.
            Your images, videos, and audio files never leave your device — everything happens
            locally on your machine.
          </p>
        </div>

        {/* How it works */}
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            How it works
          </h2>

          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'You select a file',
                description: 'Drag and drop or browse to select your file. It stays on your device.',
              },
              {
                step: '02',
                title: 'Browser-side processing',
                description: 'For images, video, and audio — FFmpeg.wasm runs entirely in your browser via WebAssembly. No server involved.',
              },
              {
                step: '03',
                title: 'Instant download',
                description: 'Your converted file is ready to download immediately. Nothing was uploaded anywhere.',
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 p-5 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
                <span className="text-2xl font-bold flex-shrink-0" style={{ color: 'rgba(59, 130, 246, 0.2)' }}>
                  {item.step}
                </span>
                <div>
                  <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-tertiary)' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Supported formats */}
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Supported formats
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                category: 'Images',
                icon: '🖼️',
                formats: 'JPG, JPEG, PNG, WebP, AVIF, HEIC, HEIF, GIF, BMP, TIFF, SVG, CR2, NEF, ARW, DNG',
                note: 'All browser-side',
              },
              {
                category: 'Video',
                icon: '🎬',
                formats: 'MP4, WebM, MOV, AVI, MKV, FLV, GIF',
                note: 'All browser-side via FFmpeg.wasm',
              },
              {
                category: 'Audio',
                icon: '🎵',
                formats: 'MP3, WAV, AAC, OGG, FLAC, M4A, OPUS, WMA',
                note: 'All browser-side',
              },
              {
                category: 'Documents',
                icon: '📄',
                formats: 'PDF, DOCX, XLSX, CSV, ODS, PPTX, ODT, RTF, TXT, HTML',
                note: 'Spreadsheets: browser-side. DOCX↔PDF: CloudConvert API',
              },
              {
                category: 'eBooks',
                icon: '📚',
                formats: 'EPUB, MOBI, AZW3',
                note: 'Via CloudConvert API',
              },
              {
                category: 'Archives',
                icon: '📦',
                formats: 'ZIP (extract & create)',
                note: 'Browser-side',
              },
            ].map((cat, i) => (
              <div key={i} className="p-5 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{cat.icon}</span>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>{cat.category}</h3>
                </div>
                <p className="text-xs leading-relaxed mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {cat.formats}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {cat.note}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy policy */}
        <section className="mb-16">
          <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
            Privacy policy
          </h2>

          <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Image, video, and audio conversions</strong> are processed
                  entirely in your browser using WebAssembly. Your files never leave your device. No data is
                  sent to any server.
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>Document conversions</strong> (DOCX↔PDF, PPTX↔PDF, etc.)
                  use CloudConvert&apos;s secure API. Files are transmitted securely via HTTPS and are
                  deleted immediately after conversion. CloudConvert is GDPR-compliant.
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
              <div className="flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div>
                  <strong style={{ color: 'var(--text-primary)' }}>No account required.</strong> No file size limits for
                  browser-based conversions. No tracking. No cookies beyond theme preference.
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold text-white btn-gradient hover:shadow-lg transition-all"
          >
            Start converting
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
