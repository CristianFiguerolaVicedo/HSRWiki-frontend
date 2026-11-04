// Material planner maths. Works on /api/planner data (see data-pipeline/update_planner_data.py).

export const CREDIT = "2";

/**
 * Level steps a player can be at: level 1, each cap before and after ascending, and 80.
 * "20+" means level 20 already ascended (phase 1), which is what the game shows as 20/30.
 */
export const LEVEL_STEPS = (() => {
  const steps = [{ key: "1", level: 1, phase: 0, label: "Lv. 1" }];
  const caps = [20, 30, 40, 50, 60, 70];
  caps.forEach((cap, i) => {
    steps.push({ key: `${cap}`, level: cap, phase: i, label: `Lv. ${cap}` });
    steps.push({ key: `${cap}+`, level: cap, phase: i + 1, label: `Lv. ${cap} ascended` });
  });
  steps.push({ key: "80", level: 80, phase: 6, label: "Lv. 80" });
  return steps;
})();

export const stepIndex = (key) => Math.max(0, LEVEL_STEPS.findIndex((s) => s.key === key));

const add = (totals, id, num) => {
  if (num > 0) totals[id] = (totals[id] || 0) + num;
};
const addRows = (totals, rows) => rows?.forEach(([id, num]) => add(totals, id, num));

/** EXP to go from one level to another, using a table of "EXP from L to L + 1" (index L - 1). */
export const expBetween = (table, from, to) => {
  let sum = 0;
  for (let level = from; level < to; level++) sum += table[level - 1] || 0;
  return sum;
};

/**
 * Turns an EXP amount into the fewest EXP items, biggest first, rounding the last one up.
 * items: [[id, exp, credits?], ...] sorted biggest first.
 */
export const expToItems = (exp, items) => {
  const result = {};
  let left = exp;
  items.forEach(([id, value], i) => {
    const isLast = i === items.length - 1;
    const count = isLast ? Math.ceil(left / value) : Math.floor(left / value);
    if (count > 0) result[id] = count;
    left -= count * value;
  });
  return result;
};

/** Everything a character entry needs: { totals: {itemId: count}, exp } */
export const characterCost = (data, entry) => {
  const char = data.characters[String(entry.id)];
  const totals = {};
  if (!char) return { totals, exp: 0 };
  const from = LEVEL_STEPS[stepIndex(entry.from)];
  const to = LEVEL_STEPS[stepIndex(entry.to)];

  let exp = 0;
  if (stepIndex(entry.to) > stepIndex(entry.from)) {
    exp = expBetween(data.exp.character, from.level, to.level);
    for (let phase = from.phase; phase < to.phase; phase++) addRows(totals, char.ascension[phase]);
  }
  Object.entries(entry.skills || {}).forEach(([key, [a, b]]) => {
    const levels = char.skills[key] || [];
    for (let i = a; i < b && i < levels.length; i++) addRows(totals, levels[i]);
  });
  if (entry.traces) char.traces.forEach((rows) => addRows(totals, rows));

  Object.entries(expToItems(exp, data.exp.character_items)).forEach(([id, n]) => add(totals, id, n));
  add(totals, CREDIT, Math.round(exp * data.exp.character_credits_per_exp));
  return { totals, exp };
};

export const lightConeCost = (data, entry) => {
  const lc = data.light_cones[entry.name];
  const totals = {};
  if (!lc) return { totals, exp: 0 };
  const from = LEVEL_STEPS[stepIndex(entry.from)];
  const to = LEVEL_STEPS[stepIndex(entry.to)];
  if (stepIndex(entry.to) <= stepIndex(entry.from)) return { totals, exp: 0 };

  const exp = expBetween(data.exp.light_cone[String(lc.exp_type)] || [], from.level, to.level);
  for (let phase = from.phase; phase < to.phase; phase++) addRows(totals, lc.ascension[phase]);
  const items = expToItems(exp, data.exp.light_cone_items);
  Object.entries(items).forEach(([id, n]) => {
    add(totals, id, n);
    const credits = data.exp.light_cone_items.find(([itemId]) => itemId === id)?.[2] || 0;
    add(totals, CREDIT, n * credits);
  });
  return { totals, exp };
};

export const entryCost = (data, entry) =>
  entry.kind === "character" ? characterCost(data, entry) : lightConeCost(data, entry);

export const sumTotals = (list) => {
  const totals = {};
  list.forEach((t) => Object.entries(t).forEach(([id, n]) => add(totals, id, n)));
  return totals;
};

/** Credits first, then EXP items, then the rest by rarity (highest first) and name. */
export const sortMaterials = (data, totals) => {
  const expIds = new Set([...data.exp.character_items, ...data.exp.light_cone_items].map(([id]) => id));
  return Object.entries(totals).sort(([a], [b]) => {
    const rank = (id) => (id === CREDIT ? 0 : expIds.has(id) ? 1 : 2);
    if (rank(a) !== rank(b)) return rank(a) - rank(b);
    const ia = data.items[a] || {}, ib = data.items[b] || {};
    return (ib.rarity || 0) - (ia.rarity || 0) || (ia.name || "").localeCompare(ib.name || "");
  });
};

/** Default skill range for a character: current 1 up to the in-game cap (6 basic-like, 10 others). */
export const defaultSkills = (data, id) => {
  const char = data.characters[String(id)];
  return Object.fromEntries(Object.entries(char?.skills || {}).map(([key, levels]) => [key, [1, levels.length]]));
};
