# ClickStudio

A modern, production-ready web photo booth application built with React 19, TypeScript, and Vite. Capture, filter, and share beautiful photo strips — entirely in the browser, no app required.

---

## Features

- **Live Camera** — HD webcam support with device switching, grid overlay, and flash
- **13 Film Filters** — Vintage, Smooth, 70s, 80s, 90s, B&W, Faded, Lomo, Cool, Warm, Film, Dreamy, and Original — applied live and baked into every capture
- **Frame Overlays** — Clean, Film strip, Blush vignette, and Minimal border
- **Layout Templates** — Single, Double Strip, Four Cuts, and Photo Strip
- **Photo Editor** — Brightness, contrast, saturation, temperature adjustments
- **Session History** — Cloud-synced via Supabase with save, load, and delete
- **Export** — PNG, JPEG, WebP, and PDF formats
- **PWA** — Installable as a native-like app
- **Responsive** — Desktop and mobile ready
- **Accessible** — WCAG AA compliant, keyboard navigable

---

## User Flow

1. Landing page — click **Start the Studio**
2. Templates — pick a layout
3. Camera — select a filter and frame, then capture
4. Preview — review your photos
5. Editor — fine-tune adjustments
6. Export or save to the cloud

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

Both the selected filter and frame overlay are baked into the saved photo via `canvas ctx.filter`.

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
src/
├── components/
│   ├── ui/                   # Button, Input, Modal, Slider, Toaster
│   └── layout/               # Header, Sidebar, Layout
├── pages/
│   ├── LandingPage.tsx
│   ├── CameraPage.tsx        # Filters, frames, live capture
│   ├── TemplatesPage.tsx
│   ├── PreviewPage.tsx
│   ├── EditorPage.tsx
│   ├── GalleryPage.tsx
│   ├── SessionHistoryPage.tsx
│   ├── SettingsPage.tsx
│   ├── HelpPage.tsx
│   └── AboutPage.tsx
├── store/
│   ├── usePhotoStore.ts      # Session, photo, and camera state + Supabase sync
│   └── useUIStore.ts
├── lib/
│   └── supabase.ts           # Typed client, upload and delete helpers
├── types/
│   └── index.ts
└── utils/
    ├── camera.ts             # CameraManager — capture with filter and frame baking
    └── cn.ts
supabase/
└── schema.sql                # Full database schema and storage setup
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

Append an entry to the `FILTERS` array in `src/pages/CameraPage.tsx`:

```typescript
{ id: 'myfilter', name: 'My Filter', css: 'sepia(30%) contrast(1.1) brightness(1.05)' }
```

The CSS string is applied live to the `<video>` element and written to the canvas via `ctx.filter` on capture.

---

## Deployment

**Vercel:** Connect the repository, set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in project settings, and deploy. Subsequent pushes to `main` deploy automatically.

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

## License

MIT — see [LICENSE](LICENSE).

---

## Acknowledgments

Design language inspired by Y2K photo booth aesthetics, Polaroid culture, and modern editorial UI patterns. Icons by [Lucide](https://lucide.dev/). Typefaces via [Google Fonts](https://fonts.google.com/).
