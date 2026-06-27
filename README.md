# ClickStudio

A modern, production-ready web photo booth application built with React 19, TypeScript, and Vite. Capture, filter, and share beautiful photo strips — entirely in the browser, no app required.

---

## Features

### Camera
- **Live Camera** — HD webcam support with device switching, grid overlay, and flash
- **Mirror toggle** — Flip the live feed horizontally; baked correctly into the captured photo
- **Timer options** — Choose 3s, 5s, or 10s countdown before each shot
- **Burst mode** — Auto-fires the full set of shots for your chosen template; opt-in
- **Retake** — Thumbnail strip after each shot lets you delete and reshoot any photo
- **Image upload** — Upload an existing JPG, PNG, or WEBP and run it through the same filter + frame pipeline

### Filters & Frames
- **13 Film Filters** — Vintage, Smooth, 70s, 80s, 90s, B&W, Faded, Lomo, Cool, Warm, Film, Dreamy, Original — applied live and baked into every capture
- **5 Frame Overlays** — Clean, Film strip, Blush vignette, Minimal border, Polaroid — applied per-photo at capture time

### Templates & Composite Output
- **Classic Layouts** — Single, Double Strip, Four Cuts, Photo Strip — plain grid arrangements with a clean white composite
- **Frame Templates** — Pre-designed composite styles: Polaroid Memories, Film Roll, Blush Edit, Minimal Clean — each applies a unique visual treatment to the entire strip output
- **Photo Strip Compositor** — All captured photos are composited into one final PNG (the "product") — the primary view in Preview
- **Polaroid caption** — When using a Polaroid frame template, add a personal text note to the bottom strip before downloading

### Preview & Export
- **Composite preview** — Preview page shows the final composited strip as the main result; individual shots appear in a retake filmstrip on the side
- **Download Strip** — One-click download of the full composite PNG with a ClickStudio watermark
- **Print-Ready PDF** — Export as print-ready PDF (300 DPI) in 6 sizes: 2×6 strip, 4×6 print, A4, US Letter
- **QR Code share** — Generate QR code to share your strip; public `/share/[sessionId]` page for anyone to view & download
- **Share** — Web Share API on supported devices; falls back to download
- **Save to cloud** — Session + photos synced to Supabase Storage

### Editor
- **Adjustments** — Brightness, contrast, saturation, exposure, shadows, highlights, temperature, tint per individual photo
- **Stickers** — 10 themed packs (160+ emoji): Favorites, Coquette, Y2K, Nature, Fun, Faces, Hearts, Food & Drink, Animals, Accessories — tap to add, drag to reposition, resize/rotate
- **Text overlays** — 6 font presets (Script, Serif, Sans, Mono, Cursive, Display), 15 colors, adjustable size — drag to reposition
- **Filters** — 13 filters with live preview thumbnails: Original, Vintage, Smooth, 70s, 80s, 90s, B&W, Faded, Lomo, Cool, Warm, Film, Dreamy
- **Crop & Rotate** — Aspect ratio presets and rotation

### App
- **What's New modal** — Auto-shows once per app version with a versioned changelog; dismissed state in localStorage
- **Session History** — Cloud-synced sessions with save, load, delete, and composite strip export
- **Feedback wall** — Leave a message on the landing page; scrolling card wall of community feedback
- **PWA** — Installable as a native-like app
- **Responsive** — Desktop and mobile ready
- **Accessible** — WCAG AA compliant, keyboard navigable

---

## User Flow

1. **Landing page** — click **Start the Studio**
2. **Templates** — pick a Classic Layout or a Frame Template
3. **Camera** — choose timer, mirror, filter, and per-photo frame overlay; capture (or use burst mode); or upload existing photos — auto-redirects to Editor when all shots are done
4. **Editor** — fine-tune brightness, contrast, saturation; apply filters with live preview thumbnails; add stickers and text overlays
5. **Preview** — see the final composited strip; retake individual shots from the filmstrip sidebar; add a Polaroid caption if applicable; generate QR code to share; download as PNG or print-ready PDF
6. **Download** the strip, share it, or save the session to the cloud

---

## Filters

| Name | Character |
|---|---|
| Original | No filter |
| Vintage | Warm sepia, slightly faded |
| Smooth | Soft, brightened, low contrast |
| 70s | Warm orange-amber film look |
| 80s | High contrast, saturated, retro-pop |
| 90s | Subtle warm fade |
| B & W | Crisp grayscale |
| Faded | Lifted blacks, desaturated |
| Lomo | Deep contrast, vivid |
| Cool | Blue-toned |
| Warm | Golden tones |
| Film | Classic film tone |
| Dreamy | Bright, soft, ethereal |

The selected filter is applied live to the `<video>` element and baked into every capture via `canvas ctx.filter`. Filters can also be applied in the Editor with live preview thumbnails.

---

## Frame Overlays (per-photo, applied at capture)

| Name | Style |
|---|---|
| Clean | No border |
| Film | Black sprocket-hole bars top and bottom |
| Blush | Soft pink radial vignette |
| Minimal | Thin white inner border |
| Polaroid | White border, thick bottom strip with ClickStudio label |

---

## Frame Templates (composite-level styles)

| Name | Layout | Style |
|---|---|---|
| Polaroid Memories | 4 shots (2×2) | White polaroid cards, soft cream background, shadow |
| Film Roll | 2 shots (vertical) | Dark background, sprocket holes, muted tones |
| Blush Edit | 4 shots (2×2) | Pink gradient background, rounded photo corners |
| Minimal Clean | 1 shot | White background, thin pink border |

Frame Templates define how the final composited strip looks. Classic Layouts use the same grid arrangements with a plain white background.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript, Vite |
| Styling | Tailwind CSS, Framer Motion |
| State | Zustand |
| Backend | Supabase (Database, Storage) |
| Icons | Lucide React |
| Fonts | Inter, DM Serif Display, Dancing Script |
| Deployment | Vercel |

---

## Getting Started

**Prerequisites:** Node.js 18+, a modern browser with WebRTC support, a Supabase project.

```bash
# 1. Clone
git clone https://github.com/sainttlaurel/ClickStudio.git
cd ClickStudio

# 2. Install
npm install

# 3. Configure environment
cp .env.example .env
```

Add your credentials to `.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
# 4. Run the database schema
# Open supabase/schema.sql and run it in the Supabase SQL Editor

# 5. Start dev server
npm run dev
```

---

## Database Setup

Run `supabase/schema.sql` once in the Supabase SQL Editor. It creates:

- `sessions` table with an `updated_at` trigger
- `photos` table with a cascade delete foreign key
- `photos` storage bucket (public, 10 MB limit)
- Row Level Security policies (public access, no login required)

---

## Design System

Pink-forward, feminine aesthetic with a clean editorial structure.

| Token | Value | Usage |
|---|---|---|
| `--background` | `#FDF5F7` | Page background |
| `--surface` | `#FFFFFF` | Cards and panels |
| `--border` | `#F5C5D8` | Borders and dividers |
| `--primary` | `#E91E8C` | Buttons, active states |
| `--secondary` | `#FF85A2` | Accents |
| `--text` | `#1C0B1A` | Body text |
| `--muted` | `#9B6B7B` | Secondary text |

**Typography:** Inter (body), DM Serif Display (display headings), Dancing Script (script accents)

---

## Project Structure

```
public/
└── logo.png                   # Official ClickStudio logo
src/
├── components/
│   ├── ui/                   # Button, Input, Modal, Slider, Toaster, ChangelogModal
│   └── layout/               # Header, Sidebar, Layout
├── constants/                # Shared constants and types
│   ├── filters.ts            # 13 film filter presets
│   ├── frames.ts             # 5 frame overlay definitions
│   ├── stickers.ts           # 10 sticker packs, text presets, colors
│   ├── changelog.ts          # Versioned changelog entries + localStorage helpers
│   ├── types.ts              # CameraError type
│   └── index.ts              # Barrel export
├── hooks/                    # Custom hooks (future)
├── pages/
│   ├── LandingPage.tsx       # Landing page with feedback wall
│   ├── CameraPage.tsx        # Filters, frames, mirror, timer, burst, retake, upload
│   ├── TemplatesPage.tsx     # Classic Layouts + Frame Templates tabs
│   ├── PreviewPage.tsx       # Composite result, retake, QR code, PDF export, download
│   ├── EditorPage.tsx        # Adjustments, stickers, text overlays, filters, crop
│   ├── GalleryPage.tsx
│   ├── SessionHistoryPage.tsx
│   ├── SettingsPage.tsx
│   ├── HelpPage.tsx
│   ├── AboutPage.tsx
│   └── SharePage.tsx         # Public share page for /share/[sessionId]
├── store/
│   ├── usePhotoStore.ts      # Session, photo, and camera state + Supabase sync
│   └── useUIStore.ts
├── lib/
│   └── supabase.ts           # Typed client, upload and delete helpers
├── types/
│   └── index.ts              # Photo, Template, CompositeStyle, and all shared types
└── utils/
    ├── camera.ts             # CameraManager — capture, upload processing, filter + frame baking
    ├── compositor.ts         # composeStrip — composites photos into a single strip PNG
    ├── pdf.ts                # generatePrintPDF — print-ready PDF export at 300 DPI
    └── cn.ts
supabase/
└── schema.sql                # Full database schema and storage setup
docs/
├── BRAINSTORM.md             # Full feature brainstorm with notes
└── ROADMAP.md                # Active roadmap — what's shipped, building, and parked
```

---

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint
npm run format       # Prettier
```

---

## Adding a Custom Filter

Append an entry to the `FILTERS` array in `src/constants/filters.ts`:

```typescript
{ id: 'myfilter', name: 'My Filter', css: 'sepia(30%) contrast(1.1) brightness(1.05)' }
```

The CSS string is applied live to the `<video>` element and baked into every capture (and upload) via `ctx.filter`.

---

## Adding a Custom Frame Template

Add an entry to the `frameTemplates` array in `src/pages/TemplatesPage.tsx`:

```typescript
{
  id: 'frame-my-style',
  name: 'My Style',
  preview: '',
  layout: 'quad',           // single | double | quad | six
  aspectRatio: '1:1',
  compositeStyle: 'blush',  // clean | polaroid | film | blush | minimal
  description: '4 shots · my custom style',
}
```

The `compositeStyle` field drives how `compositor.ts` renders the final strip PNG.

---

## Deployment

**Vercel:** Connect the repository, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in project settings, and deploy. Subsequent pushes to `main` deploy automatically.

Note: `vercel.json` sets `Permissions-Policy: camera=*` so the camera API works on the deployed domain.

```bash
# Manual build
npm run build
# Output → dist/
```

---

## Contributing

```bash
git checkout -b feature/your-feature
git commit -m 'Add your feature'
git push origin feature/your-feature
# Open a pull request
```

---

## Contact

- **Email:** [miguelpilapil30@gmail.com](mailto:miguelpilapil30@gmail.com)
- **Discord:** [saintalauuuurel_](https://discord.com/users/saintalauuuurel_)
- **GitHub:** [sainttlaurel/ClickStudio](https://github.com/sainttlaurel/ClickStudio)

---

## License

MIT — see [LICENSE](LICENSE).

---

## Acknowledgments

Design language inspired by Y2K photo booth aesthetics, Polaroid culture, and modern editorial UI patterns. Icons by [Lucide](https://lucide.dev/). Typefaces via [Google Fonts](https://fonts.google.com/).
