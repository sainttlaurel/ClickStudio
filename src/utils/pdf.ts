/**
 * pdf.ts
 *
 * Generates print-ready PDF from photo strip composite.
 * Supports standard photo booth sizes and custom layouts.
 */

import { jsPDF } from 'jspdf'

export type PrintSize =
  | '2x6'      // Standard photo booth strip (2" x 6")
  | '4x6'      // Standard photo print (4" x 6")
  | 'a4-1'     // A4 with 1 strip
  | 'a4-2'     // A4 with 2 strips (side by side)
  | 'letter-1' // US Letter with 1 strip
  | 'letter-2' // US Letter with 2 strips

interface PrintSizeConfig {
  name: string
  pageWidth: number  // mm
  pageHeight: number // mm
  stripsPerPage: number
  stripWidth: number  // mm
  stripHeight: number // mm
  marginX: number
  marginY: number
  gap: number
}

const PRINT_SIZES: Record<PrintSize, PrintSizeConfig> = {
  '2x6': {
    name: '2" × 6" Strip',
    pageWidth: 50.8,   // 2 inches = 50.8 mm
    pageHeight: 152.4, // 6 inches = 152.4 mm
    stripsPerPage: 1,
    stripWidth: 50.8,
    stripHeight: 152.4,
    marginX: 0,
    marginY: 0,
    gap: 0,
  },
  '4x6': {
    name: '4" × 6" Print',
    pageWidth: 101.6,  // 4 inches = 101.6 mm
    pageHeight: 152.4, // 6 inches = 152.4 mm
    stripsPerPage: 1,
    stripWidth: 101.6,
    stripHeight: 152.4,
    marginX: 0,
    marginY: 0,
    gap: 0,
  },
  'a4-1': {
    name: 'A4 (1 strip)',
    pageWidth: 210,
    pageHeight: 297,
    stripsPerPage: 1,
    stripWidth: 180,
    stripHeight: 250,
    marginX: 15,
    marginY: 23.5,
    gap: 0,
  },
  'a4-2': {
    name: 'A4 (2 strips)',
    pageWidth: 210,
    pageHeight: 297,
    stripsPerPage: 2,
    stripWidth: 180,
    stripHeight: 120,
    marginX: 15,
    marginY: 28.5,
    gap: 10,
  },
  'letter-1': {
    name: 'US Letter (1 strip)',
    pageWidth: 215.9,
    pageHeight: 279.4,
    stripsPerPage: 1,
    stripWidth: 185.9,
    stripHeight: 235,
    marginX: 15,
    marginY: 22.2,
    gap: 0,
  },
  'letter-2': {
    name: 'US Letter (2 strips)',
    pageWidth: 215.9,
    pageHeight: 279.4,
    stripsPerPage: 2,
    stripWidth: 185.9,
    stripHeight: 112,
    marginX: 15,
    marginY: 27.7,
    gap: 10,
  },
}

const DPI = 300

/** Convert mm to pixels at 300 DPI */
function mmToPx(mm: number): number {
  return Math.round((mm / 25.4) * DPI)
}

/**
 * Generate a print-ready PDF from a composite strip data URL.
 */
export async function generatePrintPDF(
  compositeDataUrl: string,
  printSize: PrintSize = '2x6',
  filename = 'clickstudio-print.pdf'
): Promise<void> {
  const config = PRINT_SIZES[printSize]

  // Create PDF at target page size in mm
  const pdf = new jsPDF({
    orientation: config.pageWidth < config.pageHeight ? 'portrait' : 'landscape',
    unit: 'mm',
    format: [config.pageWidth, config.pageHeight],
  })

  // Load the composite image
  const img = await loadImage(compositeDataUrl)

  // Calculate strip dimensions in pixels at 300 DPI
  const stripW = mmToPx(config.stripWidth)
  const stripH = mmToPx(config.stripHeight)

  // Draw the image(s) on a canvas at print resolution
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = mmToPx(config.pageWidth)
  canvas.height = mmToPx(config.pageHeight)

  // White background
  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Draw strip(s) centered
  for (let i = 0; i < config.stripsPerPage; i++) {
    const x = mmToPx(config.marginX) + i * (stripW + mmToPx(config.gap))
    const y = mmToPx(config.marginY)

    // Draw image with cover crop
    drawCoverCrop(ctx, img, x, y, stripW, stripH)
  }

  // Add PDF metadata
  pdf.setProperties({
    title: 'ClickStudio Photo Strip',
    creator: 'ClickStudio',
  })

  // Add the canvas as image to PDF
  const pageDataUrl = canvas.toDataURL('image/jpeg', 0.95)
  pdf.addImage(pageDataUrl, 'JPEG', 0, 0, config.pageWidth, config.pageHeight)

  // Save
  pdf.save(filename)
}

/** Load image from data URL */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

/** Draw image centre-cropped ("cover") into destination rect */
function drawCoverCrop(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number, dy: number, dw: number, dh: number,
) {
  const scale = Math.max(dw / img.naturalWidth, dh / img.naturalHeight)
  const sw = dw / scale
  const sh = dh / scale
  const sx = (img.naturalWidth - sw) / 2
  const sy = (img.naturalHeight - sh) / 2
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
}

/** Get available print sizes for UI */
export function getPrintSizes(): { value: PrintSize; label: string }[] {
  return Object.entries(PRINT_SIZES).map(([value, config]) => ({
    value: value as PrintSize,
    label: config.name,
  }))
}