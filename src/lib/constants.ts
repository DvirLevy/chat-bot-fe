import type { ChatEndedReason } from "./types";

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
export const INPUT_PLACEHOLDER_BUSY = "Chat is busy…";
export const INPUT_PLACEHOLDER_ENDED = "Chat ended";

export const BUSY_MESSAGE =
  "Someone else is currently chatting. Please try again later.";

export const END_CHAT_BUTTON_LABEL = "End chat";
export const START_NEW_CHAT_BUTTON_LABEL = "Start new chat";

export const ENDED_REASON_MESSAGES: Record<ChatEndedReason, string> = {
  user: "You ended the chat. Start a new one whenever you're ready.",
  idle: "The chat ended due to inactivity. Start a new one whenever you're ready.",
  replaced:
    "This chat was opened in another tab or window. Start a new one here to take it back.",
};

export const STATUS_LABELS: Record<string, string> = {
  idle: "Idle",
  connecting: "Connecting…",
  connected: "Connected",
  disconnected: "Disconnected",
  error: "Error",
} as const;

// ─── Username Entry ───────────────────────────────────────────────────────────

export const USERNAME_STORAGE_KEY = "chat-username";
export const USERNAME_MAX_LENGTH = 32;

export const USERNAME_ENTRY_TITLE = "Welcome";
export const USERNAME_ENTRY_DESCRIPTION =
  "Choose a username to start chatting. We'll remember it for this session.";
export const USERNAME_INPUT_LABEL = "Username";
export const USERNAME_INPUT_PLACEHOLDER = "Enter a username…";
export const USERNAME_SUBMIT_LABEL = "Continue";
export const USERNAME_REQUIRED_ERROR = "Please enter a username.";
