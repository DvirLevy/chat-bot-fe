# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # tsc -b (typecheck) then vite build → dist/
npm run preview    # serve the production build
npm run lint       # eslint .
```

There is no test runner configured. `npm run build` is the primary verification gate: it runs `tsc -b` first, so a type error fails the build.

> Note: `npm run lint` may currently fail with a `hermes-parser` module-resolution error coming from `eslint-plugin-react-hooks` — a dependency/environment issue, not a code issue. Use `npx tsc -b` to verify changes when lint is broken.

## Environment

Copy `.env.example` → `.env`. Two vars, both read in `src/lib/constants.ts` (`ENV`):

- `VITE_BACKEND_WS_URL` (default `ws://localhost:8000/ws`)
- `VITE_BACKEND_HTTP_URL` (default `http://localhost:8000`)

The app runs fine with no backend: the connection badge shows `Disconnected` and the input disables itself.

## Architecture

React 19 + Vite + TypeScript single-page app. It's the web client of a larger system: `Browser ⇄ WebSocket ⇄ FastAPI ⇄ Telegram Bot API ⇄ Telegram user`. This repo is only the browser side.

**`@/` aliases `src/`** (configured in both `vite.config.ts` and `tsconfig.app.json`). Always import with `@/...`.

### Data flow (the core of the app)

Two layered hooks own all chat state — components are otherwise presentational:

- `src/hooks/useWebSocket.ts` — owns the raw socket lifecycle: connect, auto-reconnect (up to `WS_MAX_RECONNECT_ATTEMPTS`, fixed `WS_RECONNECT_DELAY_MS` delay), and a stable `sendRaw`. Exposes `{ status, sendRaw, lastMessage }`. Swapping backends is meant to require *only* changing the `url` argument.
- `src/hooks/useChat.ts` — composes `useWebSocket`, owns the `messages` array (session-only, never persisted) and the controlled input value. Parses inbound frames and serializes outbound ones. Exposes `{ messages, inputValue, status, setInputValue, sendMessage }`.

`ChatPage` calls `useChat()` and threads its values down through `ChatLayout` → `ChatHeader` / `MessageList` / `ChatInput`.

### WebSocket protocol

All frames are JSON discriminated by `type` (see `WebSocketMessage` in `src/lib/types.ts`). Only `type: "message"` is handled today; non-JSON frames are intentionally ignored (backend ping/pong). Outbound and inbound payloads both carry `{ text, timestamp }`.

### Routing

`src/router/AppRouter.tsx` defines every route (`createBrowserRouter`). `MainLayout` wraps all pages via `<Outlet />`; add a top-level route by adding one object to the `children` array. `/` → `ChatPage`, `*` → `NotFoundPage`.

### Styling & theming

- **Tailwind CSS v4** via the `@tailwindcss/vite` plugin — there is **no `tailwind.config.js`**. Theme config lives in `src/index.css` (`@import "tailwindcss"` + `@layer base` blocks).
- Components style with **hardcoded utility classes** (e.g. `bg-white`, `text-gray-900`), each paired with an explicit `dark:` variant — not semantic tokens. When adding/editing UI, always add the matching `dark:` class.
- **Dark mode is class-based**, enabled by `@custom-variant dark (&:where(.dark, .dark *))` in `index.css`. `src/components/theme/ThemeProvider.tsx` toggles `.dark` on `<html>`, persists the choice to `localStorage["theme"]`, and defaults to the OS preference. An inline script in `index.html` applies the class before first paint to avoid a flash. `ThemeToggle` (in the chat header) flips light/dark.

### Conventions

- **No magic values** — user-facing strings, labels, and tuning numbers live in `src/lib/constants.ts`; all shared types in `src/lib/types.ts`.
- `src/components/ui/` holds shadcn-style primitives (Button, Input, Card, Badge, Separator, ScrollArea) built on Radix + `class-variance-authority`. Compose `className`s with `cn()` from `src/lib/utils.ts`.
- Accessibility is intentional throughout (`aria-live` on the message list, `sr-only` labels, keyboard send). Preserve it when editing.
