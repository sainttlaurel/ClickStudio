# ClickStudio Changelog

All notable changes to ClickStudio.

> **Note:** For versions 1.7.1–1.7.7, see [git history](https://github.com/sainttlaurel/ClickStudio/commits/main).

---

## v1.9.0 (July 2, 2026)

### Added
- **Compact editor layout** — optimized spacing with 280px right panel and max-height scrolling
- **Redo functionality** — full undo/redo stack with keyboard shortcuts (Ctrl+Z/Ctrl+Y)
- **Organized adjustment sliders** — grouped into Light, Color, and Details sections with visual dividers
- **Modern slider design** — improved thumb styling with hover/focus animations and ring effects
- **Compact sticker picker** — 5-column grid with square cells, hover zoom effects, tighter spacing
- **Enhanced filter selector** — checkmarks, active borders/background, compact 3-column layout
- **Reorganized text editing panel** — Typography, Appearance, and Size sections with clear hierarchy
- **Improved active tab state** — #FFF1F7 background, font-weight 600, smooth 200ms transitions
- **Sidebar tooltips** — fade-in animation with dark background (#gray-900) for all navigation icons
- **Live frame preview** — hover over frames to preview on canvas, restores on mouse leave

### Changed
- Editor right panel width increased from 200px to 280px for better proportions
- Bottom panel now uses max-height with internal scrolling for compact layout
- All adjustment sliders reduced to 4px track height with improved thumb interactions
- Filter grid changed from 4-column to 3-column for better visual balance
- Sticker grid changed from 4-column to 5-column for more compact display
- Frame panel spacing reduced for tighter layout

### Improved
- Overall editor UX inspired by Canva, Adobe Express, and Photopea
- Professional visual consistency across all editor components
- Smoother interactions with 150-250ms animations
- Better visual hierarchy with organized sections and dividers
- Reduced wasted vertical space in editor layout

---

## v1.8.0 (July 2, 2026)

### Added
- **Session History page** — view past editing sessions with search, sort, export, and delete
- **Gallery page** — browse user-generated content with permission
- **Full Settings page** — camera, appearance, export, and privacy controls
- **Filter thumbnails with live preview** — 64×64 downsampled photo with each filter applied
- **Frame panel visual previews** — shows actual frame styling (border, shadow, border-radius)
- **Color swatch tooltips** — template names on hover for capture screen swatches
- **Numeric slider readouts** — current value displayed next to all adjustment sliders
- **Sidebar tooltips** — hover labels on all navigation icons

### Fixed
- Logo component — proper fallback handling across Settings, Help, About, and Session History pages
- Sticker glyphs — emoji rendering working correctly in Favorites tab
- Settings page — replaced all placeholder text with functional controls
- Canvas layout — editor canvas now takes full available space as primary content
- Sidebar width — reduced to 64px as narrow utility rail
- All 11 high/medium/low priority UX tasks completed

---

## v1.7.7 (June 29, 2026)

### Added
- **Photo compositing** — filters, stickers, text, and frames baked into saved images
- **Frame overlay rendering** — Canvas displays frame overlays visually (Film, Blush, Minimal, Polaroid, Clean)
- **Sticker pack switching** — 160+ emoji across 10 themed packs
- **Lazy code splitting** — secondary pages reduce main bundle to 621KB
- **Frame-specific aspect ratios** — dynamic sizing per frame style
- **PNG frame template compositing** — frame backgrounds composite with photos
- **Click-to-place text** — exact positioning instead of auto-centering
- **Draggable overlays** — grab and reposition stickers and text on canvas
- **Zoom controls** — 50–200% scaling with fit button

### Fixed
- Adjustment sliders now bake into saved images
- `text-text` replaced with `text-foreground` (44 occurrences)
- `surface` color added to Tailwind config
- Duplicate `bakeFrameOverlay` removed
- `handleBack` from preview no longer corrupts state
- Supabase env vars — app warns instead of crashing if missing
- AdjustPanel — labels match adjustment keys, added temperature/tint sliders
- FiltersPanel — all filters import from constants with correct data
- StickersPanel — uses `STICKER_PACKS` constant
- FramesPanel — matches frame IDs consistently
- CaptureScreen — countdown, flash, color swatches work correctly
- SharePage — undefined `sessionId` shows error instead of infinite loading
- GalleryPage — `handleShare` type fixed from `any` to `Photo`
- AboutPage — version reads from `APP_VERSION` constant
- Polaroid frame — fixed invalid CSS box-shadow, now renders correctly
- Template picker — only single-photo layouts shown (12 templates)
- Frame library connected — 28 templates accessible via TemplatePicker modal

### Changed
- Bundle size optimized — removed react-query, qrcode, jspdf packages
- Supabase client — lazy initialization via `getClient()`
- Editor layout — side-by-side with photo canvas left, controls right

---

## v1.7.6 (June 29, 2026)

### Added
- Side-by-side editor layout
- Mobile bottom panel with full-width tab bar

### Fixed
- Gallery preview strips — uniform height and spacing
- Template Library — sort dropdown alignment, scrollable grid
- Frame Styles carousel — unified backgrounds
- Polaroid caption rendering
- Editor right panel — content vertically centered
- Preview page — composite image centered
- Camera carousel — arrows visible on all devices
- Editor build — removed broken duplicate layout

### Removed
- "Browse All Templates" button from CameraPage
- "Scroll to browse" hint

### Improved
- Landing page — full redesign with glassmorphism nav, hero animations, testimonials
- Template Library — 10-point polish: hover states, metadata contrast, mini previews
- All pages converted to new design tokens
- Photo Booth Editor (/studio) — full app shell with sidebar, breadcrumbs, canvas, panels

---

## v1.7.5 (June 28, 2026)

### Added
- Polaroid captions — add text below polaroid/blush frames

---

## v1.7.0 (June 27, 2026)

### Added
- Template Library — 28 templates across 15 categories
- Template carousel with glassmorphism design
- Countdown sounds via Web Audio API
- Frame Overlay tab in Editor

### Fixed
- Camera startup after template selection
- Editor layout — removed overlapping quick filter bar

---

## v1.6.0 (June 27, 2026)

### Added
- Template picker built into CameraPage
- Auto-redirect to Preview when all shots captured
- Frame Overlay tab in Editor

### Changed
- Simplified flow: Templates → Camera → Preview → Editor
- Frame overlay rendering extracted to shared utility

---

## v1.5.0 (June 27, 2026)

### Added
- Click-to-place stickers (select, then click canvas to place)
- Touch drag support for stickers and text
- 13 filters with live preview thumbnails
- 10 sticker packs (160+ emoji)
- 6 text font presets, 15 text colors

### Fixed
- Sticker and text positioning — overlays track correctly with canvas

---

## v1.4.0 (June 26, 2026)

### Added
- Stickers tab — 6 themed packs with tap-to-add, drag, resize, rotate, delete
- Text overlay tab — 4 font presets, 10 colors, adjustable size
- Stickers and text composited onto canvas on save

---

## v1.3.0 (June 26, 2026)

### Added
- Print-ready PDF export at 300 DPI (6 sizes: 2×6, 4×6, A4, US Letter)
- Print/PDF button with size picker modal

---

## v1.2.0 (June 26, 2026)

### Added
- QR code share — generate and share your strip
- Public share page — anyone can view and download
- Feedback wall — leave a message
- Copy Link button

---

## v1.1.0 (June 25, 2026)

### Added
- Photo strip compositor — combine all shots into one result
- Frame templates (Polaroid, Film, Blush, Minimal)
- Classic Layouts tab — grid arrangements
- Polaroid caption — add personal notes
- Image upload — add existing photos
- "What's New" modal — versioned changelog
- Session history export

### Changed
- Preview page shows final composite as primary result

---

## v1.0.0 (June 25, 2026)

### Initial Release
- Live camera with device switching, grid, mirror, flash
- Timer (3s/5s/10s) and burst mode
- 13 film filters, 5 frame overlays
- Image upload and retake
- Classic layouts (single, double, quad, strip)
- Frame templates
- Responsive design and PWA support
- Feedback wall and Supabase cloud sync