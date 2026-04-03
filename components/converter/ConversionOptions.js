'use client'

import { detectCategory, getExtension } from '@/lib/formats'

export default function ConversionOptions({ file, outputFormat, options, onOptionsChange }) {
  if (!file || !outputFormat) return null

  const ext = getExtension(file.name)
  const category = detectCategory(ext)

  // Determine which options to show based on category
  switch (category) {
    case 'image':
      return <ImageOptions options={options} onChange={onOptionsChange} />
    case 'video':
      return <VideoOptions options={options} onChange={onOptionsChange} file={file} />
    case 'audio':
      return <AudioOptions options={options} onChange={onOptionsChange} />
    case 'document':
      if (outputFormat === 'pdf' && ext === 'pdf') {
        return <PdfOptions options={options} onChange={onOptionsChange} />
      }
      return null
    default:
      return null
  }
}

function ImageOptions({ options, onChange }) {
  const quality = options.quality ?? 90
  const width = options.width ?? ''
  const height = options.height ?? ''

  return (
    <div className="p-4 rounded-2xl space-y-4" style={{ background: 'var(--bg-surface)' }}>
      <h4 className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
        Image Options
      </h4>

      {/* Quality slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Quality</label>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{quality}%</span>
        </div>
        <input
          type="range"
          min="1"
          max="100"
          value={quality}
          onChange={e => onChange({ ...options, quality: Number(e.target.value) })}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #3B82F6 ${quality}%, var(--bg-surface-hover) ${quality}%)` }}
        />
      </div>

      {/* Resize */}
      <div>
        <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Resize (optional)</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Width"
            value={width}
            onChange={e => onChange({ ...options, width: e.target.value ? Number(e.target.value) : '' })}
            className="flex-1 px-3 py-2 rounded-xl text-sm outline-none transition-all"
            style={{
              background: 'var(--bg-base)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-ghost)',
            }}
          />
          <span className="text-sm" style={{ color: 'var(--text-tertiary)' }}>×</span>
          <input
            type="number"
            placeholder="Height"
            value={height}
            onChange={e => onChange({ ...options, height: e.target.value ? Number(e.target.value) : '' })}
            className="flex-1 px-3 py-2 rounded-xl text-sm outline-none transition-all"
            style={{
              background: 'var(--bg-base)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-ghost)',
            }}
          />
        </div>
      </div>
    </div>
  )
}

function VideoOptions({ options, onChange, file }) {
  const resolution = options.resolution ?? 'original'
  const quality = options.quality ?? 23
  const removeAudio = options.removeAudio ?? false

  const isLargeFile = file && file.size > 100 * 1024 * 1024

  return (
    <div className="p-4 rounded-2xl space-y-4" style={{ background: 'var(--bg-surface)' }}>
      <h4 className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
        Video Options
      </h4>

      {/* Large file warning */}
      {isLargeFile && (
        <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#F59E0B' }}>
          ⚠️ Large file detected. Video conversion runs in your browser and may take several minutes. Your file never leaves your device.
        </div>
      )}

      {/* Resolution */}
      <div>
        <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Resolution</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'original', label: 'Original' },
            { value: '1080', label: '1080p' },
            { value: '720', label: '720p' },
            { value: '480', label: '480p' },
            { value: '360', label: '360p' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => onChange({ ...options, resolution: opt.value })}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={resolution === opt.value
                ? { background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white' }
                : { background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }
              }
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quality (CRF) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Quality (CRF)</label>
          <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{quality}</span>
        </div>
        <input
          type="range"
          min="18"
          max="35"
          value={quality}
          onChange={e => onChange({ ...options, quality: Number(e.target.value) })}
          className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, #3B82F6 ${((quality - 18) / 17) * 100}%, var(--bg-surface-hover) ${((quality - 18) / 17) * 100}%)` }}
        />
        <div className="flex justify-between mt-1">
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Higher quality</span>
          <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Smaller file</span>
        </div>
      </div>

      {/* Remove audio */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          className="w-9 h-5 rounded-full relative transition-colors cursor-pointer"
          style={{ background: removeAudio ? '#3B82F6' : 'var(--bg-surface-hover)' }}
          onClick={() => onChange({ ...options, removeAudio: !removeAudio })}
        >
          <div
            className="w-4 h-4 rounded-full absolute top-0.5 transition-all"
            style={{
              background: 'white',
              left: removeAudio ? '18px' : '2px',
            }}
          />
        </div>
        <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Remove audio</span>
      </label>
    </div>
  )
}

function AudioOptions({ options, onChange }) {
  const bitrate = options.bitrate ?? '192k'
  const sampleRate = options.sampleRate ?? 44100

  return (
    <div className="p-4 rounded-2xl space-y-4" style={{ background: 'var(--bg-surface)' }}>
      <h4 className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
        Audio Options
      </h4>

      {/* Bitrate */}
      <div>
        <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Bitrate</label>
        <div className="flex flex-wrap gap-2">
          {['128k', '192k', '256k', '320k'].map(br => (
            <button
              key={br}
              onClick={() => onChange({ ...options, bitrate: br })}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={bitrate === br
                ? { background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white' }
                : { background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }
              }
            >
              {br}
            </button>
          ))}
        </div>
      </div>

      {/* Sample rate */}
      <div>
        <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Sample Rate</label>
        <div className="flex flex-wrap gap-2">
          {[44100, 48000].map(sr => (
            <button
              key={sr}
              onClick={() => onChange({ ...options, sampleRate: sr })}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
              style={sampleRate === sr
                ? { background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white' }
                : { background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }
              }
            >
              {sr.toLocaleString()} Hz
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

function PdfOptions({ options, onChange }) {
  const compression = options.compression ?? 'medium'

  return (
    <div className="p-4 rounded-2xl space-y-4" style={{ background: 'var(--bg-surface)' }}>
      <h4 className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
        PDF Options
      </h4>

      <div>
        <label className="text-sm mb-2 block" style={{ color: 'var(--text-secondary)' }}>Compression Level</label>
        <div className="flex flex-wrap gap-2">
          {['low', 'medium', 'high'].map(level => (
            <button
              key={level}
              onClick={() => onChange({ ...options, compression: level })}
              className="px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all"
              style={compression === level
                ? { background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: 'white' }
                : { background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }
              }
            >
              {level}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
