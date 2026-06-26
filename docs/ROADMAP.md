# ClickStudio — Roadmap

> Distilled from `BRAINSTORM.md`.
> Last updated: June 2026

---

## Shipped — Phase 1

| # | Feature | What was built |
|---|---|---|
| C1 | Timer options | 3s / 5s / 10s pill selector in the camera controls row |
| C2 | Mirror toggle | Flips live preview with CSS `scaleX(-1)`; bakes correct transform into canvas on capture |
| C3 | Retake option | Thumbnail strip appears after each shot; hover reveals a red × to delete and reshoot |
| C4 | Burst mode | Opt-in toggle auto-fires the full shot set for the chosen template with 950ms between shots; countdown shows "Shot X of Y" |
| P2 | Polaroid frame | White border + thick bottom strip baked into the capture; subtle ClickStudio label in the strip |

---

## Building Next — Phase 2

### Photo Output

| # | Feature | What it does | Effort |
|---|---|---|---|
| P1 | Full photo strip export | Download all photos composited into one vertical strip PNG with a ClickStudio watermark | Low |
| P3 | Polaroid caption text | Add a short text line below the white polaroid border before downloading | Medium |
| X1 | Changelog / What's New popup | Show a modal on first launch after an update listing what changed; dismissed state stored in localStorage | Very Low |

---

## Building Next — Phase 3

### Upload & Edit

| # | Feature | What it does | Effort |
|---|---|---|---|
| U1 | Image upload | Upload an existing JPG / PNG / WEBP and run it through the same filter + frame pipeline | Medium |
| U2 | Filter + frame on upload | Same 13 filters and 5 frame overlays apply to uploaded images | Included in U1 |

**Uploaded images go through the same Supabase Storage pipeline as captured photos.**

---

## Building Next — Phase 4

### Sharing

| # | Feature | What it does | Effort |
|---|---|---|---|
| S1 | QR Code share | Each session gets a `/share/[sessionId]` page; QR code generated client-side | Medium |

---

## Decisions Locked

| Question | Decision |
|---|---|
| Feedback moderation | Auto-approved. A dedicated feedback page lets the dev read and reply to comments and bug reports. |
| Uploaded image storage | Same Supabase Storage bucket as captured photos — consistent pipeline. |
| Polaroid frame rendering | Canvas code only — no SVG/PNG assets. Done. |
| Strip export watermark | Yes — small "ClickStudio" text at the bottom of every strip. |
| User accounts scope | Free for everyone. Email/password auth added later. Google OAuth deferred. |
| Burst mode default | Opt-in only. Done. |

---

## Parked for Later — HOLD

| # | Feature | Why it's parked | Revisit when |
|---|---|---|---|
| H1 | Feedback & Comment Wall | Needs moderation page + dev reply system | After Phase 2 ships |
| H2 | Full Polaroid / Film Strip Template Editor | Complex; simple polaroid frame covers the need for now | After upload + edit is stable |
| H3 | Stickers & Text Overlays | Drag-and-drop canvas is complex; P3 (caption) covers basic text | After Phase 2 ships |
| H4 | Aesthetic Preset Packs | Depends on stickers | After H3 |
| H5 | Optional User Accounts | Supabase Auth ready — deferred to avoid friction before core UX is solid | When gallery/sharing is mature |
| H6 | Print-Ready PDF Export | jsPDF adds ~200 KB; PNG strip covers most use cases | After event/wedding use case grows |

---

## Full Build Order

```
Phase 1 — Camera      →  C1, C2, C3, C4, P2         ✅ SHIPPED
Phase 2 — Output      →  P1, P3, X1
Phase 3 — Upload      →  U1, U2
Phase 4 — Share       →  S1
Phase 5 — Hold        →  H1, H5, H3, H4, H2, H6
```
