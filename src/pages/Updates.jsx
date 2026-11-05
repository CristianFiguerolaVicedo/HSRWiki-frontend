import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChartNoAxesColumn, Database, Globe, Sparkles, Wrench } from "lucide-react";
import { fetchJson } from "../services/apiClient";
import { useCharacters } from "../hooks/useCharacters";
import SkeletonLoader from "../components/SkeletonLoader";
import { FACTIONS, PLANETS_DATA } from "../util/util";
import { markSeen } from "../util/updates";

const SECTIONS = {
  data: { title: "Game data", Icon: Database },
  builds: { title: "Builds", Icon: Wrench },
  tierlist: { title: "Tier List", Icon: ChartNoAxesColumn },
  world: { title: "Planets and factions", Icon: Globe },
  site: { title: "Website", Icon: Sparkles },
};

const formatDate = (iso) => {
  const d = new Date(`${iso}T12:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
};

const displayName = (name) => name.startsWith("Trailblazer")
  ? `Trailblazer ${name.endsWith("#F") ? "♀" : "♂"} (${name.replace("Trailblazer", "").replace(/#.$/, "")})`
  : name;

/** Turns an item's ref into a link (and a small picture for characters), or nothing if unknown. */
const useRefs = () => {
  const { characters } = useCharacters();
  const [lightcones, setLightcones] = useState([]);
  const [relics, setRelics] = useState([]);

  useEffect(() => {
    fetchJson("/lightcones").then(setLightcones).catch(() => {});
    fetchJson("/relics").then(setRelics).catch(() => {});
  }, []);

  return useMemo(() => (ref) => {
    if (!ref) return null;
    const { kind, name } = ref;
    if (kind === "character") {
      const c = characters.find((x) => x.name === name);
      return { label: displayName(name), to: c ? `/char/${c.id}` : null, icon: c?.miniIcon };
    }
    if (kind === "lightcone") {
      const lc = lightcones.find((x) => x.name === name);
      return { label: name, to: lc ? `/lightcones/${lc.id}` : null, icon: lc?.miniIcon };
    }
    if (kind === "relic") {
      const set = relics.find((x) => x.name === name);
      const planar = set?.pieces && "Planar Sphere" in set.pieces;
      return { label: name, to: set ? `/${planar ? "planars" : "relics"}/${encodeURIComponent(name)}` : null };
    }
    if (kind === "planet") {
      const p = PLANETS_DATA.find((x) => x.name === name);
      return { label: name, to: p ? `/planets/${p.id}` : null };
    }
    if (kind === "faction") {
      const f = FACTIONS.find((x) => x.name === name);
      return { label: name, to: f ? `/factions/${f.id}` : null };
    }
    return { label: name, to: null };
  }, [characters, lightcones, relics]);
};

const RefChip = ({ refInfo }) => {
  const body = (
    <>
      {refInfo.icon && <img src={refInfo.icon} alt="" className="w-6 h-6 rounded-full object-cover bg-bg-elevated" />}
      <span className="font-semibold">{refInfo.label}</span>
    </>
  );
  const cls = "inline-flex items-center gap-1.5 align-middle";
  return refInfo.to
    ? <Link to={refInfo.to} className={`${cls} hover:underline`}>{body}</Link>
    : <span className={cls}>{body}</span>;
};

const Entry = ({ entry, resolve, latest }) => (
  <article className="glass-panel p-6 md:p-8 relative">
    <header className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-5">
      <h2 className="text-2xl font-extrabold tracking-tight">{entry.title || formatDate(entry.date)}</h2>
      {entry.title && <span className="font-hand text-2xl text-text-secondary">{formatDate(entry.date)}</span>}
      {entry.version && (
        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#FFE68F] text-text-primary tabular-nums">v{entry.version}</span>
      )}
      {latest && <span className="font-hand text-2xl text-accent-red -rotate-2">latest!</span>}
    </header>
    <div className="space-y-5">
      {entry.sections.map((section) => {
        const meta = SECTIONS[section.type] || { title: section.type, Icon: Sparkles };
        return (
          <section key={section.type}>
            <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-text-secondary mb-2">
              <meta.Icon size={16} aria-hidden="true" /> {meta.title}
            </h3>
            <ul className="space-y-2">
              {section.items.map((item, i) => {
                const refInfo = resolve(item.ref);
                return (
                  <li key={i} className="flex gap-2 leading-relaxed">
                    <span className="text-accent-red mt-0.5" aria-hidden="true">•</span>
                    <span>
                      {refInfo && <><RefChip refInfo={refInfo} />{item.text ? <span className="text-text-secondary">: </span> : null}</>}
                      <span className={refInfo ? "text-text-secondary" : ""}>{item.text}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  </article>
);

const Updates = () => {
  const [entries, setEntries] = useState(null);
  const [error, setError] = useState(null);
  const resolve = useRefs();

  useEffect(() => {
    fetchJson("/changelog")
      .then((data) => {
        const list = data?.entries || [];
        setEntries(list);
        if (list[0]) markSeen(list[0].date);
      })
      .catch(() => setError("Couldn't load the updates. Is the backend running?"));
  }, []);

  return (
    <div className="text-text-primary">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Updates</h1>
        <p className="font-hand text-3xl text-accent-red mt-1 -rotate-1 origin-left">what changed on the Express this week</p>
      </div>
      <p className="text-text-secondary mb-8 max-w-3xl">
        The wiki updates itself every Wednesday: new game data when a version comes out, builds for new characters
        and a weekly review of the older ones against the latest guides.
      </p>

      {error && <div className="glass-panel p-6 max-w-xl" role="alert">{error}</div>}
      {!entries && !error && <SkeletonLoader type="card" count={2} />}
      {entries && entries.length === 0 && (
        <div className="glass-panel p-10 text-center max-w-2xl">
          <p className="font-hand text-3xl text-accent-red mb-2">no news yet</p>
          <p className="text-text-secondary">The first weekly update will show up here.</p>
        </div>
      )}
      {entries && entries.length > 0 && (
        <div className="space-y-6 max-w-4xl">
          {entries.map((entry, i) => <Entry key={entry.date} entry={entry} resolve={resolve} latest={i === 0} />)}
        </div>
      )}
    </div>
  );
};

export default Updates;
