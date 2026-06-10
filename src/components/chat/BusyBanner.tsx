import { AlertCircle } from "lucide-react";
import { BUSY_MESSAGE } from "@/lib/constants";

/**
 * BusyBanner — shown when another participant is currently active.
 *
 * Sits above the input row and is announced to assistive tech via
 * `role="status"` so screen reader users learn why sending is blocked.
 */
export function BusyBanner() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-center gap-2 bg-yellow-50 px-4 py-2 text-sm text-yellow-800 dark:bg-yellow-950/40 dark:text-yellow-200 sm:px-6"
    >
      <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span>{BUSY_MESSAGE}</span>
    </div>
  );
}
