import { useCallback, useState } from "react";
import { USERNAME_STORAGE_KEY } from "@/lib/constants";
import type { UseUsernameReturn } from "@/lib/types";

/**
 * useUsername — persists the chosen username to localStorage so the user
 * is recognized automatically on their next visit.
 */
export function useUsername(): UseUsernameReturn {
  const [username, setUsernameState] = useState<string | null>(() =>
    localStorage.getItem(USERNAME_STORAGE_KEY)
  );

  const setUsername = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    localStorage.setItem(USERNAME_STORAGE_KEY, trimmed);
    setUsernameState(trimmed);
  }, []);

  const clearUsername = useCallback(() => {
    localStorage.removeItem(USERNAME_STORAGE_KEY);
    setUsernameState(null);
  }, []);

  return { username, setUsername, clearUsername };
}
