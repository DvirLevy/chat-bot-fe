// ─── Core Domain Types ────────────────────────────────────────────────────────

export type MessageDirection = "incoming" | "outgoing";

export interface Message {
  id: string;
  text: string;
  direction: MessageDirection;
  timestamp: string; // ISO-8601
  sequence?: number;
  username?: string;
}

// ─── WebSocket Types ──────────────────────────────────────────────────────────

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

// Backend → frontend frames. Discriminated by `type`, matches
// app/models/websocket_events.py on the backend.
export interface IncomingMessageEvent {
  type: "message";
  payload: Message;
}

export interface HistoryEvent {
  type: "history";
  messages: Message[];
}

export interface StatusEvent {
  type: "status";
  connected: boolean;
  active_participant: boolean;
}

export interface ErrorEvent {
  type: "error";
  message: string;
}

export interface BusyEvent {
  type: "busy";
}

export interface TurnGrantedEvent {
  type: "turn_granted";
}

export interface IdleTimeoutEvent {
  type: "idle_timeout";
  username: string;
}

export type WebSocketMessage =
  | IncomingMessageEvent
  | HistoryEvent
  | StatusEvent
  | ErrorEvent
  | BusyEvent
  | TurnGrantedEvent
  | IdleTimeoutEvent;

// Frontend → backend frames, matches the backend's inbound event models.
export interface SendMessageEvent {
  type: "send_message";
  text: string;
}

export interface JoinEvent {
  type: "join";
  username: string;
}

export type OutgoingWebSocketMessage = SendMessageEvent | JoinEvent;

// ─── Hook Return Types ────────────────────────────────────────────────────────

export interface UseWebSocketReturn {
  status: ConnectionStatus;
  sendRaw: (data: string) => void;
  lastMessage: MessageEvent | null;
}

export interface UseChatReturn {
  messages: Message[];
  inputValue: string;
  status: ConnectionStatus;
  isBusy: boolean;
  setInputValue: (value: string) => void;
  sendMessage: () => void;
}

export interface UseUsernameReturn {
  username: string | null;
  setUsername: (username: string) => void;
  clearUsername: () => void;
}
