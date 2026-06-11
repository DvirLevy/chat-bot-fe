import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  USERNAME_ENTRY_DESCRIPTION,
  USERNAME_ENTRY_TITLE,
  USERNAME_INPUT_LABEL,
  USERNAME_INPUT_PLACEHOLDER,
  USERNAME_MAX_LENGTH,
  USERNAME_REQUIRED_ERROR,
  USERNAME_SUBMIT_LABEL,
} from "@/lib/constants";

interface UsernameEntryFormProps {
  onSubmit: (username: string) => void;
}

export function UsernameEntryForm({ onSubmit }: UsernameEntryFormProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = value.trim();
    if (!trimmed) {
      setError(USERNAME_REQUIRED_ERROR);
      return;
    }

    onSubmit(trimmed);
  };

  return (
    <main className="flex flex-1 items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{USERNAME_ENTRY_TITLE}</CardTitle>
          <CardDescription>{USERNAME_ENTRY_DESCRIPTION}</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-3"
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="username-input"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {USERNAME_INPUT_LABEL}
              </label>
              <Input
                id="username-input"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  if (error) setError(null);
                }}
                placeholder={USERNAME_INPUT_PLACEHOLDER}
                maxLength={USERNAME_MAX_LENGTH}
                autoComplete="off"
                autoFocus
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "username-error" : undefined}
              />
              {error && (
                <p
                  id="username-error"
                  role="alert"
                  className="text-sm text-red-600 dark:text-red-400"
                >
                  {error}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              {USERNAME_SUBMIT_LABEL}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
