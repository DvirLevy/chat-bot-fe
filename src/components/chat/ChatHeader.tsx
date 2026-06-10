import { MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { APP_TITLE, END_CHAT_BUTTON_LABEL, STATUS_LABELS } from "@/lib/constants";
import { getStatusVariant } from "@/lib/utils";
import type { ConnectionStatus } from "@/lib/types";

interface ChatHeaderProps {
  status: ConnectionStatus;
  canEndChat: boolean;
  onEndChat: () => void;
}

export function ChatHeader({ status, canEndChat, onEndChat }: ChatHeaderProps) {
  return (
    <header className="flex-shrink-0">
      <div className="flex items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm">
            <MessageCircle className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-base font-semibold leading-tight text-gray-900 dark:text-gray-100 sm:text-lg">
              {APP_TITLE}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Powered by FastAPI + Telegram
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ConnectionBadge status={status} />
          {canEndChat && (
            <Button onClick={onEndChat} size="sm" variant="outline">
              {END_CHAT_BUTTON_LABEL}
            </Button>
          )}
          <ThemeToggle />
        </div>
      </div>
      <Separator />
    </header>
  );
}

// ── Sub-component ─────────────────────────────────────────────────────────────

function ConnectionBadge({ status }: { status: ConnectionStatus }) {
  const variant = getStatusVariant(status);
  const label = STATUS_LABELS[status] ?? status;

  // Map our extended variants to Badge's accepted variants
  const badgeVariant =
    status === "connected"
      ? ("success" as const)
      : status === "connecting"
        ? ("warning" as const)
        : variant;

  return (
    <div className="flex items-center gap-1.5" role="status" aria-live="polite">
      <span
        className={`h-2 w-2 rounded-full ${
          status === "connected"
            ? "bg-green-500"
            : status === "connecting"
              ? "bg-yellow-400 animate-pulse"
              : status === "error" || status === "disconnected"
                ? "bg-red-500"
                : "bg-gray-400"
        }`}
        aria-hidden="true"
      />
      <Badge variant={badgeVariant} className="text-[11px] font-medium">
        {label}
      </Badge>
    </div>
  );
}
