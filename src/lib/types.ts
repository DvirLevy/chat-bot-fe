// ─── Core Domain Types ────────────────────────────────────────────────────────

export type MessageDirection = "incoming" | "outgoing";

export interface Message {
  id: string;
  text: string;
  direction: MessageDirection;
  timestamp: string; // ISO-8601
}

// ─── WebSocket Types ──────────────────────────────────────────────────────────

export type ConnectionStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export interface WebSocketMessage {
  type: "message" | "status" | "error";
  payload: unknown;
}

export interface IncomingWebSocketPayload {
  text: string;
  timestamp?: string;
}

// Frontend → backend frame, matches the backend's SendMessageEvent.
export interface OutgoingWebSocketMessage {
  type: "send_message";
  text: string;
}

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
  setInputValue: (value: string) => void;
  sendMessage: () => void;
}
