// Remembers (in this browser) the newest Updates entry the visitor has seen, for the "new" mark
const SEEN_KEY = "hsrwiki-updates-seen";
const EVENT = "hsrwiki-updates-seen";

export const readSeen = () => {
  try { return localStorage.getItem(SEEN_KEY) || ""; } catch { return ""; }
};

export const markSeen = (date) => {
  if (!date || date <= readSeen()) return;
  try { localStorage.setItem(SEEN_KEY, date); } catch { /* not remembered: the mark shows again next visit */ }
  window.dispatchEvent(new Event(EVENT));
};

export const onSeenChange = (fn) => {
  window.addEventListener(EVENT, fn);
  window.addEventListener("storage", fn);
  return () => { window.removeEventListener(EVENT, fn); window.removeEventListener("storage", fn); };
};
