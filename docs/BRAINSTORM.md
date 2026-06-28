# Brainstorm

Feature ideas for ClickStudio. Shipped items are checked off; everything else is a candidate for future work.

---

## Shipped

- [x] Live camera with device switching, grid, mirror, flash
- [x] Timer (3s/5s/10s) and burst mode with countdown sounds
- [x] Image upload
- [x] 13 film filters — live preview, baked into captures
- [x] 5 frame overlays (Clean, Film, Blush, Minimal, Polaroid) — per-photo
- [x] Template system — 28 templates across 15 categories
- [x] Classic layouts (single, double, quad, photo strip)
- [x] Frame templates (Polaroid, Film Roll, Blush, Minimal, Clean)
- [x] Photo strip compositor — composites into single PNG
- [x] Composite preview with retake filmstrip
- [x] Download strip with watermark
- [x] Print-ready PDF export (300 DPI, 6 sizes)
- [x] QR code generation — public share page
- [x] Web Share API
- [x] Supabase cloud sync (sessions + photos)
- [x] Editor — per-photo adjustments, filters, stickers, text overlays
- [x] Sticker packs — 10 themes, 160+ emoji, drag to reposition/resize/rotate
- [x] Text overlays — 6 font presets, 15 colors, adjustable size
- [x] What's New changelog modal
- [x] Feedback wall on landing page
- [x] PWA (installable)
- [x] Responsive design (desktop + mobile)
- [x] Camera floating toolbar redesign (vertical desktop, chips mobile)
- [x] Template carousel — centered, snap scrolling, glassmorphism arrows, badges
- [x] Template Library modal — search, categories, favorites, sort
- [x] Frame Overlay tab (replaced Crop tab)
- [x] Vercel deployment with SPA rewrites + security headers
- [x] SEO (OG tags, Twitter Cards, JSON-LD, canonical URL, sitemap, robots.txt)
- [x] Editor compactness pass — reduced canvas/panel heights, tighter grids
- [x] Centered UI — templates, filters, frames all center-aligned
- [x] 9 PNG frame templates (Anniversary, Valentine, Family, Christmas, etc.)
- [x] Frame composite style — compositor renders PNG backgrounds with photo overlay
- [x] "Coming Soon" badge on Custom Layout card
- [x] Card hover interactions (translateY, shadow, scale, glow)
- [x] Search bar improvements (48px, focus ring, white bg)
- [x] Category chip selected state (scale, shadow)
- [x] Template selection feedback
- [x] Hover quick actions (Preview, Use Template, Save)
- [x] Template Showcase section on landing page (6 real template cards)
- [x] Testimonials section — user reviews with star ratings
- [x] Alternating section backgrounds across landing page
- [x] Landing page motion — staggered entrances, hover effects, animated preview
- [x] Accessibility pass — aria-labels, focus rings, html labels, roles
- [x] Landing page spacing consistency

---

## Planned — Next Priorities

### High Priority (from Round 3 Editor UX Review)
- **Reduce editor empty space** — Canvas 55vh, panel 45vh, compress vertical distance
- **Compress bottom panel** — Max 240-320px, scrollable, not a giant wall
- **Add undo/redo** — ↶ Undo / ↷ Redo before Save, top right
- **Group adjustment sliders** — Light (Brightness, Contrast, Exposure), Color (Saturation, Temperature, Tint), Details (Shadows, Highlights)
- **Improve slider design** — Track 4px, active 6px, thumb 16px, softer pink
- **Redesign sticker grid** — Compact sticker sheet, not giant cards, hover zoom
- **Add filter names** — Original, Soft, Film, Vintage, Blush, Warm, Moody, Dreamy with check on selected
- **Improve text panel** — "+ Add Text" primary button, organized fields (Font, Weight, Color, Size, Opacity)
- **Live frame preview on hover** — Frame selection previews ON canvas
- **Add zoom controls** — − / 100% + / Fit, bottom right
- **Tooltip sidebar icons** — Home, Templates, Gallery, Editor, History
- **Improve selected tab states** — Background #FFF1F7, font-weight 600

### High Priority (existing)
- **Polaroid caption input in Editor** — Currently only in Preview; should be editable per-photo in the Editor too
- **Photo reordering** — Drag-and-drop reorder shots before compositing
- **Improved composite quality** — Higher resolution composites for print

### Medium Priority
- **Session History page** — Browse past sessions with thumbnails and composite previews
- **Gallery page** — Public showcase of community-created strips
- **Template creation tool** — Let users design custom templates with custom layouts
- **Multi-frame support** — Apply different frames to individual photos in a strip
- **Video capture** — Short video clips alongside photo strips
- **AR filters** — Face tracking and AR overlays via WebRTC
- **Music/sound effects** — Customizable shutter sounds, background music

### Low Priority (HOLD)
- **User accounts** — On HOLD per solo dev decision; no auth planned
- **Payment processing** — On HOLD
- **Premium templates** — On HOLD
- **Collaborative sessions** — On HOLD
- **Custom branding/watermarks** — On HOLD
- **Multi-camera support** — On HOLD
- **Social media integration** — On HOLD
- **Print integration** — On HOLD
- **Admin dashboard** — On HOLD
- **Analytics dashboard** — On HOLD

---

## Ideas Parking Lot

- Photo booth rental mode (offline, kiosk)
- Green screen / background replacement
- Time-lapse mode
- Photo booth rental business features
- Custom color themes per user
- Template sharing between users
- Seasonal template packs
- Photo booth simulator mode
- Export to different formats (HEIC, WebP)
- Batch processing
- Photo collage maker
- Frame builder tool
- Sticker marketplace
- Community sticker packs
- Animation effects
- Music visualization
- Social media templates (Instagram stories, etc.)
- Print queue management
- Digital signage mode
- Photo booth locator
