# ClickStudio — Changelog

> Full version history. Last updated: June 2026

---

## v1.5.0 — Editor Improvements

**June 27, 2026**

### Editor
- **Click-to-place stickers** — Select a sticker in the panel, then click anywhere on the photo to place it at that exact position
- **Touch drag support** — Stickers and text can be dragged with finger on mobile devices
- **Fixed sticker/text positioning** — Overlay coordinates now use the correct canvas wrapper reference
- **13 filters with live preview thumbnails** — Each filter shows a mini preview of your actual photo
- **Expanded sticker packs** — 10 packs (160+ emoji): Favorites, Coquette, Y2K, Nature, Fun, Faces, Hearts, Food & Drink, Animals, Accessories
- **6 text font presets** — Script, Serif, Sans, Mono, Cursive, Display
- **15 text colors** — Expanded color palette for text overlays
- **Numeric adjustment values** — Each slider shows its current value

### Preview
- **Edit Photo button** — Added to Actions sidebar for quick access to the editor

---

## v1.4.0 — Stickers & Text Overlays

**June 26, 2026**

### Editor
- **Stickers tab** — 6 themed packs (48 emoji): Favorites, Coquette, Y2K, Nature, Fun, Faces
- **Tap-to-add stickers** — Click a sticker to place it on the canvas
- **Drag to reposition** — Move stickers and text anywhere on the photo
- **Resize/rotate/delete** — Hover controls for placed stickers
- **Text overlay tab** — 4 font presets (Script, Serif, Sans, Mono), 10 colors, size slider
- **Composited on save** — Stickers and text are baked into the photo on export

---

## v1.3.0 — Print-Ready PDF Export

**June 26, 2026**

### Preview & Export
- **Print-Ready PDF** — Export as print-ready PDF at 300 DPI via jsPDF
- **6 print sizes** — 2×6 strip, 4×6 print, A4 (1/2 strips), US Letter (1/2 strips)
- **Print/PDF button** — Size picker modal in PreviewPage

---

## v1.2.0 — QR Code Share & Feedback Wall

**June 26, 2026**

### Share
- **QR Code share** — Generate QR code client-side via `qrcode` package
- **Public share page** — `/share/[sessionId]` route with composite preview + download
- **Copy Link button** — One-click link copying to clipboard

### Landing Page
- **Feedback wall** — Leave a name, message, and emoji on the landing page
- **Scrolling card wall** — Approved feedback displayed as a community wall
- **Auto-approved** — Feedback is instantly visible after submission

### Database
- **`feedback` table** — Supabase table with name, message, emoji, approved fields
- **RLS policies** — Public read access, authenticated write access

---

## v1.1.1 — Branding & Polish

**June 26, 2026**

### Branding
- **Official logo** — `public/logo.png` integrated into Header, Sidebar, About page, and Landing page footer
- **Contact info** — Email and Discord added to About page; Twitter removed
- **Copyright update** — Footer and About page updated to `© 2026 ClickStudio`

---

## v1.1.0 — Output & Composite

**June 25, 2026**

### Composite Output
- **Photo Strip Compositor** — All photos composited into one final PNG per layout and composite style
- **Frame Templates** — 4 pre-designed styles: Polaroid Memories, Film Roll, Blush Edit, Minimal Clean
- **Classic Layouts tab** — Separate template arrays for Classic vs Frame Templates
- **ClickStudio watermark** — Small text at the bottom of every strip

### Preview
- **Composite preview** — Final composited strip as the primary result
- **Retake filmstrip** — Individual shots in a sidebar for quick retakes
- **Polaroid caption** — Add personal text to Polaroid frame bottom strips

### Camera
- **Image upload** — Upload JPG, PNG, WEBP and run through the same filter + frame pipeline

### App
- **What's New modal** — Auto-shows once per app version with versioned changelog
- **Session History export** — Export button generates and downloads the full composite strip
- **Carousel arrows wired** — TemplatesPage left/right arrows scroll the carousel

---

## v1.0.0 — Initial Release

**June 25, 2026**

### Camera
- **Live Camera** — HD webcam support with device switching, grid overlay, and flash
- **Mirror toggle** — Flip the live feed horizontally; baked correctly into the captured photo
- **Timer options** — 3s, 5s, or 10s countdown before each shot
- **Burst mode** — Opt-in auto-fire for the full shot set with 950ms between shots
- **Retake** — Thumbnail strip after each shot; hover to delete and reshoot
- **13 Film Filters** — Vintage, Smooth, 70s, 80s, 90s, B&W, Faded, Lomo, Cool, Warm, Film, Dreamy, Original
- **5 Frame Overlays** — Clean, Film, Blush, Minimal, Polaroid

### Templates
- **Classic Layouts** — Single, Double Strip, Four Cuts, Photo Strip
- **Frame Templates** — Polaroid Memories, Film Roll, Blush Edit, Minimal Clean

### Editor
- **Adjustments** — Brightness, contrast, saturation, temperature, shadows, highlights, tint
- **Filters** — Apply filters in the editor
- **Crop & Rotate** — Aspect ratio presets and rotation

### App
- **PWA** — Installable as a native-like app
- **Responsive** — Desktop and mobile ready
- **Accessible** — WCAG AA compliant, keyboard navigable
- **Session History** — Cloud-synced sessions with save, load, and delete

---

## Discord Update Format

Use this template when posting updates to the Discord community:

```
ClickStudio v{VERSION} — {TITLE}

{EMOJI} {FEATURE CATEGORY}
• {feature 1}
• {feature 2}
• {feature 3}

{EMOJI} {FEATURE CATEGORY}
• {feature 1}
• {feature 2}

Try it now → https://clickstudio.app
```

### Example Posts

**v1.5.0**
```
ClickStudio v1.5.0 — Editor Improvements

🎨 Editor
• Click-to-place stickers — select, then click anywhere on your photo
• Touch drag — move stickers & text with your finger on mobile
• 13 filters with live preview thumbnails
• 10 sticker packs (160+ emoji) — Coquette, Y2K, Nature & more
• 6 text fonts, 15 colors

⚡ Preview
• Edit Photo button added to sidebar

Update live now → https://clickstudio.app
```

**v1.4.0**
```
ClickStudio v1.4.0 — Stickers & Text Overlays

🎀 Stickers
• 6 themed packs — Favorites, Coquette, Y2K, Nature, Fun, Faces
• Tap to add, drag to reposition, resize & rotate
• Composited on save

✏️ Text Overlays
• 4 font presets — Script, Serif, Sans, Mono
• 10 colors, adjustable size
• Drag anywhere on the photo

Try it now → https://clickstudio.app
```

**v1.3.0**
```
ClickStudio v1.3.0 — Print-Ready PDF

🖨️ Print / PDF
• Export at 300 DPI — print shop ready
• 6 sizes: 2×6 strip, 4×6, A4, US Letter
• Size picker modal in Preview

Perfect for events & weddings 💕

Try it now → https://clickstudio.app
```

**v1.2.0**
```
ClickStudio v1.2.0 — Share & Feedback

📱 QR Code Share
• Generate QR code — scan to view & download
• Public share page for anyone
• Copy link button

💬 Feedback Wall
• Leave a message on the landing page
• Scrolling community card wall

Try it now → https://clickstudio.app
```

**v1.1.1**
```
ClickStudio v1.1.1 — Branding

✨ What's New
• Official ClickStudio logo
• Email + Discord contact on About page
• Copyright updated to 2026

Small polish, big difference 💕
```

**v1.1.0**
```
ClickStudio v1.1.0 — Composite Output

📸 Photo Strip Compositor
• All shots combined into one PNG
• 4 Frame Templates — Polaroid, Film, Blush, Minimal
• Polaroid caption text
• Image upload support

The photo booth experience is complete 🎉

Try it now → https://clickstudio.app
```

**v1.0.0**
```
ClickStudio v1.0.0 is LIVE! 🎉

📸 Camera
• HD webcam, mirror toggle, timer, burst mode
• 13 film filters + 5 frame overlays

🎨 Editor
• Brightness, contrast, saturation & more
• Crop & rotate

📱 App
• PWA installable, responsive, accessible

The free web photo booth is here → https://clickstudio.app
```

---

## Version Numbering

- **Major (v2.0)** — Breaking changes or major feature overhaul
- **Minor (v1.X)** — New features and significant improvements
- **Patch (v1.X.X)** — Bug fixes and small polish

---

## Deploys

All versions are deployed automatically to Vercel on push to `main`.

| Version | Date | Commit |
|---|---|---|
| v1.5.0 | June 27, 2026 | `57597fd` |
| v1.4.0 | June 26, 2026 | `d1acb55` |
| v1.3.0 | June 26, 2026 | — |
| v1.2.0 | June 26, 2026 | — |
| v1.1.1 | June 26, 2026 | — |
| v1.1.0 | June 25, 2026 | — |
| v1.0.0 | June 25, 2026 | — |
