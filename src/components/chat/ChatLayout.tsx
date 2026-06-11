import { BusyBanner } from "./BusyBanner";
import { ChatEndedBanner } from "./ChatEndedBanner";
import { ChatHeader } from "./ChatHeader";
import { MessageList } from "./MessageList";
import { ChatInput } from "./ChatInput";
import type { ChatEndedReason, Message, ConnectionStatus } from "@/lib/types";

interface ChatLayoutProps {
  messages: Message[];
  inputValue: string;
  status: ConnectionStatus;
  isBusy: boolean;
  endedReason: ChatEndedReason | null;
  onInputChange: (value: string) => void;
  onSend: () => void;
  onEndChat: () => void;
  onStartNewChat: () => void;
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
  isBusy,
  endedReason,
  onInputChange,
  onSend,
  onEndChat,
  onStartNewChat,
}: ChatLayoutProps) {
  const isInputDisabled = status !== "connected" || isBusy || endedReason !== null;
  const canEndChat = status === "connected" && !isBusy && endedReason === null;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <ChatHeader status={status} canEndChat={canEndChat} onEndChat={onEndChat} />
      <MessageList messages={messages} />
      {endedReason ? (
        <ChatEndedBanner reason={endedReason} onStartNewChat={onStartNewChat} />
      ) : (
        isBusy && <BusyBanner />
      )}
      <ChatInput
        value={inputValue}
        onChange={onInputChange}
        onSend={onSend}
        disabled={isInputDisabled}
        isBusy={isBusy}
        isEnded={endedReason !== null}
      />
    </div>
  );
}
