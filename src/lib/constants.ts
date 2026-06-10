// ─── Environment ──────────────────────────────────────────────────────────────

export const ENV = {
  WS_URL: import.meta.env.VITE_BACKEND_WS_URL ?? "ws://localhost:8000/ws",
  HTTP_URL: import.meta.env.VITE_BACKEND_HTTP_URL ?? "http://localhost:8000",
} as const;

// ─── WebSocket ────────────────────────────────────────────────────────────────

export const WS_RECONNECT_DELAY_MS = 3_000;
export const WS_MAX_RECONNECT_ATTEMPTS = 5;

// ─── UI ───────────────────────────────────────────────────────────────────────

export const APP_TITLE = "Telegram Bridge Chat";
export const APP_DESCRIPTION =
  "Real-time bridge between your browser and Telegram";

export const EMPTY_STATE_TITLE = "No messages yet";
export const EMPTY_STATE_DESCRIPTION =
  "Start the conversation — your message will be forwarded to Telegram.";

export const SEND_BUTTON_LABEL = "Send";
export const INPUT_PLACEHOLDER = "Type a message…";

export const STATUS_LABELS: Record<string, string> = {
  idle: "Idle",
  connecting: "Connecting…",
  connected: "Connected",
  disconnected: "Disconnected",
  error: "Error",
} as const;
