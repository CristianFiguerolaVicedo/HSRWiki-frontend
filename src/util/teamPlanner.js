// Links to the sister project, HSR Team Planner (https://github.com/CristianFiguerolaVicedo/HSR-Team-Planner).
// VITE_TEAM_PLANNER_URL is read when the site is built (set it on Vercel). Until it's set, every
// planner link stays hidden, so the live wiki never shows a link that goes nowhere.

const raw = import.meta.env.VITE_TEAM_PLANNER_URL;

/** Base URL of the planner without trailing slash, or null while it isn't deployed. */
export const TEAM_PLANNER_URL = raw ? raw.replace(/\/+$/, "") : null;

/** Planner's team builder with this character already in the first free slot. Both apps share game ids. */
export const planTeamWithUrl = (characterId) =>
  TEAM_PLANNER_URL ? `${TEAM_PLANNER_URL}/builder?with=${encodeURIComponent(characterId)}` : null;
