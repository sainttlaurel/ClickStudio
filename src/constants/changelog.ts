export const APP_VERSION = '1.6.0'

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
    version: '1.6.0',
    date: 'June 27, 2026',
    entries: [
      { type: 'new',      text: 'Auto-redirect to Preview when all shots are captured — no manual tap needed' },
      { type: 'new',      text: 'Celebration toast "All shots captured!" before redirecting' },
      { type: 'improved', text: 'Works with burst mode — redirect triggers after full sequence completes' },
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
