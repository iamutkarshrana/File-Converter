import { NextResponse } from 'next/server'

const CLOUDCONVERT_API_KEY = process.env.CLOUDCONVERT_API_KEY
const CLOUDCONVERT_API_URL = 'https://api.cloudconvert.com/v2'

// Maximum file size: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024

// Allowed CloudConvert download domain
const ALLOWED_DOWNLOAD_HOST = 'storage.cloudconvert.com'

// Allowed input/output format pairs for security
const ALLOWED_CONVERSIONS = {
  docx: ['pdf', 'txt', 'html'],
  pdf: ['docx', 'pptx', 'jpg'],
  pptx: ['pdf'],
  xlsx: ['pdf', 'csv'],
  xls: ['pdf', 'xlsx'],
  odt: ['docx', 'pdf'],
  rtf: ['docx', 'pdf'],
  txt: ['pdf'],
  html: ['pdf'],
  epub: ['pdf', 'docx', 'mobi'],
  mobi: ['epub', 'pdf'],
  azw3: ['epub', 'pdf'],
  // RAW camera formats (FFmpeg.wasm can't decode these)
  cr2: ['jpg', 'png'],
  nef: ['jpg', 'png'],
  arw: ['jpg', 'png'],
  dng: ['jpg', 'png'],
  // Audio formats not supported by FFmpeg.wasm UMD
  wma: ['mp3', 'wav'],
}

/**
 * GET handler to proxy CloudConvert download URLs
 * This avoids COEP blocking cross-origin fetches from the browser
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const downloadUrl = searchParams.get('downloadUrl')

    if (!downloadUrl) {
      return NextResponse.json({ error: 'Missing downloadUrl parameter' }, { status: 400 })
    }

    // Validate the URL is from CloudConvert to prevent SSRF
    let parsedUrl
    try {
      parsedUrl = new URL(downloadUrl)
    } catch {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
    }

    if (parsedUrl.hostname !== ALLOWED_DOWNLOAD_HOST) {
      return NextResponse.json({ error: 'URL not from allowed domain' }, { status: 403 })
    }

    if (parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ error: 'Only HTTPS URLs allowed' }, { status: 403 })
    }

    const response = await fetch(downloadUrl)
    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch file' }, { status: 502 })
    }

    const blob = await response.blob()
    return new NextResponse(blob, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'application/octet-stream',
        'Content-Disposition': response.headers.get('Content-Disposition') || 'attachment',
      },
    })
  } catch (err) {
    console.error('Download proxy error:', err)
    return NextResponse.json({ error: 'Proxy download failed' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    if (!CLOUDCONVERT_API_KEY || CLOUDCONVERT_API_KEY === 'your_key_here') {
      return NextResponse.json(
        { error: 'CloudConvert API key not configured. Set CLOUDCONVERT_API_KEY in .env.local' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { fileBase64, inputFormat, outputFormat, filename } = body

    // Validate required fields
    if (!fileBase64 || !inputFormat || !outputFormat || !filename) {
      return NextResponse.json(
        { error: 'Missing required fields: fileBase64, inputFormat, outputFormat, filename' },
        { status: 400 }
      )
    }

    // Validate format pair
    const normalizedInput = inputFormat.toLowerCase()
    const normalizedOutput = outputFormat.toLowerCase()
    const allowedOutputs = ALLOWED_CONVERSIONS[normalizedInput]

    if (!allowedOutputs || !allowedOutputs.includes(normalizedOutput)) {
      return NextResponse.json(
        { error: `Conversion from ${normalizedInput} to ${normalizedOutput} is not supported` },
        { status: 400 }
      )
    }

    // Validate file size (base64 is ~33% larger than binary)
    const estimatedSize = (fileBase64.length * 3) / 4
    if (estimatedSize > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 100MB limit' },
        { status: 400 }
      )
    }

    // Sanitize filename
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 255)

    // Step 1: Create a job with upload + convert + export tasks
    const jobResponse = await fetch(`${CLOUDCONVERT_API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${CLOUDCONVERT_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tasks: {
          'upload-file': {
            operation: 'import/base64',
            file: fileBase64,
            filename: sanitizedFilename,
          },
          'convert-file': {
            operation: 'convert',
            input: 'upload-file',
            input_format: normalizedInput,
            output_format: normalizedOutput,
          },
          'export-file': {
            operation: 'export/url',
            input: 'convert-file',
          },
        },
      }),
    })

    if (!jobResponse.ok) {
      const errData = await jobResponse.json().catch(() => ({}))
      console.error('CloudConvert job creation failed:', errData)
      return NextResponse.json(
        { error: 'Failed to create conversion job' },
        { status: 502 }
      )
    }

    const job = await jobResponse.json()

    // Step 2: Poll for completion
    const jobId = job.data.id
    let attempts = 0
    const maxAttempts = 60 // 2 minutes max with 2s intervals

    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000))
      attempts++

      const statusResponse = await fetch(`${CLOUDCONVERT_API_URL}/jobs/${jobId}`, {
        headers: {
          'Authorization': `Bearer ${CLOUDCONVERT_API_KEY}`,
        },
      })

      if (!statusResponse.ok) {
        continue
      }

      const statusData = await statusResponse.json()
      const status = statusData.data.status

      if (status === 'finished') {
        // Find the export task with the download URL
        const exportTask = statusData.data.tasks.find(
          t => t.operation === 'export/url' && t.status === 'finished'
        )

        if (exportTask?.result?.files?.[0]?.url) {
          return NextResponse.json({
            downloadUrl: exportTask.result.files[0].url,
            filename: exportTask.result.files[0].filename,
          })
        }

        return NextResponse.json(
          { error: 'Conversion completed but no download URL found' },
          { status: 500 }
        )
      }

      if (status === 'error') {
        const errorTask = statusData.data.tasks.find(t => t.status === 'error')
        console.error('CloudConvert task error:', errorTask?.message)
        return NextResponse.json(
          { error: 'Conversion failed on the server' },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Conversion timed out. Please try again with a smaller file.' },
      { status: 504 }
    )
  } catch (err) {
    console.error('Document conversion error:', err)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
