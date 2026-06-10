import type { KeyboardEvent } from "react";
import { SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  INPUT_PLACEHOLDER,
  INPUT_PLACEHOLDER_BUSY,
  SEND_BUTTON_LABEL,
} from "@/lib/constants";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  disabled?: boolean;
  isBusy?: boolean;
}

/**
 * ChatInput — controlled text field with send button.
 *
 * Submits on Enter (without Shift) and via the send button.
 * Disabled when the WebSocket connection is not established or
 * another participant is currently active (`isBusy`).
 */
export function ChatInput({
  value,
  onChange,
  onSend,
  disabled = false,
  isBusy = false,
}: ChatInputProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  const isSendDisabled = disabled || value.trim().length === 0;

  const placeholder = isBusy
    ? INPUT_PLACEHOLDER_BUSY
    : disabled
      ? "Connecting…"
      : INPUT_PLACEHOLDER;

  return (
    <div className="flex-shrink-0">
      <Separator />
      <div className="flex items-center gap-2 px-4 py-3 sm:px-6">
        <label htmlFor="chat-input" className="sr-only">
          Message
        </label>
        <Input
          id="chat-input"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          className="flex-1"
          aria-label="Type a message"
        />
        <Button
          onClick={onSend}
          disabled={isSendDisabled}
          size="icon"
          aria-label={SEND_BUTTON_LABEL}
          className="h-10 w-10 shrink-0"
        >
          <SendHorizontal className="h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  );
}
