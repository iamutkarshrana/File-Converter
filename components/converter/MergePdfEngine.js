'use client'

import { useState, useCallback } from 'react'
import DropZone from './DropZone'
import ProgressBar from './ProgressBar'
import DownloadButton from './DownloadButton'
import { formatFileSize } from '@/lib/formats'

const STATE = {
  IDLE: 'idle',
  FILES_SELECTED: 'files_selected',
  CONVERTING: 'converting',
  DONE: 'done',
  ERROR: 'error',
}

export default function MergePdfEngine() {
  const [state, setState] = useState(STATE.IDLE)
  const [files, setFiles] = useState([])
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleMultiFileSelect = useCallback((selectedFiles) => {
    const pdfFiles = selectedFiles.filter(f => f.name.toLowerCase().endsWith('.pdf'))
    if (pdfFiles.length === 0) {
      setError('Please select PDF files only.')
      setState(STATE.ERROR)
      return
    }
    setFiles(prev => [...prev, ...pdfFiles])
    setState(STATE.FILES_SELECTED)
    setError('')
  }, [])

  const handleSingleFileSelect = useCallback((selectedFile) => {
    if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select PDF files only.')
      setState(STATE.ERROR)
      return
    }
    setFiles(prev => [...prev, selectedFile])
    setState(STATE.FILES_SELECTED)
    setError('')
  }, [])

  const removeFile = useCallback((index) => {
    setFiles(prev => {
      const next = prev.filter((_, i) => i !== index)
      if (next.length === 0) setState(STATE.IDLE)
      return next
    })
  }, [])

  const moveFile = useCallback((index, direction) => {
    setFiles(prev => {
      const next = [...prev]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return next
    })
  }, [])

  const handleReset = useCallback(() => {
    setFiles([])
    setState(STATE.IDLE)
    setResult(null)
    setError('')
    setProgress(0)
  }, [])

  const handleMerge = useCallback(async () => {
    if (files.length < 2) {
      setError('Please add at least 2 PDF files to merge.')
      return
    }

    setState(STATE.CONVERTING)
    setProgress(0)

    try {
      const { mergePdfs } = await import('@/lib/converters/pdfConverter')
      const merged = await mergePdfs(files, setProgress)
      setResult(merged)
      setState(STATE.DONE)
    } catch (err) {
      console.error('Merge error:', err)
      setError(err.message || 'Failed to merge PDFs.')
      setState(STATE.ERROR)
    }
  }, [files])

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Drop zone — always visible unless converting/done */}
      {(state === STATE.IDLE || state === STATE.FILES_SELECTED) && (
        <DropZone
          onFileSelect={handleSingleFileSelect}
          onMultiFileSelect={handleMultiFileSelect}
          multiple={true}
        />
      )}

      {/* File list */}
      {state === STATE.FILES_SELECTED && files.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-tertiary)' }}>
            {files.length} PDF files — drag to reorder
          </p>
          {files.map((file, i) => (
            <div
              key={`${file.name}-${i}`}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: 'var(--bg-surface)' }}
            >
              {/* Order controls */}
              <div className="flex flex-col gap-0.5">
                <button
                  onClick={() => moveFile(i, -1)}
                  disabled={i === 0}
                  className="w-5 h-5 flex items-center justify-center rounded text-xs disabled:opacity-20"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  ▲
                </button>
                <button
                  onClick={() => moveFile(i, 1)}
                  disabled={i === files.length - 1}
                  className="w-5 h-5 flex items-center justify-center rounded text-xs disabled:opacity-20"
                  style={{ color: 'var(--text-tertiary)' }}
                >
                  ▼
                </button>
              </div>

              {/* File icon */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(16, 185, 129, 0.08)' }}
              >
                <span className="text-xs font-bold" style={{ color: '#10B981' }}>PDF</span>
              </div>

              {/* File info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                  {file.name}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                  {formatFileSize(file.size)}
                </p>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFile(i)}
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--bg-surface-hover)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-tertiary)' }}>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}

          {/* Merge button */}
          <button
            onClick={handleMerge}
            disabled={files.length < 2}
            className={`
              w-full py-3.5 rounded-full text-sm font-semibold text-white transition-all duration-300
              ${files.length < 2 ? 'opacity-40 cursor-not-allowed' : 'btn-gradient hover:shadow-lg active:scale-[0.98]'}
            `}
            style={files.length < 2 ? { background: 'var(--bg-surface-hover)', color: 'var(--text-tertiary)' } : {}}
          >
            Merge {files.length} PDFs
          </button>
        </div>
      )}

      {/* Progress */}
      {state === STATE.CONVERTING && (
        <ProgressBar progress={progress} status="Merging PDFs in your browser..." />
      )}

      {/* Result */}
      {state === STATE.DONE && result && (
        <DownloadButton file={result} onReset={handleReset} />
      )}

      {/* Error */}
      {state === STATE.ERROR && (
        <div className="p-4 rounded-2xl text-center" style={{ background: 'var(--bg-surface)' }}>
          <p className="text-sm font-medium mb-1" style={{ color: '#EF4444' }}>Error</p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>{error}</p>
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-full text-sm font-medium"
            style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
