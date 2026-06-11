import { ChatLayout } from "@/components/chat/ChatLayout";
import { UsernameEntryForm } from "@/components/username/UsernameEntryForm";
import { useChat } from "@/hooks/useChat";
import { useUsername } from "@/hooks/useUsername";
import { APP_DESCRIPTION } from "@/lib/constants";

/**
 * ChatPage — the main application view.
 *
 * Desktop layout: centered card (max-w-4xl) with the system design panel
 *   displayed alongside on wider screens.
 * Tablet / mobile: full-screen chat, system design panel stacked below.
 *
 * Until a username is chosen (and persisted to localStorage), shows the
 * username entry screen instead of the chat.
 */
export function ChatPage() {
  const { username, setUsername } = useUsername();
  const {
    messages,
    inputValue,
    status,
    isBusy,
    endedReason,
    setInputValue,
    sendMessage,
    endChat,
    startNewChat,
  } = useChat(username);

  if (!username) {
    return <UsernameEntryForm onSubmit={setUsername} />;
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-start p-0 sm:justify-center sm:p-4 md:p-6">
      {/* Page title — visually hidden on mobile (header carries the title) */}
      <h1 className="sr-only">{APP_DESCRIPTION}</h1>

      <div className="flex w-full max-w-5xl flex-col gap-4 lg:flex-row lg:items-start">
        {/* ── Chat card ─────────────────────────────────────────────────── */}
        <div className="flex w-full flex-1 flex-col overflow-hidden rounded-none bg-white shadow-none dark:bg-gray-900 sm:rounded-xl sm:shadow-md lg:max-w-2xl">
          {/* Fixed height on sm+; full-screen on mobile */}
          <div className="flex h-dvh flex-col sm:h-150 md:h-162.5">
            <ChatLayout
              messages={messages}
              inputValue={inputValue}
              status={status}
              isBusy={isBusy}
              endedReason={endedReason}
              onInputChange={setInputValue}
              onSend={sendMessage}
              onEndChat={endChat}
              onStartNewChat={startNewChat}
            />
          </div>
        </div>
        </div>

    </main>
  );
}
