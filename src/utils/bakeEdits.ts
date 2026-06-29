import { bakeFrameOverlay } from './frameOverlay'
import { calcFrameHeight } from '@/constants/frames'
import type { PhotoAdjustments } from '@/types'

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = url
  })
}

function adjustmentsToCss(adj: PhotoAdjustments): string {
  const parts: string[] = []
  if (adj.brightness !== 0) parts.push(`brightness(${1 + adj.brightness / 100})`)
  if (adj.contrast !== 0) parts.push(`contrast(${1 + adj.contrast / 100})`)
  if (adj.saturation !== 0) parts.push(`saturate(${1 + adj.saturation / 100})`)
  if (adj.exposure !== 0) parts.push(`brightness(${1 + adj.exposure / 100})`)
  if (adj.highlights !== 0) parts.push(`contrast(${1 + adj.highlights / 200})`)
  if (adj.shadows !== 0) parts.push(`brightness(${1 - adj.shadows / 200})`)
  if (adj.temperature !== 0) parts.push(`sepia(${Math.abs(adj.temperature) / 300})`)
  if (adj.tint !== 0) parts.push(`hue-rotate(${adj.tint / 2}deg)`)
  return parts.join(' ') || 'none'
}

export interface StickerData {
  id: string; emoji: string; x: number; y: number; scale?: number; rotation?: number
}

export interface TextData {
  id: string; text: string; color: string; fontSize: number; x: number; y: number; font?: string
}

export interface BakeOptions {
  imageUrl: string
  filterCss: string
  adjustments: PhotoAdjustments
  stickers: StickerData[]
  texts: TextData[]
  frameId?: string
  size?: { w: number; h: number }
}

export async function bakePhotoEdits(options: BakeOptions): Promise<string> {
  const defaultW = 640
  const defaultH = calcFrameHeight(defaultW, options.frameId || 'none')
  const size = options.size || { w: defaultW, h: defaultH }
  const canvas = document.createElement('canvas')
  canvas.width = size.w
  canvas.height = size.h
  const ctx = canvas.getContext('2d')!
  const img = await loadImage(options.imageUrl)

  const adjCss = adjustmentsToCss(options.adjustments)
  const combinedFilter = [adjCss, options.filterCss !== 'none' ? options.filterCss : ''].filter(Boolean).join(' ')

  ctx.drawImage(img, 0, 0, size.w, size.h)

  if (combinedFilter) {
    ctx.filter = combinedFilter
    ctx.drawImage(img, 0, 0, size.w, size.h)
    ctx.filter = 'none'
  }

  for (const sticker of options.stickers) {
    const x = (sticker.x / 100) * size.w
    const y = (sticker.y / 100) * size.h
    const scale = sticker.scale || 1
    const rotation = sticker.rotation || 0
    const fontSize = Math.round(scale * 40)

    ctx.save()
    ctx.translate(x, y)
    ctx.rotate((rotation * Math.PI) / 180)
    ctx.font = `${fontSize}px serif`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(sticker.emoji, 0, 0)
    ctx.restore()
  }

  for (const text of options.texts) {
    const x = (text.x / 100) * size.w
    const y = (text.y / 100) * size.h
    const fontSize = Math.round(text.fontSize * (size.w / 300))

    ctx.save()
    ctx.font = `${fontSize}px ${text.font || 'sans-serif'}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = text.color
    if (text.color === '#FFFFFF') {
      ctx.shadowColor = 'rgba(0,0,0,0.3)'
      ctx.shadowBlur = 3
    }
    ctx.fillText(text.text, x, y)
    ctx.restore()
  }

  bakeFrameOverlay(ctx, size.w, size.h, options.frameId)

  return canvas.toDataURL('image/png', 1.0)
}
