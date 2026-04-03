import * as XLSX from 'xlsx'

/**
 * Convert spreadsheet files (XLSX, CSV, ODS)
 */
export async function convertSpreadsheet(file, outputFormat, options = {}, onProgress) {
  if (onProgress) onProgress(10)

  const arrayBuffer = await file.arrayBuffer()

  if (onProgress) onProgress(30)

  const workbook = XLSX.read(arrayBuffer, { type: 'array' })

  if (onProgress) onProgress(60)

  let output
  let mime
  let ext = outputFormat

  switch (outputFormat) {
    case 'csv': {
      const sheetName = workbook.SheetNames[0]
      output = XLSX.utils.sheet_to_csv(workbook.Sheets[sheetName])
      mime = 'text/csv'
      break
    }
    case 'xlsx': {
      output = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
      mime = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      break
    }
    case 'ods': {
      output = XLSX.write(workbook, { bookType: 'ods', type: 'array' })
      mime = 'application/vnd.oasis.opendocument.spreadsheet'
      break
    }
    default:
      throw new Error(`Unsupported spreadsheet output format: ${outputFormat}`)
  }

  if (onProgress) onProgress(90)

  const baseName = file.name.replace(/\.[^.]+$/, '')

  let blob
  if (typeof output === 'string') {
    blob = new Blob([output], { type: mime })
  } else {
    blob = new Blob([new Uint8Array(output)], { type: mime })
  }

  if (onProgress) onProgress(100)

  return new File([blob], `${baseName}.${ext}`, { type: mime })
}
