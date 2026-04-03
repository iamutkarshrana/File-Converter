import { PDFDocument } from 'pdf-lib'

/**
 * Convert PDF pages to JPG images using PDF.js for rendering
 * Returns a single JPG for single-page PDFs, or a ZIP for multi-page
 */
export async function pdfToImages(file, options = {}, onProgress) {
  if (onProgress) onProgress(5)

  const pdfjsLib = await import('pdfjs-dist')
  // Use the bundled worker
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  const pageCount = pdf.numPages

  if (onProgress) onProgress(15)

  const scale = 2 // 2x for good quality
  const images = []

  for (let i = 1; i <= pageCount; i++) {
    const page = await pdf.getPage(i)
    const viewport = page.getViewport({ scale })

    const canvas = new OffscreenCanvas(viewport.width, viewport.height)
    const ctx = canvas.getContext('2d')

    await page.render({ canvasContext: ctx, viewport }).promise

    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.92 })
    images.push(blob)

    if (onProgress) onProgress(15 + Math.round((i / pageCount) * 75))
  }

  if (onProgress) onProgress(92)

  const baseName = file.name.replace(/\.[^.]+$/, '')

  // Single page: return single JPG file
  if (images.length === 1) {
    if (onProgress) onProgress(100)
    return new File([images[0]], `${baseName}.jpg`, { type: 'image/jpeg' })
  }

  // Multi-page: create a ZIP using fflate
  const fflate = await import('fflate')
  const zipFiles = {}
  for (let i = 0; i < images.length; i++) {
    const arrBuf = await images[i].arrayBuffer()
    zipFiles[`${baseName}_page_${i + 1}.jpg`] = new Uint8Array(arrBuf)
  }

  const zipped = fflate.zipSync(zipFiles)
  if (onProgress) onProgress(100)

  return new File([zipped], `${baseName}_pages.zip`, { type: 'application/zip' })
}

/**
 * Merge multiple PDF files into one
 */
export async function mergePdfs(files, onProgress) {
  if (onProgress) onProgress(10)

  const mergedPdf = await PDFDocument.create()

  for (let i = 0; i < files.length; i++) {
    const arrayBuffer = await files[i].arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    pages.forEach(page => mergedPdf.addPage(page))

    if (onProgress) onProgress(10 + Math.round(((i + 1) / files.length) * 80))
  }

  const mergedBytes = await mergedPdf.save()
  if (onProgress) onProgress(100)

  return new File([mergedBytes], 'merged.pdf', { type: 'application/pdf' })
}

/**
 * Split PDF by page range
 */
export async function splitPdf(file, startPage, endPage, onProgress) {
  if (onProgress) onProgress(10)

  const arrayBuffer = await file.arrayBuffer()
  const pdfDoc = await PDFDocument.load(arrayBuffer)
  const totalPages = pdfDoc.getPageCount()

  const start = Math.max(0, startPage - 1)
  const end = Math.min(totalPages - 1, endPage - 1)

  if (onProgress) onProgress(30)

  const newPdf = await PDFDocument.create()
  const pageIndices = []
  for (let i = start; i <= end; i++) {
    pageIndices.push(i)
  }

  const pages = await newPdf.copyPages(pdfDoc, pageIndices)
  pages.forEach(page => newPdf.addPage(page))

  if (onProgress) onProgress(80)

  const pdfBytes = await newPdf.save()
  if (onProgress) onProgress(100)

  const baseName = file.name.replace(/\.[^.]+$/, '')
  return new File([pdfBytes], `${baseName}_pages_${startPage}-${endPage}.pdf`, {
    type: 'application/pdf',
  })
}

/**
 * Compress PDF by removing unused objects
 */
export async function compressPdf(file, options = {}, onProgress) {
  if (onProgress) onProgress(10)

  const arrayBuffer = await file.arrayBuffer()

  if (onProgress) onProgress(30)

  // Load and re-save with pdf-lib to remove unused objects
  const pdfDoc = await PDFDocument.load(arrayBuffer, {
    ignoreEncryption: true,
  })

  if (onProgress) onProgress(60)

  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,
    addDefaultPage: false,
  })

  if (onProgress) onProgress(100)

  const baseName = file.name.replace(/\.[^.]+$/, '')
  return new File([compressedBytes], `${baseName}_compressed.pdf`, {
    type: 'application/pdf',
  })
}
