'use client'

import { useCallback, useState, useRef } from 'react'
import { formatFileSize, getExtension, detectCategory } from '@/lib/formats'

export default function DropZone({ onFileSelect, onMultiFileSelect, disabled = false, multiple = false }) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!disabled) setIsDragging(true)
  }, [disabled])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = e.dataTransfer.files
    if (files.length > 0) {
      if (multiple && onMultiFileSelect) {
        onMultiFileSelect(Array.from(files))
      } else {
        onFileSelect(files[0])
      }
    }
  }, [onFileSelect, onMultiFileSelect, disabled, multiple])

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }

  const handleFileChange = (e) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (multiple && onMultiFileSelect) {
      onMultiFileSelect(Array.from(files))
    } else {
      onFileSelect(files[0])
    }
    // Reset input so same file can be selected again
    e.target.value = ''
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`
        relative cursor-pointer rounded-3xl transition-all duration-300 overflow-hidden
        ${isDragging ? 'dropzone-active' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      style={{
        background: isDragging ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
        border: isDragging
          ? '2px solid #3B82F6'
          : '2px dashed var(--border-ghost)',
        minHeight: '280px',
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={handleFileChange}
        disabled={disabled}
        multiple={multiple}
      />

      <div className="flex flex-col items-center justify-center h-full min-h-[280px] p-8 text-center">
        {/* Upload icon */}
        <div
          className={`
            w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300
            ${isDragging ? 'scale-110' : ''}
          `}
          style={{ background: isDragging ? 'rgba(59, 130, 246, 0.15)' : 'var(--bg-surface-hover)' }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke={isDragging ? '#3B82F6' : 'var(--text-tertiary)'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-colors"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" y1="3" x2="12" y2="15" />
          </svg>
        </div>

        {/* Text */}
        <p className="text-base font-medium mb-2" style={{ color: isDragging ? '#3B82F6' : 'var(--text-primary)' }}>
          {isDragging ? 'Release to upload' : multiple ? 'Drop your files here' : 'Drop your file here'}
        </p>
        <p className="text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
          or click to browse
        </p>

        {/* Supported formats hint */}
        <div className="flex flex-wrap gap-1.5 justify-center max-w-md">
          {['JPG', 'PNG', 'MP4', 'MP3', 'PDF', 'DOCX', 'WEBP', 'WAV'].map(fmt => (
            <span
              key={fmt}
              className="px-2 py-0.5 rounded-full text-xs font-medium"
              style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-tertiary)' }}
            >
              {fmt}
            </span>
          ))}
          <span className="px-2 py-0.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
            + 30 more
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * File info display shown after a file is selected
 */
export function FileInfo({ file, onRemove }) {
  const ext = getExtension(file.name)
  const category = detectCategory(ext)

  const categoryColors = {
    image: '#3B82F6',
    video: '#8B5CF6',
    audio: '#F59E0B',
    document: '#10B981',
    ebook: '#EC4899',
    archive: '#6B7280',
  }

  return (
    <div
      className="flex items-center gap-4 p-4 rounded-2xl"
      style={{ background: 'var(--bg-surface)' }}
    >
      {/* File icon */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${categoryColors[category] || '#6B7280'}15` }}
      >
        <span className="text-xs font-bold uppercase" style={{ color: categoryColors[category] || '#6B7280' }}>
          {ext}
        </span>
      </div>

      {/* File details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
          {file.name}
        </p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
          {formatFileSize(file.size)} · {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Unknown'}
        </p>
      </div>

      {/* Remove button */}
      <button
        onClick={onRemove}
        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors"
        style={{ background: 'var(--bg-surface-hover)' }}
        aria-label="Remove file"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-tertiary)' }}>
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </div>
  )
}
