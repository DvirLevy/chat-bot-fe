import { Fragment, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { DateSeparator } from "./DateSeparator";
import { EmptyState } from "./EmptyState";
import { isSameDay } from "@/lib/utils";
import type { Message } from "@/lib/types";

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = containerRef.current?.closest<HTMLElement>(
      "[data-radix-scroll-area-viewport]"
    );
    viewport?.scrollTo({ top: viewport.scrollHeight, behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 overflow-hidden">
      <div
        ref={containerRef}
        className="flex min-h-full flex-col justify-end gap-3 px-4 py-4 sm:px-6"
        role="list"
        aria-label="Chat messages"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map((msg, index) => {
            const previous = messages[index - 1];
            const showDateSeparator =
              !previous || !isSameDay(msg.timestamp, previous.timestamp);

            return (
              <Fragment key={msg.id}>
                {showDateSeparator && (
                  <DateSeparator timestamp={msg.timestamp} />
                )}
                <MessageBubble message={msg} />
              </Fragment>
            );
          })
        )}
      </div>
    </ScrollArea>
  );
}
