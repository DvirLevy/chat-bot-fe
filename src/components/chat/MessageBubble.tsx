import { formatTimestamp } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { Message } from "@/lib/types";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isOutgoing = message.direction === "outgoing";

  return (
    <div
      className={cn(
        "flex w-full",
        isOutgoing ? "justify-end" : "justify-start"
      )}
      role="listitem"
    >
      <div
        className={cn(
          "flex max-w-[75%] flex-col gap-1",
          isOutgoing ? "items-end" : "items-start"
        )}
      >
        <span className="sr-only">
          {isOutgoing ? "You" : "Telegram user"}:
        </span>

        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm",
            isOutgoing
              ? "rounded-br-sm bg-blue-600 text-white dark:bg-blue-600"
              : "rounded-bl-sm bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message.text}</p>
        </div>

        <time
          dateTime={message.timestamp}
          className="px-1 text-[11px] text-gray-400 dark:text-gray-500"
          aria-label={`Sent at ${formatTimestamp(message.timestamp)}`}
        >
          {formatTimestamp(message.timestamp)}
        </time>
      </div>
    </div>
  );
}
