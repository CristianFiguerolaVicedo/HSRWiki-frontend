import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Heart, Star, X } from "lucide-react";
import { fetchJson } from "../services/apiClient";
import { useCharacters } from "../hooks/useCharacters";
import { useFavorites } from "../hooks/useFavorites";
import { useCollection } from "../hooks/useCollection";
import SkeletonLoader from "../components/SkeletonLoader";
import { pathLabel } from "../util/paths";
import { fillDescription, naturalCap } from "../util/skills";

const MAX = 3;
const COMPARE_KEY = "hsrwiki-compare";
const SKILLS = [["basic", "Basic ATK"], ["skill", "Skill"], ["ult", "Ultimate"], ["talent", "Talent"]];
const STATS = [["hp", "HP"], ["atk", "ATK"], ["def", "DEF"], ["spd", "SPD"], ["taunt", "Aggro"]];
const MAIN_SLOTS = [["body", "Body"], ["feet", "Feet"], ["sphere", "Planar Sphere"], ["rope", "Link Rope"]];

const capitalize = (v) => v.charAt(0) + v.slice(1).toLowerCase();
const displayName = (name) => name.startsWith("Trailblazer")
  ? `Trailblazer ${name.endsWith("#F") ? "♀" : "♂"} (${name.replace("Trailblazer", "").replace(/#.$/, "")})`
  : name;
const at80 = (stat) => (stat ? stat.base + stat.step * 79 : 0);

// Columns as a CSS grid: label column on wide screens, then one per character
const Row = ({ label, cells, count }) => (
  <div className="grid gap-3 py-3 border-t border-border" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
    {label && <p className="col-span-full text-xs uppercase tracking-wide text-text-muted -mb-1">{label}</p>}
    {cells}
  </div>
);

const SkillText = ({ skill }) => {
  if (!skill) return <p className="text-text-muted">–</p>;
  const levels = skill.params?.length || 0;
  const cap = Math.min(naturalCap(skill.maxLevel || levels), levels) || 1;
  const values = skill.params?.[cap - 1] || [];
  return (
    <div className="text-sm">
      <p className="font-semibold text-text-primary">{skill.name} <span className="font-normal text-text-muted">Lv. {cap}</span></p>
      <p className="text-text-secondary leading-relaxed whitespace-pre-line mt-1">
        {fillDescription(skill.desc, values).map((part, i) => (part.text !== undefined
          ? part.text
          : <span key={i} className="font-bold text-accent-gold tabular-nums">{part.value}</span>))}
      </p>
    </div>
  );
};

const Header = ({ char, onRemove }) => {
  const fav = useFavorites("characters");
  const owned = useCollection("characters");
  return (
    <div className="flex flex-col items-center text-center gap-2 min-w-0">
      <div className="relative">
        <Link to={`/char/${char.id}`} className={`photo-card tape-${char.element.toLowerCase()} block w-32 sm:w-36`} style={{ "--tilt": "-1deg" }}>
          <span className="washi" aria-hidden="true" />
          <div className="photo-card__picture">
            <img src={char.icon} alt="" className="w-full aspect-[376/512] object-cover" />
          </div>
        </Link>
        <button type="button" onClick={onRemove} aria-label={`Remove ${char.name} from the comparison`}
          className="absolute -top-2 -right-3 z-10 w-8 h-8 rounded-full bg-bg-card border border-border shadow-sm flex items-center justify-center text-text-muted hover:text-accent-red cursor-pointer">
          <X size={15} aria-hidden="true" />
        </button>
      </div>
      <Link to={`/char/${char.id}`} className="font-bold text-lg leading-tight hover:underline">{displayName(char.name)}</Link>
      <div className="flex" aria-label={`${char.rarity} stars`}>
        {Array.from({ length: char.rarity }).map((_, i) => <Star key={i} size={13} className="text-accent-gold fill-accent-gold" />)}
      </div>
      <p className="font-hand text-xl leading-none text-text-secondary">{pathLabel(char.path)}, {capitalize(char.element)}</p>
      <div className="flex flex-wrap justify-center gap-1.5 text-xs">
        {fav.isFavorite(char.id) && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FDE3EC] text-accent-red"><Heart size={11} className="fill-accent-red" aria-hidden="true" />favorite</span>}
        {owned.has(char.id) && <span className="px-2 py-0.5 rounded-full bg-text-primary text-bg-primary font-semibold">you have E{owned.level(char.id)}</span>}
      </div>
    </div>
  );
};

const Compare = () => {
  const { characters, loading } = useCharacters();
  const [params, setParams] = useSearchParams();
  const [stats, setStats] = useState(null);
  const [pick, setPick] = useState("");

  useEffect(() => {
    fetchJson("/planner").then((d) => setStats(d.stats)).catch(() => {});
  }, []);

  const ids = (params.get("ids") || "").split(",").filter(Boolean).slice(0, MAX);
  const byId = useMemo(() => Object.fromEntries(characters.map((c) => [String(c.id), c])), [characters]);
  const chosen = ids.map((id) => byId[id]).filter(Boolean);
  const setIds = (next) => {
    try { localStorage.setItem(COMPARE_KEY, JSON.stringify(next)); } catch { /* fine */ }
    setParams(next.length ? { ids: next.join(",") } : {}, { replace: true });
  };

  // Opening /compare with no ids shows the last comparison
  useEffect(() => {
    if (params.get("ids")) {
      try { localStorage.setItem(COMPARE_KEY, JSON.stringify(params.get("ids").split(",").slice(0, MAX))); } catch { /* fine */ }
      return;
    }
    try {
      const last = JSON.parse(localStorage.getItem(COMPARE_KEY) || "[]");
      if (Array.isArray(last) && last.length) setParams({ ids: last.slice(0, MAX).join(",") }, { replace: true });
    } catch { /* nothing saved */ }
  }, [params, setParams]);

  if (loading) return <SkeletonLoader type="card" count={3} />;

  const sorted = [...characters].sort((a, b) => a.name.localeCompare(b.name));
  const count = Math.max(chosen.length, 1);
  const name = (type) => stats?.properties[type]?.name || type;
  const pct = (type) => stats?.properties[type]?.percent;

  // Highest value per stat row gets the highlighter
  const best = Object.fromEntries(STATS.map(([key]) => [key, Math.max(...chosen.map((c) => at80(c.ascension?.at(-1)?.[key])))]));

  return (
    <div className="text-text-primary">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Compare</h1>
        <p className="font-hand text-3xl text-accent-red mt-1 -rotate-1 origin-left">side by side, up to three at a time</p>
      </div>

      <div className="glass-panel p-4 mb-6 flex flex-wrap items-center gap-3">
        <select value={pick} onChange={(e) => setPick(e.target.value)} disabled={chosen.length >= MAX} aria-label="Character to add"
          className="flex-1 min-w-[220px] bg-bg-card border border-border rounded-lg px-3 py-2 disabled:opacity-50">
          <option value="">{chosen.length >= MAX ? "Three is the limit: remove one to add another" : "Add a character..."}</option>
          {sorted.filter((c) => !ids.includes(String(c.id))).map((c) => <option key={c.id} value={c.id}>{displayName(c.name)}</option>)}
        </select>
        <button type="button" disabled={!pick || chosen.length >= MAX}
          onClick={() => { setIds([...ids, pick]); setPick(""); }}
          className="px-4 py-2 rounded-lg bg-text-primary text-bg-primary font-semibold disabled:opacity-40 cursor-pointer disabled:cursor-default">
          Add
        </button>
        {chosen.length > 0 && <button type="button" onClick={() => setIds([])} className="text-sm text-text-muted hover:text-accent-red cursor-pointer">Clear</button>}
      </div>

      {chosen.length === 0 ? (
        <div className="glass-panel p-10 text-center max-w-2xl">
          <p className="font-hand text-3xl text-accent-red mb-2">pick someone to start</p>
          <p className="text-text-secondary">Add two or three characters above, or use "Compare" on any character page.</p>
        </div>
      ) : (
        <>
        {chosen.length > 1 && (
          <p className="md:hidden font-hand text-xl text-text-secondary mb-2">swipe sideways to see everyone →</p>
        )}
        <div className="glass-panel p-4 md:p-6 overflow-x-auto">
          <div className={chosen.length > 1 ? "min-w-[640px]" : ""}>
            <div className="grid gap-3 pb-4" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
              {chosen.map((c) => <Header key={c.id} char={c} onRemove={() => setIds(ids.filter((id) => id !== String(c.id)))} />)}
            </div>

            <h2 className="text-xl font-bold mt-4 mb-1">Base stats at Lv. 80</h2>
            {STATS.map(([key, label]) => (
              <Row key={key} label={label} count={count} cells={chosen.map((c) => {
                const v = at80(c.ascension?.at(-1)?.[key]);
                const top = chosen.length > 1 && v === best[key] && chosen.some((o) => at80(o.ascension?.at(-1)?.[key]) !== v);
                return <p key={c.id} className="text-lg tabular-nums"><span className={top ? "highlighter font-bold" : ""}>{key === "spd" ? v.toFixed(0) : Math.round(v).toLocaleString("en-US")}</span></p>;
              })} />
            ))}

            {stats && (
              <Row label="Bonus traces (all unlocked)" count={count} cells={chosen.map((c) => (
                <ul key={c.id} className="text-sm space-y-0.5">
                  {Object.entries(stats.characters[String(c.id)]?.traces || {}).map(([t, v]) => (
                    <li key={t}><span className="text-text-secondary">{name(t)}</span> <span className="font-semibold tabular-nums">+{pct(t) ? `${+(v * 100).toFixed(1)}%` : +v.toFixed(1)}</span></li>
                  ))}
                </ul>
              ))} />
            )}

            <h2 className="text-xl font-bold mt-6 mb-1">Skills at max level</h2>
            {SKILLS.map(([key, label]) => (
              <Row key={key} label={label} count={count} cells={chosen.map((c) => <SkillText key={c.id} skill={c.skills?.[key]} />)} />
            ))}

            <h2 className="text-xl font-bold mt-6 mb-1">Eidolons</h2>
            <Row count={count} cells={chosen.map((c) => (
              <ol key={c.id} className="space-y-1.5 text-sm">
                {(c.eidolons || []).map((e, i) => (
                  <li key={i}>
                    <details>
                      <summary className="cursor-pointer"><span className="font-hand text-lg text-accent-red mr-1">E{i + 1}</span>{e.name}</summary>
                      <p className="text-text-secondary mt-1 whitespace-pre-line">{e.desc}</p>
                    </details>
                  </li>
                ))}
              </ol>
            ))} />

            <h2 className="text-xl font-bold mt-6 mb-1">Recommended build</h2>
            <Row label="Light cones" count={count} cells={chosen.map((c) => (
              <ol key={c.id} className="text-sm space-y-0.5 list-decimal list-inside">
                {(c.build?.lightCones || []).slice(0, 4).map((lc) => <li key={lc.name}>{lc.name}</li>)}
                {!c.build && <li className="list-none text-text-muted">no guide yet</li>}
              </ol>
            ))} />
            <Row label="Relics" count={count} cells={chosen.map((c) => (
              <p key={c.id} className="text-sm">{(c.build?.relicSets || []).map((s) => s.name).join(" / ") || "–"}</p>
            ))} />
            <Row label="Planar ornaments" count={count} cells={chosen.map((c) => (
              <p key={c.id} className="text-sm">{(c.build?.planarSets || []).map((s) => s.name).join(" / ") || "–"}</p>
            ))} />
            <Row label="Main stats" count={count} cells={chosen.map((c) => (
              <ul key={c.id} className="text-sm space-y-0.5">
                {MAIN_SLOTS.map(([k, l]) => c.build?.mainStats?.[k] && (
                  <li key={k}><span className="text-text-secondary">{l}:</span> {c.build.mainStats[k]}</li>
                ))}
              </ul>
            ))} />
            <Row label="Substats, most wanted first" count={count} cells={chosen.map((c) => (
              <p key={c.id} className="text-sm">{(c.build?.subStats?.priority || []).join(" > ") || "–"}</p>
            ))} />
          </div>
        </div>
        </>
      )}
    </div>
  );
};

export default Compare;
