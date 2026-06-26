# ClickStudio — Feature Brainstorm & Roadmap

> Status: brainstorming only, nothing committed.  
> Last updated: June 2026

---

## What the user confirmed wanting

1. Feedback / comment wall.
2. Image upload + edit with filters.
3. Polaroid frame templates for uploaded images.
4. add option / choice for timer on camera.
5. add option / choice for polaroid frame on camera.
6. can we make a polaroid photo can add text on the button if user want? if possible.
7. add also retake option on camera.

---

## Feature Deep-Dives

---

### 1. Feedback & Comment Wall (HOLD)

Users can leave a short message after their session — "drop a note, spread the love."

**How it could work**
- Short form: name (optional) + message (max 160 chars) + emoji reaction
- Stored in a `feedback` Supabase table
- Displayed as a scrolling ticker or card wall on the landing page
- Moderation: a simple `approved` boolean column; only show approved ones
- Optional: tie feedback to a session ID so users can react to specific strips

**Pros**
- Builds social proof and community feel on the landing page
- Easy to implement with existing Supabase setup
- Creates a "featured users" wall (like the photobooth.co @tag card we referenced)
- Low effort, high visual impact

**Cons**
- Needs moderation or spam protection (honeypot field / rate limiting)
- Could get messy without curation
- Anonymous feedback is harder to trust

**Effort:** Low–Medium  
**Impact:** High (landing page becomes alive)

---

### 2. Image Upload + Edit (ADD)

Users can upload an existing photo (JPG, PNG, WEBP) and apply ClickStudio's filters, frames, and polaroid templates to it — not just webcam shots.

**How it could work**
- "Upload a photo" button on the Camera page (already has an Upload icon placeholder)
- File picker → reads as data URL → drops into the same preview/editor flow
- Same 13 filters + 4 frame overlays apply via canvas `ctx.filter`
- Crop/resize to match the chosen template aspect ratio
- Output downloadable as PNG

**Pros**
- Massive increase in use cases — people with older phones or no webcam can still use it
- Great for applying aesthetic filters to existing selfies
- Reuses the entire existing filter + frame pipeline with zero extra infrastructure
- Feels like a mini Lightroom/VSCO alternative

**Cons**
- Need to handle large file sizes (set a 10 MB cap, matching Supabase Storage limit)
- Cropping UX can be tricky to get right
- Users might expect AI features (remove background, auto-enhance) — scope creep risk

**Effort:** Medium  
**Impact:** Very High

---

### 3. Polaroid & Film Strip Templates for Editing (HOLD: we use simple polaroid for now)

Apply a polaroid frame, film strip border, or aesthetic collage layout to an uploaded or captured photo — exportable as a styled single image.

**How it could work**
- Template picker (similar to existing layout page) with visual previews
- Templates include: Classic Polaroid, Double Strip, 4-Cut Film, Vintage Border, Coquette Frame, Y2K Collage
- All composited on canvas — filter + frame + text → single PNG download
- Optional: add a caption text below the polaroid (like the white strip at the bottom)

**Pros**
- Core differentiator — most web photo booths don't offer this for uploads
- Canvas compositing already works in the codebase
- Creates shareable, aesthetic outputs that go viral on social media

**Cons**
- Designing quality frame assets takes time (SVG overlays or canvas drawing)
- More complex than filters alone
- "Caption" text feature adds another UI surface to design

**Effort:** Medium–High  
**Impact:** Very High

---

## Suggested Features (my recommendations)

---

### 4. Full Photo Strip Export (single image download) (ADD)

Right now users download individual photos. The killer feature of a photo booth is the **strip** — all photos arranged vertically in one image, like a real photo booth printout.

**How it could work**
- "Download Strip" button on the Preview page
- Composites all captured photos into one tall canvas (4:1 ratio for 4-cut, etc.)
- Applies a white border between shots, optional decorative bottom strip with "ClickStudio" watermark
- Downloads as a single PNG

**Pros**
- THE core deliverable of a photo booth — currently missing
- Immediately shareable to Instagram Stories (vertical format)
- Zero infrastructure cost — pure canvas

**Cons**
- Large canvas = large file (can compress to JPEG at 0.9 quality)

**Effort:** Low  
**Impact:** Very High — this is a must-have

---

### 5. Stickers & Text Overlays (HOLD)

Drag-and-drop stickers (hearts, stars, bows, sparkles) and add short captions on top of photos before exporting.

**How it could work**
- Sticker panel on the Editor page — grid of SVG/emoji stickers
- Click to place, drag to reposition, pinch/scroll to resize
- Text tool: click canvas to place text, choose font (script or sans), color
- Composited on export

**Pros**
- Huge for the Y2K/coquette audience — this is exactly what they want
- Differentiates from plain filter apps
- Can be phased: emoji stickers first (easy), custom SVG packs later

**Cons**
- Drag-and-drop canvas interaction is complex to build well
- Text rendering on canvas requires careful font loading

**Effort:** High  
**Impact:** High

---

### 6. Aesthetic Preset Packs (SOON)

Pre-made aesthetic bundles that apply a named vibe in one click: filter + frame + sticker combo.

Examples:
- **Coquette** — Blush vignette + Smooth filter + bow stickers
- **Y2K** — 80s filter + Film frame + star stickers
- **Old Money** — Film filter + Minimal frame + serif caption
- **Dark Academia** — B&W filter + Minimal frame + moody overlay
- **Summer Diary** — Warm filter + Polaroid frame + sun sticker

**Pros**
- Zero friction for users who don't want to configure manually
- Very shareable ("take the Coquette challenge")
- Can be unlocked/added seasonally to keep the app fresh

**Cons**
- Needs stickers + text to work fully (depends on feature 5)
- Curating packs takes creative effort

**Effort:** Low (once stickers exist), High (without stickers)  
**Impact:** High

---

### 7. QR Code Share (ADD)

After capturing, generate a QR code that links to a shared gallery page so someone can scan it on their phone and download the strip instantly.

**How it could work**
- Each session gets a unique `/share/[sessionId]` route
- Public share page shows the strip with a download button
- QR code generated client-side (use `qrcode` npm package)
- Session stored in Supabase — link is persistent

**Pros**
- Perfect for events, parties, weddings — point your phone at the screen
- Already have Supabase session storage, just need a public share route
- `qrcode` package is tiny (~14 KB)

**Cons**
- Needs a public `/share/[id]` page to be built
- Photos must be uploaded to Supabase Storage (already implemented!)

**Effort:** Medium  
**Impact:** Medium–High for event use cases

---

### 8. Mirror / Flip Toggle (ADD)

Many selfie-takers prefer mirrored camera (natural selfie feel). Add a toggle that flips the video feed horizontally.

**How it could work**
- `transform: scaleX(-1)` on the video element for the live preview
- On capture, apply `ctx.setTransform(-1, 0, 0, 1, canvas.width, 0)` before drawing
- Simple toggle button in the camera controls bar

**Pros**
- Tiny implementation (2 lines of CSS + 1 line of canvas transform)
- Users expect this — most camera apps have it

**Cons**
- Almost none

**Effort:** Very Low  
**Impact:** Medium (quality of life)

---

### 9. Auto-Capture Burst Mode(ADD)

Set the camera to automatically capture X photos with Y seconds between each — no manual clicking.

**How it could work**
- "Burst" toggle in camera settings: 4 photos, 3 seconds apart
- Countdown starts, then fires automatically X times
- Progress shown as a pill counter (1/4, 2/4…)

**Pros**
- Authentic photo booth experience — you don't click, you just pose
- Great for group shots
- Minimal code — extend the existing countdown logic

**Cons**
- Need clear UI for how many shots remain
- Could overwhelm first-time users if default is burst

**Effort:** Low  
**Impact:** High (core photo booth feel)

---

### 10. Optional User Accounts (HOLD: we don't have user accounts yet, soon.)

Let users sign up to save their strips permanently and access them from any device. Completely optional — the app works fully without an account.

**How it could work**
- Supabase Auth (email + Google OAuth)
- If logged in: sessions are tied to `user_id`, private by default
- If not logged in: sessions are anonymous + temporary (current behavior)
- Profile page: view all your saved strips

**Pros**
- Supabase Auth is already a dependency — low setup effort
- Enables "Your Gallery" — a personal archive of all your moments
- Enables premium features later (more frame packs, higher storage)

**Cons**
- Auth adds friction — could hurt the "no sign-up" selling point
- Must stay fully optional so anonymous use is never broken

**Effort:** Medium  
**Impact:** Medium (unlocks future monetization path)

---

### 11. Print-Ready PDF Export (HOLD)

Export the photo strip as a properly sized, print-optimized PDF — ready to send to a print shop or home printer.

**How it could work**
- Use `jsPDF` or `html2canvas + jsPDF` to generate a PDF
- Preset sizes: 2x6 inch strip (standard photo booth size), 4x6 print, A4 sheet with 2 strips
- DPI set to 300 for print quality

**Pros**
- Huge for events and weddings
- Unique feature — most web photo booths only offer PNG download

**Cons**
- `jsPDF` adds ~200 KB to the bundle
- Print quality depends on original capture resolution

**Effort:** Medium  
**Impact:** Medium–High for event/wedding use cases

---

## Improvements to Existing Features

| Area | Issue | Fix |
|---|---|---|
| Camera page | No way to retake a single bad shot | Add per-photo retake in Preview |
| Templates page | Arrow buttons are decorative (no carousel logic) | Wire up arrows to cycle templates |
| Session History | "Export Session" button does nothing | Implement strip export |
| Editor page | Filters tab shows names only, no preview | Add live thumbnail previews |
| Landing page | No real user count / social proof | Pull real session count from Supabase |
| Mobile | Filter row can still overflow on very small screens | Test on 375px and fix |
| Bundle size | 424 KB JS chunk (Lighthouse warning) | Code-split with dynamic `import()` |

---

## Priority Ranking (my recommendation)

| # | Feature | Effort | Impact | Build next? |
|---|---|---|---|---|
| 1 | Photo strip export (single image) | Low | Very High | Yes — missing core feature |
| 2 | Mirror / flip toggle | Very Low | Medium | Yes — 2 lines of code |
| 3 | Auto-capture burst mode | Low | High | Yes — authentic booth feel |
| 4 | Image upload + edit | Medium | Very High | Yes — expands audience |
| 5 | Feedback / comment wall | Low–Medium | High | Yes — landing page feels alive |
| 6 | QR Code share | Medium | High | Soon |
| 7 | Stickers & text overlays | High | High | Later |
| 8 | Polaroid templates (full editor) | Medium–High | Very High | Later |
| 9 | Aesthetic preset packs | Low (after stickers) | High | Later |
| 10 | User accounts (optional auth) | Medium | Medium | Later |
| 11 | Print-ready PDF export | Medium | Medium | Later |

---

## Tech Notes

- Strip export: pure canvas, zero new dependencies
- Mirror: CSS `scaleX(-1)` + canvas transform, zero new dependencies  
- Burst mode: extends existing countdown `useEffect`, zero new dependencies
- Image upload: `FileReader` API, zero new dependencies
- Feedback table: one new Supabase table + simple form component
- QR code: `qrcode` package (~14 KB gzip)
- Stickers: drag interaction library (e.g. `@dnd-kit`) or custom pointer events
- PDF export: `jsPDF` (~200 KB gzip) — defer until needed
- Auth: Supabase Auth (already installed), add login page + protected routes

---

## Open Questions

1. Should feedback be moderated manually (Supabase dashboard) or auto-approved with a spam filter? ANSWER: yes, auto-approved! i'm planning create a page or add landing page in bottom for feedback and the dev can reply if suggestion or need to fix or report anything comment by users.
2. Should uploaded images go through the same Supabase Storage upload as captured photos? ANSWER: yes, to keep consistency and avoid duplicate uploads.
3. For the polaroid template — do we draw frames on canvas (code) or use image assets (SVG/PNG)? ANSWER: yes, we draw frames on canvas using code.
4. Should the strip export include a "ClickStudio" watermark at the bottom, or be fully clean? ANSWER: yes, we include a "ClickStudio" watermark at the bottom of the strip export.
5. Should user accounts be Google OAuth only, or also email/password? ANSWER: for now it's for everyone and free we will add email/password later.
6. Should burst mode be the default, or an opt-in setting? ANSWER: for now it's an opt-in setting.
