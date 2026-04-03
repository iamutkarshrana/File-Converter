'use client'

import { useState, useCallback } from 'react'
import DropZone, { FileInfo } from './DropZone'
import FormatSelector from './FormatSelector'
import ConversionOptions from './ConversionOptions'
import ConvertButton from './ConvertButton'
import ProgressBar from './ProgressBar'
import DownloadButton from './DownloadButton'
import { detectCategory, getExtension, isClientSideConversion } from '@/lib/formats'

// Conversion states
const STATE = {
  IDLE: 'idle',
  FILE_SELECTED: 'file_selected',
  CONVERTING: 'converting',
  DONE: 'done',
  ERROR: 'error',
}

export default function ConversionEngine({ lockedInput = null, lockedOutput = null }) {
  const [state, setState] = useState(STATE.IDLE)
  const [file, setFile] = useState(null)
  const [outputFormat, setOutputFormat] = useState(lockedOutput || '')
  const [options, setOptions] = useState({})
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleFileSelect = useCallback((selectedFile) => {
    setFile(selectedFile)
    setState(STATE.FILE_SELECTED)
    setResult(null)
    setError('')
    setProgress(0)

    // Auto-select output format if locked
    if (lockedOutput) {
      setOutputFormat(lockedOutput)
    } else {
      setOutputFormat('')
    }
  }, [lockedOutput])

  const handleRemoveFile = useCallback(() => {
    setFile(null)
    setState(STATE.IDLE)
    setOutputFormat(lockedOutput || '')
    setOptions({})
    setResult(null)
    setError('')
    setProgress(0)
  }, [lockedOutput])

  const handleReset = useCallback(() => {
    handleRemoveFile()
  }, [handleRemoveFile])

  const handleConvert = useCallback(async () => {
    if (!file || !outputFormat) return

    setState(STATE.CONVERTING)
    setProgress(0)
    setError('')
    setResult(null)

    const inputExt = getExtension(file.name)
    const category = detectCategory(inputExt)
    const clientSide = isClientSideConversion(inputExt, outputFormat)

    try {
      let convertedFile

      if (clientSide) {
        setStatusMessage('Processing in your browser...')

        switch (category) {
          case 'image': {
            // Route GIF→video formats through the video converter
            const videoOutputs = ['mp4', 'webm']
            if (inputExt === 'gif' && videoOutputs.includes(outputFormat)) {
              const { convertVideo } = await import('@/lib/converters/videoConverter')
              convertedFile = await convertVideo(file, outputFormat, options, setProgress)
              break
            }

            if (inputExt === 'svg') {
              const { convertSvg } = await import('@/lib/converters/imageConverter')
              convertedFile = await convertSvg(file, outputFormat, options, setProgress)
            } else {
              const { convertImage } = await import('@/lib/converters/imageConverter')
              convertedFile = await convertImage(file, outputFormat, options, setProgress)
            }
            break
          }
          case 'video': {
            // Check if extracting audio
            const audioOutputs = ['mp3', 'wav', 'aac', 'ogg', 'flac']
            if (audioOutputs.includes(outputFormat)) {
              const { extractAudio } = await import('@/lib/converters/videoConverter')
              convertedFile = await extractAudio(file, outputFormat, options, setProgress)
            } else {
              const { convertVideo } = await import('@/lib/converters/videoConverter')
              convertedFile = await convertVideo(file, outputFormat, options, setProgress)
            }
            break
          }
          case 'audio': {
            const { convertAudio } = await import('@/lib/converters/audioConverter')
            convertedFile = await convertAudio(file, outputFormat, options, setProgress)
            break
          }
          case 'document': {
            // Client-side document conversions
            if (inputExt === 'docx' && outputFormat === 'html') {
              const { docxToHtml } = await import('@/lib/converters/documentConverter')
              convertedFile = await docxToHtml(file, setProgress)
            } else if (inputExt === 'docx' && outputFormat === 'txt') {
              const { docxToText } = await import('@/lib/converters/documentConverter')
              convertedFile = await docxToText(file, setProgress)
            } else if (['xlsx', 'csv', 'ods'].includes(inputExt)) {
              const { convertSpreadsheet } = await import('@/lib/converters/spreadsheetConverter')
              convertedFile = await convertSpreadsheet(file, outputFormat, options, setProgress)
            } else if (inputExt === 'pdf' && outputFormat === 'pdf') {
              // Compress PDF
              const { compressPdf } = await import('@/lib/converters/pdfConverter')
              convertedFile = await compressPdf(file, options, setProgress)
            } else if (inputExt === 'pdf' && outputFormat === 'jpg') {
              // PDF to JPG using PDF.js rendering
              const { pdfToImages } = await import('@/lib/converters/pdfConverter')
              convertedFile = await pdfToImages(file, options, setProgress)
            } else {
              throw new Error('Unsupported client-side conversion')
            }
            break
          }
          case 'archive': {
            if (outputFormat === 'extract') {
              const { extractZip } = await import('@/lib/converters/archiveConverter')
              convertedFile = await extractZip(file, setProgress)
            } else {
              throw new Error('Unsupported archive operation')
            }
            break
          }
          default:
            throw new Error(`Unsupported category: ${category}`)
        }
      } else {
        // Server-side conversion via API (documents and ebooks)
        setStatusMessage('Processing on server...')
        const { convertDocument } = await import('@/lib/converters/documentConverter')
        convertedFile = await convertDocument(file, outputFormat, setProgress)
      }

      setResult(convertedFile)
      setState(STATE.DONE)
      setProgress(100)
    } catch (err) {
      console.error('Conversion error:', err)
      setError(err.message || 'Conversion failed. Please try again.')
      setState(STATE.ERROR)
    }
  }, [file, outputFormat, options])

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Drop zone - show when idle */}
      {state === STATE.IDLE && (
        <DropZone onFileSelect={handleFileSelect} />
      )}

      {/* File info - show after file selected */}
      {file && state !== STATE.IDLE && (
        <FileInfo file={file} onRemove={handleRemoveFile} />
      )}

      {/* Format selector - show after file selected */}
      {state === STATE.FILE_SELECTED && (
        <FormatSelector
          file={file}
          outputFormat={outputFormat}
          onOutputChange={setOutputFormat}
          lockedOutput={lockedOutput}
        />
      )}

      {/* Conversion options - show when format is selected */}
      {state === STATE.FILE_SELECTED && outputFormat && (
        <ConversionOptions
          file={file}
          outputFormat={outputFormat}
          options={options}
          onOptionsChange={setOptions}
        />
      )}

      {/* Convert button - show when ready */}
      {state === STATE.FILE_SELECTED && outputFormat && (
        <ConvertButton
          onClick={handleConvert}
          disabled={!file || !outputFormat}
        />
      )}

      {/* Progress bar - show during conversion */}
      {state === STATE.CONVERTING && (
        <ProgressBar progress={progress} status={statusMessage} />
      )}

      {/* Download button - show when done */}
      {state === STATE.DONE && result && (
        <DownloadButton file={result} onReset={handleReset} />
      )}

      {/* Error state */}
      {state === STATE.ERROR && (
        <div className="p-4 rounded-2xl text-center" style={{ background: 'var(--bg-surface)' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(239, 68, 68, 0.1)' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: '#EF4444' }}>Conversion failed</p>
          <p className="text-xs mb-4" style={{ color: 'var(--text-tertiary)' }}>{error}</p>
          <button
            onClick={handleReset}
            className="px-6 py-2 rounded-full text-sm font-medium transition-all"
            style={{ background: 'var(--bg-surface-hover)', color: 'var(--text-secondary)' }}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
