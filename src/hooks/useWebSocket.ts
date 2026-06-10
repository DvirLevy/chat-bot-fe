import { useCallback, useEffect, useRef, useState } from "react";
import {
  WS_MAX_RECONNECT_ATTEMPTS,
  WS_RECONNECT_DELAY_MS,
} from "@/lib/constants";
import type { ConnectionStatus, UseWebSocketReturn } from "@/lib/types";

/**
 * useWebSocket — manages the full WebSocket lifecycle.
 *
 * Designed as a clean abstraction layer so swapping the mock
 * for a real FastAPI backend requires only changing the `url` arg.
 *
 * Features:
 *  - Automatic reconnection with attempt limit
 *  - Exponential-ready delay (currently fixed, easily extended)
 *  - Stable `sendRaw` callback (doesn't change on re-renders)
 *  - Exposes `lastMessage` so consumers can react to new data
 */
export function useWebSocket(url: string): UseWebSocketReturn {
  const [status, setStatus] = useState<ConnectionStatus>("idle");
  const [lastMessage, setLastMessage] = useState<MessageEvent | null>(null);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isMountedRef = useRef(true);

  const clearReconnectTimer = () => {
    if (reconnectTimerRef.current !== null) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
  };

  const connect = useCallback(() => {
    if (!isMountedRef.current) return;
    if (!url) {
      setStatus("idle");
      return;
    }

    setStatus("connecting");

    try {
      const ws = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        if (!isMountedRef.current) return;
        reconnectAttemptsRef.current = 0;
        setStatus("connected");
      };

      ws.onmessage = (event: MessageEvent) => {
        if (!isMountedRef.current) return;
        setLastMessage(event);
      };

      ws.onerror = () => {
        if (!isMountedRef.current) return;
        setStatus("error");
      };

      ws.onclose = () => {
        if (!isMountedRef.current) return;
        setStatus("disconnected");
        socketRef.current = null;

        if (reconnectAttemptsRef.current < WS_MAX_RECONNECT_ATTEMPTS) {
          reconnectAttemptsRef.current += 1;
          reconnectTimerRef.current = setTimeout(connect, WS_RECONNECT_DELAY_MS);
        }
      };
    } catch {
      setStatus("error");
    }
  }, [url]);

  useEffect(() => {
    isMountedRef.current = true;
    connect();

    return () => {
      isMountedRef.current = false;
      clearReconnectTimer();
      if (socketRef.current) {
        // Remove handlers before closing to suppress the auto-reconnect
        socketRef.current.onclose = null;
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [connect]);

  const sendRaw = useCallback((data: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(data);
    } else {
      console.warn("[useWebSocket] Cannot send — socket not open.");
    }
  }, []);

  return { status, sendRaw, lastMessage };
}
