# Technical Specifications Alignment: Gomoku Game Engine and AI

This document maps each requirement from the **Technical Specifications Document** to the current implementation and notes gaps or actions.

---

## 1. Project Foundation and Strategic Objectives

| Spec | Requirement | Status | Notes |
|------|-------------|--------|--------|
| Board | 19×19 Goban | ✅ Aligned | `game_manager.py`: `board_size=19`, `board.py` uses `_size` |
| Stones | No limit | ✅ Aligned | No stone-count limit in code |
| Winning | 5+ in a row (H/V/D) | ✅ Aligned | `connect_num=5`, `check_direction` / `check_line_win` |
| AI goal | Beat human players, adversarial agent | ✅ Aligned | Minimax + alpha-beta, heuristic evaluation |

---

## 2. Game Mechanics and Logic Constraints

### Capture and Endgame

| Spec | Requirement | Status | Notes |
|------|-------------|--------|--------|
| Pair extraction | Only pairs captured (not single or >2) | ✅ Aligned | `board.check_capture`: shape `[B,W,W,B]` (2 stones) |
| Flanking | Pair captured when flanked by opponent | ✅ Aligned | Same pattern: flanking stones capture middle pair |
| 10-stone win | Win on capturing 10 opponent stones | ✅ Aligned | `_max_peer_capture = 5` (5 pairs = 10 stones); `terminal_state` checks `peer_captured >= _max_peer_capture` |
| Breaking 5-in-a-row | Game does **not** end if opponent can break the line by capturing a pair within it | ❌ **Gap** | Current code ends game on any 5-in-a-row. Spec: must not terminate if opponent can immediately capture a pair **within that line** and break the five. **Action:** After detecting 5-in-a-row, check if opponent has a legal move that captures two stones on that line; if yes, do not declare win. |
| 4-pair vulnerability | After losing 4 pairs, 5th pair capture = loss | ✅ Aligned | Same as 10-stone win: 5 pairs lost = game over |
| Self-capture | Cannot move into a capture (own pair flanked) unless move also captures opponent | ❌ **Gap** | `is_legal` does not check “moving into capture.” **Action:** Before accepting move, simulate: place stone → apply captures; if our pair gets captured and we did not capture opponent, move is illegal. |
| Double-three | Forbidden move (two free-threes) | ✅ Aligned | `rules_manager.double_tree` with free-three patterns |
| Double-three exception | Legal if alignment obstructed at creation or if double-three results from a capture | ⚠️ Partial | Obstructed: free-three logic uses boundary as block; opponent block at one end not explicitly treated. Capture exception: double-three is checked **before** applying captures. **Action:** (1) Treat “blocked by opponent” as non–free-three; (2) run double-three check **after** applying captures (or allow move when move captures). |

### Endgame State

| Spec | Requirement | Status | Notes |
|------|-------------|--------|--------|
| Terminate when win certain | Stop when 5-in-a-row and opponent cannot break by capture, or opponent cannot reach 10-stone capture next turn | ⚠️ Partial | Currently: 5-in-a-row or 5-pair capture or draw. “Cannot break by capture” and “cannot reach 10-stone” not fully enforced. Tied to “Breaking 5-in-a-row” fix above. |

---

## 3. AI Architecture

| Spec | Requirement | Status | Notes |
|------|-------------|--------|--------|
| Minimax | Mandatory foundation | ✅ Aligned | `Minimax.py`: minimax with alpha-beta |
| **Depth-10 hard constraint** | Search depth **at least 10**; less = disqualification from max grade | ✅ Aligned | `ai_manager.get_depth`: Hard = 11. Easy=3, Medium=7 are below 10 (allowed for lower difficulties). **Recommendation:** Use “Hard” for evaluation; document that max grade requires depth ≥ 10. |
| Heuristic: terminal accuracy | Winning/losing/high-threat with no error | ✅ Aligned | `heuristic_evaluation`: MAX_SCORE for win/loss, capture count, pattern scores |
| Heuristic: speed | Lightweight for depth-10 in ≤ 0.5s | ⚠️ Verify | Depth 11 at 0.5s requires measurement. Backend now returns `thinking_time`; ensure Hard stays ≤ 0.5s or optimize. |
| Heuristic: adaptability | Weight by game stage | ❌ **Gap** | No explicit opening/mid/endgame weighting. Optional improvement. |
| Heuristic: material vs alignment | Balance captures vs alignments | ✅ Aligned | `peer_captured * 10` + pattern scores in `heuristic_evaluation` |
| Debug / technical defense | Output AI reasoning, branches, why moves chosen | ⚠️ Partial | `debug_mode` exists; print of time disabled when debug on. **Action:** When `debug_mode` True, log chosen move, depth, score, and optionally branch summary (see implementation). |

---

## 4. Performance and System Reliability

| Spec | Requirement | Status | Notes |
|------|-------------|--------|--------|
| **0.5s average** | AI move in ≤ 0.5s average; failure = validation failure | ⚠️ Measure | Backend returns `thinking_time_seconds`; UI shows it. Must validate on target hardware that Hard (depth 11) meets 0.5s. |
| No crash / segfault / quit | Graceful handling; Grade 0 on crash | ⚠️ Partial | **Action:** Guard all game API routes when `game_manager_module is None` (return 4xx, no exception). |
| Makefile: $(NAME), all, clean, fclean, re | Mandatory rules | ⚠️ Partial | **Action:** Add `NAME := Gomoku`; `all` and `$(NAME)` build the project; keep `clean`, `fclean`, `re`. |
| Zero relinking | Do not recompile up-to-date files | ✅ Aligned | build-frontend/build-backend are phony; PyInstaller/npm build internally. **Action:** Document that `$(NAME)` depends on build steps; avoid redundant work in recipes. |

---

## 5. GUI and Interaction

| Spec | Requirement | Status | Notes |
|------|-------------|--------|--------|
| **AI Thinking Timer** | **Mandatory.** Display precise time for AI calculation. No timer = no validation. | ✅ Aligned | Backend measures and returns `thinking_time_seconds`; frontend displays it in AI Thinking Indicator / stats. Timer reflects **backend computation time**, not only network. |
| Hotseat + move suggestion | Local multiplayer with AI engine suggesting Minimax top move | ✅ Aligned | PlayerVsPlayer: “Hints” toggle calls `/api/game/best_move` and shows hint on board. |

---

## 6. Submission and Defense

| Spec | Requirement | Status | Notes |
|------|-------------|--------|--------|
| Explain Minimax | Tree traversal to non-expert | ✅ Ready | Code is standard minimax + alpha-beta; add short comment or doc for defense. |
| Justify heuristic | Speed vs terminal accuracy | ✅ Ready | Heuristic is centralized; document design in comments or SPEC_ALIGNMENT. |
| Live rule demo | Captures and no double-three | ✅ Ready | Use standard rule; demonstrate capture and illegal double-three. |
| Live play | AI holds its own | ✅ Ready | Use Hard (depth 11). |
| Bonus (Standard/Pro/Swap etc.) | Only if mandatory part perfect | ✅ Stubs | PRO/SWAP exist as subclasses of standard (same behavior) so selection does not crash; full variants can be added later. |

---

## 7. Summary: Required Actions

### Must fix for spec compliance

1. **API stability:** Guard every game route: if `game_manager_module is None`, return 400/404 with a clear message (no 500/crash).
2. **AI Thinking Timer:** Backend returns `thinking_time_seconds` in `/api/game/best_move` response; frontend displays this value as the official “AI calculation time.”
3. **Makefile:** `NAME := Gomoku`; `all` and `$(NAME)` build the project (depend on `build`); `clean`, `fclean`, `re` unchanged; `wildcard` typo in status target fixed. Use `make help` to list all targets.
4. **Rules:** PRO and SWAP are implemented as stub classes (inherit from standard, same behavior) so `globals()[rule]()` does not crash. Full rule variants can be added later for bonus.

### Recommended for full alignment

5. **Breaking 5-in-a-row:** Do not end game on 5-in-a-row if opponent can break the line by capturing a pair on that line (simulate opponent capture moves on the winning line).
6. **Self-capture:** In `is_legal`, after placing stone and applying captures: if our pair was captured and we did not capture opponent, move is illegal.
7. **Double-three exceptions:** Consider “obstructed at creation” and “double-three from capture” (e.g. run double-three check after captures or allow when move captures).
8. **Debug output:** When `debug_mode` is True, log move chosen, depth, score, and optionally a brief branch summary for defense.

### Optional / later

9. Heuristic game-stage weighting (opening/mid/endgame).  
10. Performance: If Hard (depth 11) exceeds 0.5s on evaluation hardware, reduce depth or optimize (e.g. memo, move ordering, pruning).

---

## 8. Checklist (Heuristic Design – Spec Section 3)

- [x] Terminal node accuracy: winning/losing/high-threat identified (MAX_SCORE, capture count, patterns).
- [ ] Computational speed: confirm depth-10 (or 11) within 0.5s (measure with `thinking_time_seconds`).
- [ ] Adaptability: game-stage weighting not implemented.
- [x] Material weighting: captures (×10) and alignment patterns balanced in heuristic.

---

*Last updated from Technical Specifications Document review. Implement the “Must fix” items first, then “Recommended,” then optional.*
