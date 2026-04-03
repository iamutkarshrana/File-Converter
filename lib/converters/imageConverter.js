import { getFFmpeg } from '@/lib/ffmpegLoader'
import { fetchFile } from '@ffmpeg/util'

// Formats the browser Canvas API can output
const CANVAS_OUTPUT_FORMATS = ['jpg', 'jpeg', 'png', 'webp']

// Formats the browser can natively decode via createImageBitmap
// (AVIF support depends on browser — Chrome 85+, Firefox 93+, Safari 16.4+)
const BROWSER_DECODABLE = ['jpg', 'jpeg', 'png', 'webp', 'avif', 'bmp', 'gif']

// Formats that need special handling
const HEIC_FORMATS = ['heic', 'heif']
const RAW_FORMATS = ['cr2', 'nef', 'arw', 'dng']

/**
 * Convert image — picks the best strategy based on input/output formats
 */
export async function convertImage(file, outputFormat, options = {}, onProgress) {
  const inputExt = file.name.split('.').pop().toLowerCase()

  // HEIC/HEIF: use heic2any library (FFmpeg.wasm doesn't have the decoder)
  if (HEIC_FORMATS.includes(inputExt)) {
    return await convertHeic(file, outputFormat, options, onProgress)
  }

  // RAW camera formats: these can't be decoded in-browser or by FFmpeg.wasm
  // Route to server-side conversion via CloudConvert
  if (RAW_FORMATS.includes(inputExt)) {
    throw new Error(
      `RAW format (${inputExt.toUpperCase()}) requires server-side processing. ` +
      `This conversion will use the CloudConvert API.`
    )
  }

  // AVIF output: use Canvas API if the browser supports it, otherwise fail gracefully
  if (outputFormat === 'avif') {
    return await convertWithCanvas(file, outputFormat, options, onProgress)
  }

  // Browser-decodable input + Canvas-compatible output → fast Canvas path
  if (BROWSER_DECODABLE.includes(inputExt) && CANVAS_OUTPUT_FORMATS.includes(outputFormat)) {
    try {
      return await convertWithCanvas(file, outputFormat, options, onProgress)
    } catch {
      // Fall through to FFmpeg
    }
  }

  // Everything else: FFmpeg.wasm
  return await convertWithFFmpeg(file, outputFormat, options, onProgress)
}

/**
 * Convert HEIC/HEIF using heic2any library
 */
async function convertHeic(file, outputFormat, options = {}, onProgress) {
  const { quality = 90, width, height } = options

  if (onProgress) onProgress(10)

  const heic2any = (await import('heic2any')).default

  const mimeMap = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg',
    png: 'image/png', webp: 'image/webp',
  }
  // heic2any supports JPEG, PNG, GIF output
  const toType = mimeMap[outputFormat] || 'image/jpeg'

  if (onProgress) onProgress(20)

  const blob = await heic2any({
    blob: file,
    toType,
    quality: quality / 100,
  })

  if (onProgress) onProgress(70)

  // Handle array result (multi-image HEIC)
  const resultBlob = Array.isArray(blob) ? blob[0] : blob

  // If resize is requested, run through canvas
  if (width || height) {
    const bitmap = await createImageBitmap(resultBlob)
    const targetWidth = width || bitmap.width
    const targetHeight = height || bitmap.height

    const canvas = new OffscreenCanvas(targetWidth, targetHeight)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight)

    const resized = await canvas.convertToBlob({ type: toType, quality: quality / 100 })
    if (onProgress) onProgress(100)

    const baseName = file.name.replace(/\.[^.]+$/, '')
    return new File([resized], `${baseName}.${outputFormat}`, { type: toType })
  }

  if (onProgress) onProgress(100)

  const baseName = file.name.replace(/\.[^.]+$/, '')
  return new File([resultBlob], `${baseName}.${outputFormat}`, { type: toType })
}

/**
 * Fast canvas-based conversion for web image formats
 */
async function convertWithCanvas(file, outputFormat, options = {}, onProgress) {
  const { quality = 90, width, height } = options

  if (onProgress) onProgress(10)

  const bitmap = await createImageBitmap(file)

  if (onProgress) onProgress(30)

  const targetWidth = width || bitmap.width
  const targetHeight = height || bitmap.height

  const canvas = new OffscreenCanvas(targetWidth, targetHeight)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(bitmap, 0, 0, targetWidth, targetHeight)

  if (onProgress) onProgress(60)

  const mimeMap = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
  }

  const mime = mimeMap[outputFormat] || 'image/png'
  const blob = await canvas.convertToBlob({
    type: mime,
    quality: quality / 100,
  })

  if (onProgress) onProgress(100)

  const baseName = file.name.replace(/\.[^.]+$/, '')
  return new File([blob], `${baseName}.${outputFormat}`, { type: mime })
}

/**
 * FFmpeg-based conversion for complex formats (HEIC, RAW, GIF↔video, etc.)
 */
async function convertWithFFmpeg(file, outputFormat, options = {}, onProgress) {
  const { quality = 90, width, height } = options

  const ffmpeg = await getFFmpeg(onProgress)
  const inputName = `input.${file.name.split('.').pop()}`
  const outputName = `output.${outputFormat}`

  await ffmpeg.writeFile(inputName, await fetchFile(file))

  const args = ['-i', inputName]

  // Add resize filter if specified
  if (width && height) {
    args.push('-vf', `scale=${width}:${height}`)
  } else if (width) {
    args.push('-vf', `scale=${width}:-1`)
  } else if (height) {
    args.push('-vf', `scale=-1:${height}`)
  }

  // Quality settings per format
  if (outputFormat === 'jpg' || outputFormat === 'jpeg') {
    args.push('-q:v', String(Math.round((100 - quality) * 31 / 100 + 1)))
  } else if (outputFormat === 'webp') {
    args.push('-quality', String(quality))
  }

  args.push('-y', outputName)

  await ffmpeg.exec(args)
  const data = await ffmpeg.readFile(outputName)

  // Cleanup
  await ffmpeg.deleteFile(inputName)
  await ffmpeg.deleteFile(outputName)

  const baseName = file.name.replace(/\.[^.]+$/, '')
  const mimeMap = {
    jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png',
    webp: 'image/webp', avif: 'image/avif', gif: 'image/gif',
    bmp: 'image/bmp', tiff: 'image/tiff', mp4: 'video/mp4', webm: 'video/webm',
  }
  return new File([data.buffer], `${baseName}.${outputFormat}`, {
    type: mimeMap[outputFormat] || 'application/octet-stream',
  })
}

/**
 * Convert SVG to raster image using Canvas
 */
export async function convertSvg(file, outputFormat, options = {}, onProgress) {
  const { quality = 90, width, height } = options

  if (onProgress) onProgress(10)

  const svgText = await file.text()
  const blob = new Blob([svgText], { type: 'image/svg+xml' })
  const url = URL.createObjectURL(blob)

  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      if (onProgress) onProgress(40)

      const targetWidth = width || img.naturalWidth || 800
      const targetHeight = height || img.naturalHeight || 600

      const canvas = document.createElement('canvas')
      canvas.width = targetWidth
      canvas.height = targetHeight

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight)

      if (onProgress) onProgress(70)

      const mimeMap = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png' }
      const mime = mimeMap[outputFormat] || 'image/png'

      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(url)
          if (onProgress) onProgress(100)
          const baseName = file.name.replace(/\.[^.]+$/, '')
          resolve(new File([blob], `${baseName}.${outputFormat}`, { type: mime }))
        },
        mime,
        quality / 100
      )
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Failed to load SVG'))
    }
    img.src = url
  })
}
