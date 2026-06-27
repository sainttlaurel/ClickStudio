# ClickStudio — Feature Brainstorm & Roadmap

> Phase 1 shipped. See `ROADMAP.md` for what's next.
> Last updated: June 2026

---

## What the user confirmed wanting

1. Feedback / comment wall.
2. Image upload + edit with filters.
3. Polaroid frame templates for uploaded images.
4. Add option / choice for timer on camera. ✅ SHIPPED (Phase 1)
5. Add option / choice for polaroid frame on camera. ✅ SHIPPED (Phase 1)
6. Can we make a polaroid photo can add text on the bottom if user want? if possible.
7. Add also retake option on camera. ✅ SHIPPED (Phase 1)
8. Can we add pop up updates / with description change log with new features?

---

## Feature Deep-Dives

---

### 1. Feedback & Comment Wall (DONE ✅)

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

### 2. Image Upload + Edit (DONE ✅)

Users can upload an existing photo (JPG, PNG, WEBP) and apply ClickStudio's filters, frames, and polaroid templates to it — not just webcam shots.

**How it could work**
- "Upload a photo" button on the Camera page (already has an Upload icon placeholder)
- File picker → reads as data URL → drops into the same preview/editor flow
- Same 13 filters + 5 frame overlays apply via canvas `ctx.filter`
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

### 4. Full Photo Strip Export (single image download) (DONE ✅)

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

### 5. Stickers & Text Overlays (DONE ✅)

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

### 6. Aesthetic Preset Packs (PARKED)

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

### 7. QR Code Share (DONE ✅)

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

### 8. Mirror / Flip Toggle ✅ SHIPPED (Phase 1)

Flips the video feed horizontally with `scaleX(-1)` on the video element and `ctx.setTransform` on capture so the saved photo is also mirrored correctly.

---

### 9. Auto-Capture Burst Mode ✅ SHIPPED (Phase 1)

Opt-in toggle. When on, clicking capture automatically fires the full set of shots for the chosen template with a 950ms gap between each. Progress shown as "Shot X of Y" in the countdown overlay.

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

### 11. Print-Ready PDF Export (DONE ✅)

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

### 12. Changelog / What's New popup (DONE ✅)

Show a modal or banner when the user opens the app after a new update — listing what changed in plain language.

**How it could work**
- A `changelog.ts` file with versioned entries (version, date, list of changes)
- Compare the stored version in `localStorage` to the current app version
- If they differ, show a "What's New" modal with the latest entries
- User dismisses it → store the new version in `localStorage`

**Pros**
- Keeps users informed without requiring them to read GitHub commits
- Builds a sense of active development and care
- Minimal infrastructure — no backend needed, just a static file

**Cons**
- Someone has to maintain the changelog entries manually
- Risk of being ignored if shown too often or on every visit

**Effort:** Very Low
**Impact:** Medium

---

## Improvements to Existing Features

| Area | Issue | Fix |
|---|---|---|
| Templates page | Arrow buttons are decorative (no carousel logic) | Wire up arrows to cycle templates |
| Session History | "Export Session" button does nothing | Implement strip export (Phase 2) |
| Editor page | Filters tab shows names only, no preview | Add live thumbnail previews |
| Landing page | No real user count / social proof | Pull real session count from Supabase |
| Mobile | Filter row can still overflow on very small screens | Test on 375px and fix |
| Bundle size | 648 KB JS chunk (Lighthouse warning) | Code-split with dynamic `import()` |

---

## Open Questions

1. Should feedback be moderated manually (Supabase dashboard) or auto-approved with a spam filter? **ANSWER:** Auto-approved. Planning a dedicated page where the dev can read and reply to user comments and bug reports.
2. Should uploaded images go through the same Supabase Storage upload as captured photos? **ANSWER:** Yes — keeps it consistent and avoids duplicate pipelines.
3. For the polaroid template — do we draw frames on canvas (code) or use image assets (SVG/PNG)? **ANSWER:** Canvas code only. ✅ Done.
4. Should the strip export include a "ClickStudio" watermark at the bottom, or be fully clean? **ANSWER:** Yes, include a watermark.
5. Should user accounts be Google OAuth only, or also email/password? **ANSWER:** Free for everyone now. Email/password added later.
6. Should burst mode be the default, or an opt-in setting? **ANSWER:** Opt-in only. ✅ Done.
