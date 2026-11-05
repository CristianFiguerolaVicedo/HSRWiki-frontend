// Team builder helpers: roles by Path, checks on a lineup and matching against the guides' teams.

export const ROLES = {
  damage: "Damage dealer",
  support: "Support",
  debuff: "Debuffer",
  sustain: "Sustain",
  flex: "Flexible",
};

// What each Path does in the game. Remembrance and Elation characters vary a lot, so they start as
// "flexible" and the player can say what they use them for.
const PATH_ROLE = {
  DESTRUCTION: "damage", HUNT: "damage", ERUDITION: "damage",
  HARMONY: "support", NIHILITY: "debuff",
  PRESERVATION: "sustain", ABUNDANCE: "sustain",
  REMEMBRANCE: "flex", ELATION: "flex",
};

export const defaultRole = (char) => PATH_ROLE[(char?.path || "").toUpperCase()] || "flex";

/** Version-independent identity: the game only lets you field one Trailblazer and one March 7th. */
const family = (name) => {
  if (name.startsWith("Trailblazer")) return "Trailblazer";
  if (name.startsWith("March 7th")) return "March 7th";
  return name;
};

const ALIASES = { Topaz: "Topaz & Numby", "Permansor Terrae": "Dan Heng • Permansor Terrae" };

/**
 * A guide's team member ("Kafka", "Robin / Silver Wolf", "Trailblazer (Remembrance)", "Any DoT Unit")
 * -> list of character names it accepts (empty = a generic slot anyone can fill).
 */
export const resolveMember = (text, names) => {
  const options = text.split(/\s*\/\s*/);
  const out = [];
  for (const raw of options) {
    const opt = ALIASES[raw] || raw;
    if (names.has(opt)) { out.push(opt); continue; }
    const tb = opt.match(/^Trailblazer \((\w+)\)$/);
    if (tb) { out.push(`Trailblazer${tb[1]}#M`, `Trailblazer${tb[1]}#F`); continue; }
    const loose = [...names].find((n) => n.endsWith(` • ${opt}`) || n.startsWith(`${opt} &`));
    if (loose) out.push(loose);
  }
  return out.filter((n) => names.has(n));
};

/** How well the lineup matches one guide team: members covered out of the named ones. */
export const matchTeam = (team, lineupNames, names) => {
  const members = team.teamMembers.map((m) => ({ text: m, accepts: resolveMember(m, names) }));
  const named = members.filter((m) => m.accepts.length > 0);
  const hits = named.filter((m) => m.accepts.some((n) => lineupNames.includes(n)));
  return { members, named: named.length, hits: hits.length };
};

/** Problems and notes for a lineup: [{level: "warn" | "info" | "ok", text}] */
export const checkTeam = (members, roleOf, weaknesses) => {
  const notes = [];
  const filled = members.filter(Boolean);
  if (filled.length === 0) return notes;
  const roles = filled.map(roleOf);

  const families = filled.map((c) => family(c.name));
  const dupes = [...new Set(families.filter((f, i) => families.indexOf(f) !== i))];
  dupes.forEach((f) => notes.push({ level: "warn", text: `Only one ${f} can be in a team.` }));

  const sustains = roles.filter((r) => r === "sustain").length;
  if (sustains === 0) notes.push({ level: "warn", text: "No healer or shielder: the team may not survive long fights." });
  else if (sustains > 1) notes.push({ level: "info", text: "Two sustains: very safe, but less damage." });
  else notes.push({ level: "ok", text: "Has a sustain." });

  if (!roles.includes("damage") && !roles.includes("flex")) {
    // Nihility characters (Kafka, Acheron, Black Swan...) often carry the team themselves
    notes.push(roles.includes("debuff")
      ? { level: "info", text: "No pure damage dealer: fine if a Nihility character carries the team (set their role to damage dealer)." }
      : { level: "warn", text: "No damage dealer." });
  }
  if (roles.filter((r) => r === "damage").length >= 3) notes.push({ level: "info", text: "Three damage dealers: little room for buffs or debuffs." });
  if (filled.length === 4 && !roles.includes("support") && !roles.includes("debuff")) {
    notes.push({ level: "info", text: "No support or debuffer to boost the damage dealer." });
  }

  if (weaknesses.length > 0) {
    weaknesses.forEach((w) => {
      const hit = filled.filter((c) => c.element === w);
      notes.push(hit.length
        ? { level: "ok", text: `${capitalize(w)} weakness: ${hit.map((c) => shortName(c.name)).join(", ")}.` }
        : { level: "warn", text: `Nobody deals ${capitalize(w)} DMG to break that weakness.` });
    });
  }
  if (filled.length < 4) notes.push({ level: "info", text: `${4 - filled.length} slot${filled.length === 3 ? "" : "s"} left.` });
  return notes;
};

export const capitalize = (v) => v.charAt(0) + v.slice(1).toLowerCase();
export const shortName = (name) => name.startsWith("Trailblazer")
  ? `Trailblazer ${name.endsWith("#F") ? "♀" : "♂"} (${name.replace("Trailblazer", "").replace(/#.$/, "")})`
  : name;

/**
 * Guide teams that include someone in the lineup, from every character's guide (not only the
 * lineup's own: Mortenax Blade's guide pairs him with Acheron even if Acheron's guide doesn't).
 * The same four characters suggested by two guides count once.
 * -> { complete: teams with everyone in the lineup, partial: teams with only some of them }
 *    each { owner, team, members, covered: lineup names it includes, hits, named }
 */
export const findGuideTeams = (characters, lineupNames, names) => {
  const found = new Map();
  characters.forEach((owner) => (owner.build?.teams || []).forEach((team) => {
    const m = matchTeam(team, lineupNames, names);
    if (m.hits === 0) return;
    const covered = lineupNames.filter((n) => m.members.some((x) => x.accepts.includes(n)));
    const key = [...team.teamMembers].sort().join("|");
    const prev = found.get(key);
    // Prefer the version from the guide of someone in the lineup
    if (!prev || (!lineupNames.includes(prev.owner.name) && lineupNames.includes(owner.name))) {
      found.set(key, { owner, team, ...m, covered });
    }
  }));
  const all = [...found.values()].sort((a, b) =>
    b.covered.length - a.covered.length
    || Number(lineupNames.includes(b.owner.name)) - Number(lineupNames.includes(a.owner.name))
    || b.hits / b.named - a.hits / a.named);
  return {
    complete: all.filter((s) => s.covered.length === lineupNames.length),
    partial: all.filter((s) => s.covered.length < lineupNames.length),
  };
};
