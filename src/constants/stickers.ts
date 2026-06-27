/**
 * stickers.ts
 *
 * Emoji sticker packs for the photo editor.
 * Y2K / coquette / aesthetic themed.
 */

export interface StickerPack {
  name: string
  emoji: string
  stickers: string[]
}

export const STICKER_PACKS: StickerPack[] = [
  {
    name: 'Favorites',
    emoji: '⭐',
    stickers: ['♡', '⭐', '✦', '🎀', '🌸', '💕', '📸', '✨'],
  },
  {
    name: 'Coquette',
    emoji: '🎀',
    stickers: ['🎀', '💗', '🩷', '🧸', '🪞', '🦋', '🌷', '🩰'],
  },
  {
    name: 'Y2K',
    emoji: '✨',
    stickers: ['✨', '💫', '🌟', '⚡', '🔥', '💎', '👑', '💖'],
  },
  {
    name: 'Nature',
    emoji: '🌸',
    stickers: ['🌸', '🌺', '🌻', '🌷', '🌹', '🍀', '🌿', '🌙'],
  },
  {
    name: 'Fun',
    emoji: '🎉',
    stickers: ['🎉', '🎊', '🎈', '🎵', '🎶', '🎁', '🪅', '🎯'],
  },
  {
    name: 'Faces',
    emoji: '😊',
    stickers: ['😊', '🥰', '😎', '🤩', '😍', '🫶', '💋', '😘'],
  },
]

export interface TextPreset {
  name: string
  font: string
  style: string
}

export const TEXT_PRESETS: TextPreset[] = [
  { name: 'Script', font: 'Dancing Script', style: 'italic' },
  { name: 'Serif', font: 'DM Serif Display', style: 'normal' },
  { name: 'Sans', font: 'Inter', style: 'normal' },
  { name: 'Mono', font: 'monospace', style: 'normal' },
]

export const TEXT_COLORS = [
  '#FFFFFF',
  '#000000',
  '#E91E8C',
  '#FF85A2',
  '#F5C5D8',
  '#1C0B1A',
  '#FFD700',
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
]
