# UI Review

Design review conducted June 27, 2026. Score: **9.2/10**.

---

## Overall Impression

The app is clean, modern, and has a clear pink-forward aesthetic. The camera-to-preview flow is smooth. The template system is well-structured. The editor is functional.

But it still feels like a demo. To be a real product, it needs to feel **alive**.

---

## What's Working

- Clean pink-forward aesthetic — consistent throughout
- Camera flow is intuitive (template → capture → preview)
- Template Library modal is well-designed with categories and search
- Filter + frame tabs are clearly separated
- Sticker and text overlay systems are solid
- Composite strip output looks professional
- Print-ready PDF export is a strong feature
- QR code sharing is a nice touch
- PWA installability

---

## Issues to Fix

### 1. Static / Not Alive
The site feels static. Every page is a white card on a pink background. There's no motion, no life.

**Fixes needed:**
- Add subtle entrance animations to cards and sections (Framer Motion)
- Animate the hero section — floating elements, parallax, or particle effects
- Add hover states to template cards (scale, shadow shift)
- Animate the capture button (pulse, glow)
- Add page transition animations
- Add loading states and skeleton screens
- Make the feedback wall auto-scroll or have staggered entrance

### 2. Placeholder Graphics
The hero section uses emoji (📸, 🎀, ✨, 🖼, 🎪) instead of real images. The template previews are empty circles. There are no example photo strips anywhere.

**Fixes needed:**
- Replace emoji hero with real photo strip examples or high-quality illustrations
- Create real template preview thumbnails (not empty circles)
- Show example output strips on the landing page
- Add a "gallery" section showing what users have created

### 3. Repetitive Layouts
Almost every page follows the same pattern: white card on pink background. The landing page sections, the about page, the help page — they all feel identical.

**Fixes needed:**
- Vary section backgrounds (alternate between white, pink-50, gradient)
- Add full-width sections that break out of the container
- Use different card styles (some with borders, some with shadows, some with gradients)
- Add visual hierarchy through size and spacing variation

### 4. Missing Social Proof
There are no testimonials, no user counts, no "made by" stories, no community showcase.

**Fixes needed:**
- Add testimonials section to landing page
- Show user count or session count
- Add a "featured creations" gallery
- Show Discord member count or activity

### 5. Missing Template Showcase
The template carousel is buried inside the camera page. Users don't see what's possible until they've already started.

**Fixes needed:**
- Add a template showcase section to the landing page
- Show template previews with example output strips
- Let users browse templates before clicking "Start"

### 6. Accessibility Issues
- Contrast: Pink text on white backgrounds may not meet WCAG AA
- Focus rings: Some interactive elements lack visible focus indicators
- Labels: Some buttons use only icons without labels
- Alt text: Missing on some images

**Fixes needed:**
- Audit all text colors against backgrounds for 4.5:1 contrast ratio
- Add visible focus rings to all interactive elements
- Add labels or aria-labels to icon-only buttons
- Add alt text to all images

### 7. Spacing
Some sections feel too far apart, others too cramped.

**Fixes needed:**
- Tighten spacing between related sections
- Increase spacing between unrelated sections
- Ensure consistent padding across all pages

---

## Priority Actions

| Priority | Action | Impact |
|---|---|---|
| 1 | Add motion/animations to landing page | High — makes site feel alive |
| 2 | Create real template preview thumbnails | High — shows what's possible |
| 3 | Add example photo strips to landing page | High — social proof + showcase |
| 4 | Add testimonials/social proof section | Medium — builds trust |
| 5 | Fix accessibility issues | Medium — legal + usability |
| 6 | Vary section backgrounds | Medium — breaks visual monotony |
| 7 | Add hover states and micro-interactions | Low — polish |

---

## Design Tokens Reference

| Token | Value | Usage |
|---|---|---|
| `--background` | `#FDF5F7` | Page background |
| `--surface` | `#FFFFFF` | Cards and panels |
| `--border` | `#F5C5D8` | Borders and dividers |
| `--primary` | `#E91E8C` | Buttons, active states |
| `--secondary` | `#FF85A2` | Accents |
| `--text` | `#1C0B1A` | Body text |
| `--muted` | `#9B6B7B` | Secondary text |

**Typography:** Inter (body), DM Serif Display (headings), Dancing Script (accents)
