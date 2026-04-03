import { getFFmpeg } from '@/lib/ffmpegLoader'
import { fetchFile } from '@ffmpeg/util'

/**
 * Convert video file using FFmpeg.wasm
 */
export async function convertVideo(file, outputFormat, options = {}, onProgress) {
  const {
    resolution,       // 'original' | '1080' | '720' | '480' | '360'
    quality = 23,     // CRF value (lower = better, 18-28 typical)
    removeAudio = false,
    frameRate,        // e.g. 24, 30, 60
  } = options

  const ffmpeg = await getFFmpeg(onProgress)
  const inputExt = file.name.split('.').pop().toLowerCase()
  const inputName = `input.${inputExt}`
  const outputName = `output.${outputFormat}`

  await ffmpeg.writeFile(inputName, await fetchFile(file))

  const args = ['-i', inputName]

  // Build video filter chain
  const filters = []

  // Resolution scaling
  if (resolution && resolution !== 'original') {
    const heights = { '1080': 1080, '720': 720, '480': 480, '360': 360 }
    const h = heights[resolution]
    if (h) {
      filters.push(`scale=-2:${h}`)
    }
  }

  // Frame rate for GIF output
  if (outputFormat === 'gif') {
    filters.push('fps=10')
    if (filters.length === 1) {
      filters.push('scale=480:-1:flags=lanczos')
    }
  }

  if (filters.length > 0) {
    args.push('-vf', filters.join(','))
  }

  // Frame rate
  if (frameRate && outputFormat !== 'gif') {
    args.push('-r', String(frameRate))
  }

  // Quality (CRF) for video output
  if (outputFormat !== 'gif') {
    const codec = getVideoCodec(outputFormat)
    if (codec) args.push('-c:v', codec)
    args.push('-crf', String(quality))
  }

  // Audio handling
  if (removeAudio) {
    args.push('-an')
  } else if (outputFormat !== 'gif') {
    const audioCodec = getAudioCodecForContainer(outputFormat)
    if (audioCodec) args.push('-c:a', audioCodec)
  }

  // GIF specific: no audio
  if (outputFormat === 'gif') {
    args.push('-an')
  }

  args.push('-y', outputName)

  await ffmpeg.exec(args)
  const data = await ffmpeg.readFile(outputName)

  // Cleanup
  await ffmpeg.deleteFile(inputName)
  await ffmpeg.deleteFile(outputName)

  const baseName = file.name.replace(/\.[^.]+$/, '')
  const mimeMap = {
    mp4: 'video/mp4', webm: 'video/webm', mov: 'video/quicktime',
    avi: 'video/x-msvideo', mkv: 'video/x-matroska', flv: 'video/x-flv',
    gif: 'image/gif',
  }

  return new File([data.buffer], `${baseName}.${outputFormat}`, {
    type: mimeMap[outputFormat] || 'video/mp4',
  })
}

/**
 * Extract audio from video file
 */
export async function extractAudio(file, outputFormat, options = {}, onProgress) {
  const { bitrate = '192k', sampleRate = 44100 } = options

  const ffmpeg = await getFFmpeg(onProgress)
  const inputExt = file.name.split('.').pop().toLowerCase()
  const inputName = `input.${inputExt}`
  const outputName = `output.${outputFormat}`

  await ffmpeg.writeFile(inputName, await fetchFile(file))

  const args = [
    '-i', inputName,
    '-vn', // No video
    '-b:a', bitrate,
    '-ar', String(sampleRate),
  ]

  const audioCodec = getAudioCodecByFormat(outputFormat)
  if (audioCodec) args.push('-c:a', audioCodec)

  args.push('-y', outputName)

  await ffmpeg.exec(args)
  const data = await ffmpeg.readFile(outputName)

  await ffmpeg.deleteFile(inputName)
  await ffmpeg.deleteFile(outputName)

  const baseName = file.name.replace(/\.[^.]+$/, '')
  const mimeMap = {
    mp3: 'audio/mpeg', wav: 'audio/wav', aac: 'audio/aac',
  }

  return new File([data.buffer], `${baseName}.${outputFormat}`, {
    type: mimeMap[outputFormat] || 'audio/mpeg',
  })
}

function getVideoCodec(format) {
  const codecs = {
    mp4: 'libx264',
    webm: 'libvpx',
    mov: 'libx264',
    avi: 'libx264',
    mkv: 'libx264',
    flv: 'libx264',
  }
  return codecs[format] || null
}

function getAudioCodecForContainer(format) {
  const codecs = {
    mp4: 'aac',
    webm: 'libvorbis',
    mov: 'aac',
    avi: 'mp3',
    mkv: 'aac',
    flv: 'aac',
  }
  return codecs[format] || null
}

function getAudioCodecByFormat(format) {
  const codecs = {
    mp3: 'libmp3lame',
    wav: 'pcm_s16le',
    aac: 'aac',
    ogg: 'libvorbis',
    flac: 'flac',
  }
  return codecs[format] || null
}
