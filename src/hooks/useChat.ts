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

export function useChat(username: string | null): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isBusy, setIsBusy] = useState(false);
  const [endedReason, setEndedReason] = useState<ChatEndedReason | null>(null);

  const [isReplaced, setIsReplaced] = useState(false);

  const { status, sendRaw, lastMessage } = useWebSocket(username ? ENV.WS_URL : "");

  useEffect(() => {
    if (status !== "connected" || !username || isReplaced) return;

    setIsBusy(false);
    setEndedReason(null);

    const frame: OutgoingWebSocketMessage = { type: "join", username };
    sendRaw(JSON.stringify(frame));
  }, [status, username, isReplaced, sendRaw]);

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
      console.warn("[useChat] Received non-JSON frame:", lastMessage.data);
    }
  }, [lastMessage, username]);

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

    const frame: OutgoingWebSocketMessage = {
      type: "send_message",
      text,
    };

    sendRaw(JSON.stringify(frame));
  }, [inputValue, isBusy, endedReason, sendRaw]);

  const endChat = useCallback(() => {
    if (status !== "connected") return;

    const frame: OutgoingWebSocketMessage = { type: "end_chat" };
    sendRaw(JSON.stringify(frame));
    setEndedReason("user");
  }, [status, sendRaw]);

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
