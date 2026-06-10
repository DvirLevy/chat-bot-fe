import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { type ConnectionStatus } from "./types";

// ─── Tailwind Helper ──────────────────────────────────────────────────────────

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ─── ID Generation ────────────────────────────────────────────────────────────

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

// ─── Timestamp Formatting ─────────────────────────────────────────────────────

export function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function nowISO(): string {
  return new Date().toISOString();
}

// ─── Connection Status ────────────────────────────────────────────────────────

export function getStatusColor(status: ConnectionStatus): string {
  switch (status) {
    case "connected":
      return "bg-green-500";
    case "connecting":
      return "bg-yellow-400";
    case "disconnected":
    case "error":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
}

export function getStatusVariant(
  status: ConnectionStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "connected":
      return "default";
    case "connecting":
      return "secondary";
    case "disconnected":
    case "error":
      return "destructive";
    default:
      return "outline";
  }
}
