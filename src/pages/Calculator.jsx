import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Download } from "lucide-react";
import apiClient, { fetchJson } from "../services/apiClient";
import { useCharacters } from "../hooks/useCharacters";
import SkeletonLoader from "../components/SkeletonLoader";
import { SLOTS, SUBSTATS, computeStats, formatStat, isCap, phaseFor } from "../util/stats";

const STORE_KEY = "hsrwiki-calculator";
const LAST_UID_KEY = "hsrwiki-last-uid";

const DEFAULT_INPUT = {
  charId: null, level: 80, ascended: false, traces: true,
  lightCone: "", lightConeLevel: 80, lightConeAscended: false, superimposition: 1,
  sets: { set1: "", set1Pieces: 4, set2: "", planar: "" },
  mains: { Head: { type: "HPDelta" }, Hands: { type: "AttackDelta" }, Body: {}, Feet: {}, "Planar Sphere": {}, "Link Rope": {} },
  subs: {},
};

const read = (key, fallback) => {
  try { const v = JSON.parse(localStorage.getItem(key) || "null"); return v ?? fallback; } catch { return fallback; }
};
const readLastUid = () => { try { return localStorage.getItem(LAST_UID_KEY) || ""; } catch { return ""; } };

const displayName = (name) => name.startsWith("Trailblazer")
  ? `Trailblazer ${name.endsWith("#F") ? "♀" : "♂"} (${name.replace("Trailblazer", "").replace(/#.$/, "")})`
  : name;

/** Showcase character (from /api/profile) -> calculator input, with the exact relic numbers. */
const fromShowcase = (c) => {
  const plain = c.sets.filter((s) => !s.planar).sort((a, b) => b.pieces - a.pieces);
  const planar = c.sets.find((s) => s.planar && s.pieces >= 2);
  const mains = { ...DEFAULT_INPUT.mains };
  const subs = {};
  c.relics.forEach((r) => {
    if (r.mainStat) mains[r.slot] = { type: r.mainStat.type, value: r.mainStat.value };
    r.subStats.forEach((s) => { subs[s.type] = (subs[s.type] || 0) + s.value; });
  });
  return {
    ...DEFAULT_INPUT,
    charId: c.id,
    level: c.level,
    ascended: c.promotion > phaseFor(c.level, false),
    lightCone: c.lightCone?.name || "",
    lightConeLevel: c.lightCone?.level || 80,
    lightConeAscended: c.lightCone ? c.lightCone.promotion > phaseFor(c.lightCone.level, false) : false,
    superimposition: c.lightCone?.superimposition || 1,
    sets: {
      set1: plain[0]?.pieces >= 2 ? plain[0].set : "",
      set1Pieces: plain[0]?.pieces >= 4 ? 4 : 2,
      set2: plain[0]?.pieces < 4 && plain[1]?.pieces >= 2 ? plain[1].set : "",
      planar: planar?.set || "",
    },
    mains,
    subs,
    imported: true,
  };
};

const Select = ({ label, value, onChange, children, className = "" }) => (
  <label className={`flex flex-col gap-1 text-xs text-text-muted min-w-0 ${className}`}>
    {label}
    <select value={value} onChange={(e) => onChange(e.target.value)} aria-label={label}
      className="w-full bg-bg-card border border-border text-text-primary text-sm rounded-lg px-2.5 py-2 min-w-0">
      {children}
    </select>
  </label>
);

const LevelPicker = ({ label, level, ascended, onChange }) => (
  <div className="flex items-end gap-2">
    <Select label={label} value={level} onChange={(v) => onChange(Number(v), ascended)} className="w-24">
      {Array.from({ length: 80 }, (_, i) => 80 - i).map((l) => <option key={l} value={l}>Lv. {l}</option>)}
    </Select>
    {isCap(level) && (
      <label className="flex items-center gap-1.5 text-sm text-text-secondary pb-2 cursor-pointer">
        <input type="checkbox" checked={ascended} onChange={(e) => onChange(level, e.target.checked)} style={{ accentColor: "var(--color-accent-red)" }} />
        ascended
      </label>
    )}
  </div>
);

const Section = ({ title, note, children }) => (
  <section className="glass-panel p-5 space-y-4">
    <div>
      <h2 className="text-xl font-bold">{title}</h2>
      {note && <p className="font-hand text-xl leading-tight text-text-secondary">{note}</p>}
    </div>
    {children}
  </section>
);

const Calculator = () => {
  const { characters } = useCharacters();
  const [lightcones, setLightcones] = useState([]);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const [input, setInputState] = useState(() => ({ ...DEFAULT_INPUT, ...read(STORE_KEY, {}) }));
  const [showcase, setShowcase] = useState({ status: "idle", characters: [] });
  const [params, setParams] = useSearchParams();

  const setInput = (patch) => setInputState((prev) => {
    const next = { ...prev, ...patch, imported: patch.imported ?? false };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch { /* not saved: fine */ }
    return next;
  });

  useEffect(() => {
    fetchJson("/planner").then((d) => setStats(d.stats)).catch(() => setError("Couldn't load the calculator data. Is the backend running?"));
    fetchJson("/lightcones").then(setLightcones).catch(() => {});
  }, []);

  const loadShowcase = (uid, pickId) => {
    setShowcase({ status: "loading", characters: [] });
    apiClient.get(`/profile/${encodeURIComponent(uid)}`)
      .then(({ data }) => {
        setShowcase({ status: "ready", characters: data.characters, nickname: data.nickname });
        const pick = data.characters.find((c) => String(c.id) === String(pickId));
        if (pick) setInput(fromShowcase(pick));
      })
      .catch((err) => setShowcase({ status: "error", characters: [], error: err.response?.data?.error || "Couldn't load your showcase." }));
  };

  // /calculator?uid=...&char=... (from My Account) loads that showcase character
  useEffect(() => {
    const uid = params.get("uid");
    if (!uid) return;
    loadShowcase(uid, params.get("char"));
    setParams({}, { replace: true });
    // loadShowcase only uses setters
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const sortedChars = useMemo(() => [...characters].sort((a, b) => a.name.localeCompare(b.name)), [characters]);
  const result = useMemo(() => (stats && input.charId ? computeStats(stats, input) : null), [stats, input]);

  if (error) return <div className="glass-panel p-6 max-w-xl" role="alert">{error}</div>;
  if (!stats) return <SkeletonLoader type="card" count={4} />;

  const char = stats.characters[String(input.charId)];
  const name = (type) => stats.properties[type]?.name || type;
  const isPercent = (type) => stats.properties[type]?.percent;
  const label = (type) => (isPercent(type) && ["HP", "ATK", "DEF", "SPD"].includes(name(type)) ? `${name(type)}%` : name(type));
  const lcPaths = Object.entries(stats.light_cones);
  const samePath = lcPaths.filter(([, v]) => char && v.path === char.path).map(([n]) => n).sort();
  const otherPath = lcPaths.filter(([, v]) => !char || v.path !== char.path).map(([n]) => n).sort();
  const setNames = Object.entries(stats.relic_sets);
  const cavern = setNames.filter(([, v]) => !v.planar).map(([n]) => n).sort();
  const planars = setNames.filter(([, v]) => v.planar).map(([n]) => n).sort();
  const lastUid = readLastUid();
  const chosenSets = [input.sets.set1, input.sets.set1Pieces === 2 ? input.sets.set2 : "", input.sets.planar].filter(Boolean);

  return (
    <div className="text-text-primary">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Stat Calculator</h1>
        <p className="font-hand text-3xl text-accent-red mt-1 -rotate-1 origin-left">what the character screen would say</p>
      </div>

      <div className="glass-panel p-4 mb-6 flex flex-wrap items-center gap-3">
        <Download size={18} className="text-text-secondary" aria-hidden="true" />
        {showcase.status === "ready" ? (
          <>
            <span className="text-sm text-text-secondary">Load from {showcase.nickname}'s showcase:</span>
            {showcase.characters.map((c) => (
              <button key={c.id} type="button" onClick={() => setInput(fromShowcase(c))}
                className={`px-3 py-1 rounded-full border text-sm cursor-pointer ${input.imported && input.charId === c.id ? "bg-text-primary text-bg-primary border-text-primary" : "bg-bg-card border-border hover:border-border-hover"}`}>
                {displayName(c.name)}
              </button>
            ))}
            {showcase.characters.length === 0 && <span className="text-sm text-text-muted">the showcase is empty</span>}
          </>
        ) : lastUid ? (
          <button type="button" onClick={() => loadShowcase(lastUid)} disabled={showcase.status === "loading"}
            className="px-3 py-1.5 rounded-lg bg-text-primary text-bg-primary text-sm font-semibold cursor-pointer disabled:opacity-60">
            {showcase.status === "loading" ? "Loading..." : `Load my showcase (UID ${lastUid})`}
          </button>
        ) : (
          <span className="text-sm text-text-secondary">
            Want your real builds? Look up your UID in <Link to="/account" className="text-accent-cyan hover:underline">My Account</Link> first.
          </span>
        )}
        {showcase.status === "error" && <span className="text-sm text-accent-red">{showcase.error}</span>}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-6 items-start">
        <div className="space-y-5">
          <Section title="Character">
            <div className="flex flex-wrap items-end gap-3">
              <Select label="Who" value={input.charId ?? ""} onChange={(v) => setInput({ charId: v ? Number(v) : null })} className="flex-1 min-w-[200px]">
                <option value="">Pick a character...</option>
                {sortedChars.map((c) => <option key={c.id} value={c.id}>{displayName(c.name)}</option>)}
              </Select>
              <LevelPicker label="Level" level={input.level} ascended={input.ascended} onChange={(level, ascended) => setInput({ level, ascended })} />
            </div>
            <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
              <input type="checkbox" checked={input.traces} onChange={(e) => setInput({ traces: e.target.checked })} style={{ accentColor: "var(--color-accent-red)" }} />
              All bonus traces unlocked
            </label>
          </Section>

          <Section title="Light cone" note={input.lightCone && char && !samePath.includes(input.lightCone) ? "different Path: only its base stats count" : null}>
            <div className="flex flex-wrap items-end gap-3">
              <Select label="Which" value={input.lightCone} onChange={(v) => setInput({ lightCone: v })} className="flex-1 min-w-[200px]">
                <option value="">None</option>
                {samePath.length > 0 && <optgroup label="Same Path">{samePath.map((n) => <option key={n} value={n}>{n}</option>)}</optgroup>}
                <optgroup label={char ? "Other Paths" : "All"}>{otherPath.map((n) => <option key={n} value={n}>{n}</option>)}</optgroup>
              </Select>
              <LevelPicker label="Level" level={input.lightConeLevel} ascended={input.lightConeAscended} onChange={(lightConeLevel, lightConeAscended) => setInput({ lightConeLevel, lightConeAscended })} />
              <Select label="Superimposition" value={input.superimposition} onChange={(v) => setInput({ superimposition: Number(v) })} className="w-24">
                {[1, 2, 3, 4, 5].map((s) => <option key={s} value={s}>S{s}</option>)}
              </Select>
            </div>
          </Section>

          <Section title="Relics" note={input.imported ? "taken from your showcase, exact values" : "main stats at +15, 5-star"}>
            <div className="grid sm:grid-cols-2 gap-3">
              <Select label="Relic set" value={input.sets.set1} onChange={(v) => setInput({ sets: { ...input.sets, set1: v } })}>
                <option value="">None</option>
                {cavern.map((n) => <option key={n} value={n}>{n}</option>)}
              </Select>
              <Select label="Pieces" value={input.sets.set1Pieces} onChange={(v) => setInput({ sets: { ...input.sets, set1Pieces: Number(v) } })}>
                <option value={4}>4 pieces</option>
                <option value={2}>2 pieces + another set</option>
              </Select>
              {input.sets.set1Pieces === 2 && (
                <Select label="Second relic set (2 pieces)" value={input.sets.set2} onChange={(v) => setInput({ sets: { ...input.sets, set2: v } })}>
                  <option value="">None</option>
                  {cavern.map((n) => <option key={n} value={n}>{n}</option>)}
                </Select>
              )}
              <Select label="Planar ornament" value={input.sets.planar} onChange={(v) => setInput({ sets: { ...input.sets, planar: v } })}>
                <option value="">None</option>
                {planars.map((n) => <option key={n} value={n}>{n}</option>)}
              </Select>
            </div>

            <div className="grid grid-cols-2 2xl:grid-cols-3 gap-3 pt-2">
              {SLOTS.map((slot) => {
                const options = Object.keys(stats.main_stats[slot] || {});
                const main = input.mains[slot] || {};
                return (
                  <Select key={slot} label={slot} value={main.type || ""}
                    onChange={(type) => setInput({ mains: { ...input.mains, [slot]: type ? { type } : {} } })}>
                    {options.length > 1 && <option value="">None</option>}
                    {options.map((t) => <option key={t} value={t}>{label(t)}</option>)}
                  </Select>
                );
              })}
            </div>

            <div className="pt-2">
              <p className="text-sm font-semibold text-text-secondary mb-2">Substats, added up across all six pieces</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-3 gap-x-5 gap-y-2">
                {SUBSTATS.map((type) => {
                  const pct = isPercent(type);
                  const value = input.subs[type];
                  const shown = value === undefined ? "" : String(+(pct ? value * 100 : value).toFixed(pct ? 1 : 1));
                  return (
                    <label key={type} className="flex items-center gap-2 text-sm">
                      <span className="flex-1 text-text-secondary truncate">{label(type)}</span>
                      <input
                        type="number" min="0" step={pct ? "0.1" : "1"} inputMode="decimal" value={shown}
                        onChange={(e) => {
                          const raw = e.target.value === "" ? undefined : Math.max(0, Number(e.target.value));
                          const subs = { ...input.subs };
                          if (raw === undefined || Number.isNaN(raw)) delete subs[type]; else subs[type] = pct ? raw / 100 : raw;
                          setInput({ subs });
                        }}
                        className="w-20 bg-bg-card border border-border rounded-md px-2 py-1 text-right tabular-nums"
                        aria-label={label(type)}
                      />
                      <span className="w-3 text-text-muted text-xs">{pct ? "%" : ""}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </Section>
        </div>

        <aside className="glass-panel p-5 lg:sticky lg:top-6">
          <h2 className="text-2xl font-bold mb-1">Final stats</h2>
          {!result ? (
            <p className="text-text-secondary">Pick a character to start.</p>
          ) : (
            <>
              <p className="font-hand text-xl text-text-secondary mb-4">
                {displayName(characters.find((c) => c.id === input.charId)?.name || "")}, Lv. {input.level}
              </p>
              <table className="w-full text-sm tabular-nums">
                <thead>
                  <tr className="text-text-muted text-xs">
                    <th className="text-left font-normal pb-1">Stat</th>
                    <th className="text-right font-normal pb-1">Base</th>
                    <th className="text-right font-normal pb-1">Bonus</th>
                    <th className="text-right font-normal pb-1">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((row) => {
                    const bonus = row.total - row.base;
                    return (
                      <tr key={row.key} className="border-t border-border">
                        <td className="py-2 pr-2">{row.label}</td>
                        <td className="py-2 text-right text-text-secondary">{formatStat(row.base, row)}</td>
                        <td className={`py-2 text-right ${bonus > 0.00001 ? "text-emerald-700" : "text-text-muted"}`}>
                          {bonus > 0.00001 ? `+${formatStat(bonus, row)}` : "–"}
                        </td>
                        <td className="py-2 text-right font-bold text-base">{formatStat(row.total, row)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-accent-cyan hover:underline">Where the bonuses come from</summary>
                <ul className="mt-2 space-y-1.5 text-sm">
                  {result.sources.filter((s) => Object.keys(s.values).length > 0).map((s) => (
                    <li key={s.label}>
                      <span className="font-semibold">{s.label}:</span>{" "}
                      <span className="text-text-secondary">
                        {Object.entries(s.values).map(([t, v]) => `${label(t)} +${isPercent(t) ? `${(v * 100).toFixed(1)}%` : Math.round(v * 10) / 10}`).join(", ")}
                      </span>
                    </li>
                  ))}
                </ul>
              </details>

              <div className="mt-4 p-3 rounded-lg bg-bg-primary border border-border text-xs text-text-secondary space-y-1.5">
                <p>
                  Only bonuses that are always on are counted. Effects that need a condition (in combat, after using a skill...) are left out,
                  like the in-game character screen does.
                </p>
                {chosenSets.map((set) => stats.relic_sets[set]?.desc?.length > 0 && (
                  <p key={set}><span className="font-semibold text-text-primary">{set}:</span> {stats.relic_sets[set].desc.join(" ")}</p>
                ))}
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
};

export default Calculator;
