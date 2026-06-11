import { useCallback, useState } from "react";
import { USERNAME_STORAGE_KEY } from "@/lib/constants";
import type { UseUsernameReturn } from "@/lib/types";

export function useUsername(): UseUsernameReturn {
  const [username, setUsernameState] = useState<string | null>(() =>
    sessionStorage.getItem(USERNAME_STORAGE_KEY)
  );

  const setUsername = useCallback((value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    sessionStorage.setItem(USERNAME_STORAGE_KEY, trimmed);
    setUsernameState(trimmed);
  }, []);

  const clearUsername = useCallback(() => {
    sessionStorage.removeItem(USERNAME_STORAGE_KEY);
    setUsernameState(null);
  }, []);

  return { username, setUsername, clearUsername };
}
