# ClickStudio Changelog

All notable changes to ClickStudio are documented here.

---

## v1.7.6 (June 28, 2026)

### Added
* Zoom controls — 50%–150% with fit button
* Collapsible panel — click active tab to collapse

### Changed
* Tab tooltips — hover for tab labels

---

## v1.7.5 (June 28, 2026)

### Added
* Undo / Redo — full history tracking for editor changes

### Changed
* Canvas space — reduced empty space, larger editing area
* Bottom panel — compressed to 24vh for more canvas room
* Adjustment sliders — grouped by Light and Color categories
* Sticker sheet — compact 8-column grid layout
* Slider component — softer styling with thinner track and thumb

---

## v1.7.4 (June 28, 2026)

### Added
* Gallery preview section — 5 photo strip style mockups on landing page
* Camera tooltip walkthrough — 4-step first-visit onboarding

### Changed
* Feature card visuals — realistic mockups replacing emoji placeholders
* Accessibility contrast audit — WCAG AA analysis for all design tokens

---

## v1.7.1 (June 28, 2026)

### Fixed
* Camera blank page — fixed React hooks ordering error (error #310)
* Template carousel — cards now center-aligned with equal heights
* Camera filters and frames — bottom panel content centered

### Changed
* Editor is more compact — smaller canvas, tighter grids, centered controls
* Migrated from Netlify to Vercel — better bandwidth and SPA routing
* Removed unused dependencies (react-hook-form, react-qr-code) and stale files
* Package renamed from photobooth-app to clickstudio

---

## v1.7.0 (June 27, 2026)

### Added
* Template Library — 28 templates across 15 categories with search, sort, and favorites
* Template carousel — premium horizontal scroll with glassmorphism arrows and floating cards
* Countdown sounds — Web Audio API beeps during countdown and capture

### Fixed
* Camera now starts correctly after template selection
* Editor layout — removed standalone quick filter bar that was overlapping the canvas

### Changed
* Frame Overlay tab replaces empty Crop tab
* Canvas height increased for better editing experience

---

## v1.6.0 (June 27, 2026)

### Added
* Simplified flow — template picker is now built into CameraPage (no separate Templates page)
* Auto-redirect to Preview when all shots are captured
* Frame Overlay tab in Editor — change frame after capturing
* Quick filter bar below the canvas

### Changed
* Fewer pages, smoother experience — Templates → Camera → Preview → Editor
* Frame overlay rendering extracted to a shared utility

---

## v1.5.0 (June 27, 2026)

### Added
* Click-to-place stickers (select a sticker, then click anywhere on the photo)
* Touch drag support for stickers and text on mobile
* 13 filters with live preview thumbnails in the Editor
* 10 sticker packs (160+ emoji)
* 6 text font presets — Script, Serif, Sans, Mono, Cursive, Display
* 15 text colors for overlays
* "Edit Photo" button in PreviewPage Actions sidebar

### Fixed
* Sticker and text positioning — overlays now track correctly with the canvas

---

## v1.4.0 (June 26, 2026)

### Added
* Stickers tab — 6 themed packs with tap-to-add, drag, resize, rotate, delete
* Text overlay tab — 4 font presets, 10 colors, adjustable size
* Stickers and text composited onto canvas on save

---

## v1.3.0 (June 26, 2026)

### Added
* Print-Ready PDF — export at 300 DPI in 6 sizes: 2×6, 4×6, A4, US Letter
* Print/PDF button with size picker modal

---

## v1.2.0 (June 26, 2026)

### Added
* QR Code share — generate a QR code to share your strip
* Public share page — anyone can view and download your strip
* Feedback wall — leave a message on the landing page
* Copy Link button for easy sharing

---

## v1.1.1 (June 26, 2026)

### Added
* Official ClickStudio logo on Header, Sidebar, About page, and Landing page
* Contact info — email and Discord on the About page

### Fixed
* Copyright updated to 2026

---

## v1.1.0 (June 25, 2026)

### Added
* Photo strip compositor — all shots combined into one beautiful result
* Frame Templates with Polaroid, Film, Blush, and Minimal composite styles
* Classic Layouts tab — plain grid arrangements without decorative framing
* Polaroid caption — add a personal note to the bottom strip before downloading
* Image upload — add existing photos through the same filter + frame pipeline
* "What's New" modal — versioned changelog, auto-shows once per version
* Session history export — generates and downloads the full composite strip

### Changed
* Preview page now shows the final composite as the primary result
* Retake a shot from the Preview page — removes the photo and sends you back to camera

---

## v1.0.0 (June 25, 2026)

### Initial Release
* Live camera with device switching, grid overlay, mirror toggle, flash
* Timer (3s/5s/10s) and burst mode
* 13 film filters — live preview, baked into captures
* 5 frame overlays — Clean, Film, Blush, Minimal, Polaroid
* Image upload — drop existing photos into the pipeline
* Retake — delete and reshoot individual photos
* Classic layouts — Single, Double, Quad, Photo Strip
* Frame templates — Polaroid Memories, Film Roll, Blush Edit, Minimal Clean
* Responsive design — desktop and mobile
* PWA support — installable as a native-like app
* Feedback wall — community messages on landing page
* Supabase cloud sync — sessions and photos synced to storage
