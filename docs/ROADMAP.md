# Roadmap

Development phases and status for ClickStudio.

---

## Current Status

| Metric | Value |
|---|---|
| Version | 1.7.6 |
| Pages | 10 (Landing, Camera, Preview, Editor, Share, About, Help, Settings, Gallery, SessionHistory) |
| Templates | 37 (28 library + 9 PNG frame templates) across 15 categories |
| Filters | 13 film presets |
| Frames | 5 overlay styles |
| Sticker Packs | 10 themes, 160+ emoji |
| Deployment | Vercel |
| URL | [clickstudio.vercel.app](https://clickstudio.vercel.app) |

---

## Phase 1 — Core Camera & Filters ✅
**Status:** Complete

- [x] Live camera with device switching
- [x] HD quality support, grid overlay, flash, mirror toggle
- [x] Timer (3s/5s/10s) and burst mode
- [x] Retake individual photos
- [x] 13 film filters + 5 frame overlays
- [x] Image upload + filter/frame baking

## Phase 2 — Composite & Export ✅
**Status:** Complete

- [x] Classic layouts (single, double, quad, photo strip)
- [x] Frame templates (Polaroid, Film Roll, Blush, Minimal, Clean)
- [x] Photo strip compositor with watermark
- [x] Print-ready PDF export (300 DPI)
- [x] QR code + public share page + Web Share API
- [x] Supabase cloud sync

## Phase 3 — Editor & UI ✅
**Status:** Complete

- [x] Per-photo adjustments, stickers (160+ emoji), text overlays (6 fonts, 15 colors)
- [x] Sticker/text drag/resize/rotate
- [x] What's New changelog, feedback wall, PWA, responsive design
- [x] Camera floating toolbar, template carousel, Template Library modal
- [x] Frame Overlay tab, countdown sounds

## Phase 4 — Polish & Deployment ✅
**Status:** Complete

- [x] Vercel deployment, SPA routing, security headers, SEO
- [x] Google Search Console, sitemap, robots.txt, PWA manifest
- [x] Code cleanup, React error #310 fix
- [x] Editor compactness pass, centered UI

## Phase 5 — Landing Page & UI Polish ✅
**Status:** Complete

- [x] Feature card visuals — realistic mockups replacing emoji placeholders
- [x] Gallery preview section — 5 photo strip style mockups
- [x] Testimonials section — real user reviews with star ratings
- [x] Alternating section backgrounds across landing page
- [x] Landing page motion — staggered entrances, hover effects
- [x] Accessibility pass — aria-labels, focus rings, labels, roles
- [x] Button component upgrade — gradient bg, deeper shadows, smoother hover
- [x] Camera tooltip walkthrough — 4-step first-visit onboarding
- [x] Accessibility contrast audit — WCAG AA analysis for all design tokens
- [x] 9 PNG frame templates — Anniversary, Valentine, Family, Christmas, etc.
- [x] Card hover interactions, search bar, category chips, selection feedback
- [x] Hover quick actions (Preview, Use Template, Save)

#### Contrast Audit Results (WCAG AA)

| Color | Ratio | AA Normal | AA Large | AA UI |
|---|---|---|---|---|
| `text` on `background` | 17.61:1 | ✅ | ✅ | ✅ |
| `text` on `surface` | 18.88:1 | ✅ | ✅ | ✅ |
| `muted` on `background` | 4.09:1 | ❌ | ✅ | ✅ |
| `muted` on `surface` | 4.39:1 | ❌ | ✅ | ✅ |
| `primary` on `background` | 3.89:1 | ❌ | ✅ | ✅ |
| `primary` on `surface` | 4.18:1 | ❌ | ✅ | ✅ |
| `secondary` on `background` | 2.14:1 | ❌ | ❌ | ❌ |
| `secondary` on `surface` | 2.30:1 | ❌ | ❌ | ❌ |
| `white` on `primary` | 4.18:1 | ❌ | ✅ | ✅ |
| `white` on `secondary` | 2.30:1 | ❌ | ❌ | ❌ |

**Issues:** `muted` and `primary` need darkening for small text. `secondary` needs significant darkening for all uses.

---

## Phase 6 — Editor UX Overhaul 🚧
**Status:** In Progress

### Completed

- [x] Reduce empty canvas space (55vh → 65vh)
- [x] Compress bottom panel (30vh → 24vh)
- [x] Undo / Redo (50-state history)
- [x] Group sliders (Light / Color categories)
- [x] Compact sticker sheet (8-column grid)
- [x] Filter labels (already present)
- [x] Softer sliders (1.5px track, 16px thumb)
- [x] Collapsible controls (click tab to collapse)
- [x] Zoom controls (50%–150% with fit button)
- [x] Sidebar tooltips (title attributes on tabs)

### Still Planned

- [ ] Improve selected states — background fill, font-weight 600
- [ ] Redesign text workflow
- [ ] "+ Add Text" primary button for text panel
- [ ] Better Save hierarchy
- [ ] Live frame preview on hover
- [ ] Better preview feedback

### Extra

- [ ] Polaroid captions
- [ ] Photo reordering (drag-and-drop)
- [ ] Higher resolution composites for print
- [ ] Functional Session History page
- [ ] Community Gallery page

---

## Phase 7 — Future (HOLD)
**Status:** On hold

User accounts, payment processing, premium templates, collaborative sessions, custom branding, multi-camera support, social media integration, print integration, admin dashboard, analytics.

---

## Design Tokens

| Token | Value | Usage |
|---|---|---|
| `--background` | `#FDF5F7` | Page background |
| `--surface` | `#FFFFFF` | Cards and panels |
| `--border` | `#F5C5D8` | Borders and dividers |
| `--primary` | `#E91E8C` | Buttons, active states |
| `--secondary` | `#FF85A2` | Accents |
| `--text` | `#1C0B1A` | Body text |
| `--muted` | `#9B6B7B` | Secondary text |

**Typography:** Inter (body), DM Serif Display (headings), Dancing Script (accents)
