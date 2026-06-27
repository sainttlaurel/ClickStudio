# ClickStudio

A modern web photo booth — capture, edit, and share photo strips directly in the browser. No app download required.

**Live:** [clickstudiodev.netlify.app](https://clickstudiodev.netlify.app)

---

## Features

### Capture
- **Live Camera** — HD webcam with device switching, grid overlay, mirror toggle, and flash
- **Timer & Burst** — 3s/5s/10s countdown; burst mode auto-fires all shots; countdown beeps included
- **Image Upload** — Drop existing photos into the same filter + frame pipeline
- **Retake** — Thumbnail strip after each shot; delete and reshoot any photo

### Edit (Preview Page)
- **Filters** — 13 film presets (Vintage, B&W, Dreamy, etc.) applied per-photo with live preview thumbnails
- **Frame Overlays** — Clean, Film, Blush, Minimal, Polaroid — applied per-photo at capture or in editor
- **Stickers** — 10 themed packs (160+ emoji): Coquette, Y2K, Nature, Hearts, Food, Animals, etc.
- **Text Overlays** — 6 font presets, 15 colors, adjustable size — drag to reposition

### Export & Share
- **Composite Strip** — All photos composited into one PNG with a ClickStudio watermark
- **Print-Ready PDF** — 300 DPI in 6 sizes: 2×6 strip, 4×6 print, A4, US Letter
- **QR Code** — Generate a shareable link; public `/share/[sessionId]` page for anyone to view & download
- **Web Share API** — Native share on supported devices; falls back to download
- **Save to Cloud** — Session + photos synced to Supabase Storage

### App
- **What's New** — Auto-shows once per version with a changelog; dismiss state in localStorage
- **Feedback Wall** — Community messages displayed on the landing page
- **PWA** — Installable as a native-like app
- **Responsive** — Desktop and mobile

---

## User Flow

1. **Landing** — click **Start the Studio**
2. **Camera** — pick a template, capture photos with timer/mirror/filters/frames, or upload — auto-redirects to Preview when done
3. **Preview** — see the final composited strip; edit individual photos; retake shots; add Polaroid captions; generate QR code; download as PNG or PDF; save to cloud

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, Vite |
| Styling | Tailwind CSS, Framer Motion |
| State | Zustand |
| Backend | Supabase (Database, Storage) |
| Icons | Lucide React |
| Fonts | Inter, DM Serif Display, Dancing Script |
| Deployment | Netlify |

---

## Getting Started

**Prerequisites:** Node.js 18+, a modern browser with WebRTC, a Supabase project.

```bash
git clone https://github.com/sainttlaurel/ClickStudio.git
cd ClickStudio
npm install
cp .env.example .env
```

Add your credentials to `.env`:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

```bash
# Run the database schema in the Supabase SQL Editor
# Open supabase/schema.sql and run it

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

## Project Structure

```
src/
├── components/
│   ├── ui/                 # Button, Input, Modal, Slider, Toaster, ChangelogModal
│   ├── layout/             # Header, Sidebar, Layout
│   └── templates/          # TemplateLibrary modal
├── constants/
│   ├── filters.ts          # 13 film filter presets
│   ├── frames.ts           # 5 frame overlay definitions
│   ├── stickers.ts         # 10 sticker packs, text presets, colors
│   ├── changelog.ts        # Versioned changelog + localStorage helpers
│   ├── templates.ts        # 28 template library items, 15 categories
│   └── index.ts            # Barrel export
├── pages/
│   ├── LandingPage.tsx     # Landing with feedback wall
│   ├── CameraPage.tsx      # Camera, template carousel, filters, frames, mirror, timer
│   ├── PreviewPage.tsx     # Composite result, edit, retake, QR, PDF, download
│   ├── EditorPage.tsx      # Adjustments, stickers, text, filters, frames
│   ├── AboutPage.tsx       # About / tech stack
│   ├── HelpPage.tsx        # Help / FAQ
│   ├── SettingsPage.tsx    # Settings
│   ├── SharePage.tsx       # Public share page /share/[sessionId]
│   ├── GalleryPage.tsx     # Placeholder (planned)
│   └── SessionHistoryPage.tsx  # Placeholder (planned)
├── store/
│   ├── usePhotoStore.ts    # Session, photo, camera state + Supabase sync
│   └── useUIStore.ts       # Toast + modal state
├── lib/
│   └── supabase.ts         # Typed client, upload/delete helpers
├── types/
│   └── index.ts            # Photo, Template, CompositeStyle, all shared types
└── utils/
    ├── camera.ts           # CameraManager — capture, upload, filter + frame baking
    ├── compositor.ts       # composeStrip — composites photos into a strip PNG
    ├── frameOverlay.ts     # Shared frame drawing logic
    ├── pdf.ts              # Print-ready PDF export at 300 DPI
    ├── sounds.ts           # Countdown/capture beep sounds
    └── cn.ts               # Class name utility
supabase/
└── schema.sql              # Database schema and storage setup
docs/
├── BRAINSTORM.md           # Feature brainstorm
├── ROADMAP.md              # Active roadmap
├── CHANGESLOG.md           # Version history
└── UIREVIEW.md             # Design review & feedback
```

---

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # ESLint
npm run type-check   # TypeScript check
npm run format       # Prettier
```

---

## Customization

### Adding a Filter

Append to `FILTERS` in `src/constants/filters.ts`:

```typescript
{ id: 'myfilter', name: 'My Filter', css: 'sepia(30%) contrast(1.1) brightness(1.05)' }
```

### Adding a Frame

Append to `FRAMES` in `src/constants/frames.ts`:

```typescript
{ id: 'myframe', name: 'My Frame', icon: '🖼', style: { /* CSS properties */ } }
```

### Adding a Template

Add to the `templates` array in `src/constants/templates.ts`:

```typescript
{
  id: 'my-template',
  name: 'My Template',
  category: 'Custom',
  layout: 'quad',
  aspectRatio: '1:1',
  compositeStyle: 'blush',
  description: '4 shots · my custom style',
  preview: '',
}
```

---

## Deployment

**Netlify** (current):

1. Connect the GitHub repo in Netlify Dashboard
2. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in environment variables
3. Pushes to `main` deploy automatically

`netlify.toml` + `public/_redirects` handle SPA routing. `Permissions-Policy: camera=*` is set for camera API access.

---

## Contact

- **Email:** [clickstudio.dev@gmail.com](mailto:clickstudio.dev@gmail.com)
- **Discord:** [Join our server](https://discord.gg/4aqNkmt9RG)
- **GitHub:** [sainttlaurel/ClickStudio](https://github.com/sainttlaurel/ClickStudio)

---

## License

MIT — see [LICENSE](LICENSE).
