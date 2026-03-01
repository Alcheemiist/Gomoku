# UI & Animation Innovation Plan — Gomoku

## Current State Summary

- **Stack:** React, TypeScript, Tailwind, Vite, Lucide icons, react-hot-toast.
- **Look:** Purple/indigo gradients, glass panels, generic “AI” aesthetic.
- **Animations:** fadeIn, slideIn, stone scale+rotate, win pulse, ripple, float particles, basic loading spinner.
- **Board:** Flat amber panel, gradient grid lines, stones with `stonePlace` (scale 0→1.2→1, rotate 180→0).
- **Winner:** Modal with ping-style “confetti” (dots), trophy/crown, gradient text.
- **Theme:** Light/dark/auto via CSS variables; App uses `from-indigo-900 via-purple-900 to-pink-900`.

---

## Improvement Directions (Innovative)

### 1. **Distinct Visual Identity**
- **Problem:** Purple/indigo gradients are overused and don’t tie to Gomoku.
- **Ideas:**
  - **Go/Board-game theme:** Warm bamboo/paper palette (cream, light wood, ink black, subtle red accent).
  - **Minimal premium:** One strong accent (e.g. gold or deep green), lots of whitespace, clear typography.
  - **Dark “strategy” mode:** Deep navy/charcoal, gold or cyan accent, high contrast stones.
- **Action:** Introduce a second theme (e.g. “Classic”) via CSS variables and a toggle; keep current as “Modern”.

### 2. **Board & Stones**
- **Board:**
  - Subtle **3D perspective** (e.g. `perspective` + `rotateX(2deg)`) so the board feels like a table.
  - **Wood grain:** CSS pattern or subtle image background for the board surface.
  - **Grid:** Slightly softer lines, optional “star points” (dots at 4-4, 10-10, 16-16, etc.) for a Go feel.
- **Stones:**
  - **Glossy/ceramic:** Radial gradient (highlight top-left), subtle inner shadow, small rim shadow.
  - **Placement:** Short “drop” with a small bounce (scale overshoot then settle), optional soft sound.
  - **Winning stones:** Gentle glow + scale pulse; optional subtle “shine” sweep (shimmer).
- **Action:** Implement glossy stone styling and optional 3D board in CSS; refine `stonePlace` to a drop+bounce.

### 3. **Winning Line — Signature Moment**
- **Current:** Static yellow bar + pulsing circles.
- **Idea:** Line **draws on** over ~0.5s (SVG path with `stroke-dasharray` / `stroke-dashoffset` animation).
- **Action:** Render winning segment as an SVG line and animate `stroke-dashoffset` from full to 0; keep stone highlight.

### 4. **Winner / Game End**
- **Confetti:** Replace random ping dots with a **burst** from center (many small divs with random angle, distance, delay, rotation) or use a tiny canvas-based burst.
- **Victory line:** Reveal the winning line first (draw-on), then fade in the modal.
- **Modal:** Subtle scale-in + backdrop blur; optional particle burst behind the card.
- **Action:** CSS-only confetti burst (fixed number of particles, random directions); ensure winning line animates before or with modal.

### 5. **AI Thinking**
- **Current:** Glass card, brain icon, rotating rings, floating dots, progress bar (fake).
- **Ideas:**
  - **Neural vibe:** Animated “nodes” (circles) and “edges” (lines) that appear/disappear.
  - **Depth meter:** Bar or segments that fill by “depth” (could be simulated from time).
  - **Message rotation:** Keep; add 1–2 more distinct phrases.
- **Action:** Optional “depth” bar that grows with `thinkingTime`; keep existing copy and timer.

### 6. **Micro-interactions & Motion**
- **Buttons:** Slight “magnetic” pull on hover (move icon/text a few px toward cursor); or consistent scale + shadow.
- **Stones:** On hover (empty cell), preview stone with slight scale and opacity pulse.
- **Page transitions:** Use View Transitions API (or Framer Motion if added) for route change (e.g. main menu ↔ game).
- **Reduced motion:** Respect `prefers-reduced-motion: reduce` (shorter/disabled animations).

### 7. **Accessibility & Performance**
- **Focus:** Visible focus ring on board intersections and buttons (already partially there).
- **Reduced motion:** `@media (prefers-reduced-motion: reduce)` to shorten or disable keyframes.
- **Performance:** Avoid animating hundreds of particles every frame; use CSS animations or a small fixed set.

---

## Implementation Priority

| Priority | Item | Impact | Effort |
|----------|------|--------|--------|
| P0 | Winning line draw-on (SVG) | High — signature moment | Low |
| P0 | Glossy stone styling + drop/bounce | High — core tactile feel | Low |
| P1 | Board 3D + wood texture | High — distinct look | Medium |
| P1 | Winner confetti burst (CSS) | High — celebration | Medium |
| P2 | Theme variables (Classic vs Modern) | Medium — identity | Medium |
| P2 | AI “depth” progress bar | Medium — clarity | Low |
| P3 | Page transitions, magnetic buttons | Nice-to-have | Medium |

---

## Technical Notes

- **No new deps required** for P0/P1: use CSS + SVG + React state.
- **Optional:** `framer-motion` for route transitions and more complex orchestration later.
- **Confetti:** Keep particle count fixed (e.g. 40–60) and use `transform` + `opacity` only for GPU-friendly animation.

---

*This document is the reference for UI/animation improvements. Implementations follow these directions.*
