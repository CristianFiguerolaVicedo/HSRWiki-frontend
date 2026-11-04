import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, PackagePlus, Star, X } from "lucide-react";
import apiClient from "../services/apiClient";
import { pathLabel } from "../util/paths";
import { updateCollection, useCollection } from "../hooks/useCollection";

const LAST_UID_KEY = "hsrwiki-last-uid";

const readLastUid = () => {
  try { return localStorage.getItem(LAST_UID_KEY) || ""; } catch { return ""; }
};
const saveLastUid = (uid) => {
  try { localStorage.setItem(LAST_UID_KEY, uid); } catch { /* private mode: nothing to remember */ }
};

const capitalize = (value) => value.charAt(0) + value.slice(1).toLowerCase();

// Stats come raw from the API: 0.324 -> "32.4%", SPD 25.3 -> "25.3", HP 705.6 -> "706"
const formatStat = (stat) => {
  if (!stat) return "";
  if (stat.percent) return `${(stat.value * 100).toFixed(1)}%`;
  if (stat.type === "SpeedDelta") return stat.value.toFixed(1);
  return Math.round(stat.value).toString();
};
const statName = (stat) =>
  stat.percent && ["HP", "ATK", "DEF"].includes(stat.name) ? `${stat.name}%` : stat.name;

const characterName = (name) => name.startsWith("Trailblazer")
  ? `Trailblazer ${name.endsWith("#F") ? "♀" : "♂"}`
  : name;

// A small "checked against the guide" mark: tick when it matches the recommended build
const GuideMark = ({ ok, label }) => (
  <span
    className={`inline-flex items-center gap-1 font-hand text-lg leading-none ${ok ? "text-emerald-700" : "text-text-muted"}`}
    title={label}
  >
    {ok ? <Check size={15} aria-hidden="true" /> : <X size={15} aria-hidden="true" />}
    {ok ? "as the guide says" : "not the guide's pick"}
  </span>
);

const RelicSlot = ({ relic }) => (
  <div className="bg-bg-primary border border-border rounded-lg p-2.5 flex flex-col gap-1.5 min-w-0">
    <div className="flex items-center gap-2 min-w-0">
      {relic.icon && <img src={relic.icon} alt="" loading="lazy" className="w-9 h-9 shrink-0" />}
      <div className="min-w-0">
        <p className="text-xs text-text-muted leading-tight">{relic.slot} +{relic.level}</p>
        <p className="text-sm font-semibold leading-tight truncate" title={relic.set}>{relic.mainStat ? statName(relic.mainStat) : "?"}</p>
      </div>
      <span className="ml-auto text-sm font-semibold tabular-nums">{formatStat(relic.mainStat)}</span>
    </div>
    {relic.recommendedMainStat !== null && relic.recommendedMainStat !== undefined && (
      <span className={`text-xs ${relic.recommendedMainStat ? "text-emerald-700" : "text-rose-700"}`}>
        {relic.recommendedMainStat ? "main stat matches the guide" : "guide suggests another main stat"}
      </span>
    )}
    <ul className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-xs text-text-secondary">
      {relic.subStats.map((sub, i) => (
        <li key={i} className="flex justify-between gap-1">
          <span className="truncate">{statName(sub)}</span>
          <span className="tabular-nums text-text-primary">{formatStat(sub)}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ShowcaseEntry = ({ char, index }) => {
  const navigate = useNavigate();
  const check = char.buildCheck;

  return (
    <article className="glass-panel p-5 md:p-6 flex flex-col lg:flex-row gap-6">
      <button
        onClick={() => navigate(`/char/${char.id}`)}
        className={`photo-card tape-${char.element.toLowerCase()} w-44 shrink-0 self-center lg:self-start cursor-pointer`}
        style={{ "--tilt": `${(index % 2 ? 1 : -1) * 1.2}deg` }}
        aria-label={`Open the ${char.name} page`}
      >
        <span className="washi" aria-hidden="true" />
        <div className="photo-card__picture">
          <img src={char.icon} alt="" loading="lazy" className="w-full aspect-[376/512] object-cover" />
        </div>
        <p className="font-hand text-xl text-text-secondary text-center pt-1.5 leading-none">
          Lv. {char.level}, E{char.eidolon}
        </p>
      </button>

      <div className="flex-1 min-w-0 space-y-5">
        <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-2xl font-extrabold tracking-tight">{characterName(char.name)}</h3>
          <span className="font-hand text-xl text-text-secondary">
            {pathLabel(char.path)}, {capitalize(char.element)}
          </span>
          {char.enhanced && (
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-[#FFE68F] text-text-primary">Enhanced kit</span>
          )}
          {check && (
            <span className="ml-auto font-hand text-xl text-text-secondary">
              {check.mainStatsMatched} of {check.mainStatsChecked} main stats like the guide
            </span>
          )}
        </header>

        <div className="grid sm:grid-cols-2 gap-4">
          <section aria-label="Light cone" className="flex items-center gap-3">
            {char.lightCone?.icon && <img src={char.lightCone.icon} alt="" loading="lazy" className="w-14 h-14 rounded-md bg-bg-elevated" />}
            <div className="min-w-0">
              <p className="font-semibold leading-tight">{char.lightCone ? char.lightCone.name : "No light cone"}</p>
              {char.lightCone && (
                <p className="text-sm text-text-secondary">
                  Lv. {char.lightCone.level}, S{char.lightCone.superimposition}
                </p>
              )}
              {char.lightCone && check && <GuideMark ok={char.lightCone.recommended} label="Compared with the recommended light cones" />}
            </div>
          </section>

          <section aria-label="Relic sets" className="space-y-1">
            {char.sets.length === 0 && <p className="text-text-muted">No relics equipped</p>}
            {char.sets.map((set) => (
              <p key={set.set} className="flex items-center gap-2 text-sm">
                <span className={`font-semibold ${set.recommended ? "highlighter" : ""}`}>{set.set}</span>
                <span className="text-text-muted">×{set.pieces}</span>
              </p>
            ))}
            {check && (
              <p className="font-hand text-lg leading-tight text-text-secondary">
                {check.relicSet && check.planarSet ? "both sets come from the guide"
                  : check.relicSet || check.planarSet ? "one set comes from the guide"
                  : "sets differ from the guide"}
              </p>
            )}
          </section>
        </div>

        {char.relics.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
            {char.relics.map((relic) => <RelicSlot key={relic.slot} relic={relic} />)}
          </div>
        )}
      </div>
    </article>
  );
};

// Copies the showcase into the browser collection: Eidolons and the equipped cones' Superimposition.
// It only raises levels, so a showcase never lowers something the player set by hand.
const ImportShowcase = ({ characters }) => {
  const chars = useCollection("characters");
  const cones = useCollection("lightcones");
  const [done, setDone] = useState(false);

  const changes = { characters: {}, lightcones: {} };
  for (const c of characters) {
    if (!chars.has(c.id) || chars.level(c.id) < c.eidolon) changes.characters[c.id] = c.eidolon;
    const lc = c.lightCone;
    if (lc?.id != null && (!cones.has(lc.id) || cones.level(lc.id) < lc.superimposition)) changes.lightcones[lc.id] = lc.superimposition;
  }
  const pending = Object.keys(changes.characters).length + Object.keys(changes.lightcones).length;

  return (
    <div className="glass-panel p-4 flex flex-wrap items-center gap-3">
      <PackagePlus size={20} className="text-text-secondary shrink-0" aria-hidden="true" />
      <p className="flex-1 min-w-[200px] text-sm text-text-secondary">
        {pending > 0
          ? "Add these characters and their light cones to your collection, with their Eidolons and Superimpositions."
          : done ? "Done! Your collection now has everything in this showcase." : "Everything in this showcase is already in your collection."}
      </p>
      {pending > 0 && (
        <button
          type="button"
          onClick={() => { updateCollection(changes); setDone(true); }}
          className="px-4 py-2 rounded-lg bg-text-primary text-bg-primary font-semibold hover:bg-accent-cyan transition-colors cursor-pointer"
        >
          Add {pending} to my collection
        </button>
      )}
    </div>
  );
};

const ERROR_HINTS = {
  404: "Check the number: it's the UID shown at the bottom-left of the game screen.",
  429: "Lookups are limited so the service stays free for everyone.",
  503: "Showcases come back once the servers are up again.",
};

const Account = () => {
  const { uid } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState(uid || readLastUid());
  const [state, setState] = useState({ status: "idle", profile: null, error: null, code: null });

  useEffect(() => {
    if (!uid) return;
    let cancelled = false;
    setState({ status: "loading", profile: null, error: null, code: null });
    apiClient.get(`/profile/${encodeURIComponent(uid)}`)
      .then(({ data }) => {
        if (cancelled) return;
        saveLastUid(uid);
        setState({ status: "ready", profile: data, error: null, code: null });
      })
      .catch((err) => {
        if (cancelled) return;
        const code = err.response?.status ?? null;
        const message = err.response?.data?.error || "Couldn't load that profile. Is the backend running?";
        setState({ status: "error", profile: null, error: message, code });
      });
    return () => { cancelled = true; };
  }, [uid]);

  const submit = (e) => {
    e.preventDefault();
    const clean = input.trim();
    if (!/^\d{9,10}$/.test(clean)) {
      setState({ status: "error", profile: null, error: "A UID is 9 or 10 digits long.", code: 400 });
      return;
    }
    navigate(`/account/${clean}`);
  };

  const { status, profile, error, code } = state;

  return (
    <div className="text-text-primary">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">My Account</h1>
        <p className="font-hand text-3xl text-accent-red mt-1 -rotate-1 origin-left">
          paste your UID and we'll tape your showcase in here
        </p>
      </div>

      <form onSubmit={submit} className="glass-panel p-5 mb-3 flex flex-col sm:flex-row sm:items-end gap-4 max-w-2xl">
        <label className="flex-1">
          <span className="block text-sm font-semibold text-text-secondary mb-1">Your UID</span>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value.replace(/[^\d]/g, "").slice(0, 10))}
            inputMode="numeric"
            autoComplete="off"
            placeholder="e.g. 700000000"
            className="w-full bg-transparent border-b-2 border-border-hover focus:border-accent-cyan outline-none font-hand text-3xl leading-tight py-1 tabular-nums"
          />
        </label>
        <button
          type="submit"
          className="px-5 py-2.5 rounded-lg bg-text-primary text-bg-primary font-semibold hover:bg-accent-cyan transition-colors cursor-pointer disabled:opacity-60"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Looking it up..." : "Show my characters"}
        </button>
      </form>
      <p className="text-sm text-text-muted mb-10 max-w-2xl">
        No login or password: this reads the characters you chose to show in your in-game profile,
        through Enka.Network. Change them in the game under Profile, then Edit showcase.
      </p>

      {status === "error" && (
        <div className="glass-panel p-6 max-w-2xl border-l-4 border-l-accent-red" role="alert">
          <p className="font-semibold">{error}</p>
          {ERROR_HINTS[code] && <p className="text-text-secondary mt-1">{ERROR_HINTS[code]}</p>}
        </div>
      )}

      {status === "loading" && (
        <p className="font-hand text-3xl text-text-secondary animate-pulse">flipping through the album...</p>
      )}

      {status === "ready" && profile && (
        <div className="space-y-8">
          <section className="glass-panel p-6 flex flex-wrap items-end gap-x-10 gap-y-4">
            <div className="min-w-0">
              <h2 className="text-4xl font-extrabold tracking-tight">{profile.nickname}</h2>
              <p className="text-text-secondary tabular-nums">UID {profile.uid}</p>
              {profile.signature && (
                <p className="font-hand text-2xl text-text-secondary mt-2">“{profile.signature}”</p>
              )}
            </div>
            <dl className="flex flex-wrap gap-x-8 gap-y-2 ml-auto">
              {[
                ["Trailblaze Level", profile.level],
                ["Equilibrium", profile.equilibriumLevel],
                ["Characters", profile.characterCount],
                ["Achievements", profile.achievementCount],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt className="text-sm text-text-muted">{label}</dt>
                  <dd className="text-2xl font-bold tabular-nums">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          {profile.characters.length === 0 ? (
            <div className="glass-panel p-6 max-w-2xl">
              <p className="font-semibold">This showcase is empty or hidden.</p>
              <p className="text-text-secondary mt-1">
                In the game, open your Profile, choose Edit showcase, add some characters and turn on
                "Show character details". It can take a few minutes to update here.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-baseline gap-3">
                Showcase <span className="text-text-muted font-normal">({profile.characters.length})</span>
                <span className="font-hand text-2xl font-normal text-text-secondary">checked against the wiki's builds</span>
              </h2>
              <ImportShowcase characters={profile.characters} />
              {profile.characters.map((char, i) => <ShowcaseEntry key={char.id} char={char} index={i} />)}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Account;
