import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { fetchJson } from "../services/apiClient";
import { useCharacters } from "../hooks/useCharacters";
import { useCollection } from "../hooks/useCollection";
import SkeletonLoader from "../components/SkeletonLoader";
import {
  CREDIT, LEVEL_STEPS, defaultSkills, entryCost, sortMaterials, stepIndex, sumTotals,
} from "../util/planner";

const STORE_KEY = "hsrwiki-planner";
const SKILL_NAMES = {
  basic: "Basic ATK", skill: "Skill", ult: "Ultimate", talent: "Talent",
  memo_skill: "Memosprite Skill", memo_talent: "Memosprite Talent", elation_skill: "Elation Skill",
};

const loadPlan = () => {
  try {
    const plan = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
    return Array.isArray(plan) ? plan.filter((e) => e && (e.kind === "character" || e.kind === "lightcone")) : [];
  } catch { return []; }
};
const savePlan = (plan) => {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(plan)); } catch { /* private mode: plan lasts this visit */ }
};

const displayName = (name) => name.startsWith("Trailblazer")
  ? `Trailblazer ${name.endsWith("#F") ? "♀" : "♂"} (${name.replace("Trailblazer", "").replace(/#.$/, "")})`
  : name;

const fmt = (n) => n.toLocaleString("en-US");

const MaterialList = ({ data, totals, compact = false }) => {
  const rows = sortMaterials(data, totals);
  if (rows.length === 0) return <p className="text-text-muted text-sm">Nothing to farm for this range.</p>;
  return (
    <ul className={`grid gap-2 ${compact ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"}`}>
      {rows.map(([id, count]) => {
        const item = data.items[id] || { name: `Item ${id}` };
        return (
          <li key={id}>
            <Link
              to={`/items/${id}`}
              className="flex items-center gap-2 p-2 rounded-lg bg-bg-primary border border-border hover:border-border-hover transition-colors min-w-0"
              title={item.name}
            >
              {item.icon && <img src={item.icon} alt="" loading="lazy" className={`${compact ? "w-8 h-8" : "w-10 h-10"} shrink-0`} />}
              <span className="min-w-0">
                <span className="block font-bold tabular-nums leading-tight">
                  {id === CREDIT && "≈ "}{fmt(count)}
                </span>
                <span className="block text-xs text-text-secondary truncate">{item.name}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
};

const LevelSelect = ({ value, onChange, label, min }) => (
  <label className="flex flex-col text-xs text-text-muted gap-0.5">
    {label}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-bg-card border border-border text-text-primary text-sm rounded-lg px-2 py-1.5"
    >
      {LEVEL_STEPS.map((step, i) => (
        <option key={step.key} value={step.key} disabled={min !== undefined && i < stepIndex(min)}>{step.label}</option>
      ))}
    </select>
  </label>
);

const NumberSelect = ({ value, max, onChange, label }) => (
  <select
    value={value}
    onChange={(e) => onChange(Number(e.target.value))}
    aria-label={label}
    className="w-16 bg-bg-card border border-border text-text-primary text-sm rounded-md px-1.5 py-1 tabular-nums"
  >
    {Array.from({ length: max }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n}</option>)}
  </select>
);

const PlanEntry = ({ entry, info, data, onChange, onRemove }) => {
  const { totals } = entryCost(data, entry);
  const set = (patch) => onChange({ ...entry, ...patch });
  const fromIndex = stepIndex(entry.from);

  return (
    <article className="glass-panel p-5 space-y-4">
      <header className="flex items-center gap-3">
        {info?.icon && <img src={info.icon} alt="" className="w-12 h-12 rounded-full object-cover bg-bg-elevated shrink-0" />}
        <div className="min-w-0 flex-1">
          <Link to={entry.kind === "character" ? `/char/${entry.id}` : `/lightcones/${info?.id ?? ""}`} className="font-bold text-lg leading-tight hover:underline">
            {entry.kind === "character" ? displayName(info?.name || "Character") : entry.name}
          </Link>
          <p className="font-hand text-xl leading-none text-text-secondary">{entry.kind === "character" ? "character" : "light cone"}</p>
        </div>
        <button type="button" onClick={onRemove} className="p-2 rounded-lg text-text-muted hover:text-accent-red hover:bg-bg-elevated cursor-pointer" aria-label="Remove from plan">
          <Trash2 size={18} aria-hidden="true" />
        </button>
      </header>

      <div className="flex flex-wrap items-end gap-3">
        <LevelSelect label="Now" value={entry.from} onChange={(from) => set({ from, to: stepIndex(entry.to) < stepIndex(from) ? from : entry.to })} />
        <span className="pb-2 text-text-muted">→</span>
        <LevelSelect label="Goal" value={entry.to} min={entry.from} onChange={(to) => set({ to })} />
        {fromIndex === stepIndex(entry.to) && <span className="pb-2 text-xs text-text-muted">no levels to gain</span>}
      </div>

      {entry.kind === "character" && (
        <div className="space-y-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1.5">
            {Object.entries(entry.skills || {}).map(([key, [a, b]]) => {
              const max = data.characters[String(entry.id)]?.skills[key]?.length || 1;
              return (
                <div key={key} className="flex items-center gap-2 text-sm">
                  <span className="flex-1 text-text-secondary truncate">{SKILL_NAMES[key] || key}</span>
                  <NumberSelect value={a} max={max} label={`${SKILL_NAMES[key]} now`}
                    onChange={(v) => set({ skills: { ...entry.skills, [key]: [v, Math.max(v, b)] } })} />
                  <span className="text-text-muted">→</span>
                  <NumberSelect value={b} max={max} label={`${SKILL_NAMES[key]} goal`}
                    onChange={(v) => set({ skills: { ...entry.skills, [key]: [Math.min(a, v), v] } })} />
                </div>
              );
            })}
          </div>
          <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
            <input type="checkbox" checked={!!entry.traces} onChange={(e) => set({ traces: e.target.checked })} style={{ accentColor: "var(--color-accent-red)" }} />
            Unlock every bonus trace (stat boosts and major traces)
          </label>
        </div>
      )}

      <details className="group">
        <summary className="cursor-pointer text-sm text-accent-cyan hover:underline select-none">What this one needs</summary>
        <div className="mt-3"><MaterialList data={data} totals={totals} compact /></div>
      </details>
    </article>
  );
};

const Planner = () => {
  const { characters } = useCharacters();
  const [lightcones, setLightcones] = useState([]);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [plan, setPlan] = useState(loadPlan);
  const [params, setParams] = useSearchParams();
  const [pickChar, setPickChar] = useState("");
  const [pickCone, setPickCone] = useState("");
  const ownedChars = useCollection("characters");
  const ownedCones = useCollection("lightcones");

  useEffect(() => {
    fetchJson("/planner").then(setData).catch(() => setError("Couldn't load the planner data. Is the backend running?"));
    fetchJson("/lightcones").then(setLightcones).catch(() => {});
  }, []);

  const updatePlan = (next) => { setPlan(next); savePlan(next); };

  const makeEntry = (kind, idOrName) => kind === "character"
    ? { uid: `c${idOrName}-${Date.now()}`, kind, id: Number(idOrName), from: "1", to: "80", skills: defaultSkills(data, idOrName), traces: true }
    : { uid: `l${Date.now()}`, kind, name: idOrName, from: "1", to: "80" };

  // /planner?add=char:1005 or ?add=lc:<light cone id> (links from the detail pages)
  useEffect(() => {
    const add = params.get("add");
    if (!add || !data) return;
    const [kind, value] = add.split(":");
    let entry = null;
    if (kind === "char" && data.characters[value]) entry = makeEntry("character", value);
    if (kind === "lc") {
      const lc = lightcones.find((l) => String(l.id) === value);
      if (lc && data.light_cones[lc.name]) entry = makeEntry("lightcone", lc.name);
      else if (lightcones.length === 0) return; // wait for the list
    }
    if (entry) {
      const current = loadPlan();
      const dupe = current.some((e) => (entry.kind === "character" ? e.id === entry.id : e.name === entry.name) && e.kind === entry.kind);
      if (!dupe) updatePlan([entry, ...current]);
    }
    params.delete("add");
    setParams(params, { replace: true });
    // makeEntry/updatePlan only depend on data, already listed
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params, data, lightcones]);

  const charsById = useMemo(() => Object.fromEntries(characters.map((c) => [String(c.id), c])), [characters]);
  const conesByName = useMemo(() => Object.fromEntries(lightcones.map((l) => [l.name, l])), [lightcones]);
  const totals = useMemo(() => (data ? sumTotals(plan.map((e) => entryCost(data, e).totals)) : {}), [data, plan]);

  if (error) return <div className="glass-panel p-6 max-w-xl" role="alert">{error}</div>;
  if (!data) return <SkeletonLoader type="card" count={4} />;

  const sortedChars = [...characters].filter((c) => data.characters[String(c.id)]).sort((a, b) => a.name.localeCompare(b.name));
  const sortedCones = [...lightcones].filter((l) => data.light_cones[l.name]).sort((a, b) => a.name.localeCompare(b.name));
  const ownedC = sortedChars.filter((c) => ownedChars.has(c.id));
  const ownedL = sortedCones.filter((l) => ownedCones.has(l.id));

  const addPicked = (kind) => {
    const value = kind === "character" ? pickChar : pickCone;
    if (!value) return;
    updatePlan([makeEntry(kind, value), ...plan]);
    if (kind === "character") setPickChar(""); else setPickCone("");
  };

  const picker = (kind, value, setValue, owned, all, labelOf, keyOf) => (
    <div className="flex gap-2 flex-1 min-w-[260px]">
      <select value={value} onChange={(e) => setValue(e.target.value)} className="flex-1 min-w-0 bg-bg-card border border-border rounded-lg px-3 py-2 text-text-primary">
        <option value="">{kind === "character" ? "Add a character..." : "Add a light cone..."}</option>
        {owned.length > 0 && (
          <optgroup label="In your collection">
            {owned.map((x) => <option key={`o${keyOf(x)}`} value={keyOf(x)}>{labelOf(x)}</option>)}
          </optgroup>
        )}
        <optgroup label="Everyone">
          {all.map((x) => <option key={keyOf(x)} value={keyOf(x)}>{labelOf(x)}</option>)}
        </optgroup>
      </select>
      <button type="button" onClick={() => addPicked(kind)} disabled={!value}
        className="px-3 py-2 rounded-lg bg-text-primary text-bg-primary font-semibold disabled:opacity-40 cursor-pointer disabled:cursor-default inline-flex items-center gap-1">
        <Plus size={16} aria-hidden="true" /> Add
      </button>
    </div>
  );

  return (
    <div className="text-text-primary">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Planner</h1>
        <p className="font-hand text-3xl text-accent-red mt-1 -rotate-1 origin-left">what to farm before the next banner</p>
      </div>

      <div className="glass-panel p-4 mb-6 flex flex-wrap gap-3">
        {picker("character", pickChar, setPickChar, ownedC, sortedChars, (c) => displayName(c.name), (c) => String(c.id))}
        {picker("lightcone", pickCone, setPickCone, ownedL, sortedCones, (l) => l.name, (l) => l.name)}
      </div>

      {plan.length === 0 ? (
        <div className="glass-panel p-10 text-center max-w-2xl">
          <p className="font-hand text-3xl text-accent-red mb-2">nothing planned yet</p>
          <p className="text-text-secondary">Add a character or a light cone above, or use "Plan materials" on any character page.</p>
        </div>
      ) : (
        <div className="grid xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-6 items-start">
          <div className="space-y-4">
            {plan.map((entry) => (
              <PlanEntry
                key={entry.uid}
                entry={entry}
                data={data}
                info={entry.kind === "character" ? charsById[String(entry.id)] && { ...charsById[String(entry.id)], icon: charsById[String(entry.id)].miniIcon } : conesByName[entry.name] && { ...conesByName[entry.name], icon: conesByName[entry.name].miniIcon }}
                onChange={(next) => updatePlan(plan.map((e) => (e.uid === entry.uid ? next : e)))}
                onRemove={() => updatePlan(plan.filter((e) => e.uid !== entry.uid))}
              />
            ))}
          </div>
          <aside className="glass-panel p-5 xl:sticky xl:top-6">
            <div className="flex items-baseline justify-between gap-3 mb-4">
              <h2 className="text-2xl font-bold">Shopping list</h2>
              <button type="button" onClick={() => updatePlan([])} className="text-sm text-text-muted hover:text-accent-red cursor-pointer">Clear plan</button>
            </div>
            <MaterialList data={data} totals={totals} />
            <p className="mt-4 text-xs text-text-muted">
              Credits include ascensions, traces and EXP items. The Credit cost of character EXP items
              isn't in the game files, so it's estimated at 10% of the EXP they give.
            </p>
          </aside>
        </div>
      )}
    </div>
  );
};

export default Planner;
