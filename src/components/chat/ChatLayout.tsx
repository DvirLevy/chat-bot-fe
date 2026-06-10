import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import type { Message, ConnectionStatus } from "@/lib/types";

interface ChatLayoutProps {
  messages: Message[];
  inputValue: string;
  status: ConnectionStatus;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

/**
 * ChatLayout — structural shell of the chat interface.
 *
 * Composes header, scrollable message list, and sticky input row.
 * Uses flex-column layout so MessageList naturally fills available height.
 */
export function ChatLayout({
  messages,
  inputValue,
  status,
  onInputChange,
  onSend,
}: ChatLayoutProps) {
  const isInputDisabled = status !== "connected";

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ChatHeader status={status} />
      <MessageList messages={messages} />
      <ChatInput
        value={inputValue}
        onChange={onInputChange}
        onSend={onSend}
        disabled={isInputDisabled}
      />
    </div>
  );
}
