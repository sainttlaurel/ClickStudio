# ClickStudio — Roadmap

> Distilled from `BRAINSTORM.md`.  
> Last updated: June 2026

---

## Building Now — ADD

These are confirmed and ready to implement.

---

### Camera Improvements

| # | Feature | What it does | Effort |
|---|---|---|---|
| C1 | Timer options | Let user choose 3s / 5s / 10s countdown before capturing | Very Low |
| C2 | Mirror / Flip toggle | Flip the video feed horizontally — natural selfie feel | Very Low |
| C3 | Retake option | After a shot, user can discard and retake that single photo | Low |
| C4 | Auto-capture burst mode | Camera fires X shots automatically — user just poses | Low |

**Burst mode is opt-in, not the default.**

---

### Photo Output

| # | Feature | What it does | Effort |
|---|---|---|---|
| P1 | Full photo strip export | Download all photos composited into one vertical strip PNG, with a ClickStudio watermark at the bottom | Low |
| P2 | Polaroid frame option on camera | Choose a polaroid-style frame while shooting — baked into the capture | Low |
| P3 | Polaroid caption text | Add a short text line below the white polaroid border before downloading | Medium |

**Polaroid frames are drawn on canvas in code — no external image assets.**  
**Strip export watermark: small "ClickStudio" text at the bottom.**

---

### Upload & Edit

| # | Feature | What it does | Effort |
|---|---|---|---|
| U1 | Image upload | Upload an existing JPG / PNG / WEBP and run it through the same filter + frame pipeline | Medium |
| U2 | Filter + frame on upload | Same 13 filters and 4 frame overlays apply to uploaded images | Included in U1 |

**Uploaded images go through the same Supabase Storage pipeline as captured photos — keeps uploads consistent and avoids duplicates.**

---

### Sharing

| # | Feature | What it does | Effort |
|---|---|---|---|
| S1 | QR Code share | Each session gets a `/share/[sessionId]` page; QR code generated client-side so anyone can scan and download | Medium |

---

## Decisions Locked

These questions are answered — no need to revisit.

| Question | Decision |
|---|---|
| Feedback moderation | Auto-approved. A dedicated feedback page lets the dev read and reply to user comments and bug reports. |
| Uploaded image storage | Same Supabase Storage bucket as captured photos — consistent pipeline, no duplicates. |
| Polaroid frame rendering | Canvas code only — no SVG/PNG assets needed. |
| Strip export watermark | Yes — small "ClickStudio" text at the bottom of every strip. |
| User accounts scope | Free for everyone. Email/password auth added later. Google OAuth deferred. |
| Burst mode default | Opt-in only — not on by default. |

---

## Parked for Later — HOLD

These are good ideas but not being built yet. Revisit when the ADD items are shipped.

---

### On Hold

| # | Feature | Why it's parked | Revisit when |
|---|---|---|---|
| H1 | Feedback & Comment Wall | Needs moderation page + dev reply system — more than a simple form | After core features ship |
| H2 | Full Polaroid / Film Strip Template Editor | Complex multi-template editor — simple polaroid frame covers the need for now | After upload + edit is stable |
| H3 | Stickers & Text Overlays | Drag-and-drop canvas interaction is complex; polaroid caption (P3) covers basic text | After strip export + upload ship |
| H4 | Aesthetic Preset Packs | Depends on stickers being built first | After H3 |
| H5 | Optional User Accounts | Supabase Auth is ready — deferred to avoid adding friction before core UX is solid | When gallery/sharing is mature |
| H6 | Print-Ready PDF Export | jsPDF adds ~200 KB; PNG strip covers most use cases for now | After event/wedding use case grows |

---

## Build Order Suggestion

```
Phase 1 — Camera  →  C1, C2, C3, C4, P2
Phase 2 — Output  →  P1, P3
Phase 3 — Upload  →  U1, U2
Phase 4 — Share   →  S1
Phase 5 — Hold    →  H1, H5, H3, H4, H2, H6
```
