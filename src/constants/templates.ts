export interface TemplateLibraryItem {
  id: string
  name: string
  description: string
  layout: 'single' | 'double' | 'quad' | 'six'
  aspectRatio: '1:1' | '3:4' | '4:3' | '16:9' | '2:3'
  compositeStyle: 'clean' | 'polaroid' | 'film' | 'blush' | 'minimal' | 'frame'
  preview: string
  previewEmoji?: string
  frameImage?: string
  badge?: { label: string; variant: 'new' | 'popular' | 'trending' | 'collab' }
  categories: string[]
  popular?: boolean
}

export const TEMPLATE_CATEGORIES = [
  { id: 'all', name: 'All', emoji: '✦' },
  { id: 'birthday', name: 'Birthday', emoji: '🎂' },
  { id: 'wedding', name: 'Wedding', emoji: '💍' },
  { id: 'graduation', name: 'Graduation', emoji: '🎓' },
  { id: 'couple', name: 'Couple', emoji: '💕' },
  { id: 'friends', name: 'Friends', emoji: '👯' },
  { id: 'family', name: 'Family', emoji: '👨‍👩‍👧‍👦' },
  { id: 'holiday', name: 'Holiday', emoji: '🎄' },
  { id: 'kp', name: 'K-Pop', emoji: '🎤' },
  { id: 'vintage', name: 'Vintage', emoji: '📻' },
  { id: 'minimal', name: 'Minimal', emoji: '◻️' },
  { id: 'aesthetic', name: 'Aesthetic', emoji: '🌸' },
  { id: 'seasonal', name: 'Seasonal', emoji: '🌻' },
  { id: 'corporate', name: 'Corporate', emoji: '💼' },
  { id: 'custom', name: 'Custom', emoji: '✨' },
]

export const TEMPLATE_LIBRARY: TemplateLibraryItem[] = [
  { id: 'single-square', name: 'Single', description: 'One perfect shot', layout: 'single', aspectRatio: '1:1', compositeStyle: 'clean', preview: '', previewEmoji: '📸', badge: { label: 'Popular', variant: 'popular' }, categories: ['all', 'minimal', 'aesthetic'] },
  { id: 'single-polaroid', name: 'Polaroid Single', description: 'Classic instant photo', layout: 'single', aspectRatio: '1:1', compositeStyle: 'polaroid', preview: '', previewEmoji: '📷', categories: ['all', 'vintage', 'aesthetic', 'wedding'] },
  { id: 'single-blush', name: 'Blush Portrait', description: 'Soft pink glow', layout: 'single', aspectRatio: '3:4', compositeStyle: 'blush', preview: '', previewEmoji: '🌸', badge: { label: 'New', variant: 'new' }, categories: ['all', 'aesthetic', 'birthday', 'couple'] },
  { id: 'single-film', name: 'Film Frame', description: 'Cinematic feel', layout: 'single', aspectRatio: '16:9', compositeStyle: 'film', preview: '', previewEmoji: '🎥', categories: ['all', 'vintage', 'minimal'] },
  { id: 'single-minimal', name: 'Clean Cut', description: 'Thin white border', layout: 'single', aspectRatio: '1:1', compositeStyle: 'minimal', preview: '', previewEmoji: '✧', categories: ['all', 'minimal', 'corporate', 'family'] },
  { id: 'double-vertical', name: 'Double Strip', description: 'Two shots vertical', layout: 'double', aspectRatio: '2:3', compositeStyle: 'clean', preview: '', previewEmoji: '🎞️', categories: ['all', 'minimal', 'friends', 'couple'] },
  { id: 'double-film', name: 'Film Roll', description: 'Double film strip', layout: 'double', aspectRatio: '2:3', compositeStyle: 'film', preview: '', previewEmoji: '🎥', badge: { label: 'Trending', variant: 'trending' }, categories: ['all', 'vintage', 'holiday', 'friends'] },
  { id: 'double-polaroid', name: 'Double Polaroid', description: 'Two polaroids stacked', layout: 'double', aspectRatio: '2:3', compositeStyle: 'polaroid', preview: '', previewEmoji: '📷', categories: ['all', 'vintage', 'wedding', 'graduation'] },
  { id: 'double-blush', name: 'Blush Duo', description: 'Pink gradient double', layout: 'double', aspectRatio: '2:3', compositeStyle: 'blush', preview: '', previewEmoji: '🌸', categories: ['all', 'aesthetic', 'birthday', 'couple'] },
  { id: 'double-minimal', name: 'Slim Strip', description: 'Minimal double', layout: 'double', aspectRatio: '2:3', compositeStyle: 'minimal', preview: '', previewEmoji: '✧', categories: ['all', 'minimal', 'corporate'] },
  { id: 'quad-square', name: 'Four Cuts', description: 'Classic 2×2 grid', layout: 'quad', aspectRatio: '1:1', compositeStyle: 'clean', preview: '', previewEmoji: '🖼️', badge: { label: 'New', variant: 'new' }, categories: ['all', 'minimal', 'friends', 'family', 'birthday'] },
  { id: 'quad-polaroid', name: 'Polaroid Grid', description: 'Four polaroid shots', layout: 'quad', aspectRatio: '1:1', compositeStyle: 'polaroid', preview: '', previewEmoji: '📷', categories: ['all', 'vintage', 'wedding', 'holiday'] },
  { id: 'quad-film', name: 'Film Strip 4', description: 'Grid with film borders', layout: 'quad', aspectRatio: '1:1', compositeStyle: 'film', preview: '', previewEmoji: '🎞️', categories: ['all', 'vintage', 'kp', 'friends'] },
  { id: 'quad-blush', name: 'Blush Edit', description: 'Pink gradient quad', layout: 'quad', aspectRatio: '1:1', compositeStyle: 'blush', preview: '', previewEmoji: '🌸', badge: { label: 'Popular', variant: 'popular' }, categories: ['all', 'aesthetic', 'birthday', 'couple', 'seasonal'] },
  { id: 'quad-minimal', name: 'Clean Grid', description: 'Minimal 2×2', layout: 'quad', aspectRatio: '1:1', compositeStyle: 'minimal', preview: '', previewEmoji: '✧', categories: ['all', 'minimal', 'corporate', 'family'] },
  { id: 'quad-kpop', name: 'K-Pop Grid', description: 'Bold vibrant grid', layout: 'quad', aspectRatio: '1:1', compositeStyle: 'clean', preview: '', previewEmoji: '🎤', categories: ['all', 'kp', 'friends', 'aesthetic'] },
  { id: 'quad-vintage', name: 'Retro Grid', description: 'Warm sepia tones', layout: 'quad', aspectRatio: '1:1', compositeStyle: 'film', preview: '', previewEmoji: '📻', categories: ['all', 'vintage', 'holiday'] },
  { id: 'quad-wedding', name: 'Love Grid', description: 'Romantic 2×2', layout: 'quad', aspectRatio: '1:1', compositeStyle: 'blush', preview: '', previewEmoji: '💍', categories: ['all', 'wedding', 'couple'] },
  { id: 'six-strip', name: 'Photo Strip', description: '6 shots, 3 columns', layout: 'six', aspectRatio: '4:3', compositeStyle: 'clean', preview: '', previewEmoji: '📠', categories: ['all', 'minimal', 'friends', 'family'] },
  { id: 'six-polaroid', name: 'Polaroid Strip', description: '6 polaroid style', layout: 'six', aspectRatio: '4:3', compositeStyle: 'polaroid', preview: '', previewEmoji: '📷', badge: { label: 'Trending', variant: 'trending' }, categories: ['all', 'vintage', 'holiday', 'graduation', 'friends'] },
  { id: 'six-film', name: 'Film Contact', description: 'Contact sheet look', layout: 'six', aspectRatio: '4:3', compositeStyle: 'film', preview: '', previewEmoji: '🎞️', categories: ['all', 'vintage', 'kp'] },
  { id: 'six-blush', name: 'Pink Strip', description: 'Pink gradient strip', layout: 'six', aspectRatio: '4:3', compositeStyle: 'blush', preview: '', previewEmoji: '🌸', categories: ['all', 'aesthetic', 'birthday', 'seasonal'] },
  { id: 'six-minimal', name: 'Clean Strip', description: 'Minimal 3×2', layout: 'six', aspectRatio: '4:3', compositeStyle: 'minimal', preview: '', previewEmoji: '✧', categories: ['all', 'minimal', 'corporate'] },
  { id: 'six-graduation', name: 'Grad Strip', description: 'Celebration strip', layout: 'six', aspectRatio: '4:3', compositeStyle: 'clean', preview: '', previewEmoji: '🎓', categories: ['all', 'graduation', 'friends', 'family'] },
  { id: 'six-holiday', name: 'Holiday Strip', description: 'Festive photo strip', layout: 'six', aspectRatio: '4:3', compositeStyle: 'polaroid', preview: '', previewEmoji: '🎄', categories: ['all', 'holiday', 'family', 'friends'] },
  { id: 'six-couple', name: 'Love Strip', description: 'Romantic 6-shot', layout: 'six', aspectRatio: '4:3', compositeStyle: 'blush', preview: '', previewEmoji: '💕', categories: ['all', 'couple', 'wedding', 'aesthetic'] },
  // ── Frame Templates (PNG backgrounds) ──────────────────────────────────────
  { id: 'frame-anniversary', name: 'Anniversary Frame', description: 'Beige anniversary collage', layout: 'single', aspectRatio: '3:4', compositeStyle: 'frame', preview: '', previewEmoji: '🎉', frameImage: '/frame-templates/Beige Minimalist Happy Anniversary Photo Collage Frame Instagram Story.png', badge: { label: 'New', variant: 'new' }, categories: ['all', 'wedding', 'couple', 'seasonal'] },
  { id: 'frame-polaroid', name: 'Polaroid Moments', description: 'Beige moments collage', layout: 'single', aspectRatio: '3:4', compositeStyle: 'frame', preview: '', previewEmoji: '📷', frameImage: '/frame-templates/Beige Minimalist Moments Photo Collage Your Story.png', categories: ['all', 'vintage', 'aesthetic', 'friends'] },
  { id: 'frame-mono-polaroid', name: 'Mono Polaroid', description: 'Black & gray polaroid style', layout: 'single', aspectRatio: '3:4', compositeStyle: 'frame', preview: '', previewEmoji: '🖤', frameImage: '/frame-templates/Black and Gray Monochrome Polaroid Photo Collage Love Phone Wallpaper.png', categories: ['all', 'vintage', 'minimal', 'couple'] },
  { id: 'frame-valentine-bw', name: 'Valentine B&W', description: 'Minimalist Valentine\'s Day', layout: 'single', aspectRatio: '3:4', compositeStyle: 'frame', preview: '', previewEmoji: '🤍', frameImage: '/frame-templates/Black and White Minimalist Valentine\'s Day Your Story.png', badge: { label: 'Popular', variant: 'popular' }, categories: ['all', 'couple', 'wedding', 'seasonal'] },
  { id: 'frame-family', name: 'Family Collage', description: 'Grey & red family design', layout: 'quad', aspectRatio: '3:4', compositeStyle: 'frame', preview: '', previewEmoji: '👨‍👩‍👧‍👦', frameImage: '/frame-templates/Grey and Red Modern Family Photo Collage Instagram Story.png', categories: ['all', 'family', 'friends'] },
  { id: 'frame-aesthetic', name: 'Aesthetic Frame', description: 'Grey minimalist aesthetic', layout: 'single', aspectRatio: '3:4', compositeStyle: 'frame', preview: '', previewEmoji: '◻️', frameImage: '/frame-templates/Grey Minimalist Aesthetic Photo Collage Instagram Story.png', categories: ['all', 'minimal', 'aesthetic', 'corporate'] },
  { id: 'frame-cat', name: 'Cat Valentine', description: 'Pet polaroid style', layout: 'single', aspectRatio: '3:4', compositeStyle: 'frame', preview: '', previewEmoji: '🐱', frameImage: '/frame-templates/Pet Cat Valentine\'s Day Poster in Black and White in Polaroid Style.png', categories: ['all', 'aesthetic', 'seasonal'] },
  { id: 'frame-strip', name: 'Photo Strip', description: 'Pink & green playful strip', layout: 'six', aspectRatio: '3:4', compositeStyle: 'frame', preview: '', previewEmoji: '🎞️', badge: { label: 'Trending', variant: 'trending' }, frameImage: '/frame-templates/Pink and Green Playful Photo Strip Design.png', categories: ['all', 'friends', 'birthday', 'graduation'] },
  { id: 'frame-christmas', name: 'Christmas Frame', description: 'Vintage Christmas portrait', layout: 'single', aspectRatio: '3:4', compositeStyle: 'frame', preview: '', previewEmoji: '🎄', frameImage: '/frame-templates/Vintage Aesthetic Christmas Portrait Photo Collage.png', badge: { label: 'New', variant: 'new' }, categories: ['all', 'holiday', 'seasonal', 'family'] },
]

export const photoCounts: Record<string, number> = { single: 1, double: 2, quad: 4, six: 6 }
