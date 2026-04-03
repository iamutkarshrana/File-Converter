export const TOOLS = [
  // Image conversions
  { slug: 'jpg-to-png', inputFormat: 'jpg', outputFormat: 'png', category: 'image', title: 'JPG to PNG', description: 'Convert JPG images to PNG format with transparency support.', metaDescription: 'Convert JPG images to PNG format free, instantly, in your browser. No upload required. 100% private.' },
  { slug: 'jpg-to-webp', inputFormat: 'jpg', outputFormat: 'webp', category: 'image', title: 'JPG to WebP', description: 'Convert JPG to WebP for smaller file sizes and faster web loading.', metaDescription: 'Convert JPG to WebP format free online. Smaller files, same quality. Runs in your browser — no upload needed.' },
  { slug: 'png-to-jpg', inputFormat: 'png', outputFormat: 'jpg', category: 'image', title: 'PNG to JPG', description: 'Convert PNG images to JPG for smaller file sizes.', metaDescription: 'Convert PNG to JPG free online. Reduce file size while maintaining quality. 100% browser-based.' },
  { slug: 'png-to-webp', inputFormat: 'png', outputFormat: 'webp', category: 'image', title: 'PNG to WebP', description: 'Convert PNG to WebP for modern web optimization.', metaDescription: 'Convert PNG to WebP free online. Optimize images for the web. No files uploaded — runs in your browser.' },
  { slug: 'webp-to-jpg', inputFormat: 'webp', outputFormat: 'jpg', category: 'image', title: 'WebP to JPG', description: 'Convert WebP images to universally supported JPG format.', metaDescription: 'Convert WebP to JPG free online. Maximum compatibility across all devices. Browser-based, private.' },
  { slug: 'webp-to-png', inputFormat: 'webp', outputFormat: 'png', category: 'image', title: 'WebP to PNG', description: 'Convert WebP to PNG with full transparency support.', metaDescription: 'Convert WebP to PNG free online with transparency support. No upload required.' },
  { slug: 'heic-to-jpg', inputFormat: 'heic', outputFormat: 'jpg', category: 'image', title: 'HEIC to JPG', description: 'Convert iPhone HEIC photos to universally compatible JPG.', metaDescription: 'Convert HEIC to JPG free online. Perfect for iPhone photos. No upload — private browser conversion.' },
  { slug: 'heic-to-png', inputFormat: 'heic', outputFormat: 'png', category: 'image', title: 'HEIC to PNG', description: 'Convert iPhone HEIC photos to PNG format.', metaDescription: 'Convert HEIC to PNG free online. iPhone photo conversion in your browser. 100% private.' },
  { slug: 'svg-to-png', inputFormat: 'svg', outputFormat: 'png', category: 'image', title: 'SVG to PNG', description: 'Rasterize SVG vector graphics to PNG images.', metaDescription: 'Convert SVG to PNG free online. Rasterize vector graphics instantly in your browser.' },
  { slug: 'gif-to-mp4', inputFormat: 'gif', outputFormat: 'mp4', category: 'image', title: 'GIF to MP4', description: 'Convert animated GIFs to MP4 video for smaller files.', metaDescription: 'Convert GIF to MP4 free online. Dramatically smaller file sizes. Browser-based WebAssembly conversion.' },
  { slug: 'avif-to-jpg', inputFormat: 'avif', outputFormat: 'jpg', category: 'image', title: 'AVIF to JPG', description: 'Convert AVIF images to widely supported JPG format.', metaDescription: 'Convert AVIF to JPG free online. Maximum compatibility. Private browser conversion.' },
  { slug: 'avif-to-png', inputFormat: 'avif', outputFormat: 'png', category: 'image', title: 'AVIF to PNG', description: 'Convert AVIF images to PNG with transparency.', metaDescription: 'Convert AVIF to PNG free online. Transparent backgrounds preserved. No upload required.' },
  { slug: 'jpg-to-avif', inputFormat: 'jpg', outputFormat: 'avif', category: 'image', title: 'JPG to AVIF', description: 'Convert JPG to AVIF for next-gen image compression.', metaDescription: 'Convert JPG to AVIF free online. Next-generation image format with superior compression.' },
  { slug: 'png-to-avif', inputFormat: 'png', outputFormat: 'avif', category: 'image', title: 'PNG to AVIF', description: 'Convert PNG to AVIF for modern image compression.', metaDescription: 'Convert PNG to AVIF free online. Smaller files with better quality. Browser-based conversion.' },

  // Video conversions
  { slug: 'mp4-to-webm', inputFormat: 'mp4', outputFormat: 'webm', category: 'video', title: 'MP4 to WebM', description: 'Convert MP4 video to open WebM format.', metaDescription: 'Convert MP4 to WebM free online. Open video format for the web. Runs in your browser via WebAssembly.' },
  { slug: 'mp4-to-gif', inputFormat: 'mp4', outputFormat: 'gif', category: 'video', title: 'MP4 to GIF', description: 'Convert video clips to animated GIFs.', metaDescription: 'Convert MP4 to GIF free online. Create animated GIFs from video. Browser-based, no upload.' },
  { slug: 'mp4-to-mov', inputFormat: 'mp4', outputFormat: 'mov', category: 'video', title: 'MP4 to MOV', description: 'Convert MP4 to Apple QuickTime MOV format.', metaDescription: 'Convert MP4 to MOV free online. Apple-compatible format. WebAssembly-powered browser conversion.' },
  { slug: 'webm-to-mp4', inputFormat: 'webm', outputFormat: 'mp4', category: 'video', title: 'WebM to MP4', description: 'Convert WebM video to widely supported MP4.', metaDescription: 'Convert WebM to MP4 free online. Maximum compatibility. Browser-based conversion.' },
  { slug: 'mov-to-mp4', inputFormat: 'mov', outputFormat: 'mp4', category: 'video', title: 'MOV to MP4', description: 'Convert QuickTime MOV to universally supported MP4.', metaDescription: 'Convert MOV to MP4 free online. Works everywhere. No upload — private browser conversion.' },
  { slug: 'avi-to-mp4', inputFormat: 'avi', outputFormat: 'mp4', category: 'video', title: 'AVI to MP4', description: 'Convert AVI video to modern MP4 format.', metaDescription: 'Convert AVI to MP4 free online. Modernize your videos. Browser-based WebAssembly conversion.' },
  { slug: 'mkv-to-mp4', inputFormat: 'mkv', outputFormat: 'mp4', category: 'video', title: 'MKV to MP4', description: 'Convert MKV to MP4 for universal playback.', metaDescription: 'Convert MKV to MP4 free online. Play on any device. No upload required.' },
  { slug: 'video-to-gif', inputFormat: 'mp4', outputFormat: 'gif', category: 'video', title: 'Video to GIF', description: 'Create animated GIFs from any video file.', metaDescription: 'Convert any video to GIF free online. Create shareable animations. Browser-based conversion.' },

  // Audio conversions
  { slug: 'mp4-to-mp3', inputFormat: 'mp4', outputFormat: 'mp3', category: 'audio', title: 'MP4 to MP3', description: 'Extract audio from MP4 video as MP3.', metaDescription: 'Extract MP3 audio from MP4 video free online. Private browser-based extraction.' },
  { slug: 'mp3-to-wav', inputFormat: 'mp3', outputFormat: 'wav', category: 'audio', title: 'MP3 to WAV', description: 'Convert MP3 to uncompressed WAV audio.', metaDescription: 'Convert MP3 to WAV free online. Lossless audio format. Browser-based conversion.' },
  { slug: 'wav-to-mp3', inputFormat: 'wav', outputFormat: 'mp3', category: 'audio', title: 'WAV to MP3', description: 'Compress WAV audio to smaller MP3 files.', metaDescription: 'Convert WAV to MP3 free online. Smaller files, great quality. No upload required.' },
  { slug: 'flac-to-mp3', inputFormat: 'flac', outputFormat: 'mp3', category: 'audio', title: 'FLAC to MP3', description: 'Convert lossless FLAC to portable MP3.', metaDescription: 'Convert FLAC to MP3 free online. Portable audio format. Private browser conversion.' },
  { slug: 'ogg-to-mp3', inputFormat: 'ogg', outputFormat: 'mp3', category: 'audio', title: 'OGG to MP3', description: 'Convert OGG Vorbis audio to MP3.', metaDescription: 'Convert OGG to MP3 free online. Universal audio format. Browser-based conversion.' },
  { slug: 'm4a-to-mp3', inputFormat: 'm4a', outputFormat: 'mp3', category: 'audio', title: 'M4A to MP3', description: 'Convert M4A (Apple) audio to MP3.', metaDescription: 'Convert M4A to MP3 free online. Universal compatibility. No upload — private conversion.' },
  { slug: 'mp3-to-aac', inputFormat: 'mp3', outputFormat: 'aac', category: 'audio', title: 'MP3 to AAC', description: 'Convert MP3 to AAC for better quality at lower bitrates.', metaDescription: 'Convert MP3 to AAC free online. Better audio quality at smaller sizes. Browser-based.' },

  // Document conversions
  { slug: 'pdf-to-word', inputFormat: 'pdf', outputFormat: 'docx', category: 'document', title: 'PDF to Word', description: 'Convert PDF documents to editable Word files.', metaDescription: 'Convert PDF to Word (DOCX) free online. Edit your PDF content. Powered by CloudConvert.' },
  { slug: 'word-to-pdf', inputFormat: 'docx', outputFormat: 'pdf', category: 'document', title: 'Word to PDF', description: 'Convert Word documents to PDF with full formatting.', metaDescription: 'Convert Word to PDF free online. Preserve formatting perfectly. Fast and secure.' },
  { slug: 'xlsx-to-csv', inputFormat: 'xlsx', outputFormat: 'csv', category: 'document', title: 'Excel to CSV', description: 'Convert Excel spreadsheets to CSV format.', metaDescription: 'Convert Excel to CSV free online. Browser-based, no upload required. 100% private.' },
  { slug: 'csv-to-xlsx', inputFormat: 'csv', outputFormat: 'xlsx', category: 'document', title: 'CSV to Excel', description: 'Convert CSV files to Excel spreadsheets.', metaDescription: 'Convert CSV to Excel free online. In-browser conversion. No file upload needed.' },
  { slug: 'pptx-to-pdf', inputFormat: 'pptx', outputFormat: 'pdf', category: 'document', title: 'PowerPoint to PDF', description: 'Convert PowerPoint presentations to PDF.', metaDescription: 'Convert PowerPoint to PDF free online. Preserve slides and formatting. Fast conversion.' },
  { slug: 'html-to-pdf', inputFormat: 'html', outputFormat: 'pdf', category: 'document', title: 'HTML to PDF', description: 'Convert HTML pages to PDF documents.', metaDescription: 'Convert HTML to PDF free online. Clean document conversion. Powered by CloudConvert.' },

  // PDF tools
  { slug: 'compress-pdf', inputFormat: 'pdf', outputFormat: 'pdf', category: 'document', title: 'Compress PDF', description: 'Reduce PDF file size while maintaining quality.', metaDescription: 'Compress PDF free online. Reduce file size in your browser. No upload required. 100% private.' },
  { slug: 'merge-pdf', inputFormat: 'pdf', outputFormat: 'pdf', category: 'document', title: 'Merge PDF', description: 'Combine multiple PDF files into one document.', metaDescription: 'Merge PDF files free online. Combine multiple PDFs in your browser. Private and secure.' },

  // eBook conversions
  { slug: 'epub-to-pdf', inputFormat: 'epub', outputFormat: 'pdf', category: 'ebook', title: 'EPUB to PDF', description: 'Convert EPUB eBooks to PDF for universal reading.', metaDescription: 'Convert EPUB to PDF free online. Read on any device. Powered by CloudConvert.' },
  { slug: 'epub-to-mobi', inputFormat: 'epub', outputFormat: 'mobi', category: 'ebook', title: 'EPUB to MOBI', description: 'Convert EPUB to MOBI for Kindle devices.', metaDescription: 'Convert EPUB to MOBI free online. Read on Kindle devices. Fast conversion.' },
  { slug: 'mobi-to-epub', inputFormat: 'mobi', outputFormat: 'epub', category: 'ebook', title: 'MOBI to EPUB', description: 'Convert MOBI eBooks to open EPUB format.', metaDescription: 'Convert MOBI to EPUB free online. Open eBook format. Works on all readers.' },
]

/**
 * Get tool config by slug
 */
export function getToolBySlug(slug) {
  return TOOLS.find(t => t.slug === slug) || null
}

/**
 * Get tools by category
 */
export function getToolsByCategory(category) {
  return TOOLS.filter(t => t.category === category)
}
