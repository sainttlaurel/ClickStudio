# ClickStudio 📸

A modern, production-ready web-based photo booth application built with React 19, TypeScript, and cutting-edge technologies. The aesthetic photo studio experience — right in your browser. No app required.

## ✨ Features

- **Live Camera Capture** — HD webcam support with device switching and grid overlay
- **13 Film Filters** — Vintage, Smooth, 70s, 80s, 90s, B&W, Faded, Lomo, Cool, Warm, Film, Dreamy & more — applied live and baked into every photo
- **Frame Overlays** — Clean, Film strip, Blush vignette, and Minimal border styles
- **Multiple Layouts** — Single, Double Strip, Four Cuts, and Photo Strip templates
- **Photo Editor** — Brightness, contrast, saturation, temperature and more
- **Real-time Preview** — See filter changes live on the camera feed
- **Export Options** — PNG, JPEG, WebP, and PDF formats
- **Session History** — Track and manage your photo sessions
- **Responsive Design** — Works beautifully on desktop and mobile
- **Accessibility** — WCAG AA compliant with keyboard navigation
- **PWA Support** — Install as a native-like app

## 🌸 User Flow

1. **Landing Page** → Click "Start the Studio"
2. **Template Selection** → Pick a frame layout (Single / Double / Four Cuts / Strip)
3. **Camera** → Choose a live filter + frame overlay → Countdown → Capture
4. **Preview** → Review your photos
5. **Editor** → Fine-tune adjustments and apply filters
6. **Export** → Download or share instantly

## 🎞️ Filters

| Filter | Vibe |
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
| Cool | Blue-toned crisp |
| Warm | Golden warm tones |
| Film | Classic film tone |
| Dreamy | Bright, soft, ethereal |

## 🖼️ Frame Overlays

| Frame | Style |
|---|---|
| Clean ✦ | No border — pure camera view |
| Film 🎞️ | Black sprocket-hole bars top & bottom |
| Blush 🌸 | Soft pink vignette at the edges |
| Minimal ⬜ | Thin white inner border |

> Both the filter and frame are **baked into the saved photo** — what you see is what you capture.

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS, Framer Motion
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Backend**: Supabase (Auth, Database, Storage)
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Fonts**: Inter, DM Serif Display, Dancing Script (Google Fonts)
- **Deployment**: Vercel

## 📋 Prerequisites

- Node.js 18+ and npm/yarn
- Modern browser with WebRTC support
- Supabase account (for backend features)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/clickstudio.git
   cd clickstudio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Update `.env` with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:5173`

## 🎨 Design System

ClickStudio uses a feminine pink design system with:

- **Color Palette**: Warm pink-white backgrounds with hot pink accents
- **Typography**: Inter (body), DM Serif Display (headings), Dancing Script (cursive accents)
- **Components**: Reusable UI components with pill/rounded variants
- **Spacing**: 8-point grid system
- **Animations**: Smooth Framer Motion transitions with float and pulse effects
- **Accessibility**: Focus states, ARIA labels, keyboard navigation

### Color Tokens

```css
--background: #FDF5F7   /* Warm pink-white */
--surface:    #FFFFFF
--card:       #FFF0F5
--border:     #F5C5D8   /* Soft rose border */
--primary:    #E91E8C   /* Hot pink */
--secondary:  #FF85A2   /* Medium pink */
--accent:     #FFB3C6   /* Light blush */
--text:       #1C0B1A   /* Deep dark */
--muted:      #9B6B7B   /* Dusty rose */
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/             # Button, Input, Modal, Slider, Toaster
│   └── layout/         # Header, Sidebar, Layout
├── pages/
│   ├── LandingPage.tsx       # Hero + floating stickers + CTA
│   ├── CameraPage.tsx        # Live camera + filters + frames
│   ├── TemplatesPage.tsx     # Frame layout selection
│   ├── PreviewPage.tsx       # Review captured photos
│   ├── EditorPage.tsx        # Adjust brightness, contrast etc.
│   ├── GalleryPage.tsx       # Browse all photos
│   ├── SessionHistoryPage.tsx
│   ├── SettingsPage.tsx
│   ├── HelpPage.tsx
│   └── AboutPage.tsx
├── store/
│   ├── usePhotoStore.ts      # Camera, photos, session state
│   └── useUIStore.ts         # Toast, sidebar UI state
├── types/
│   └── index.ts              # TypeScript interfaces
└── utils/
    ├── camera.ts             # CameraManager (capture + filter baking)
    └── cn.ts                 # Tailwind class merging helper
```

## 🧪 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run format       # Format code with Prettier
```

### Code Quality

- **ESLint** — Linting with TypeScript rules
- **Prettier** — Code formatting
- **Husky** — Git hooks for quality checks
- **TypeScript** — Strict mode enabled

### Camera Settings

Modify camera defaults in `src/store/usePhotoStore.ts`:

```typescript
cameraSettings: {
  facingMode: 'user',
  resolution: { width: 1280, height: 720 },
  countdown: 3,
  flash: false,
  grid: true,
}
```

### Adding a Custom Filter

Add a new entry to the `FILTERS` array in `src/pages/CameraPage.tsx`:

```typescript
{ id: 'myfilter', name: 'My Filter', css: 'sepia(30%) contrast(1.1) brightness(1.05)' }
```

The CSS string is applied live to the `<video>` element and baked into the canvas on capture via `ctx.filter`.

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Set environment variables in the Vercel dashboard
3. Deploy — automatic deployments on push to main

### Manual Build

```bash
npm run build
# Output is in the dist/ directory
```

## 📊 Performance

- **Lighthouse Score**: 90+ across all metrics
- **Core Web Vitals**: Optimized for best user experience
- **Bundle Size**: Code splitting and lazy loading
- **PWA**: Service worker with offline support

## ♿ Accessibility

- **WCAG AA Compliance**: Meets accessibility standards
- **Keyboard Navigation**: Full keyboard support
- **Screen Readers**: Proper ARIA labels and roles
- **Focus Management**: Visible pink focus indicators
- **Reduced Motion**: Respects `prefers-reduced-motion`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Design inspiration from Polaroid Booth, photobooth.io, and Y2K aesthetics
- Icons by [Lucide](https://lucide.dev/)
- Typography by [Google Fonts](https://fonts.google.com/) — DM Serif Display, Dancing Script, Inter

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/clickstudio/issues)

---

**Made with ♡ for capturing beautiful moments**
