# Changelog

All notable changes to ClickStudio are documented here. Auto-shows in the What's New modal via `changelog.ts`.

---

## v1.7.0 — June 27, 2026

### Added
- **Template Library** — 28 templates across 15 categories (Birthday, Wedding, Graduation, Couple, Friends, Family, Holiday, K-Pop, Vintage, Minimal, Aesthetic, Seasonal, Corporate, Custom)
- **Template Library modal** — Accessible via "Browse All Templates" button in carousel; includes search, sort (Popular/Newest/A–Z), favorites, responsive grid
- **Template carousel** — Premium horizontally scrollable carousel with snap scrolling, glassmorphism navigation arrows, floating cards with badges (New/Popular/Trending)
- **Countdown sounds** — Web Audio API beeps: tick on countdown, dual-tone on capture

### Fixed
- **Camera not starting** — Added `useEffect` watching `hasTemplate` so camera attaches after template selection (previously tried to attach to null video element on mount)
- **Editor layout overlap** — Removed standalone quick filter bar that was overlapping the canvas; filters now only accessible via Filters tab
- **Canvas height** — Increased to `max-h-[60vh] lg:max-h-[75vh]` for better editing experience

### Changed
- **Quick filter bar removed** — Consolidated into Filters tab only; cleaner editor layout
- **Frame Overlay tab** — Replaces Crop tab (which was empty); provides photo overlay options
- **Tab content panel** — New max height `max-h-[45vh] lg:max-h-[38vh]` for better scrolling

---

## v1.6.0 — June 26, 2026

### Added
- **Countdown beeps** — Audio feedback during countdown and capture
- **Filter preview thumbnails** — Live preview of all 13 filters in the Filters tab
- **Sticker text labels** — Names shown on hover/selection for better discoverability
- **Quick filter bar** — One-tap filter access below the canvas (later removed in v1.7.0)

### Fixed
- **Composite compositeStyle** — Frame templates now correctly use their defined composite style
- **Retake filmstrip layout** — Improved spacing and thumbnail quality

---

## v1.5.0 — June 25, 2026

### Added
- **Template system** — 28 templates across 15 categories
- **Template carousel** — Horizontal scroll with snap, glassmorphism arrows, floating cards
- **Template picker in CameraPage** — Select template before starting camera
- **Auto-redirect to Preview** — After all shots complete, auto-navigate to Preview (was Editor)

### Changed
- **User flow simplified** — 5 pages → 3 (Landing → Camera → Preview)
- **Standalone TemplatesPage removed** — Template selection built into CameraPage

---

## v1.4.0 — June 24, 2026

### Added
- **Camera floating toolbar** — Vertical toolbar on desktop, tool chips on mobile
- **Gradient capture button** — Redesigned with gradient and pulse animation
- **Tab-based filter/frame panel** — Cleaner panel layout
- **Compact timer/burst controls** — Improved camera UI density
- **Shot tray with thumbnails** — Visual feedback after each capture

### Changed
- **Camera UI redesign** — From flat grid to floating toolbar + compact panels
- **Mobile responsive v3** — Camera viewport `max-h-[60vh]`, bottom panel `max-h-[35vh]`

---

## v1.3.0 — June 23, 2026

### Added
- **Editor adjustments** — Brightness, contrast, saturation, exposure, shadows, highlights, temperature, tint
- **Sticker packs** — 10 themes, 160+ emoji with drag/resize/rotate
- **Text overlays** — 6 font presets, 15 colors, adjustable size, drag to reposition
- **Frame Overlay tab** — Apply frames per-photo in the editor

### Changed
- **Frame tab replaces Crop** — Crop was empty; Frame provides actual functionality

---

## v1.2.0 — June 22, 2026

### Added
- **QR code generation** — Generate shareable links with QR codes
- **Public share page** — `/share/[sessionId]` for anyone to view and download
- **Print-ready PDF export** — 300 DPI in 6 sizes (2×6, 4×6, A4, US Letter)
- **Composite strip compositor** — All photos composited into one PNG
- **Download with watermark** — ClickStudio branding on exports

### Changed
- **Preview page redesigned** — Composite strip is the main result; retake filmstrip on the side

---

## v1.1.0 — June 21, 2026

### Added
- **Supabase cloud sync** — Sessions and photos synced to cloud storage
- **Session history** — Browse and load past sessions
- **PWA support** — Installable as a native-like app
- **What's New modal** — Versioned changelog, auto-shows once per version

### Security
- **Security headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- **SPA routing** — Vercel `vercel.json` rewrites

---

## v1.0.0 — June 20, 2026

### Initial Release
- **Live camera** with device switching, grid overlay, mirror toggle, flash
- **Timer** (3s/5s/10s) and burst mode
- **13 film filters** — live preview, baked into captures
- **5 frame overlays** — Clean, Film, Blush, Minimal, Polaroid
- **Image upload** — Drop existing photos into the pipeline
- **Retake** — Delete and reshoot individual photos
- **Classic layouts** — Single, Double, Quad, Photo Strip
- **Frame templates** — Polaroid Memories, Film Roll, Blush Edit, Minimal Clean
- **Responsive design** — Desktop and mobile
- **Feedback wall** — Community messages on landing page
