# Roadmap

Development roadmap and future direction for ClickStudio.

---

## Current Status

| Metric | Value |
|---|---|
| Version | 1.9.0 |
| Pages | 10 (Landing, Camera, Preview, Editor, Share, About, Help, Settings, Gallery, SessionHistory) |
| Features | Camera, Filters, Adjustments, Stickers, Text, Frames, Undo/Redo, Zoom |
| Templates | 37 (28 library + 9 PNG frame templates) |
| Deployment | Vercel |
| URL | [clickstudio.vercel.app](https://clickstudio.vercel.app) |

---

## ✅ Completed

All core features are production-ready:
- Live camera with device switching, grid, flash, mirror, timer, burst mode
- 13 film filters, 5 frame overlays (Clean, Film, Blush, Minimal, Polaroid)
- Photo adjustments (brightness, contrast, saturation, exposure, etc.)
- Stickers (160+ emoji across 10 packs), text overlays (6 fonts, 15 colors)
- Drag/resize/rotate for stickers and text
- Frame templates with PNG backgrounds
- Zoom controls (50–200%)
- Undo/Redo (50-state history)
- PDF export (300 DPI, 6 sizes)
- QR code and public share page
- PWA support
- Supabase cloud sync
- Session History page — view past editing sessions with search, sort, export
- Gallery page — browse user-generated content with permission
- Full Settings page with camera, appearance, export, and privacy controls
- Filter thumbnails with live photo preview (64×64 downsampling)
- Frame panel with visual previews showing actual frame styling
- Color swatch labels on capture screen (tooltips on hover)
- Numeric readouts on all adjustment sliders
- Tooltips on all sidebar navigation icons
- Logo fallback handling across all pages
- Compact editor layout with optimized spacing (280px right panel, max-height scrolling)
- Redo functionality with full undo/redo stack and keyboard shortcuts (Ctrl+Z/Ctrl+Y)
- Organized adjustment sliders into Light, Color, and Details sections with dividers
- Modern slider design with improved thumb styling, hover/focus animations
- Compact sticker picker with 5-column grid, square cells, hover zoom effects
- Enhanced filter selector with checkmarks, active borders, compact 3-column layout
- Reorganized text editing panel with Typography, Appearance, and Size sections
- Improved active tab state with #FFF1F7 background, smooth transitions
- Sidebar tooltips with fade-in animation and dark background
- Live frame preview on hover (preview on canvas, restore on mouse leave)

---

## 📋 Backlog

- Photo reordering — drag-and-drop to reorder captures
- Higher resolution composites for print
- User accounts and authentication
- Premium templates
- Collaborative editing sessions
- Custom branding options
- Social media integration
- Admin dashboard
- Analytics

---

## Design System

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
