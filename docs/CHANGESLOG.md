# ClickStudio Changelog

All notable changes to ClickStudio are documented here.

## v1.8.0 (June 29, 2026)

### Added
* Photo compositing — filters, stickers, text, and frames are now baked into the saved image via `utils/bakeEdits.ts`
* Frame overlay rendering — Canvas now displays frame overlays visually (Film, Blush, Minimal, Polaroid)
* `bakePhotoEdits` utility — composites image + adjustments + CSS filter + emoji stickers + text overlays + frame overlay onto a canvas, returns baked data URL
* StickersPanel pack switching — 160 emojis across 10 themed packs with tab selector
* Lazy loading — all secondary pages now code-split via `React.lazy`, main bundle reduced to 621KB

### Fixed
* **Adjustment sliders now bake into saved image** — brightness, contrast, saturation, exposure, highlights, shadows, temperature, tint are all composited via `adjustmentsToCss()` in `bakeEdits.ts`
* Save now preserves all edits — adjustments + filters + stickers + text + frames are composited before storing
* `text-text` (44 occurrences) replaced with `text-foreground` — these were silently ignored no-op Tailwind classes
* `surface` color (`#FFFFFF`) added to Tailwind config — `bg-surface` now resolves properly
* Dead code removed: `sounds.ts` (39 lines), `pdf.ts` (195 lines), `TemplateLibrary.tsx` (376 lines), `qrcode` + `jspdf` npm packages (45 packages removed)
* Duplicate `bakeFrameOverlay` removed — `bakeEdits.ts` now imports from `frameOverlay.ts`
* `handleBack` from preview screen now correctly returns to edit mode without corrupting state
* Supabase env vars: app no longer crashes at startup if vars are missing — warns instead, creates client lazily
* `bg-rose-50` → `bg-secondary`, `hover:bg-rose-50` → `hover:bg-secondary` in Header and Sidebar
* AdjustPanel — labels match actual adjustment keys, added missing temperature/tint sliders, switched from local to controlled state
* FiltersPanel — imports from constants with data-driven `thumbColor`, `90s` filter no longer missing
* StickersPanel — imports `STICKER_PACKS` instead of hardcoded 16 emojis
* FramesPanel — uses matching IDs from `@/constants/frames`
* CaptureScreen — countdown (3s), flash effect, color swatches now tint viewport
* SharePage: `sessionId` undefined now shows error instead of infinite loading
* GalleryPage: `handleShare` type fixed from `any` to `Photo`
* AboutPage: version now reads from `APP_VERSION` constant (was hardcoded `1.7.8`)
* Changelog constant added to `constants/index.ts` barrel export
* `text-text` (44 occurrences) replaced with `text-foreground` across old layout pages
* LandingPage "Start the Studio" links directly to `/studio`
* Sidebar nav: Camera→Studio, Preview→Gallery, Editor→History
* Raw `<svg>` replaced with `lucide-react` icons in PhotoBoothEditor sidebar nav and BottomTabs (8 icons) — removes 2KB of inline SVG strings
* `#EC1A66` hardcoded color replaced with `studio` Tailwind color token across all 11 photobooth components — centralized color management
* Duplicate emoji removed from sticker packs; `墨镜` replaced with emoji
* Date formatting standardized to `en-US` locale
* Breadcrumb text simplified (removed confusing "Preview ›" prefix)
* Text shadow extended to all light colors (gold, pink, lime, cyan)

### Changed
* Bundle size: ~672KB → ~621KB (react-query, qrcode, jspdf removed; lazy loading added)
* Supabase client: lazy initialization via `getClient()`, no crash on missing env vars
* PhotoBoothEditor — centralized state management, fixed undo stack closure issue

## v1.7.9 (June 29, 2026)

### Added
* Side-by-side editor layout — photo canvas left, editor controls right, icon sidebar far left
* Mobile bottom panel — full-width tab bar and controls on small screens

### Fixed
* Gallery preview strips — uniform height, all cards fill available space
* Feedback form — removed emoji picker, simplified form
* Template Library — sort dropdown alignment, scrollable grid
* Frame Styles carousel — unified backgrounds to match Classic card style
* Polaroid caption — frameOverlay now accepts caption param, shows user text or fallback "ClickStudio"
* Editor right panel — content centered vertically with flex justify-center
* Preview page — composite image centered on screen
* Camera page — carousel arrows now visible on all devices
* Version bump to 1.7.9 to force PWA service worker cache refresh
* Editor build — removed broken duplicate layout, restored clean build

### Removed
* "Browse All Templates" button from CameraPage — reduced bundle by ~21KB
* "Scroll to browse" hint from CameraPage

### Improved
* Landing page — full conversion to new UI/UX reference design:
  - Glassmorphism fixed nav with scroll-aware background
  - Hero section with animated photo strip visual, floating badges, radial gradient background
  - Pink marquee ticker banner (SNAP · POSE · FILTER · SHARE...)
  - How It Works: 4-step cards with hover reveal arrow
  - Features: gradient preview cards with icon + tag badges
  - Templates: horizontal scrollable carousel with active state selection
  - Testimonials: 5 rotated review cards with alternating backgrounds
  - Contact / Drop a note: form with Supabase integration + feedback wall
  - CTA: pink gradient card with floating decorations
  - Footer: clean minimal footer
  - Film grain overlay for vintage texture
  - Reveal-on-scroll animations with staggered delays
  - Floating decorative elements (hearts, stars, sparkles)
* Template Library — 10-point senior polish pass:
  - Reduced subtitle opacity for softer feel
  - Search + sort height reduced to 50px for lighter modal
  - Category chips overflow scroll with padding-bottom fix
  - Grid centers incomplete rows with justify-items-center
  - Card metadata contrast increased (#8f6878)
  - Hover: translateY(-6px) + primary border + deeper shadow
  - Mini wireframe previews replace placeholder camera icons
  - Close button: white bg + shadow + rotate-90 on hover
  - Selected state with primary border + checkmark badge
  - "Showing X templates" count under category chips
* All remaining pages converted to new design tokens:
  - `text-muted` → `text-muted-foreground`, `bg-rose-50` → `bg-secondary` across 9 pages
  - SharePage, GalleryPage, SessionHistoryPage, SettingsPage, HelpPage, AboutPage
  - PreviewPage, EditorPage, CameraPage — full token consistency
* New Photo Booth Editor (/studio):
  - Full app shell with 64px sidebar, top breadcrumb bar, main canvas, right panel, bottom tabs
  - Capture screen: camera viewport with corner guides, color swatches, shutter button
  - Edit screen: Adjust tab (6 sliders), Filters tab (12 swatches), Stickers tab (16 emoji), Text tab (input + colors + size), Frames tab (8 options)
  - Design system: #EC1A66 pink primary, #F7F7F8 background, gray-400 secondary text
  - Preview screen: Save shows result with Download + Gallery buttons instead of broken /preview redirect
  - Capture count: shows `1 / 1` immediately after capture, not just on Save
  - Font preset rendering: TextPanel now passes font through canvas overlay
  - Old pages redirect: CameraPage, EditorPage, PreviewPage all redirect to /studio (removed ~2.8KB old code)
* Click-to-place stickers — select sticker emoji → cursor changes to crosshair → click canvas to place at exact position (replaces random-position placement)
* Font preset now renders on canvas overlay — TextPanel passes font through EditScreen → Canvas `fontFamily`

---

## v1.7.8 (June 28, 2026)

### Added
* Polaroid captions — add text below polaroid/blush frames with 3 font options

---

## v1.7.7 (June 28, 2026)

### Changed
* Selected states — background fill and font-weight 600 for active tabs
* Text workflow — compact one-row layout with prominent Add button
* Save button — glow effect when unsaved changes
* Frame preview — live preview on hover
* Preview feedback — ring glow on canvas with unsaved changes

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
* Bottom panel — compressed to 240px for more canvas room
* Adjustment sliders — grouped by Light and Color categories
* Sticker sheet — compact 10-column grid layout
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
