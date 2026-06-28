/**
 * compositor.ts
 *
 * Composites multiple captured photos into a single strip / grid PNG
 * according to the chosen template layout and composite style.
 */

import type { Photo, Template, CompositeStyle } from '@/types'

// ── Photo image area per layout (width × height in pixels) ──────────────────
// These are the dimensions of each individual photo cell in the output.
const PHOTO_DIMS: Record<string, { w: number; h: number }> = {
  single: { w: 640, h: 480 },
  double: { w: 560, h: 420 },
  quad:   { w: 420, h: 315 },
  six:    { w: 340, h: 255 },
}

// ── Grid columns × rows per layout ──────────────────────────────────────────
const GRID: Record<string, { cols: number; rows: number }> = {
  single: { cols: 1, rows: 1 },
  double: { cols: 1, rows: 2 },
  quad:   { cols: 2, rows: 2 },
  six:    { cols: 3, rows: 2 },
}

const GAP      = 12   // px gap between photo cells
const PAD      = 24   // px outer padding
const FOOTER_H = 32   // px watermark footer

// Polaroid border thickness
const POL_THIN   = 10  // top / left / right border
const POL_BOTTOM_RATIO = 0.22  // bottom caption strip = 22% of photo height

// ── Helpers ─────────────────────────────────────────────────────────────────

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload  = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

/** Draw image centre-cropped ("cover") into destination rect. */
function drawCoverCrop(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number, dy: number, dw: number, dh: number,
) {
  const scale = Math.max(dw / img.naturalWidth, dh / img.naturalHeight)
  const sw = dw / scale
  const sh = dh / scale
  const sx = (img.naturalWidth  - sw) / 2
  const sy = (img.naturalHeight - sh) / 2
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh)
}

/** Manual rounded-rect path (works in all envs where roundRect may not). */
function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.quadraticCurveTo(x + w, y, x + w, y + r)
  ctx.lineTo(x + w, y + h - r)
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
  ctx.lineTo(x + r, y + h)
  ctx.quadraticCurveTo(x, y + h, x, y + h - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

// ── Main composite function ──────────────────────────────────────────────────

export async function composeStrip(
  photos: Photo[],
  template: Template,
  polaroidCaption = '',
): Promise<string> {
  const layout = template.layout as 'single' | 'double' | 'quad' | 'six'
  const style: CompositeStyle = template.compositeStyle ?? 'clean'

  const { cols, rows } = GRID[layout]
  const photo = PHOTO_DIMS[layout]

  // Polaroid style enlarges each slot with borders
  const polBottom = style === 'polaroid' ? Math.round(photo.h * POL_BOTTOM_RATIO) : 0
  const polThin   = style === 'polaroid' ? POL_THIN : 0

  // Outer slot dimensions (what each cell occupies on the canvas)
  const slotW = photo.w + polThin * 2
  const slotH = photo.h + polThin + polBottom

  // Full canvas size
  const canvasW = cols * slotW + (cols - 1) * GAP + 2 * PAD
  const canvasH = rows * slotH + (rows - 1) * GAP + 2 * PAD + FOOTER_H

  const canvas = document.createElement('canvas')
  canvas.width  = canvasW
  canvas.height = canvasH
  const ctx = canvas.getContext('2d')!

  // ── Draw background ──────────────────────────────────────────────────────
  switch (style) {
    case 'film': {
      ctx.fillStyle = '#161616'
      ctx.fillRect(0, 0, canvasW, canvasH)
      break
    }
    case 'blush': {
      const grad = ctx.createLinearGradient(0, 0, 0, canvasH)
      grad.addColorStop(0, '#FDF5F7')
      grad.addColorStop(1, '#FFE0EE')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvasW, canvasH)
      break
    }
    case 'polaroid': {
      ctx.fillStyle = '#F7EEF2'
      ctx.fillRect(0, 0, canvasW, canvasH)
      break
    }
    case 'frame': {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvasW, canvasH)
      break
    }
    default: {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvasW, canvasH)
    }
  }

  // ── Film: sprocket holes along left + right edges ────────────────────────
  if (style === 'film') {
    const holeW = 13
    const holeH = 20
    const holeSpacing = 36
    const holeXPositions = [PAD * 0.35, canvasW - PAD * 0.35 - holeW]
    ctx.fillStyle = 'rgba(255,255,255,0.14)'
    for (const hx of holeXPositions) {
      let hy = PAD * 0.6
      while (hy + holeH < canvasH - FOOTER_H - PAD * 0.4) {
        roundRectPath(ctx, hx, hy, holeW, holeH, 3)
        ctx.fill()
        hy += holeSpacing
      }
    }
  }

  // ── Frame: load and draw PNG background ──────────────────────────────────
  let frameImg: HTMLImageElement | null = null
  if (style === 'frame' && template.frameImage) {
    try {
      frameImg = await loadImage(template.frameImage)
      const fw = canvasW
      const fh = canvasH - FOOTER_H
      const imgScale = Math.max(fw / frameImg.naturalWidth, fh / frameImg.naturalHeight)
      const sw = fw / imgScale
      const sh = fh / imgScale
      const sx = (frameImg.naturalWidth - sw) / 2
      const sy = (frameImg.naturalHeight - sh) / 2
      ctx.drawImage(frameImg, sx, sy, sw, sh, 0, 0, fw, fh)
    } catch {
      // Frame image failed to load, continue with white background
    }
  }

  // ── Minimal: outer border ────────────────────────────────────────────────
  if (style === 'minimal') {
    ctx.strokeStyle = '#F5C5D8'
    ctx.lineWidth = 3
    ctx.strokeRect(1.5, 1.5, canvasW - 3, canvasH - FOOTER_H - 1.5)
  }

  // ── Load all photo images in parallel ────────────────────────────────────
  const totalSlots = cols * rows
  const loadedImgs = await Promise.all(
    Array.from({ length: totalSlots }, (_, i) =>
      photos[i]
        ? loadImage(photos[i].url).catch(() => null)
        : Promise.resolve(null),
    ),
  )

  // ── Draw each photo slot ─────────────────────────────────────────────────
  let idx = 0
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const slotX = PAD + col * (slotW + GAP)
      const slotY = PAD + row * (slotH + GAP)

      // Photo image area (offset by polaroid border if applicable)
      const imgX = slotX + polThin
      const imgY = slotY + polThin
      const imgW = photo.w
      const imgH = photo.h

      const img = loadedImgs[idx++]

      // ── Polaroid white card (drawn first as background) ──
      if (style === 'polaroid') {
        ctx.save()
        ctx.shadowColor    = 'rgba(0,0,0,0.15)'
        ctx.shadowBlur     = 18
        ctx.shadowOffsetY  = 5
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(slotX, slotY, slotW, slotH)
        ctx.restore()
      }

      // ── Photo image or placeholder ──
      if (img) {
        ctx.save()
        if (style === 'blush' || style === 'frame') {
          roundRectPath(ctx, imgX, imgY, imgW, imgH, 6)
        } else {
          ctx.beginPath()
          ctx.rect(imgX, imgY, imgW, imgH)
        }
        ctx.clip()
        drawCoverCrop(ctx, img, imgX, imgY, imgW, imgH)
        ctx.restore()

        // ── Frame: subtle shadow on photos ──
        if (style === 'frame') {
          ctx.save()
          ctx.shadowColor = 'rgba(0,0,0,0.25)'
          ctx.shadowBlur = 12
          ctx.shadowOffsetY = 4
          ctx.strokeStyle = 'rgba(255,255,255,0.9)'
          ctx.lineWidth = 2
          roundRectPath(ctx, imgX, imgY, imgW, imgH, 6)
          ctx.stroke()
          ctx.restore()
        }
      } else {
        // Empty slot placeholder
        if (style === 'polaroid') {
          ctx.fillStyle = '#F9EEF3'
          ctx.fillRect(imgX, imgY, imgW, imgH)
        } else if (style === 'film') {
          ctx.fillStyle = '#2A2A2A'
          ctx.fillRect(imgX, imgY, imgW, imgH)
        } else if (style === 'blush') {
          ctx.fillStyle = '#F9D5E5'
          roundRectPath(ctx, imgX, imgY, imgW, imgH, 6)
          ctx.fill()
        } else if (style === 'frame') {
          ctx.fillStyle = 'rgba(255,255,255,0.85)'
          roundRectPath(ctx, imgX, imgY, imgW, imgH, 6)
          ctx.fill()
        } else {
          ctx.fillStyle = '#F5E8ED'
          ctx.fillRect(imgX, imgY, imgW, imgH)
        }
        // Dashed border on placeholder
        ctx.save()
        ctx.strokeStyle = style === 'film' ? '#3A3A3A' : style === 'frame' ? 'rgba(200,180,190,0.6)' : 'rgba(245,197,216,0.8)'
        ctx.lineWidth = 1.5
        ctx.setLineDash([5, 5])
        ctx.strokeRect(imgX + 6, imgY + 6, imgW - 12, imgH - 12)
        ctx.restore()
      }

      // ── Minimal: thin pink border over each slot ──
      if (style === 'minimal') {
        ctx.strokeStyle = '#F5C5D8'
        ctx.lineWidth = 1.5
        ctx.strokeRect(imgX, imgY, imgW, imgH)
      }

      // ── Polaroid caption text (bottom strip) ──
      if (style === 'polaroid' && polBottom > 0) {
        const captionCenterY = slotY + polThin + photo.h + polBottom / 2
        if (polaroidCaption.trim()) {
          ctx.fillStyle = '#9B6B7B'
          ctx.font      = `italic ${Math.round(polBottom * 0.44)}px cursive`
          ctx.textAlign    = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(
            polaroidCaption,
            slotX + slotW / 2,
            captionCenterY,
          )
        } else {
          // Subtle default label
          ctx.fillStyle = 'rgba(155, 107, 123, 0.35)'
          ctx.font      = `italic ${Math.round(polBottom * 0.36)}px cursive`
          ctx.textAlign    = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText('ClickStudio', slotX + slotW / 2, captionCenterY)
        }
      }
    }
  }

  // ── Footer watermark ─────────────────────────────────────────────────────
  const footerY = canvasH - FOOTER_H
  if (style === 'film') {
    ctx.fillStyle = '#111111'
  } else if (style === 'polaroid') {
    ctx.fillStyle = '#F0E4EA'
  } else if (style === 'blush') {
    ctx.fillStyle = 'rgba(255,224,238,0.7)'
  } else if (style === 'frame') {
    ctx.fillStyle = 'rgba(255,255,255,0.85)'
  } else {
    ctx.fillStyle = '#FFF0F5'
  }
  ctx.fillRect(0, footerY, canvasW, FOOTER_H)

  ctx.fillStyle =
    style === 'film'
      ? 'rgba(255,255,255,0.35)'
      : style === 'frame'
        ? 'rgba(155, 107, 123, 0.45)'
        : 'rgba(155, 107, 123, 0.55)'
  ctx.font         = `italic ${Math.round(FOOTER_H * 0.48)}px cursive`
  ctx.textAlign    = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('✦ ClickStudio', canvasW / 2, footerY + FOOTER_H / 2)

  return canvas.toDataURL('image/png', 1.0)
}

/** Trigger a browser download for a composite data URL. */
export function downloadComposite(
  dataUrl: string,
  filename = 'clickstudio-strip.png',
) {
  const a = document.createElement('a')
  a.href     = dataUrl
  a.download = filename
  a.click()
}
