export const FILTERS = [
  { id: 'none',    name: 'Original', css: 'none' },
  { id: 'vintage', name: 'Vintage',  css: 'sepia(45%) contrast(1.1) brightness(1.05) saturate(0.85)' },
  { id: 'smooth',  name: 'Smooth',   css: 'brightness(1.1) contrast(0.88) saturate(0.85)' },
  { id: '70s',     name: '70s',      css: 'sepia(55%) saturate(1.6) contrast(1.08) brightness(1.1) hue-rotate(8deg)' },
  { id: '80s',     name: '80s',      css: 'contrast(1.35) saturate(1.7) brightness(1.1) hue-rotate(-25deg)' },
  { id: '90s',     name: '90s',      css: 'sepia(18%) saturate(1.3) contrast(1.06) brightness(1.03)' },
  { id: 'bw',      name: 'B & W',    css: 'grayscale(100%) contrast(1.2)' },
  { id: 'faded',   name: 'Faded',    css: 'brightness(1.15) contrast(0.8) saturate(0.6)' },
  { id: 'lomo',    name: 'Lomo',     css: 'contrast(1.5) saturate(1.45) brightness(0.85)' },
  { id: 'cool',    name: 'Cool',     css: 'hue-rotate(20deg) saturate(1.25) contrast(1.08) brightness(1.02)' },
  { id: 'warm',    name: 'Warm',     css: 'sepia(35%) saturate(1.5) brightness(1.08)' },
  { id: 'film',    name: 'Film',     css: 'sepia(25%) contrast(1.18) saturate(0.85) brightness(0.98)' },
  { id: 'dreamy',  name: 'Dreamy',   css: 'brightness(1.12) contrast(0.85) saturate(1.3)' },
] as const

export type FilterId = (typeof FILTERS)[number]['id']
