import { useCallback, useEffect, useState } from "react";
import { ENV } from "@/lib/constants";
import { generateId, nowISO } from "@/lib/utils";
import type {
  IncomingWebSocketPayload,
  Message,
  OutgoingWebSocketMessage,
  UseChatReturn,
  WebSocketMessage,
} from "@/lib/types";
import { useWebSocket } from "./useWebSocket";

/**
 * useChat — high-level chat state manager.
 *
 * Composes useWebSocket and owns:
 *  - messages list (session-scoped, no persistence by design)
 *  - controlled input value
 *  - outbound message dispatch
 *  - inbound message parsing
 *
 * To connect to the real FastAPI backend, update VITE_BACKEND_WS_URL
 * in .env — no hook changes required.
 */
export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const { status, sendRaw, lastMessage } = useWebSocket(ENV.WS_URL);

  // ── Parse inbound WebSocket frames ────────────────────────────────────────
  useEffect(() => {
    if (!lastMessage) return;

    try {
      const frame = JSON.parse(lastMessage.data as string) as WebSocketMessage;

      if (frame.type === "message") {
        const payload = frame.payload as IncomingWebSocketPayload;
        const incoming: Message = {
          id: generateId(),
          text: payload.text,
          direction: "incoming",
          timestamp: payload.timestamp ?? nowISO(),
        };
        setMessages((prev) => [...prev, incoming]);
      }
    } catch {
      // Non-JSON frames are ignored — backend may send ping/pong strings
      console.warn("[useChat] Received non-JSON frame:", lastMessage.data);
    }
  }, [lastMessage]);

  // ── Outbound dispatch ─────────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    const text = inputValue.trim();
    if (!text) return;

    const outgoing: Message = {
      id: generateId(),
      text,
      direction: "outgoing",
      timestamp: nowISO(),
    };

    setMessages((prev) => [...prev, outgoing]);
    setInputValue("");

    // Serialize as a typed WebSocket frame so the backend can route it
    const frame: OutgoingWebSocketMessage = {
      type: "send_message",
      text,
    };

    sendRaw(JSON.stringify(frame));
  }, [inputValue, sendRaw]);

  return { messages, inputValue, status, setInputValue, sendMessage };
}
