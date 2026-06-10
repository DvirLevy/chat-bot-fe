import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ENDED_REASON_MESSAGES,
  START_NEW_CHAT_BUTTON_LABEL,
} from "@/lib/constants";
import type { ChatEndedReason } from "@/lib/types";

interface ChatEndedBannerProps {
  reason: ChatEndedReason;
  onStartNewChat: () => void;
}

/**
 * ChatEndedBanner — shown once the active turn has ended, whether by the
 * user clicking "End chat" or via a server-side idle timeout.
 *
 * Offers a "Start new chat" action that re-sends `join` to attempt to
 * become the active participant again.
 */
export function ChatEndedBanner({ reason, onStartNewChat }: ChatEndedBannerProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center justify-between gap-2 bg-blue-50 px-4 py-2 text-sm text-blue-800 dark:bg-blue-950/40 dark:text-blue-200 sm:px-6"
    >
      <div className="flex items-center gap-2">
        <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
        <span>{ENDED_REASON_MESSAGES[reason]}</span>
      </div>
      <Button onClick={onStartNewChat} size="sm" variant="outline" className="shrink-0">
        {START_NEW_CHAT_BUTTON_LABEL}
      </Button>
    </div>
  );
}
