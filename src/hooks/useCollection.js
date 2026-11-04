import { useCallback, useSyncExternalStore } from "react";

/*
 * What the player owns, kept in this browser only (the wiki has no accounts):
 *   characters: { [id]: eidolon 0-6 }      lightcones: { [id]: superimposition 1-5 }
 */
const KEY = "hsrwiki-collection";
const EMPTY = { characters: {}, lightcones: {} };
export const LIMITS = { characters: [0, 6], lightcones: [1, 5] };
const listeners = new Set();
let cache = null;

const clamp = (kind, value) => {
  const [min, max] = LIMITS[kind];
  const n = Math.round(Number(value));
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
};

const read = () => {
  if (cache) return cache;
  let data = EMPTY;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) || "null");
    if (parsed && typeof parsed === "object") {
      data = { characters: {}, lightcones: {} };
      for (const kind of Object.keys(LIMITS)) {
        for (const [id, value] of Object.entries(parsed[kind] || {})) data[kind][id] = clamp(kind, value);
      }
    }
  } catch { /* storage blocked or corrupted: start empty */ }
  cache = data;
  return cache;
};

const write = (data) => {
  cache = data;
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch { /* private mode: keep it for this visit */ }
  listeners.forEach((fn) => fn());
};

const subscribe = (fn) => {
  listeners.add(fn);
  const onStorage = (e) => { if (e.key === KEY) { cache = null; fn(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(fn); window.removeEventListener("storage", onStorage); };
};

/** Low-level updater: changes(kind -> {id: level | null}) where null removes the entry. */
export const updateCollection = (changes) => {
  const current = read();
  const next = { characters: { ...current.characters }, lightcones: { ...current.lightcones } };
  for (const [kind, entries] of Object.entries(changes)) {
    for (const [id, value] of Object.entries(entries)) {
      if (value === null || value === undefined) delete next[kind][String(id)];
      else next[kind][String(id)] = clamp(kind, value);
    }
  }
  write(next);
};

/** useCollection("characters" | "lightcones") -> { owned, level(id), has(id), set(id, level), remove(id) } */
export const useCollection = (kind) => {
  const data = useSyncExternalStore(subscribe, read, () => EMPTY);
  const owned = data[kind];
  const has = useCallback((id) => String(id) in owned, [owned]);
  const level = useCallback((id) => owned[String(id)], [owned]);
  const set = useCallback((id, value) => updateCollection({ [kind]: { [id]: value } }), [kind]);
  const remove = useCallback((id) => updateCollection({ [kind]: { [id]: null } }), [kind]);
  return { owned, has, level, set, remove };
};
