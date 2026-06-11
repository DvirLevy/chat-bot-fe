import { MessageCircleDashed } from "lucide-react";
import { EMPTY_STATE_DESCRIPTION, EMPTY_STATE_TITLE } from "@/lib/constants";

export function EmptyState() {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-12 text-center"
      role="status"
      aria-label="No messages yet"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40">
        <MessageCircleDashed
          className="h-8 w-8 text-blue-400 dark:text-blue-300"
          aria-hidden="true"
          strokeWidth={1.5}
        />
      </div>

      <div className="space-y-1">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {EMPTY_STATE_TITLE}
        </h2>
        <p className="max-w-xs text-sm text-gray-500 dark:text-gray-400">
          {EMPTY_STATE_DESCRIPTION}
        </p>
      </div>
    </div>
  );
}
