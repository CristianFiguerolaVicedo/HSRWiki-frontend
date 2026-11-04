// Stat calculator maths, using the "stats" part of /api/planner (data-pipeline/update_planner_data.py).
// Final stats follow the game: (character base + light cone base) x (1 + % bonuses) + flat bonuses.

const CAPS = [20, 30, 40, 50, 60, 70];
/** Ascensions done at a level: below a cap it's the caps passed; at a cap it depends on "ascended". */
export const phaseFor = (level, ascended) =>
  CAPS.filter((cap) => cap < level).length + (ascended && CAPS.includes(level) ? 1 : 0);
export const isCap = (level) => CAPS.includes(level);

export const SLOTS = ["Head", "Hands", "Body", "Feet", "Planar Sphere", "Link Rope"];

// Substats a relic can roll, in the order the game lists them
export const SUBSTATS = [
  "HPDelta", "AttackDelta", "DefenceDelta", "HPAddedRatio", "AttackAddedRatio", "DefenceAddedRatio",
  "SpeedDelta", "CriticalChanceBase", "CriticalDamageBase", "StatusProbabilityBase",
  "StatusResistanceBase", "BreakDamageAddedRatioBase",
];

const at = ([base, step], level) => base + step * (level - 1);

const addAll = (bonus, source) => {
  Object.entries(source || {}).forEach(([type, value]) => {
    bonus[type] = (bonus[type] || 0) + value;
  });
};

/** Bonuses grouped by where they come from, so the page can explain the result. */
export const collectBonuses = (stats, input) => {
  const char = stats.characters[String(input.charId)];
  const lc = input.lightCone ? stats.light_cones[input.lightCone] : null;
  const sources = [];
  if (char && input.traces) sources.push({ label: "Traces", values: char.traces });
  if (lc && char) {
    if (lc.path === char.path) {
      sources.push({ label: "Light cone ability", values: lc.ranks[(input.superimposition || 1) - 1] || {} });
    }
  }
  const { set1, set1Pieces, set2, planar } = input.sets || {};
  const sets = stats.relic_sets;
  if (set1 && sets[set1]) {
    sources.push({ label: `${set1} (2 pc)`, values: sets[set1].two });
    if (set1Pieces === 4) sources.push({ label: `${set1} (4 pc)`, values: sets[set1].four });
  }
  if (set2 && sets[set2] && !(set1Pieces === 4)) {
    // 2 + 2: the same set twice is a 4-piece
    if (set2 === set1) sources.push({ label: `${set2} (4 pc)`, values: sets[set2].four });
    else sources.push({ label: `${set2} (2 pc)`, values: sets[set2].two });
  }
  if (planar && sets[planar]) sources.push({ label: `${planar} (2 pc)`, values: sets[planar].two });

  const mains = {};
  SLOTS.forEach((slot) => {
    const main = input.mains?.[slot];
    if (main?.type) addAll(mains, { [main.type]: main.value ?? stats.main_stats[slot]?.[main.type] ?? 0 });
  });
  sources.push({ label: "Relic main stats", values: mains });
  sources.push({ label: "Relic substats", values: input.subs || {} });
  return sources;
};

/** -> { rows: [{key, label, base, total, percent}], lightConeActive, bonuses } */
export const computeStats = (stats, input) => {
  const char = stats.characters[String(input.charId)];
  if (!char) return null;
  const level = input.level || 80;
  const cBase = char.base[Math.min(phaseFor(level, input.ascended), char.base.length - 1)];
  const lc = input.lightCone ? stats.light_cones[input.lightCone] : null;
  const lcLevel = input.lightConeLevel || 80;
  const lBase = lc?.base[Math.min(phaseFor(lcLevel, input.lightConeAscended), lc.base.length - 1)];

  const sources = collectBonuses(stats, input);
  const b = {};
  sources.forEach((s) => addAll(b, s.values));
  const get = (...types) => types.reduce((sum, t) => sum + (b[t] || 0), 0);

  const base = {
    hp: at(cBase.hp, level) + (lBase ? at(lBase.hp, lcLevel) : 0),
    atk: at(cBase.atk, level) + (lBase ? at(lBase.atk, lcLevel) : 0),
    def: at(cBase.def, level) + (lBase ? at(lBase.def, lcLevel) : 0),
    spd: cBase.spd[0] + get("BaseSpeed"),
  };
  const dmgName = stats.properties[char.dmg_boost]?.name || "DMG Boost";

  const rows = [
    { key: "hp", label: "HP", base: base.hp, total: base.hp * (1 + get("HPAddedRatio")) + get("HPDelta") },
    { key: "atk", label: "ATK", base: base.atk, total: base.atk * (1 + get("AttackAddedRatio")) + get("AttackDelta") },
    { key: "def", label: "DEF", base: base.def, total: base.def * (1 + get("DefenceAddedRatio")) + get("DefenceDelta") },
    { key: "spd", label: "SPD", base: base.spd, total: base.spd * (1 + get("SpeedAddedRatio")) + get("SpeedDelta"), decimals: 1 },
    { key: "cr", label: "CRIT Rate", base: cBase.crit_rate[0], total: cBase.crit_rate[0] + get("CriticalChanceBase", "CriticalChance"), percent: true },
    { key: "cd", label: "CRIT DMG", base: cBase.crit_dmg[0], total: cBase.crit_dmg[0] + get("CriticalDamageBase", "CriticalDamage"), percent: true },
    { key: "be", label: "Break Effect", base: 0, total: get("BreakDamageAddedRatioBase", "BreakDamageAddedRatio"), percent: true },
    { key: "heal", label: "Outgoing Healing Boost", base: 0, total: get("HealRatioBase", "HealRatio"), percent: true },
    { key: "err", label: "Energy Regeneration Rate", base: 1, total: 1 + get("SPRatioBase", "SPRatio"), percent: true },
    { key: "ehr", label: "Effect Hit Rate", base: 0, total: get("StatusProbabilityBase", "StatusProbability"), percent: true },
    { key: "res", label: "Effect RES", base: 0, total: get("StatusResistanceBase", "StatusResistance"), percent: true },
    { key: "dmg", label: dmgName, base: 0, total: get(char.dmg_boost, "AllDamageTypeAddedRatio"), percent: true },
  ];
  const elation = get("ElationDamageAddedRatioBase", "ElationDamageAddedRatio");
  if (elation || char.path === "ELATION") rows.push({ key: "elation", label: "Elation", base: 0, total: elation, percent: true });

  return {
    rows,
    sources,
    lightConeActive: Boolean(lc && lc.path === char.path),
  };
};

export const formatStat = (value, row) => {
  if (row.percent) return `${(value * 100).toFixed(1)}%`;
  if (row.decimals) return value.toFixed(row.decimals);
  return Math.round(value).toLocaleString("en-US");
};
