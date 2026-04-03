export const CATEGORIES = {
  image: {
    label: 'Images',
    icon: '🖼️',
    description: 'Convert between image formats',
    clientSide: true,
  },
  video: {
    label: 'Video',
    icon: '🎬',
    description: 'Convert video formats',
    clientSide: true,
  },
  audio: {
    label: 'Audio',
    icon: '🎵',
    description: 'Convert audio formats',
    clientSide: true,
  },
  document: {
    label: 'Documents',
    icon: '📄',
    description: 'Convert document formats',
    clientSide: false, // hybrid
  },
  ebook: {
    label: 'eBooks',
    icon: '📚',
    description: 'Convert eBook formats',
    clientSide: false,
  },
  archive: {
    label: 'Archives',
    icon: '📦',
    description: 'Extract and create archives',
    clientSide: true,
  },
}

export const FORMATS = {
  image: {
    inputs: ['jpg', 'jpeg', 'png', 'webp', 'avif', 'heic', 'heif', 'gif', 'bmp', 'tiff', 'svg', 'cr2', 'nef', 'arw', 'dng'],
    conversions: {
      jpg: ['png', 'webp', 'avif', 'gif', 'bmp', 'tiff'],
      jpeg: ['png', 'webp', 'avif', 'gif', 'bmp', 'tiff'],
      png: ['jpg', 'webp', 'avif', 'gif', 'bmp', 'tiff'],
      webp: ['jpg', 'png', 'avif', 'gif'],
      avif: ['jpg', 'png', 'webp'],
      heic: ['jpg', 'png', 'webp'],
      heif: ['jpg', 'png', 'webp'],
      gif: ['mp4', 'webm', 'jpg', 'png'],
      bmp: ['jpg', 'png', 'webp'],
      tiff: ['jpg', 'png', 'webp'],
      svg: ['png', 'jpg'],
      cr2: ['jpg', 'png'],
      nef: ['jpg', 'png'],
      arw: ['jpg', 'png'],
      dng: ['jpg', 'png'],
    },
  },
  video: {
    inputs: ['mp4', 'webm', 'mov', 'avi', 'mkv', 'flv'],
    conversions: {
      mp4: ['webm', 'mov', 'avi', 'mkv', 'flv', 'gif', 'mp3', 'wav', 'aac'],
      webm: ['mp4', 'mov', 'avi', 'gif'],
      mov: ['mp4', 'webm', 'avi', 'gif'],
      avi: ['mp4', 'webm', 'mov'],
      mkv: ['mp4', 'webm'],
      flv: ['mp4', 'webm'],
    },
  },
  audio: {
    inputs: ['mp3', 'wav', 'aac', 'ogg', 'flac', 'm4a', 'opus', 'wma'],
    conversions: {
      mp3: ['wav', 'aac', 'ogg', 'flac', 'm4a'],
      wav: ['mp3', 'aac', 'ogg', 'flac'],
      aac: ['mp3', 'wav', 'ogg', 'flac'],
      ogg: ['mp3', 'wav'],
      flac: ['mp3', 'wav', 'aac'],
      m4a: ['mp3', 'wav', 'aac'],
      opus: ['mp3', 'wav', 'ogg'],
      wma: ['mp3', 'wav'], // WMA decoding routed to CloudConvert
    },
  },
  document: {
    inputs: ['pdf', 'docx', 'xlsx', 'csv', 'ods', 'pptx', 'odt', 'rtf', 'txt', 'html'],
    conversions: {
      pdf: ['jpg', 'docx', 'pptx'],
      docx: ['pdf', 'txt', 'html'],
      xlsx: ['csv', 'ods', 'pdf'],
      csv: ['xlsx', 'ods'],
      ods: ['xlsx', 'csv'],
      pptx: ['pdf'],
      odt: ['docx', 'pdf'],
      rtf: ['docx', 'pdf'],
      txt: ['pdf'],
      html: ['pdf'],
    },
    // Which conversions are client-side vs server-side
    clientSideConversions: {
      xlsx: ['csv', 'ods'],
      csv: ['xlsx', 'ods'],
      ods: ['xlsx', 'csv'],
      docx: ['txt', 'html'],
      pdf: ['jpg', 'pdf'], // pdf→pdf = compress (client-side via pdf-lib)
    },
  },
  ebook: {
    inputs: ['epub', 'mobi', 'azw3'],
    conversions: {
      epub: ['mobi', 'azw3', 'pdf'],
      mobi: ['epub', 'pdf'],
      azw3: ['epub', 'pdf'],
    },
  },
  archive: {
    inputs: ['zip'],
    conversions: {
      zip: ['extract'],
    },
  },
}

// Map file extensions to MIME types
export const MIME_MAP = {
  // Images
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  avif: 'image/avif',
  heic: 'image/heic',
  heif: 'image/heif',
  gif: 'image/gif',
  bmp: 'image/bmp',
  tiff: 'image/tiff',
  svg: 'image/svg+xml',
  // Video
  mp4: 'video/mp4',
  webm: 'video/webm',
  mov: 'video/quicktime',
  avi: 'video/x-msvideo',
  mkv: 'video/x-matroska',
  flv: 'video/x-flv',
  // Audio
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  aac: 'audio/aac',
  ogg: 'audio/ogg',
  flac: 'audio/flac',
  m4a: 'audio/mp4',
  opus: 'audio/opus',
  wma: 'audio/x-ms-wma',
  // Documents
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  csv: 'text/csv',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  odt: 'application/vnd.oasis.opendocument.text',
  rtf: 'application/rtf',
  txt: 'text/plain',
  html: 'text/html',
  // eBooks
  epub: 'application/epub+zip',
  mobi: 'application/x-mobipocket-ebook',
  azw3: 'application/vnd.amazon.ebook',
  // Archives
  zip: 'application/zip',
}

/**
 * Detect file category from extension
 */
export function detectCategory(extension) {
  const ext = extension.toLowerCase()
  for (const [category, config] of Object.entries(FORMATS)) {
    if (config.inputs.includes(ext)) {
      return category
    }
  }
  return null
}

/**
 * Get valid output formats for a given input extension
 */
export function getOutputFormats(inputExtension) {
  const ext = inputExtension.toLowerCase()
  for (const [category, config] of Object.entries(FORMATS)) {
    if (config.conversions[ext]) {
      return {
        category,
        formats: config.conversions[ext],
      }
    }
  }
  return null
}

/**
 * Check if a conversion can happen client-side
 */
export function isClientSideConversion(inputExt, outputExt) {
  const ext = inputExt.toLowerCase()
  const out = outputExt.toLowerCase()

  // RAW camera formats always need server-side processing
  const rawFormats = ['cr2', 'nef', 'arw', 'dng']
  if (rawFormats.includes(ext)) return false

  // WMA input needs server-side (wmav2 codec not in FFmpeg.wasm)
  if (ext === 'wma') return false

  // Image, video, audio are client-side
  if (FORMATS.image.conversions[ext]?.includes(out)) return true
  if (FORMATS.video.conversions[ext]?.includes(out)) return true
  if (FORMATS.audio.conversions[ext]?.includes(out)) return true

  // Document: check specifically
  if (FORMATS.document.clientSideConversions?.[ext]?.includes(out)) return true

  // Archive is client-side
  if (FORMATS.archive.conversions[ext]?.includes(out)) return true

  return false
}

/**
 * Get file extension from filename
 */
export function getExtension(filename) {
  return filename.split('.').pop().toLowerCase()
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}
