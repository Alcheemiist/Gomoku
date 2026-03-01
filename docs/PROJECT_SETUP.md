# Project setup verification

Quick reference for a “whole project” review. Use this to confirm everything is wired correctly.

## Structure

| Path | Purpose |
|------|--------|
| `backend/` | Flask app, game logic, AI (Minimax), API |
| `backend/api/` | Blueprints: `game.py`, `settings.py` |
| `backend/srcs/` | `game/` (board, rules, player, game_manager), `ai/` (Minimax, heuristic, ai_manager), `settings/` |
| `render/` | React + TypeScript + Vite frontend |
| `render/src/` | Components, pages, context, hooks, types |
| `docs/` | SPEC_ALIGNMENT.md, README_IMPROVEMENTS.md |

## Config and build

- **Backend deps:** `backend/requirements.txt` (flask, flask_cors, numpy, pyinstaller).
- **Frontend deps:** `render/package.json` (react, vite, tailwind, axios, etc.).
- **API base URL:** `render/src/Config.tsx` → `http://127.0.0.1:6969`.
- **Makefile:** `NAME := Gomoku`; `all` / `$(NAME)` → build; `clean`, `fclean`, `re`; `make help` lists targets.
- **.gitignore:** Ignores `Gomoku/`, `backend/build/`, `backend/render_dist/`, `Gomoku-env/`, `render/node_modules/`, `render/dist/`, logs/PIDs, IDE/OS cruft.

## Run modes

1. **Production-style:** `make build` then `make start` → run `./Gomoku/Gomoku` (serves app on 6969).
2. **Development:** `make dev` → backend on 6969 + Vite dev server (e.g. 5173); use Vite URL for UI, API on 6969.

## API behavior

- **Game routes** (e.g. `/api/game/board`, `/api/game/move`, `/api/game/best_move`, `/api/game/winner`) return 400 with a clear message when no game is initialized (`game_manager_module is None`).
- **POST /api/game/init** requires JSON body with `isAI`; missing body or key returns 400.
- **GET /api/game/winner** includes `winning_line` only when the win is by 5-in-a-row (valid line); capture/draw wins omit it so the UI does not get invalid coordinates.
- **GET /api/game/best_move** returns `x`, `y`, and `thinking_time_seconds` (backend AI computation time).

## Frontend

- **PlayerVsAI** uses `thinking_time_seconds` from the API when present and falls back to client-side timing; winning line is set with `?? null` when the server omits it.
- **PlayerVsPlayer** uses the same `winning_line ?? null` for capture/draw wins.
- **Board** only draws a winning line when `winningLine` is non-null and has valid `start`/`end`.

## Server

- **`/` and `/<path>`** check that `render_dist` exists (and `index.html` for `/`); if not built, return 503 with a message instead of crashing.

## Spec alignment

See `docs/SPEC_ALIGNMENT.md` for the full technical-spec checklist and remaining gaps (e.g. breaking 5-in-a-row by capture, self-capture rule).

---

*Last verified: full project review; init validation, winner/winning_line handling, and server dist check added.*
