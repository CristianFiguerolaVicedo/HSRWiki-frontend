// Endgame page helpers: which phase is running and team suggestions from the character guides.
import { defaultRole, resolveMember } from "./teams";

export const todayIso = () => new Date().toISOString().slice(0, 10);

/** "current" | "upcoming" | "ended" by the phase dates (phases without dates are always current). */
export const phaseStatus = (phase, today = todayIso()) => {
  if (!phase.begin || !phase.end) return "current";
  if (today < phase.begin) return "upcoming";
  if (today >= phase.end) return "ended";
  return "current";
};

/** Whole days from `from` to `to` (ISO dates). */
export const daysBetween = (from, to) =>
  Math.round((Date.parse(`${to}T00:00:00Z`) - Date.parse(`${from}T00:00:00Z`)) / 86400000);

/** The phases worth showing: running and upcoming, oldest first. */
export const visiblePhases = (mode, today = todayIso()) =>
  (mode?.phases || []).filter((p) => phaseStatus(p, today) !== "ended");

/** Hand-written guide for a phase: { source, picks, teams } or null. */
export const phaseGuide = (teams, modeId, phaseId) => teams?.phases?.[`${modeId}:${phaseId}`] || null;

/** Guide entries (picks or teams) for one part of the phase: `part` is a half label or a stage name. */
export const forPart = (list, part) => (list || []).filter((x) => (x.for || null) === part);

/** Every element the enemies of a half are weak to, most common first (from the waves when there are any). */
export const halfWeaknesses = (half) => {
  const counts = {};
  (half.waves || []).flat().forEach((e) => e.weaknesses.forEach((w) => { counts[w] = (counts[w] || 0) + (e.count || 1); }));
  const fromEnemies = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
  return half.weaknesses?.length ? half.weaknesses : fromEnemies;
};

/**
 * Teams from the character guides that fit a half: their main damage dealer hits a weakness.
 * Ranked by how many members hit a weakness, then by how many of them you own.
 * -> [{ key, name, owner, main, members: [{ text, char }], hits, owned, ownedAll }]
 */
export const suggestTeams = (characters, weaknesses, { has = () => false, limit = 3, ownedOnly = false } = {}) => {
  if (!weaknesses?.length || !characters?.length) return [];
  const names = new Set(characters.map((c) => c.name));
  const byName = Object.fromEntries(characters.map((c) => [c.name, c]));
  const weak = new Set(weaknesses);
  const seen = new Map();

  characters.forEach((owner) => (owner.build?.teams || []).forEach((team) => {
    const members = (team.teamMembers || []).map((text) => {
      const accepts = resolveMember(text, names);
      // An alternative slot ("A / B") counts as the option that hits a weakness, if any
      const pick = accepts.find((n) => weak.has(byName[n]?.element)) || accepts[0];
      return { text, char: pick ? byName[pick] : null };
    });
    const chars = members.map((m) => m.char).filter(Boolean);
    if (chars.length < 3) return;
    // The team's main damage dealer must hit a weakness: the guide's own character if it deals damage,
    // otherwise the first damage dealer in the team (or a Nihility carry like Acheron when there's none)
    const dealsDamage = (c) => ["damage", "flex"].includes(defaultRole(c));
    const ownerChar = chars.find((c) => c.name === owner.name);
    const main = (ownerChar && dealsDamage(ownerChar) && ownerChar)
      || chars.find(dealsDamage)
      || chars.find((c) => defaultRole(c) === "debuff");
    if (!main || !weak.has(main.element)) return;
    const key = chars.map((c) => c.name).sort().join("|");
    if (seen.has(key)) return;
    const hits = chars.filter((c) => weak.has(c.element)).length;
    const owned = chars.filter((c) => has(c.id)).length;
    seen.set(key, { key, name: team.name, owner, main, members, hits, owned, ownedAll: owned === chars.length });
  }));

  return [...seen.values()]
    .filter((s) => !ownedOnly || s.ownedAll)
    .sort((a, b) => b.hits - a.hits || b.owned - a.owned || a.name.localeCompare(b.name))
    .slice(0, limit);
};
