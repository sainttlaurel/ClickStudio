# ClickStudio — Roadmap

> Distilled from `BRAINSTORM.md`.
> Last updated: June 2026

---

## Shipped — Phase 1 (DONE)

| # | Feature | What was built |
|---|---|---|
| C1 | Timer options | 3s / 5s / 10s pill selector in the camera controls row |
| C2 | Mirror toggle | Flips live preview with CSS `scaleX(-1)`; bakes correct transform into canvas on capture |
| C3 | Retake option | Thumbnail strip appears after each shot; hover reveals a red × to delete and reshoot |
| C4 | Burst mode | Opt-in toggle auto-fires the full shot set for the chosen template with 950ms between shots; countdown shows "Shot X of Y" |
| P2 | Polaroid frame | White border + thick bottom strip baked into the capture; subtle ClickStudio label in the strip |

---

## Shipped — Phase 2 (DONE)

| # | Feature | What was built |
|---|---|---|
| P1 | Full photo strip export | `compositor.ts` — all photos composited into one canvas PNG per layout and composite style; ClickStudio watermark in footer; Download Strip button in PreviewPage |
| P3 | Polaroid caption text | Input field in PreviewPage when template `compositeStyle === 'polaroid'`; text baked into each polaroid bottom strip at render time |
| X1 | Changelog / What's New popup | `constants/changelog.ts` + `ChangelogModal` component; auto-shows once per `APP_VERSION`; dismissed state in localStorage |
| — | Frame Templates (real) | 4 pre-designed frame templates — Polaroid Memories, Film Roll, Blush Edit, Minimal Clean — each applies a unique composite style to the strip output |
| — | Classic Layouts tab fixed | Separate template arrays per tab; Frame Templates and Classic Layouts now show distinct content |
| — | Composite Preview in PreviewPage | Preview page now shows the final composited strip as the primary result; individual shots in a retake filmstrip sidebar |
| — | Image upload (U1 / U2) | "or upload a photo" link on CameraPage; `CameraManager.processUploadedImage()` runs JPG / PNG / WEBP through the same filter + frame pipeline as a live capture |
| — | Session History export fixed | Export button generates and downloads the full composite strip via `compositor.ts` |
| — | Carousel arrows wired | TemplatesPage left/right arrows now scroll the carousel via `scrollBy` |
| — | `CompositeStyle` type | Added to `src/types/index.ts`; `Template` interface extended with `compositeStyle` and `description` fields |

---

## Shipped — Branding & Polish (DONE)

| # | Feature | What was built |
|---|---|---|
| — | Official logo | `public/logo.png` integrated into Header, Sidebar, About page, and Landing page footer with fallback |
| — | Contact info | About page now shows email and Discord; Twitter replaced with Email + Discord buttons |
| — | Copyright update | Footer and About page updated to `© 2026 ClickStudio` |

---

## Shipped — Phase 3 (DONE)

| # | Feature | What was built |
|---|---|---|
| S1 | QR Code share | `/share/[sessionId]` public page with composite preview + download; QR code generated client-side via `qrcode` package; Copy Link button; QR modal in PreviewPage |
| H1 | Feedback / Comment Wall | `feedback` Supabase table with name, message, emoji, approved fields; feedback form on LandingPage; scrolling card wall displaying approved feedback; auto-approved on submit |

---

## Shipped — Phase 4 (DONE)

| # | Feature | What was built |
|---|---|---|
| H6 | Print-Ready PDF Export | `src/utils/pdf.ts` — generates print-ready PDF at 300 DPI via jsPDF; supports 6 print sizes: 2×6 strip, 4×6 print, A4 (1/2 strips), US Letter (1/2 strips); Print/PDF button + size picker modal in PreviewPage |

---

## Shipped — Phase 5 (DONE)

| # | Feature | What was built |
|---|---|---|
| H3 | Stickers & Text Overlays | `src/constants/stickers.ts` — 6 sticker packs (48 emoji); Stickers tab in EditorPage with pack selector, tap-to-add, drag-to-reposition, resize/rotate/delete controls; Text tab with 4 font presets, 10 colors, size slider, drag-to-reposition; stickers and text composited onto canvas on save |

---

## Decisions Locked

| Question | Decision |
|---|---|
| Feedback moderation | Auto-approved. A dedicated feedback page lets the dev read and reply to comments and bug reports. |
| Uploaded image storage | Same Supabase Storage bucket as captured photos — consistent pipeline. |
| Polaroid frame rendering | Canvas code only — no SVG / PNG assets. Done. |
| Strip export watermark | Yes — small "ClickStudio" text at the bottom of every strip. |
| User accounts scope | Free for everyone. Email / password auth added later. Google OAuth deferred. |
| Burst mode default | Opt-in only. Done. |
| Image upload size cap | 10 MB — matches the Supabase Storage limit. |

---

## Parked for Later — HOLD

| # | Feature | Why it's parked | Revisit when |
|---|---|---|---|
| H2 | Full Polaroid / Film Strip Template Editor | Complex; current frame templates cover the need | After sharing grows |
| H5 | Optional User Accounts | Supabase Auth ready — deferred to avoid friction before core UX is solid | When gallery / sharing is mature |

---

## Full Build Order

```
Phase 1 — Camera      →  C1, C2, C3, C4, P2                    ✅ SHIPPED
Phase 2 — Output      →  P1, P3, X1, U1/U2, Frame Templates    ✅ SHIPPED
Phase 2b — Branding   →  Logo, Contact, Copyright               ✅ SHIPPED
Phase 3 — Share       →  S1, H1                                 ✅ SHIPPED
Phase 4 — PDF Export  →  H6                                     ✅ SHIPPED
Phase 5 — Creative    →  H3                                     ✅ SHIPPED
Phase 6 — Accounts    →  H5                                     (HOLD)
```
