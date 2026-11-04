/**
 * In-game skill level caps. The data lists every level the game has (10 or 15), but a player can
 * only reach 6 (basic attack style skills) or 10 (the rest) through Traces; Eidolons add up to +1/+2.
 */
export const naturalCap = (maxLevel) => (maxLevel >= 15 ? 10 : maxLevel >= 10 ? 6 : maxLevel);

/** Splits a description with {0}, {1}... into text and the values of one level: [{text} | {value}] */
export const fillDescription = (desc, values) => {
  const parts = [];
  let last = 0;
  for (const m of (desc || "").matchAll(/\{(\d+)\}/g)) {
    if (m.index > last) parts.push({ text: desc.slice(last, m.index) });
    parts.push({ value: values[Number(m[1])] ?? "?" });
    last = m.index + m[0].length;
  }
  parts.push({ text: (desc || "").slice(last) });
  return parts;
};
