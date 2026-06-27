export const APP_VERSION = '1.1.0'

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
    version: '1.1.0',
    date: 'June 2026',
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
    date: 'June 2026',
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
