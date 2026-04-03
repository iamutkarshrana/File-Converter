import { FFmpeg } from '@ffmpeg/ffmpeg'
import { toBlobURL } from '@ffmpeg/util'

let ffmpegInstance = null
let isLoaded = false
let loadingPromise = null
let currentProgressHandler = null

function attachProgressHandler(onProgress) {
  // Remove previous handler to prevent stacking
  if (currentProgressHandler) {
    ffmpegInstance.off('progress', currentProgressHandler)
    currentProgressHandler = null
  }

  if (onProgress) {
    currentProgressHandler = ({ progress }) => {
      onProgress(Math.round(progress * 100))
    }
    ffmpegInstance.on('progress', currentProgressHandler)
  }
}

export async function getFFmpeg(onProgress) {
  if (isLoaded && ffmpegInstance) {
    attachProgressHandler(onProgress)
    return ffmpegInstance
  }

  // Prevent multiple simultaneous loads
  if (loadingPromise) {
    await loadingPromise
    attachProgressHandler(onProgress)
    return ffmpegInstance
  }

  loadingPromise = (async () => {
    ffmpegInstance = new FFmpeg()

    attachProgressHandler(onProgress)

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd'

    await ffmpegInstance.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })

    isLoaded = true
  })()

  await loadingPromise
  loadingPromise = null
  return ffmpegInstance
}

export function isFFmpegLoaded() {
  return isLoaded
}
