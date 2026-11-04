import { useCallback, useSyncExternalStore } from "react";

// Favorites live in this browser only (the wiki has no accounts): one list of ids per kind
const KEYS = { characters: "hsrwiki-fav-characters", lightcones: "hsrwiki-fav-lightcones" };
const listeners = new Set();
const cache = {};

const read = (kind) => {
  if (cache[kind]) return cache[kind];
  let ids = [];
  try {
    const parsed = JSON.parse(localStorage.getItem(KEYS[kind]) || "[]");
    if (Array.isArray(parsed)) ids = parsed.map(String);
  } catch { /* storage blocked or corrupted: start empty */ }
  cache[kind] = ids;
  return ids;
};

const write = (kind, ids) => {
  cache[kind] = ids;
  try { localStorage.setItem(KEYS[kind], JSON.stringify(ids)); } catch { /* private mode: keep it for this visit */ }
  listeners.forEach((fn) => fn());
};

const subscribe = (fn) => {
  listeners.add(fn);
  // Another tab changed the favorites: drop the cache so the next read picks them up
  const onStorage = (e) => {
    const kind = Object.keys(KEYS).find((k) => KEYS[k] === e.key);
    if (kind) { delete cache[kind]; fn(); }
  };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(fn); window.removeEventListener("storage", onStorage); };
};

/** useFavorites("characters" | "lightcones") -> { ids, isFavorite(id), toggle(id) } */
export const useFavorites = (kind) => {
  const ids = useSyncExternalStore(subscribe, () => read(kind), () => []);
  const isFavorite = useCallback((id) => ids.includes(String(id)), [ids]);
  const toggle = useCallback((id) => {
    const key = String(id);
    const current = read(kind);
    write(kind, current.includes(key) ? current.filter((x) => x !== key) : [...current, key]);
  }, [kind]);
  return { ids, isFavorite, toggle };
};
