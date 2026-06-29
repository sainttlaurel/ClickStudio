export interface FrameConfig {
  id: string
  name: string
  emoji: string
  aspectRatio: string
  frameImage?: string
}

export const FRAMES: FrameConfig[] = [
  { id: 'none', name: 'Clean', emoji: '✦', aspectRatio: '1/1' },
  { id: 'film', name: 'Film', emoji: '🎞️', aspectRatio: '3/2' },
  { id: 'blush', name: 'Blush', emoji: '🌸', aspectRatio: '4/5' },
  { id: 'minimal', name: 'Minimal', emoji: '⬜', aspectRatio: '1/1' },
  { id: 'polaroid', name: 'Polaroid', emoji: '🖼️', aspectRatio: '4/5' },
] as const

export type FrameId = (typeof FRAMES)[number]['id']

export function getFrameAspectRatio(frameId: string): string {
  const frame = FRAMES.find(f => f.id === frameId)
  return frame?.aspectRatio || '1/1'
}

export function calcFrameHeight(width: number, frameId: string, templateRatio?: string): number {
  if (templateRatio) {
    const [w, h] = templateRatio.split(/[:/]/).map(Number)
    return Math.round(width * h / w)
  }
  const frame = FRAMES.find(f => f.id === frameId)
  const ratio = frame?.aspectRatio || '1/1'
  const [w, h] = ratio.split('/').map(Number)
  return Math.round(width * h / w)
}
