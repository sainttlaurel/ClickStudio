export const FRAMES = [
  { id: 'none', name: 'Clean', emoji: '✦' },
  { id: 'film', name: 'Film', emoji: '🎞️' },
  { id: 'blush', name: 'Blush', emoji: '🌸' },
  { id: 'minimal', name: 'Minimal', emoji: '⬜' },
  { id: 'polaroid', name: 'Polaroid', emoji: '🖼️' },
] as const

export type FrameId = (typeof FRAMES)[number]['id']
