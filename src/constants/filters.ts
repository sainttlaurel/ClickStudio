export const FILTERS = [
  { id: 'none',    name: 'Original', thumbColor: 'bg-pink-200', css: 'none' },
  { id: 'vintage', name: 'Vintage',  thumbColor: 'bg-orange-400', css: 'sepia(45%) contrast(1.1) brightness(1.05) saturate(0.85)' },
  { id: 'smooth',  name: 'Smooth',   thumbColor: 'bg-pink-100', css: 'brightness(1.1) contrast(0.88) saturate(0.85)' },
  { id: '70s',     name: '70s',      thumbColor: 'bg-purple-200', css: 'sepia(55%) saturate(1.6) contrast(1.08) brightness(1.1) hue-rotate(8deg)' },
  { id: '80s',     name: '80s',      thumbColor: 'bg-amber-200', css: 'contrast(1.35) saturate(1.7) brightness(1.1) hue-rotate(-25deg)' },
  { id: '90s',     name: '90s',      thumbColor: 'bg-yellow-200', css: 'sepia(18%) saturate(1.3) contrast(1.06) brightness(1.03)' },
  { id: 'bw',      name: 'B & W',    thumbColor: 'bg-gray-800', css: 'grayscale(100%) contrast(1.2)' },
  { id: 'faded',   name: 'Faded',    thumbColor: 'bg-gray-300', css: 'brightness(1.15) contrast(0.8) saturate(0.6)' },
  { id: 'lomo',    name: 'Lomo',     thumbColor: 'bg-purple-400', css: 'contrast(1.5) saturate(1.45) brightness(0.85)' },
  { id: 'cool',    name: 'Cool',     thumbColor: 'bg-blue-200', css: 'hue-rotate(20deg) saturate(1.25) contrast(1.08) brightness(1.02)' },
  { id: 'warm',    name: 'Warm',     thumbColor: 'bg-orange-300', css: 'sepia(35%) saturate(1.5) brightness(1.08)' },
  { id: 'film',    name: 'Film',     thumbColor: 'bg-yellow-400', css: 'sepia(25%) contrast(1.18) saturate(0.85) brightness(0.98)' },
  { id: 'dreamy',  name: 'Dreamy',   thumbColor: 'bg-teal-200', css: 'brightness(1.12) contrast(0.85) saturate(1.3)' },
] as const

export type FilterId = (typeof FILTERS)[number]['id']
