import axios from "axios";

// VITE_API_BASE_URL is read when the site is built. Without it, a production build uses the deployed
// API on Render (so a missing variable on Vercel can't leave the site pointing at localhost).
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.PROD ? "https://hsrwiki-backend.onrender.com/api" : "http://localhost:8080/api");

// The API runs on Render's free plan: after 15 minutes without visits it sleeps and the first
// request can take a minute or two while it wakes up. So requests wait long enough, GETs are retried
// for up to 4 minutes while the server is starting, and slow requests are reported so the UI can say why.
const TIMEOUT_MS = 100000;
const RETRY_FOR_MS = 240000;
const RETRY_DELAY_MS = 3000;
const SLOW_AFTER_MS = 4000;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: TIMEOUT_MS,
});

// --- "server is waking up" state, for the banner in Layout ---
let pending = 0;
let slowTimer = null;
let waking = false;
const listeners = new Set();
const setWaking = (value) => {
  if (waking === value) return;
  waking = value;
  listeners.forEach((l) => l());
};
export const isServerWaking = () => waking;
export const onServerWakingChange = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const started = () => {
  pending += 1;
  if (!slowTimer) slowTimer = setTimeout(() => setWaking(true), SLOW_AFTER_MS);
};
const finished = () => {
  pending = Math.max(0, pending - 1);
  if (pending === 0) {
    clearTimeout(slowTimer);
    slowTimer = null;
    setWaking(false);
  }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Network errors, timeouts and 502/503/504 are what a sleeping or starting server answers
const retryable = (err) => {
  const status = err.response?.status;
  return !err.response || status === 502 || status === 503 || status === 504;
};

// --- Static snapshot of the API (public/data, made by .github/workflows/data-snapshot.yml) ---
// The game data only changes once a week, so the site reads it from files on Vercel's CDN, which
// answer instantly, and only falls back to the live API if a file is missing. Used in production
// builds; set VITE_USE_SNAPSHOT=true or false to force it either way.
const USE_SNAPSHOT = import.meta.env.VITE_USE_SNAPSHOT
  ? import.meta.env.VITE_USE_SNAPSHOT === "true"
  : Boolean(import.meta.env.PROD);

/** Same as slug() in scripts/snapshot_api.py. */
export const slug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/** API path -> snapshot file, or null for what only the live API has (e.g. /profile). */
export const snapshotPath = (url) => {
  const path = url.split("?")[0].replace(/\/+$/, "");
  const parts = path.split("/").filter(Boolean).map(decodeURIComponent);
  const [kind, a, b] = parts;
  const lists = ["characters", "lightcones", "relics", "items", "planner", "changelog", "version", "endgame"];
  if (parts.length === 1 && lists.includes(kind)) return `/data/${kind}.json`;
  if (parts.length === 2 && ["characters", "items", "lightcones"].includes(kind) && /^-?\d+$/.test(a)) {
    return `/data/${kind}/${a}.json`;
  }
  if (parts.length === 2 && kind === "relics") return `/data/relics/${slug(a)}.json`;
  if (parts.length === 3 && kind === "lightcones" && a === "name") return `/data/lightcones/name/${slug(b)}.json`;
  return null;
};

const snapshotCache = new Map();
const fetchSnapshot = (file) => {
  if (!snapshotCache.has(file)) {
    const request = fetch(file).then(async (res) => {
      // Vercel answers unknown paths with the site's index.html, so check that it really is JSON
      if (!res.ok || !(res.headers.get("content-type") || "").includes("json")) throw new Error("not in snapshot");
      return res.json();
    });
    request.catch(() => snapshotCache.delete(file));
    snapshotCache.set(file, request);
  }
  return snapshotCache.get(file);
};

export const fetchJson = async (url) => {
  const file = USE_SNAPSHOT ? snapshotPath(url) : null;
  if (file) {
    try {
      return await fetchSnapshot(file);
    } catch {
      // not in the snapshot (or offline): ask the live API below
    }
  }
  started();
  try {
    const start = Date.now();
    for (;;) {
      try {
        const response = await apiClient.get(url);
        return response.data;
      } catch (err) {
        if (!retryable(err) || Date.now() - start > RETRY_FOR_MS) throw err;
        await sleep(RETRY_DELAY_MS);
      }
    }
  } finally {
    finished();
  }
};

export default apiClient;
