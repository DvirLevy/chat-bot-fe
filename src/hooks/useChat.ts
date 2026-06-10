import { useCallback, useEffect, useState } from "react";
import { ENV } from "@/lib/constants";
import { generateId, nowISO } from "@/lib/utils";
import type {
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
export function useChat(username: string | null): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  // Don't open a connection until the user has identified themselves —
  // an empty url keeps useWebSocket idle.
  const { status, sendRaw, lastMessage } = useWebSocket(username ? ENV.WS_URL : "");

  // ── Join on (re)connect ────────────────────────────────────────────────────
  useEffect(() => {
    if (status !== "connected" || !username) return;

    const frame: OutgoingWebSocketMessage = { type: "join", username };
    sendRaw(JSON.stringify(frame));
  }, [status, username, sendRaw]);

  // ── Parse inbound WebSocket frames ────────────────────────────────────────
  useEffect(() => {
    if (!lastMessage) return;

    try {
      const frame = JSON.parse(lastMessage.data as string) as WebSocketMessage;

      switch (frame.type) {
        case "message":
          setMessages((prev) => [...prev, frame.payload]);
          break;
        case "history":
          setMessages(frame.messages);
          break;
        default:
          break;
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
