import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DATE_LABEL_TODAY, DATE_LABEL_YESTERDAY } from "./constants";
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

export function isSameDay(isoA: string, isoB: string): boolean {
  const a = new Date(isoA);
  const b = new Date(isoB);
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatDateLabel(iso: string): string {
  const date = new Date(iso);
  const now = new Date();

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (isSameDay(iso, now.toISOString())) return DATE_LABEL_TODAY;
  if (isSameDay(iso, yesterday.toISOString())) return DATE_LABEL_YESTERDAY;

  const day = date.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase();
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${day} ${dd}.${mm}.${yyyy}`;
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
