export const APP_VERSION = '1.7.6'

const LS_KEY = `cs_changelog_v${APP_VERSION}`
export const isChangelogSeen = (): boolean =>
  localStorage.getItem(LS_KEY) === '1'
export const markChangelogSeen = (): void =>
  localStorage.setItem(LS_KEY, '1')

export type ChangeType = 'new' | 'improved' | 'fixed'

export interface ChangeEntry {
  type: ChangeType
  text: string
}

export interface ChangelogVersion {
  version: string
  date: string
  entries: ChangeEntry[]
}

export const CHANGELOG: ChangelogVersion[] = [
  {
    version: '1.7.6',
    date: 'June 28, 2026',
    entries: [
      { type: 'new',      text: 'Zoom controls — 50%–150% with fit button' },
      { type: 'new',      text: 'Collapsible panel — click active tab to collapse' },
      { type: 'improved', text: 'Tab tooltips — hover for tab labels' },
    ],
  },
  {
    version: '1.7.5',
    date: 'June 28, 2026',
    entries: [
      { type: 'new',      text: 'Undo / Redo — full history tracking for editor changes' },
      { type: 'improved', text: 'Canvas space — reduced empty space, larger editing area' },
      { type: 'improved', text: 'Bottom panel — compressed to 24vh for more canvas room' },
      { type: 'improved', text: 'Adjustment sliders — grouped by Light and Color categories' },
      { type: 'improved', text: 'Sticker sheet — compact 8-column grid layout' },
      { type: 'improved', text: 'Slider component — softer styling with thinner track and thumb' },
    ],
  },
  {
    version: '1.7.4',
    date: 'June 28, 2026',
    entries: [
      { type: 'new',      text: 'Gallery preview section — 5 photo strip style mockups on landing page' },
      { type: 'new',      text: 'Camera tooltip walkthrough — 4-step first-visit onboarding' },
      { type: 'improved', text: 'Feature card visuals — realistic mockups replacing emoji placeholders' },
      { type: 'improved', text: 'Accessibility contrast audit — WCAG AA analysis for all design tokens' },
    ],
  },
  {
    version: '1.7.3',
    date: 'June 28, 2026',
    entries: [
      { type: 'new',      text: 'Template Showcase section on landing page — 6 real template cards' },
      { type: 'new',      text: 'Testimonials section — user reviews with star ratings' },
      { type: 'improved', text: 'Alternating section backgrounds across landing page' },
      { type: 'improved', text: 'Landing page motion — staggered entrances, hover effects, animated preview' },
      { type: 'improved', text: 'Accessibility pass — aria-labels, focus rings, labels, roles' },
    ],
  },
  {
    version: '1.7.2',
    date: 'June 28, 2026',
    entries: [
      { type: 'new',      text: '9 PNG frame templates — Anniversary, Valentine, Family, Christmas, and more' },
      { type: 'new',      text: 'Frame composite style — compositor renders PNG backgrounds with photo overlay' },
      { type: 'new',      text: '"Coming Soon" badge on Custom Layout card' },
      { type: 'improved', text: 'Card hover interactions — translateY, shadow, scale, border glow' },
      { type: 'improved', text: 'Search bar — taller (48px), white bg, focus ring with primary glow' },
      { type: 'improved', text: 'Category chips — larger, stronger selected state with scale + shadow' },
      { type: 'improved', text: 'Template selection feedback — selected card shows checkmark' },
      { type: 'improved', text: 'Hover quick actions — Preview, Use Template, Save on card hover' },
    ],
  },
  {
    version: '1.7.1',
    date: 'June 28, 2026',
    entries: [
      { type: 'fixed',    text: 'Camera blank page — fixed React hooks ordering error (error #310)' },
      { type: 'fixed',    text: 'Template carousel — cards now center-aligned with equal heights' },
      { type: 'fixed',    text: 'Camera filters and frames — bottom panel content centered' },
      { type: 'improved', text: 'Editor is more compact — smaller canvas, tighter grids, centered controls' },
      { type: 'improved', text: 'Migrated from Netlify to Vercel — better bandwidth and SPA routing' },
      { type: 'improved', text: 'Removed unused dependencies (react-hook-form, react-qr-code) and stale files' },
    ],
  },
  {
    version: '1.7.0',
    date: 'June 27, 2026',
    entries: [
      { type: 'new',      text: 'Template Library — 28 templates across 15 categories with search, sort, and favorites' },
      { type: 'new',      text: 'Template carousel — premium horizontal scroll with glassmorphism arrows and floating cards' },
      { type: 'new',      text: 'Countdown sounds — Web Audio API beeps during countdown and capture' },
      { type: 'fixed',    text: 'Camera now starts correctly after template selection' },
      { type: 'fixed',    text: 'Editor layout — removed standalone quick filter bar that was overlapping the canvas' },
      { type: 'improved', text: 'Frame Overlay tab replaces empty Crop tab' },
      { type: 'improved', text: 'Canvas height increased for better editing experience' },
    ],
  },
  {
    version: '1.6.0',
    date: 'June 27, 2026',
    entries: [
      { type: 'new',      text: 'Simplified flow — template picker is now built into CameraPage (no separate Templates page)' },
      { type: 'new',      text: 'Auto-redirect to Preview when all shots are captured — edit photos from Preview' },
      { type: 'new',      text: 'Landing page now goes directly to Camera' },
      { type: 'improved', text: 'Fewer pages, smoother experience — Templates → Camera → Preview → Editor' },
      { type: 'new',      text: 'Frame Overlay tab in Editor — change frame (Clean, Film, Blush, Minimal, Polaroid) after capturing' },
      { type: 'new',      text: 'Quick filter bar below the canvas — tap a filter to see the effect instantly, no tab switching needed' },
      { type: 'improved', text: 'Frame overlay rendering extracted to a shared utility — consistent across Camera and Editor' },
    ],
  },
  {
    version: '1.5.0',
    date: 'June 27, 2026',
    entries: [
      { type: 'new',      text: 'Click-to-place stickers — select a sticker, click on the photo to place it anywhere' },
      { type: 'new',      text: 'Touch drag support — stickers and text can be dragged with finger on mobile' },
      { type: 'improved', text: 'Fixed sticker/text positioning — overlays now track correctly with the canvas' },
      { type: 'new',      text: '13 filters with live preview thumbnails in the Editor' },
      { type: 'new',      text: '10 sticker packs (160+ emoji) — Favorites, Coquette, Y2K, Nature, Fun, Faces, Hearts, Food & Drink, Animals, Accessories' },
      { type: 'new',      text: '6 text font presets — Script, Serif, Sans, Mono, Cursive, Display' },
      { type: 'new',      text: '15 text colors for overlays' },
      { type: 'new',      text: 'Edit Photo button in PreviewPage Actions sidebar' },
    ],
  },
  {
    version: '1.4.0',
    date: 'June 26, 2026',
    entries: [
      { type: 'new',      text: 'Stickers tab — 6 themed packs with tap-to-add, drag, resize, rotate, delete' },
      { type: 'new',      text: 'Text overlay tab — 4 font presets, 10 colors, adjustable size' },
      { type: 'new',      text: 'Stickers and text composited onto canvas on save' },
    ],
  },
  {
    version: '1.3.0',
    date: 'June 26, 2026',
    entries: [
      { type: 'new',      text: 'Print-Ready PDF — export at 300 DPI in 6 sizes: 2×6, 4×6, A4, US Letter' },
      { type: 'new',      text: 'Print/PDF button with size picker modal' },
    ],
  },
  {
    version: '1.2.0',
    date: 'June 26, 2026',
    entries: [
      { type: 'new',      text: 'QR Code share — generate a QR code to share your strip' },
      { type: 'new',      text: 'Public share page — anyone can view and download your strip' },
      { type: 'new',      text: 'Feedback wall — leave a message on the landing page' },
      { type: 'new',      text: 'Copy Link button for easy sharing' },
    ],
  },
  {
    version: '1.1.1',
    date: 'June 26, 2026',
    entries: [
      { type: 'new',      text: 'Official ClickStudio logo on Header, Sidebar, About page, and Landing page' },
      { type: 'improved', text: 'Contact info — email and Discord on the About page' },
      { type: 'fixed',    text: 'Copyright updated to 2026' },
    ],
  },
  {
    version: '1.1.0',
    date: 'June 25, 2026',
    entries: [
      { type: 'new',      text: 'Photo strip compositor — all shots combined into one beautiful result' },
      { type: 'new',      text: 'Frame Templates with Polaroid, Film, Blush, and Minimal composite styles' },
      { type: 'new',      text: 'Classic Layouts tab — plain grid arrangements without decorative framing' },
      { type: 'new',      text: 'Polaroid caption — add a personal note to the bottom strip before downloading' },
      { type: 'new',      text: 'Image upload — add existing photos through the same filter + frame pipeline' },
      { type: 'improved', text: 'Preview page now shows the final composite as the primary result' },
      { type: 'improved', text: 'Retake a shot from the Preview page — removes the photo and sends you back to camera' },
      { type: 'improved', text: 'Session History export now generates and downloads the full composite strip' },
    ],
  },
  {
    version: '1.0.0',
    date: 'June 25, 2026',
    entries: [
      { type: 'new', text: 'Timer options — 3 s, 5 s, or 10 s countdown before each shot' },
      { type: 'new', text: 'Mirror toggle — flip live feed and bake correct orientation into the capture' },
      { type: 'new', text: 'Burst mode — auto-fires all shots for the chosen template' },
      { type: 'new', text: 'Retake — delete and reshoot any individual photo from the camera page' },
      { type: 'new', text: 'Polaroid frame — white border with thick caption strip baked into every capture' },
      { type: 'new', text: '13 film filters — Vintage, Smooth, 70s, 80s, 90s, B&W, Faded, Lomo, and more' },
      { type: 'new', text: '5 frame overlays — Clean, Film, Blush, Minimal, Polaroid' },
    ],
  },
]
