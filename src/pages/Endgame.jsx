import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarClock, ExternalLink, Sparkles, Swords, Users } from "lucide-react";
import { fetchJson } from "../services/apiClient";
import { useCharacters } from "../hooks/useCharacters";
import { useCollection } from "../hooks/useCollection";
import SkeletonLoader from "../components/SkeletonLoader";
import { capitalize, resolveMember, shortName } from "../util/teams";
import { daysBetween, forPart, halfWeaknesses, phaseGuide, phaseStatus, suggestTeams, todayIso, visiblePhases } from "../util/endgame";

const STORE_KEY = "hsrwiki-endgame";
const ELEMENT_ICONS = {
  FIRE: "/assets/Type_Fire.webp", ICE: "/assets/Type_Ice.webp", LIGHTNING: "/assets/Type_Lightning.webp",
  WIND: "/assets/Type_Wind.webp", QUANTUM: "/assets/Type_Quantum.webp", IMAGINARY: "/assets/Type_Imaginary.webp",
  PHYSICAL: "/assets/Type_Physical.webp",
};
const RANK_STYLE = {
  Boss: "bg-accent-red text-white",
  Elite: "bg-accent-gold-muted text-accent-gold-hover",
  Minion: "bg-bg-elevated text-text-secondary",
};
const HALF_LABELS = ["First half", "Second half"];

const readStore = () => {
  try { return JSON.parse(localStorage.getItem(STORE_KEY) || "{}") || {}; } catch { return {}; }
};
const writeStore = (value) => {
  try { localStorage.setItem(STORE_KEY, JSON.stringify(value)); } catch { /* not important */ }
};

const formatDate = (iso) => new Date(`${iso}T12:00:00`).toLocaleDateString("en-GB", { day: "numeric", month: "long" });

const Weaknesses = ({ list, size = "w-6 h-6" }) => (
  <span className="inline-flex flex-wrap items-center gap-1">
    {list.map((w) => (
      <img key={w} src={ELEMENT_ICONS[w]} alt={capitalize(w)} title={capitalize(w)} className={size} />
    ))}
  </span>
);

const Effect = ({ effect }) => (
  <div className="rounded-lg border border-border bg-bg-card p-3">
    <p className="font-bold">{effect.name}</p>
    {effect.description && <p className="text-sm text-text-secondary whitespace-pre-line mt-1">{effect.description}</p>}
  </div>
);

const Enemy = ({ enemy }) => (
  <li className="flex items-center gap-3 py-1.5">
    <span className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wide ${RANK_STYLE[enemy.rank]}`}>
      {enemy.rank}
    </span>
    <span className="min-w-0 flex-1">
      <span className="font-semibold">{enemy.name}</span>
      {enemy.count > 1 && <span className="text-text-secondary"> ×{enemy.count}</span>}
      {enemy.level && <span className="text-text-muted text-sm"> · Lv. {enemy.level}</span>}
    </span>
    <Weaknesses list={enemy.weaknesses} size="w-5 h-5" />
  </li>
);

/** A small character portrait that links to its page, or plain text if the name isn't a character. */
const Member = ({ text, char, owned }) => (
  char ? (
    <Link to={`/char/${char.id}`} title={shortName(char.name)} className="group flex flex-col items-center gap-1 w-16 text-center">
      <span className={`relative rounded-full ring-2 ${owned ? "ring-emerald-600" : "ring-border"}`}>
        <img src={char.miniIcon} alt="" className="w-12 h-12 rounded-full object-cover bg-bg-elevated" />
        <img src={ELEMENT_ICONS[char.element]} alt="" className="absolute -bottom-1 -right-1 w-5 h-5" />
      </span>
      <span className="text-[11px] leading-tight group-hover:underline line-clamp-2">{shortName(char.name)}</span>
    </Link>
  ) : (
    <span className="flex items-center justify-center w-16 h-12 text-[11px] text-text-muted text-center leading-tight">{text}</span>
  )
);

const TeamCard = ({ title, members, note, has }) => (
  <div className="rounded-lg border border-border bg-bg-card p-3">
    <p className="font-semibold text-sm mb-2">{title}</p>
    <div className="flex flex-wrap gap-1">
      {members.map((m, i) => <Member key={i} text={m.text} char={m.char} owned={m.char && has(m.char.id)} />)}
    </div>
    {note && <p className="font-hand text-lg leading-tight text-text-secondary mt-2">{note}</p>}
  </div>
);

/** Recommendations for one half (or one stage): guide picks, guide teams and suggestions from the character guides. */
const Recommendations = ({ part, guide, weaknesses, characters, resolve, has, ownedOnly }) => {
  const picks = forPart(guide?.picks, part);
  const teams = forPart(guide?.teams, part);
  const suggested = useMemo(
    () => suggestTeams(characters, weaknesses, { has, ownedOnly, limit: 3 }),
    [characters, weaknesses, has, ownedOnly],
  );
  return (
    <div className="space-y-3">
      {picks.map((p, i) => (
        <div key={`p${i}`}>
          {p.characters?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-1">
              {p.characters.map((c) => { const r = resolve(c); return <Member key={c} text={c} char={r} owned={r && has(r.id)} />; })}
            </div>
          )}
          {p.note && <p className="text-sm text-text-secondary">{p.note}</p>}
        </div>
      ))}
      {teams.map((t) => (
        <TeamCard key={t.name} title={t.name} has={has} members={t.members.map((m) => ({ text: m, char: resolve(m) }))} />
      ))}
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-text-muted mb-2 flex items-center gap-1.5">
          <Users size={13} aria-hidden="true" /> From our character guides
        </p>
        {suggested.length === 0 ? (
          <p className="text-sm text-text-muted">
            {ownedOnly ? "None of the guide teams for these weaknesses is fully in your collection." : "No guide team matches these weaknesses yet."}
          </p>
        ) : (
          <div className="grid gap-2">
            {suggested.map((s) => (
              <TeamCard key={s.key} has={has} members={s.members}
                title={<>{s.name} <span className="font-normal text-text-muted">· {shortName(s.owner.name)}&apos;s guide</span></>} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Half = ({ label, half, children }) => {
  const weak = halfWeaknesses(half);
  return (
    <section className="glass-panel p-5 min-w-0">
      <header className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <h3 className="text-xl font-extrabold">{label}</h3>
        {weak.length > 0 && (
          <span className="flex items-center gap-2 text-sm text-text-secondary">weak to <Weaknesses list={weak} /></span>
        )}
      </header>
      {half.waves.length > 0 ? (
        <ol className="space-y-3 mb-5">
          {half.waves.map((wave, i) => (
            <li key={i}>
              {half.waves.length > 1 && <p className="font-hand text-xl leading-none text-accent-red">wave {i + 1}</p>}
              <ul className="divide-y divide-border">
                {wave.map((e) => <Enemy key={e.id} enemy={e} />)}
              </ul>
            </li>
          ))}
        </ol>
      ) : <p className="text-sm text-text-muted mb-5">No enemy data for this half.</p>}
      {children}
    </section>
  );
};

const PhaseDates = ({ phase, today }) => {
  const status = phaseStatus(phase, today);
  if (!phase.begin) return <span className="text-text-secondary">changes with each game version</span>;
  if (status === "upcoming") {
    const d = daysBetween(today, phase.begin);
    return <span>starts {formatDate(phase.begin)} <span className="text-text-muted">· in {d} day{d === 1 ? "" : "s"}</span></span>;
  }
  const d = daysBetween(today, phase.end);
  return <span>{formatDate(phase.begin)} – {formatDate(phase.end)} <span className="text-accent-red font-semibold">· {d} day{d === 1 ? "" : "s"} left</span></span>;
};

const Endgame = () => {
  const [payload, setPayload] = useState(null);
  const [error, setError] = useState(null);
  const { characters } = useCharacters();
  const { has, owned } = useCollection("characters");
  const [store, setStore] = useState(readStore);
  const today = todayIso();

  useEffect(() => {
    fetchJson("/endgame").then(setPayload).catch(() => setError("Couldn't load the endgame data. Try again in a moment."));
  }, []);

  const save = (patch) => setStore((prev) => { const next = { ...prev, ...patch }; writeStore(next); return next; });

  const names = useMemo(() => new Set(characters.map((c) => c.name)), [characters]);
  const byName = useMemo(() => Object.fromEntries(characters.map((c) => [c.name, c])), [characters]);
  const resolve = useMemo(() => (text) => byName[resolveMember(text, names)[0]] || null, [byName, names]);

  if (error) return <div className="glass-panel p-6 max-w-xl" role="alert">{error}</div>;
  if (!payload) return <SkeletonLoader type="card" count={3} />;

  const modes = payload.data?.modes || [];
  const mode = modes.find((m) => m.id === store.mode) || modes[0];
  const phases = visiblePhases(mode, today);
  const phase = phases.find((p) => p.id === store.phase?.[mode?.id]) || phases[0];
  const guide = phase ? phaseGuide(payload.teams, mode.id, phase.id) : null;
  const regular = phase?.stages.filter((s) => !s.extra) || [];
  const isPeak = mode?.id === "peak";
  const stage = phase?.stages.find((s) => s.name === store.stage?.[`${mode.id}:${phase.id}`])
    || (isPeak ? phase?.stages[phase.stages.length - 1] : regular[regular.length - 1]) || phase?.stages[0];
  const ownedOnly = Boolean(store.ownedOnly) && Object.keys(owned).length > 0;
  // The guides write about the hardest stage of each half (Stage 12, Stage 4, Difficulty 4), the Starward
  // Mode and each Anomaly Arbitration stage, so their picks only show there
  const guideApplies = isPeak || stage?.extra || stage === regular[regular.length - 1];
  const recProps = { guide: guideApplies ? guide : null, characters, resolve, has, ownedOnly };

  return (
    <div className="text-text-primary">
      <div className="mb-6">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Endgame</h1>
        <p className="font-hand text-3xl text-accent-red mt-1 -rotate-1 origin-left">what's waiting at the top of the tower</p>
      </div>

      <nav className="flex flex-wrap gap-2 mb-6" aria-label="Endgame modes">
        {modes.map((m) => (
          <button key={m.id} type="button" onClick={() => save({ mode: m.id })} aria-pressed={m.id === mode?.id}
            className={`px-4 py-2 rounded-full border font-semibold cursor-pointer transition-colors ${m.id === mode?.id
              ? "bg-text-primary text-bg-card border-text-primary" : "bg-bg-card border-border hover:border-border-hover"}`}>
            {m.name}
          </button>
        ))}
      </nav>

      {!mode || !phase ? (
        <div className="glass-panel p-10 text-center max-w-2xl">
          <p className="font-hand text-3xl text-accent-red mb-2">no phase right now</p>
          <p className="text-text-secondary">The next one will show up here when the game data has it.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <section className="glass-panel p-6 md:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-bold uppercase tracking-wide text-text-muted">{mode.name}</p>
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">{phase.name}</h2>
                <p className="mt-1 flex items-center gap-2"><CalendarClock size={16} aria-hidden="true" /> <PhaseDates phase={phase} today={today} /></p>
              </div>
              {phases.length > 1 && (
                <div className="flex gap-2" role="group" aria-label="Phase">
                  {phases.map((p) => {
                    const st = phaseStatus(p, today);
                    return (
                      <button key={p.id} type="button" aria-pressed={p.id === phase.id}
                        onClick={() => save({ phase: { ...store.phase, [mode.id]: p.id } })}
                        className={`px-3 py-1.5 rounded-lg border text-sm cursor-pointer ${p.id === phase.id
                          ? "border-accent-red bg-accent-red-muted font-semibold" : "border-border bg-bg-card hover:border-border-hover"}`}>
                        {st === "current" ? "Now" : `From ${formatDate(p.begin)}`}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
            <p className="text-text-secondary mt-4 max-w-3xl">{mode.about}</p>

            {phase.effects?.length > 0 && (
              <div className="mt-5">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-text-secondary mb-2">
                  <Sparkles size={16} aria-hidden="true" /> Phase effects
                </h3>
                <div className="grid md:grid-cols-2 gap-3">{phase.effects.map((e) => <Effect key={e.name} effect={e} />)}</div>
              </div>
            )}
            {phase.buffChoices?.length > 0 && (
              <div className="mt-5">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-text-secondary mb-2">
                  <Swords size={16} aria-hidden="true" /> Buffs to choose from
                </h3>
                <div className="space-y-4">
                  {phase.buffChoices.map((c) => (
                    <div key={c.label}>
                      {phase.buffChoices.length > 1 && <p className="font-hand text-2xl leading-none text-accent-red mb-1">{c.label}</p>}
                      <div className="grid md:grid-cols-3 gap-3">{c.options.map((o) => <Effect key={o.name} effect={o} />)}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {guide && (forPart(guide.picks, null).length > 0 || forPart(guide.teams, null).length > 0) && (
              <div className="mt-5">
                <h3 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-text-secondary mb-2">
                  <Users size={16} aria-hidden="true" /> Recommended for this phase
                </h3>
                {forPart(guide.picks, null).map((p, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex flex-wrap gap-1 mb-1">
                      {(p.characters || []).map((c) => { const r = resolve(c); return <Member key={c} text={c} char={r} owned={r && has(r.id)} />; })}
                    </div>
                    {p.note && <p className="text-sm text-text-secondary">{p.note}</p>}
                  </div>
                ))}
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {forPart(guide.teams, null).map((t) => (
                    <TeamCard key={t.name} title={t.name} has={has} members={t.members.map((m) => ({ text: m, char: resolve(m) }))} />
                  ))}
                </div>
              </div>
            )}
            {guide?.source && (
              <p className="text-sm text-text-muted mt-4">
                Recommendations from{" "}
                <a href={guide.source.url} target="_blank" rel="noreferrer" className="underline inline-flex items-center gap-1">
                  {guide.source.name} <ExternalLink size={12} aria-hidden="true" />
                </a>
                ; enemies and effects from the game data (v{payload.data.version}).
              </p>
            )}
          </section>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2" role="group" aria-label="Stage">
              {phase.stages.map((s) => (
                <button key={s.name} type="button" aria-pressed={s.name === stage?.name}
                  onClick={() => save({ stage: { ...store.stage, [`${mode.id}:${phase.id}`]: s.name } })}
                  className={`px-3 py-1.5 rounded-lg border text-sm cursor-pointer ${s.name === stage?.name
                    ? "border-text-primary bg-text-primary text-bg-card font-semibold"
                    : `bg-bg-card hover:border-border-hover ${s.extra ? "border-accent-gold" : "border-border"}`}`}>
                  {isPeak ? s.name : s.name.replace(/^(Stage|Difficulty) /, "")}
                </button>
              ))}
            </div>
            {Object.keys(owned).length > 0 && (
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={ownedOnly} onChange={(e) => save({ ownedOnly: e.target.checked })} />
                Only suggest teams I own
              </label>
            )}
          </div>

          {stage && (
            <>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2 className="text-2xl font-extrabold">{stage.name}</h2>
                {stage.cycles && <span className="text-text-secondary">{stage.cycles} cycles</span>}
                {stage.extra && <span className="font-hand text-2xl text-accent-gold">{isPeak ? "the hardest version" : "bonus stage for the best players"}</span>}
              </div>
              {stage.effects?.length > 0 && (
                <div className="grid md:grid-cols-2 gap-3">{stage.effects.map((e) => <Effect key={e.name} effect={e} />)}</div>
              )}
              {stage.buffChoices?.map((c) => (
                <div key={c.label}>
                  <p className="font-hand text-2xl leading-none text-accent-red mb-1">pick one</p>
                  <div className="grid md:grid-cols-3 gap-3">{c.options.map((o) => <Effect key={o.name} effect={o} />)}</div>
                </div>
              ))}
              <div className={`grid gap-6 ${stage.halves.length > 1 ? "lg:grid-cols-2" : "max-w-3xl"}`}>
                {stage.halves.map((half, i) => {
                  const part = stage.halves.length > 1 ? HALF_LABELS[i] : (isPeak ? stage.name.replace(/: .*$/, "") : stage.name);
                  const label = stage.halves.length > 1 ? HALF_LABELS[i] : "Enemies";
                  return (
                    <Half key={i} label={label} half={half}>
                      <Recommendations part={part} weaknesses={halfWeaknesses(half)} {...recProps} />
                    </Half>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Endgame;
