import { getFFmpeg } from '@/lib/ffmpegLoader'
import { fetchFile } from '@ffmpeg/util'

/**
 * Convert audio file using FFmpeg.wasm
 */
export async function convertAudio(file, outputFormat, options = {}, onProgress) {
  const {
    bitrate = '192k',
    sampleRate = 44100,
  } = options

  const ffmpeg = await getFFmpeg(onProgress)
  const inputExt = file.name.split('.').pop().toLowerCase()
  const inputName = `input.${inputExt}`
  const outputName = `output.${outputFormat}`

  await ffmpeg.writeFile(inputName, await fetchFile(file))

  const args = ['-i', inputName]

  // Set audio codec
  const codec = getCodec(outputFormat)
  if (codec) args.push('-c:a', codec)

  // Set bitrate (not for lossless formats)
  if (outputFormat !== 'wav' && outputFormat !== 'flac') {
    args.push('-b:a', bitrate)
  }

  // Set sample rate
  args.push('-ar', String(sampleRate))

  // No video stream
  args.push('-vn')

  args.push('-y', outputName)

  await ffmpeg.exec(args)
  const data = await ffmpeg.readFile(outputName)

  // Cleanup
  await ffmpeg.deleteFile(inputName)
  await ffmpeg.deleteFile(outputName)

  const baseName = file.name.replace(/\.[^.]+$/, '')
  const mimeMap = {
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    aac: 'audio/aac',
    ogg: 'audio/ogg',
    flac: 'audio/flac',
    m4a: 'audio/mp4',
    opus: 'audio/opus',
    wma: 'audio/x-ms-wma',
  }

  return new File([data.buffer], `${baseName}.${outputFormat}`, {
    type: mimeMap[outputFormat] || 'audio/mpeg',
  })
}

function getCodec(format) {
  // Note: FFmpeg.wasm UMD build may not have all codecs
  // libopus → fall back to libvorbis in OGG container
  // wmav2 → not available, WMA routed to server-side instead
  const codecs = {
    mp3: 'libmp3lame',
    wav: 'pcm_s16le',
    aac: 'aac',
    ogg: 'libvorbis',
    flac: 'flac',
    m4a: 'aac',
    opus: 'libvorbis', // libopus often unavailable in WASM UMD, use vorbis as fallback
  }
  return codecs[format] || null
}
