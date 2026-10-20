"use client";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";

type StorageKind = "session" | "local";

const getStore = (kind: StorageKind): Storage | null => {
  if (typeof window === "undefined") return null;
  try {
    return kind === "session" ? window.sessionStorage : window.localStorage;
  } catch {
    return null; // private mode / blocked storage
  }
};

type Options<T> = {
  /** "session" (default): per tab, cleared when the browser closes. "local": survives restarts. */
  storage?: StorageKind;
  /** Validate / merge the parsed value over the default (always return a complete T). */
  restore?: (saved: unknown, def: T) => T;
};

/**
 * `useState` that survives navigating away and back by mirroring the value into
 * web storage. Reads happen in the lazy initializer (only use from client-only
 * components, e.g. ones loaded with `dynamic(..., { ssr: false })`).
 * Every storage access is wrapped: a missing/blocked store just means defaults.
 */
export function usePersistentState<T>(
  key: string,
  makeDefault: () => T,
  { storage = "session", restore }: Options<T> = {},
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const def = makeDefault();
    const store = getStore(storage);
    if (!store) return def;
    try {
      const raw = store.getItem(key);
      if (raw == null) return def;
      const saved: unknown = JSON.parse(raw);
      return restore ? restore(saved, def) : (saved as T);
    } catch {
      return def;
    }
  });

  useEffect(() => {
    const store = getStore(storage);
    if (!store) return;
    try {
      store.setItem(key, JSON.stringify(state));
    } catch {
      /* quota / blocked: the in-memory state still works */
    }
  }, [key, storage, state]);

  return [state, setState];
}
