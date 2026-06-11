# Telegram Bridge Chat — Frontend

A clean, production-quality React chat UI that bridges a web user with a remote Telegram participant via a FastAPI + WebSocket backend.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui primitives |
| Routing | React Router DOM v7 |
| Icons | Lucide React |

---

## Quick Start

### 1. Install

```bash
npm install
```

### 2. Configure environment

```bash
add .env file sent to your email
```

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 4. Build for production

```bash
npm run build
npm run preview
```

---

## Run with Docker

Builds the app and serves it via nginx on port 5173. The `VITE_*` vars are baked in at build time.

```bash
# using the values from .env
VITE_BACKEND_WS_URL=$(grep VITE_BACKEND_WS_URL .env | cut -d= -f2) \
VITE_BACKEND_HTTP_URL=$(grep VITE_BACKEND_HTTP_URL .env | cut -d= -f2) \
docker compose up --build
```

Or build/run directly:

```bash
docker build \
  --build-arg VITE_BACKEND_WS_URL=ws://localhost:8000/ws \
  --build-arg VITE_BACKEND_HTTP_URL=http://localhost:8000 \
  -t chat-bot-fe .

docker run -p 5173:80 chat-bot-fe
```

Open [http://localhost:5173](http://localhost:5173).

---

## Project Structure

```
src/
├── pages/
│   ├── ChatPage.tsx          # Main chat view
│   └── NotFoundPage.tsx      # 404 fallback
├── layouts/
│   └── MainLayout.tsx        # Root layout wrapper
├── router/
│   └── AppRouter.tsx         # All route definitions
├── components/
│   ├── chat/
│   │   ├── ChatLayout.tsx    # Structural shell
│   │   ├── ChatHeader.tsx    # Title + connection status badge
│   │   ├── MessageList.tsx   # Scrollable message feed
│   │   ├── MessageBubble.tsx # Individual message bubble
│   │   ├── ChatInput.tsx     # Controlled input + send button
│   │   └── EmptyState.tsx    # Shown when no messages exist
│   ├── system-design/
│   │   └── SystemDesignPanel.tsx  # Architecture diagram
│   └── ui/                   # shadcn-style primitive components
├── hooks/
│   ├── useWebSocket.ts       # WebSocket lifecycle (connect/reconnect/send)
│   └── useChat.ts            # Chat state + message dispatch
└── lib/
    ├── types.ts              # All TypeScript types
    ├── constants.ts          # Named constants (no magic values)
    └── utils.ts              # Shared utilities
```

---

## Architecture

```
React Frontend  (this repo)
       ↕  WebSocket  (VITE_BACKEND_WS_URL)
FastAPI Backend
       ↕  Telegram Bot API
Telegram Bot
       ↕
Telegram User
```

### WebSocket Message Protocol

All frames are JSON with a `type` discriminator:

```ts
// Outbound (browser → backend)
{ type: "message", payload: { text: string, timestamp: string } }

// Inbound  (backend → browser)
{ type: "message", payload: { text: string, timestamp?: string } }
```

---

## Connecting to the Backend

The app degrades gracefully when the backend is unavailable — the connection status badge shows `Disconnected` and the input is disabled. To connect:

1. Start your FastAPI server.
2. Set `VITE_BACKEND_WS_URL` in `.env`.
3. Ensure the backend sends frames matching the protocol above.

No frontend code changes are needed.

---

## Routes

| Path | Component | Description |
|---|---|---|
| `/` | `ChatPage` | Main chat interface |
| `*` | `NotFoundPage` | 404 — user-friendly fallback |

---

## Key Design Decisions

- **Session-only messages** — stored in React state, never persisted.
- **Auto-reconnect** — up to 5 retries with a 3 s delay.
- **Stable callbacks** — `sendRaw`/`sendMessage` wrapped in `useCallback`.
- **Accessibility** — semantic HTML, `aria-live` on message list, keyboard navigation.
- **No magic values** — all constants in `src/lib/constants.ts`.
