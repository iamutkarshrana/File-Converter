import { unzipSync, zipSync } from 'fflate'

/**
 * Extract ZIP file and return a downloadable ZIP with the contents listed
 * For single file ZIPs, returns the extracted file directly
 */
export async function extractZip(file, onProgress) {
  if (onProgress) onProgress(10)

  const arrayBuffer = await file.arrayBuffer()
  const data = new Uint8Array(arrayBuffer)

  if (onProgress) onProgress(30)

  const unzipped = unzipSync(data)
  const fileNames = Object.keys(unzipped)

  if (onProgress) onProgress(70)

  // Single file: return it directly
  if (fileNames.length === 1) {
    const name = fileNames[0]
    const content = unzipped[name]
    if (onProgress) onProgress(100)
    return new File([content], name, { type: 'application/octet-stream' })
  }

  // Multiple files: re-pack into a flat ZIP (removes folder nesting)
  // This shows the user what was inside
  if (onProgress) onProgress(90)

  const repacked = zipSync(unzipped)
  if (onProgress) onProgress(100)

  const baseName = file.name.replace(/\.[^.]+$/, '')
  return new File([repacked], `${baseName}_extracted.zip`, { type: 'application/zip' })
}

/**
 * Create a ZIP from multiple files
 */
export async function createZip(files, onProgress) {
  if (onProgress) onProgress(10)

  const zipFiles = {}
  for (let i = 0; i < files.length; i++) {
    const f = files[i]
    const arrBuf = await f.arrayBuffer()
    zipFiles[f.name] = new Uint8Array(arrBuf)

    if (onProgress) onProgress(10 + Math.round(((i + 1) / files.length) * 80))
  }

  const zipped = zipSync(zipFiles)
  if (onProgress) onProgress(100)

  return new File([zipped], 'archive.zip', { type: 'application/zip' })
}
