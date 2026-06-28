# Roadmap

Active development phases for ClickStudio.

---

## Phase 1 — Core Camera & Filters ✅
**Status:** Complete

- [x] Live camera with device switching
- [x] HD quality support
- [x] Grid overlay
- [x] Flash toggle
- [x] Mirror toggle
- [x] Timer (3s/5s/10s)
- [x] Burst mode
- [x] Retake individual photos
- [x] 13 film filters
- [x] 5 frame overlays
- [x] Image upload
- [x] Filter + frame baking into captures

## Phase 2 — Composite & Export ✅
**Status:** Complete

- [x] Classic layouts (single, double, quad, photo strip)
- [x] Frame templates (Polaroid, Film Roll, Blush, Minimal, Clean)
- [x] Photo strip compositor
- [x] Download strip with watermark
- [x] Print-ready PDF export (300 DPI)
- [x] QR code generation
- [x] Public share page
- [x] Web Share API
- [x] Supabase cloud sync

## Phase 3 — Editor & UI ✅
**Status:** Complete

- [x] Per-photo adjustments (brightness, contrast, saturation, etc.)
- [x] Sticker packs (10 themes, 160+ emoji)
- [x] Text overlays (6 fonts, 15 colors)
- [x] Sticker drag/resize/rotate
- [x] Text drag/reposition
- [x] What's New changelog modal
- [x] Feedback wall
- [x] PWA support
- [x] Responsive design
- [x] Camera floating toolbar redesign
- [x] Template carousel — centered, snap scrolling, glassmorphism arrows
- [x] Template Library modal (28 templates, search, categories)
- [x] Frame Overlay tab (replaced Crop)
- [x] Countdown sounds (Web Audio API)

## Phase 4 — Polish & Deployment ✅
**Status:** Complete

- [x] Vercel deployment (migrated from Netlify)
- [x] SPA routing (vercel.json rewrites)
- [x] Security headers (X-Frame-Options, X-Content-Type-Options, Permissions-Policy: camera=*)
- [x] SEO (OG tags, Twitter Cards, JSON-LD, canonical URL)
- [x] Google Search Console verified
- [x] Sitemap + robots.txt
- [x] PWA manifest
- [x] Code cleanup (removed unused deps: react-hook-form, react-qr-code; stale files: vercel.json, hooks/, constants/types.ts)
- [x] React error #310 fix (camera hooks ordering)
- [x] Editor compactness pass (reduced canvas/panel heights, tighter grids)
- [x] Centered UI (templates, filters, frames)

## Phase 5 — Next Steps 🚧
**Status:** In Progress

### Shipped in v1.7.2
- [x] 9 PNG frame templates (Anniversary, Valentine, Family, Christmas, etc.)
- [x] Frame composite style — compositor renders PNG backgrounds
- [x] "Coming Soon" badge on Custom Layout
- [x] Template Library category chips — snap-x + fade hint
- [x] Card hover interactions (translateY, shadow, scale, glow)
- [x] Search bar improvements (48px, focus ring, white bg)
- [x] Category chip selected state (scale, shadow)
- [x] Template selection feedback
- [x] Hover quick actions (Preview, Use Template, Save)

### Still Planned
- [ ] **Editor UX overhaul (Round 3 review)**
  - [ ] Reduce empty space — canvas 55vh, panel 45vh
  - [ ] Compress bottom panel — max 240-320px, scrollable
  - [ ] Add undo / redo buttons
  - [ ] Group adjustment sliders (Light / Color / Details)
  - [ ] Redesign sticker grid — compact sticker sheet
  - [ ] Improve selected tab states — background fill, font-weight 600
  - [ ] Add live frame preview on hover
  - [ ] Add zoom controls (− / 100% / + / Fit)
  - [ ] Add tooltips to left sidebar icons
  - [ ] Improve slider thickness (4px track, 16px thumb)
  - [ ] Add filter names below thumbnails
  - [ ] "+ Add Text" primary button for text panel
- [ ] Polaroid caption input in Editor
- [ ] Photo reordering (drag-and-drop)
- [ ] Higher resolution composites for print
- [ ] Session History page (functional)
- [ ] Gallery page (community showcase)
- [ ] Replace placeholder graphics with real photo strips
- [ ] Add template showcase to landing page
- [ ] Add testimonials/social proof
- [ ] Improve accessibility (contrast, focus rings, labels)

## Phase 6 — Future (HOLD)
**Status:** On hold

User accounts, payment processing, premium templates, collaborative sessions, custom branding, multi-camera support, social media integration, print integration, admin dashboard, analytics.

---

## Current Status

| Metric | Value |
|---|---|
| Version | 1.7.2 |
| Pages | 10 (Landing, Camera, Preview, Editor, Share, About, Help, Settings, Gallery, SessionHistory) |
| Templates | 37 (28 library + 9 PNG frame templates) across 15 categories |
| Filters | 13 film presets |
| Frames | 5 overlay styles |
| Sticker Packs | 10 themes, 160+ emoji |
| Deployment | Vercel |
| URL | [clickstudio.vercel.app](https://clickstudio.vercel.app) |
