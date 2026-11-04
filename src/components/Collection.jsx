import { Check, PackageCheck, X } from "lucide-react";
import { LIMITS, useCollection } from "../hooks/useCollection";

const PREFIX = { characters: "E", lightcones: "S" };
const WORD = { characters: "Eidolon", lightcones: "Superimposition" };

/** Stamp on a photo card when the player owns it: "E2" or "S1". */
export const OwnedBadge = ({ kind, id }) => {
  const { has, level } = useCollection(kind);
  if (!has(id)) return null;
  return (
    <span
      className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded-md bg-text-primary text-bg-primary text-xs font-bold tabular-nums shadow-sm -rotate-3"
      title={`In your collection, ${WORD[kind]} ${level(id)}`}
    >
      {PREFIX[kind]}{level(id)}
    </span>
  );
};

/** Detail-page panel: "I have it" plus the Eidolon / Superimposition picker. */
export const CollectionControl = ({ kind, id, name }) => {
  const { has, level, set, remove } = useCollection(kind);
  const [min, max] = LIMITS[kind];
  const owned = has(id);

  if (!owned) {
    return (
      <button
        type="button"
        onClick={() => set(id, min)}
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold bg-bg-card border-border text-text-secondary hover:text-text-primary hover:border-border-hover cursor-pointer transition-colors"
      >
        <PackageCheck size={16} aria-hidden="true" />
        I have {name}
      </button>
    );
  }

  return (
    <div className="w-full max-w-72 rounded-xl border border-text-primary/30 bg-bg-card p-2 pl-3 text-left">
      <div className="flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-text-primary">
          <Check size={15} aria-hidden="true" /> Owned
        </span>
        <button
          type="button"
          onClick={() => remove(id)}
          className="w-7 h-7 rounded-full inline-flex items-center justify-center text-text-muted hover:text-accent-red hover:bg-bg-elevated cursor-pointer"
          aria-label={`Remove ${name} from your collection`}
          title="Remove from collection"
        >
          <X size={15} aria-hidden="true" />
        </button>
      </div>
      <div className="flex flex-wrap gap-0.5 mt-1" role="group" aria-label={WORD[kind]}>
        {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => set(id, value)}
            aria-pressed={level(id) === value}
            title={`${WORD[kind]} ${value}`}
            className={`w-8 h-7 rounded-full text-xs font-bold tabular-nums cursor-pointer transition-colors ${level(id) === value
              ? "bg-text-primary text-bg-primary"
              : "text-text-secondary hover:bg-bg-elevated hover:text-text-primary"}`}
          >
            {PREFIX[kind]}{value}
          </button>
        ))}
      </div>
    </div>
  );
};

/** List filter: All / Owned / Missing, with how many of each. */
export const OwnershipFilter = ({ value, onChange, ownedCount, total }) => (
  <div className="inline-flex rounded-lg border border-border bg-bg-card p-0.5" role="group" aria-label="Collection filter">
    {[["all", `All (${total})`], ["owned", `Owned (${ownedCount})`], ["missing", `Missing (${total - ownedCount})`]].map(([key, text]) => (
      <button
        key={key}
        type="button"
        onClick={() => onChange(key)}
        aria-pressed={value === key}
        className={`px-3 py-1.5 rounded-md text-sm cursor-pointer transition-colors ${value === key
          ? "bg-text-primary text-bg-primary font-semibold"
          : "text-text-secondary hover:text-text-primary"}`}
      >
        {text}
      </button>
    ))}
  </div>
);
