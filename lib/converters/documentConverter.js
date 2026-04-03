/**
 * Client for calling /api/convert/document route
 * Used for server-side document conversions via CloudConvert
 */
export async function convertDocument(file, outputFormat, onProgress) {
  if (onProgress) onProgress(5)

  // Convert file to base64 using chunked approach (safe for large files)
  const arrayBuffer = await file.arrayBuffer()
  const bytes = new Uint8Array(arrayBuffer)
  const chunkSize = 32768
  let binaryString = ''
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binaryString += String.fromCharCode.apply(null, bytes.subarray(i, i + chunkSize))
  }
  const base64 = btoa(binaryString)

  if (onProgress) onProgress(15)

  const inputFormat = file.name.split('.').pop().toLowerCase()

  const response = await fetch('/api/convert/document', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileBase64: base64,
      inputFormat,
      outputFormat,
      filename: file.name,
    }),
  })

  if (onProgress) onProgress(50)

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err.error || 'Document conversion failed')
  }

  const result = await response.json()

  if (onProgress) onProgress(70)

  // Download via our proxy endpoint to avoid COEP blocking cross-origin fetches
  const downloadResponse = await fetch(
    `/api/convert/document?downloadUrl=${encodeURIComponent(result.downloadUrl)}`
  )
  if (!downloadResponse.ok) {
    throw new Error('Failed to download converted file')
  }

  const blob = await downloadResponse.blob()

  if (onProgress) onProgress(100)

  const baseName = file.name.replace(/\.[^.]+$/, '')
  return new File([blob], `${baseName}.${outputFormat}`, { type: blob.type })
}

/**
 * Convert DOCX to HTML using Mammoth (client-side)
 */
export async function docxToHtml(file, onProgress) {
  if (onProgress) onProgress(10)

  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()

  if (onProgress) onProgress(40)

  const result = await mammoth.convertToHtml({ arrayBuffer })

  if (onProgress) onProgress(80)

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>${file.name}</title></head>
<body>${result.value}</body>
</html>`

  if (onProgress) onProgress(100)

  const baseName = file.name.replace(/\.[^.]+$/, '')
  return new File([html], `${baseName}.html`, { type: 'text/html' })
}

/**
 * Convert DOCX to plain text using Mammoth (client-side)
 */
export async function docxToText(file, onProgress) {
  if (onProgress) onProgress(10)

  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()

  if (onProgress) onProgress(40)

  const result = await mammoth.extractRawText({ arrayBuffer })

  if (onProgress) onProgress(100)

  const baseName = file.name.replace(/\.[^.]+$/, '')
  return new File([result.value], `${baseName}.txt`, { type: 'text/plain' })
}
