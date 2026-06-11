import { useCallback, useEffect, useState } from "react";
import { ENV } from "@/lib/constants";
import { generateId, nowISO } from "@/lib/utils";
import type {
  ChatEndedReason,
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
  const [isBusy, setIsBusy] = useState(false);
  const [endedReason, setEndedReason] = useState<ChatEndedReason | null>(null);

  // Set when the backend reports this connection was replaced by another
  // tab/window for the same username. Blocks the auto-(re)join effect below
  // so the two tabs don't keep kicking each other off on every reconnect.
  const [isReplaced, setIsReplaced] = useState(false);

  // Don't open a connection until the user has identified themselves —
  // an empty url keeps useWebSocket idle.
  const { status, sendRaw, lastMessage } = useWebSocket(username ? ENV.WS_URL : "");

  // ── Join on (re)connect ────────────────────────────────────────────────────
  useEffect(() => {
    if (status !== "connected" || !username || isReplaced) return;

    // A fresh connection means a fresh session — clear any stale busy/ended
    // state from before a disconnect or "End chat".
    setIsBusy(false);
    setEndedReason(null);

    const frame: OutgoingWebSocketMessage = { type: "join", username };
    sendRaw(JSON.stringify(frame));
  }, [status, username, isReplaced, sendRaw]);

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
        case "busy":
          setIsBusy(true);
          setEndedReason(null);
          break;
        case "turn_granted":
          setIsBusy(false);
          setEndedReason(null);
          break;
        case "idle_timeout":
          if (frame.username === username) {
            setEndedReason("idle");
          }
          break;
        case "session_replaced":
          setIsReplaced(true);
          setEndedReason("replaced");
          break;
        default:
          break;
      }
    } catch {
      // Non-JSON frames are ignored — backend may send ping/pong strings
      console.warn("[useChat] Received non-JSON frame:", lastMessage.data);
    }
  }, [lastMessage, username]);

  // ── Outbound dispatch ─────────────────────────────────────────────────────
  const sendMessage = useCallback(() => {
    const text = inputValue.trim();
    if (!text || isBusy || endedReason) return;

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
  }, [inputValue, isBusy, endedReason, sendRaw]);

  // ── End the active turn ───────────────────────────────────────────────────
  const endChat = useCallback(() => {
    if (status !== "connected") return;

    const frame: OutgoingWebSocketMessage = { type: "end_chat" };
    sendRaw(JSON.stringify(frame));
    setEndedReason("user");
  }, [status, sendRaw]);

  // ── Rejoin after the chat ended (user-initiated, idle, or replaced) ───────
  const startNewChat = useCallback(() => {
    if (status !== "connected" || !username) return;

    const frame: OutgoingWebSocketMessage = { type: "join", username };
    sendRaw(JSON.stringify(frame));
    setEndedReason(null);
    setIsReplaced(false);
  }, [status, username, sendRaw]);

  return {
    messages,
    inputValue,
    status,
    isBusy,
    endedReason,
    setInputValue,
    sendMessage,
    endChat,
    startNewChat,
  };
}
