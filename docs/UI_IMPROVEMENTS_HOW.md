# How the UI Can Be Improved

Concrete, actionable improvements grouped by impact and effort.

---

## 1. Clarity & Feedback

| Improvement | What to do | Where |
|-------------|------------|--------|
| **Turn label** | Show explicit "Your turn" or "AI's turn" next to or below "Turn N" so it's obvious who moves. | Above board (PlayerVsAI) or inside PlayerInfo. |
| **Active player** | Add a small "Thinking..." or "Your turn" badge on the active side; keep the current ring/glow. | PlayerInfo already has `isCurrentTurn`; add a one-line label. |
| **Last move** | Optionally pulse or dim the last move’s cell for 1–2 seconds after placement so the eye finds it. | Board: track `lastMove` and apply a short-lived class. |
| **Capture feedback** | When stones are captured, briefly animate them (shrink/fade) before they disappear, or show a "+1" near the capturing player’s card. | Board `place_stone` / frontend after move; or toast "Captured 1 pair!". |

---

## 2. Interactivity

| Improvement | What to do | Where |
|-------------|------------|--------|
| **Click move in analysis** | Make the move coordinates in "Move Analysis" clickable; on click, briefly highlight that cell on the board (e.g. pulse or outline). | AIMoveAnalysis receives `onHighlightPosition`; PlayerVsAI passes callback that sets a "highlight cell" state; Board shows a temporary highlight. |
| **Hover preview** | On empty cells, show a faint preview stone (current player’s color) that appears on hover and disappears on mouse out. | Board: already has hover state; add a semi-transparent stone for the current player. |
| **Performance bar** | Animate the Performance bar when the value changes (e.g. transition width over 300–500ms). | AIStatistics: bar already has `transition-all duration-500`; ensure `width` is driven by state. |

---

## 3. Polish & Consistency

| Improvement | What to do | Where |
|-------------|------------|--------|
| **Favicon** | Remove 404 for `/vite.svg`: use an inline favicon (data URI) or add `favicon.ico` / `favicon.svg` in `render/public/` so the build includes it. | `render/index.html` and/or `render/public/`. |
| **AI stats source** | Replace mock "Nodes" / "Depth" / "Win Rate" with real data from the backend when/if the API returns them (e.g. from `/api/game/best_move` or a new endpoint). | Backend: return `nodes_evaluated`, `depth_used`; frontend: use in AIStatistics and AIMoveAnalysis. |
| **Move analysis copy** | Keep reasoning strings; fix small wording issues (e.g. "at position [9, 12)" → "at (9, 12)"). | `generateMoveReasoning` and AIMoveAnalysis display. |
| **Loading state** | When AI is thinking, disable the board with a clear overlay and show "AI is thinking…" with a timer; already partially there—ensure overlay covers the whole board. | Board + AIThinkingIndicator. |

---

## 4. Visual & Motion

| Improvement | What to do | Where |
|-------------|------------|--------|
| **Winning line** | Line draws on (SVG stroke-dashoffset); winning stones pulse. | ✅ Done in Board + index.css. |
| **Stones** | Glossy look and drop+bounce on place. | ✅ Done (stone-glossy, stone-drop). |
| **Board** | Wood frame and subtle 3D on the grid. | ✅ Done. |
| **Winner** | Confetti burst from center. | ✅ Done in WinnerModal. |
| **Theme variety** | Add a "Classic" theme (e.g. warm bamboo/paper) alongside "Modern" (current purple). | ThemeContext + CSS variables + toggle in Settings. |
| **Star points** | Optional small dots at 4-4, 10-10, 16-16 on the board for a Go feel. | Board: render small circles at those intersections. |

---

## 5. Accessibility & Robustness

| Improvement | What to do | Where |
|-------------|------------|--------|
| **Reduced motion** | Shorten or disable animations when `prefers-reduced-motion: reduce`. | ✅ Done in index.css. |
| **Focus** | Keep visible focus ring on board cells and buttons; ensure "Back to Menu" and Settings are reachable by keyboard. | Already partial; audit tab order and focus styles. |
| **Screen reader** | Announce "Your turn" / "AI's turn" and "Game over, X wins" (e.g. via `aria-live` or a short announcement component). | Add a live region and update it on turn/winner change. |

---

## Quick Wins (already or easy to add)

1. **Favicon** – Use data URI or a small SVG in `public` so `/vite.svg` is not requested (removes 404).
2. **Turn label** – Add "Your turn" / "AI's turn" next to the turn number.
3. **Performance bar** – Ensure the bar width animates (already has transition; tie width to real or simulated progress).
4. **Move analysis click** – Optional: click coordinate → highlight cell on board for 1s.

---

*See also: `docs/UI_ANIMATION_IMPROVEMENTS.md` for the full innovation plan.*
