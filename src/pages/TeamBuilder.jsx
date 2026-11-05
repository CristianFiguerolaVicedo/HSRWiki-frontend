import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Info, Plus, X } from "lucide-react";
import { useCharacters } from "../hooks/useCharacters";
import { useCollection } from "../hooks/useCollection";
import SkeletonLoader from "../components/SkeletonLoader";
import { pathLabel } from "../util/paths";
import { ROLES, capitalize, checkTeam, defaultRole, findGuideTeams, resolveMember, shortName } from "../util/teams";

const STORE_KEY = "hsrwiki-team";
const ELEMENTS = ["PHYSICAL", "FIRE", "ICE", "LIGHTNING", "WIND", "QUANTUM", "IMAGINARY"];
const NOTE_ICON = { warn: AlertTriangle, info: Info, ok: CheckCircle2 };
const NOTE_COLOR = { warn: "text-accent-red", info: "text-text-secondary", ok: "text-emerald-700" };

const load = () => {
  try {
    const v = JSON.parse(localStorage.getItem(STORE_KEY) || "null");
    if (v && Array.isArray(v.slots)) return { slots: [...v.slots, null, null, null, null].slice(0, 4), roles: v.roles || {}, weaknesses: v.weaknesses || [] };
  } catch { /* start empty */ }
  return { slots: [null, null, null, null], roles: {}, weaknesses: [] };
};

const Slot = ({ char, index, role, onRole, onRemove }) => {
  if (!char) {
    return (
      <div className="rounded-lg border-2 border-dashed border-border-hover min-h-[260px] flex flex-col items-center justify-center text-text-muted p-4 text-center">
        <span className="font-hand text-4xl leading-none">{index + 1}</span>
        <span className="text-sm mt-1">empty slot</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center gap-2 min-w-0">
      <div className="relative w-full max-w-[170px]">
        <Link to={`/char/${char.id}`} className={`photo-card tape-${char.element.toLowerCase()} block`} style={{ "--tilt": `${index % 2 ? 1 : -1}deg` }}>
          <span className="washi" aria-hidden="true" />
          <div className="photo-card__picture">
            <img src={char.icon} alt="" className="w-full aspect-[376/512] object-cover" />
          </div>
        </Link>
        <button type="button" onClick={onRemove} aria-label={`Remove ${shortName(char.name)} from the team`}
          className="absolute -top-2 -right-3 z-10 w-8 h-8 rounded-full bg-bg-card border border-border shadow-sm flex items-center justify-center text-text-muted hover:text-accent-red cursor-pointer">
          <X size={15} aria-hidden="true" />
        </button>
      </div>
      <p className="font-bold leading-tight text-center">{shortName(char.name)}</p>
      <p className="font-hand text-lg leading-none text-text-secondary">{pathLabel(char.path)}, {capitalize(char.element)}</p>
      <select value={role} onChange={(e) => onRole(e.target.value)} aria-label={`${shortName(char.name)} role`}
        className="w-full max-w-[190px] bg-bg-card border border-border rounded-md px-2 py-1 text-sm">
        {Object.entries(ROLES).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
      </select>
    </div>
  );
};

const TeamBuilder = () => {
  const { characters, loading } = useCharacters();
  const owned = useCollection("characters");
  const [state, setStateRaw] = useState(load);
  const [pick, setPick] = useState("");
  const [ownedOnly, setOwnedOnly] = useState(false);

  const setState = (patch) => setStateRaw((prev) => {
    const next = { ...prev, ...patch };
    try { localStorage.setItem(STORE_KEY, JSON.stringify(next)); } catch { /* fine */ }
    return next;
  });

  const byId = useMemo(() => Object.fromEntries(characters.map((c) => [String(c.id), c])), [characters]);
  const byName = useMemo(() => Object.fromEntries(characters.map((c) => [c.name, c])), [characters]);
  const names = useMemo(() => new Set(characters.map((c) => c.name)), [characters]);

  if (loading) return <SkeletonLoader type="card" count={4} />;

  const members = state.slots.map((id) => (id ? byId[String(id)] : null));
  const lineupNames = members.filter(Boolean).map((c) => c.name);
  const roleOf = (c) => state.roles[c.id] || defaultRole(c);
  const notes = checkTeam(members, roleOf, state.weaknesses);
  const full = members.every(Boolean);

  const addChar = (id) => {
    const slots = [...state.slots];
    const free = slots.findIndex((s) => !s);
    if (free === -1 || slots.includes(Number(id))) return;
    slots[free] = Number(id);
    setState({ slots });
  };

  // Guide teams (from every guide) that include someone in the lineup: with everyone first
  const { complete, partial } = lineupNames.length
    ? findGuideTeams(characters, lineupNames, names)
    : { complete: [], partial: [] };
  const lineupLabel = members.filter(Boolean).map((c) => shortName(c.name));
  const joinNames = (list) => (list.length < 2 ? list.join("") : `${list.slice(0, -1).join(", ")} and ${list.at(-1)}`);

  const applyTeam = (team) => {
    const slots = [];
    team.teamMembers.forEach((text) => {
      const accepts = resolveMember(text, names);
      const already = accepts.find((n) => lineupNames.includes(n));
      const choice = already || accepts.find((n) => owned.has(byName[n]?.id)) || accepts[0];
      slots.push(choice && byName[choice] ? byName[choice].id : null);
    });
    setState({ slots: [...slots, null, null, null, null].slice(0, 4) });
  };

  const sorted = [...characters]
    .filter((c) => !ownedOnly || owned.has(c.id))
    .filter((c) => !state.slots.includes(c.id))
    .sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="text-text-primary">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Team Builder</h1>
        <p className="font-hand text-3xl text-accent-red mt-1 -rotate-1 origin-left">four seats on the Express, who gets them?</p>
      </div>

      <div className="glass-panel p-4 mb-6 flex flex-wrap items-center gap-3">
        <select value={pick} onChange={(e) => setPick(e.target.value)} disabled={full} aria-label="Character to add"
          className="flex-1 min-w-[220px] bg-bg-card border border-border rounded-lg px-3 py-2 disabled:opacity-50">
          <option value="">{full ? "The team is full: remove someone first" : "Add a character..."}</option>
          {sorted.map((c) => <option key={c.id} value={c.id}>{shortName(c.name)}{owned.has(c.id) ? ` (E${owned.level(c.id)})` : ""}</option>)}
        </select>
        <button type="button" disabled={!pick || full} onClick={() => { addChar(pick); setPick(""); }}
          className="px-4 py-2 rounded-lg bg-text-primary text-bg-primary font-semibold disabled:opacity-40 cursor-pointer disabled:cursor-default inline-flex items-center gap-1">
          <Plus size={16} aria-hidden="true" /> Add
        </button>
        <label className="flex items-center gap-2 text-sm text-text-secondary cursor-pointer">
          <input type="checkbox" checked={ownedOnly} onChange={(e) => setOwnedOnly(e.target.checked)} style={{ accentColor: "var(--color-accent-red)" }} />
          Only characters I have ({Object.keys(owned.owned).length})
        </label>
        {lineupNames.length > 0 && (
          <button type="button" onClick={() => setState({ slots: [null, null, null, null] })} className="text-sm text-text-muted hover:text-accent-red cursor-pointer">Clear team</button>
        )}
      </div>

      <section className="glass-panel p-5 md:p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-5 gap-y-8 pt-2">
          {members.map((char, i) => (
            <Slot key={i} index={i} char={char} role={char ? roleOf(char) : ""}
              onRole={(role) => setState({ roles: { ...state.roles, [char.id]: role } })}
              onRemove={() => setState({ slots: state.slots.map((s, j) => (j === i ? null : s)) })} />
          ))}
        </div>
      </section>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-6 items-start">
        <section className="glass-panel p-5 space-y-4">
          <div>
            <h2 className="text-xl font-bold">Team check</h2>
            <p className="font-hand text-xl text-text-secondary leading-tight">roles come from each Path; change them above if you play someone differently</p>
          </div>
          <div>
            <p className="text-sm font-semibold text-text-secondary mb-2">Enemy weaknesses you're facing</p>
            <div className="flex flex-wrap gap-1.5">
              {ELEMENTS.map((el) => {
                const on = state.weaknesses.includes(el);
                return (
                  <button key={el} type="button" aria-pressed={on}
                    onClick={() => setState({ weaknesses: on ? state.weaknesses.filter((w) => w !== el) : [...state.weaknesses, el] })}
                    className={`px-3 py-1 rounded-full text-sm border cursor-pointer ${on ? "bg-[#FFE68F] border-[#E3C552] font-semibold" : "bg-bg-card border-border text-text-secondary hover:text-text-primary"}`}>
                    {capitalize(el)}
                  </button>
                );
              })}
            </div>
          </div>
          {notes.length === 0 ? (
            <p className="text-text-secondary">Add characters to see how the team holds up.</p>
          ) : (
            <ul className="space-y-2">
              {notes.map((n, i) => {
                const Icon = NOTE_ICON[n.level];
                return (
                  <li key={i} className={`flex items-start gap-2 text-sm ${NOTE_COLOR[n.level]}`}>
                    <Icon size={17} className="shrink-0 mt-0.5" aria-hidden="true" />
                    <span className={n.level === "info" ? "" : "font-semibold"}>{n.text}</span>
                  </li>
                );
              })}
            </ul>
          )}
          {lineupNames.length > 0 && (
            <div className="pt-3 border-t border-border flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <p><span className="text-text-muted">Elements:</span> {[...new Set(members.filter(Boolean).map((c) => capitalize(c.element)))].join(", ")}</p>
              <p><span className="text-text-muted">Roles:</span> {members.filter(Boolean).map((c) => ROLES[roleOf(c)].split(" (")[0]).join(", ")}</p>
            </div>
          )}
        </section>

        <section className="glass-panel p-5 space-y-3">
          <div>
            <h2 className="text-xl font-bold">Teams from the guides</h2>
            <p className="font-hand text-xl text-text-secondary leading-tight">teams from every guide that include someone you picked</p>
          </div>
          {lineupNames.length === 0 && <p className="text-text-secondary text-sm">Add a character to see the teams the guides suggest with them.</p>}
          {lineupNames.length > 1 && complete.length === 0 && partial.length > 0 && (
            <p className="text-sm rounded-lg border border-accent-red/30 bg-[#FDE3EC]/60 px-3 py-2">
              No guide puts {joinNames(lineupLabel)} in the same team: the teams below include only some of them.
            </p>
          )}
          {[
            ["complete", complete, lineupNames.length > 1 ? `Teams with ${joinNames(lineupLabel)}` : null],
            ["partial", partial, complete.length > 0 ? "Teams with only some of them" : null],
          ].map(([key, list, title]) => list.length > 0 && (
            <div key={key} className="space-y-3">
              {title && <h3 className="text-sm font-bold uppercase tracking-wide text-text-secondary pt-1">{title}</h3>}
              {list.slice(0, key === "complete" ? 6 : 4).map(({ owner, team, members: ms, hits, named }) => (
                <article key={`${owner.name}-${team.name}`} className="rounded-lg border border-border bg-bg-primary p-3 space-y-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h3 className="font-semibold">{team.name}</h3>
                    <span className="text-xs text-text-muted tabular-nums">{hits} of {named} already in</span>
                    <span className="basis-full -mt-1 font-hand text-lg leading-none text-text-secondary">from {shortName(owner.name)}'s guide</span>
                  </div>
                  <ul className="flex flex-wrap gap-1.5">
                    {ms.map((m, i) => {
                      const inTeam = m.accepts.some((n) => lineupNames.includes(n));
                      const have = m.accepts.some((n) => owned.has(byName[n]?.id));
                      return (
                        <li key={i} className={`px-2 py-0.5 rounded-full text-sm border ${inTeam ? "bg-emerald-50 border-emerald-600/40 text-emerald-800 font-semibold" : m.accepts.length ? "bg-bg-card border-border" : "bg-transparent border-dashed border-border-hover text-text-muted italic"}`}
                          title={inTeam ? "In your team" : have ? "You have this character" : m.accepts.length ? "" : "Any character that fits"}>
                          {m.text}{!inTeam && have ? " ✓" : ""}
                        </li>
                      );
                    })}
                  </ul>
                  {team.description && (
                    <details>
                      <summary className="text-sm text-accent-cyan cursor-pointer hover:underline">Why this team</summary>
                      <p className="text-sm text-text-secondary mt-1 whitespace-pre-line">{team.description}</p>
                    </details>
                  )}
                  <button type="button" onClick={() => applyTeam(team)} className="text-sm px-3 py-1 rounded-md bg-text-primary text-bg-primary font-semibold cursor-pointer">
                    Use this team
                  </button>
                </article>
              ))}
            </div>
          ))}
          <p className="text-xs text-text-muted">✓ marks characters in your collection. Dashed slots can be anyone who fits.</p>
        </section>
      </div>
    </div>
  );
};

export default TeamBuilder;
