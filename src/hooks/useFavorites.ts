import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "sqlref.favorites";
const EVENT = "sqlref:favorites-changed";

export function favKey(groupId: string, name: string) {
  return `${groupId}::${name}`;
}

function read(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

function write(set: Set<string>) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function useFavorites() {
  const [favs, setFavs] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    setFavs(read());
    const sync = () => setFavs(read());
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback((key: string) => {
    const next = new Set(read());
    if (next.has(key)) next.delete(key);
    else next.add(key);
    write(next);
    setFavs(next);
  }, []);

  const isFav = useCallback((key: string) => favs.has(key), [favs]);

  return { favs, toggle, isFav };
}
