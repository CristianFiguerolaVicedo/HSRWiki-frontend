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

export const fetchJson = async (url) => {
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
