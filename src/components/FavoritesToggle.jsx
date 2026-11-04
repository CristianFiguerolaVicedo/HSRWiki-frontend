import { Heart } from "lucide-react";

/** "Favorites only" chip shown next to the sort selector of a list. */
const FavoritesToggle = ({ active, count, onChange }) => (
  <button
    type="button"
    onClick={() => onChange(!active)}
    aria-pressed={active}
    className={`px-4 py-2 rounded-lg border flex items-center gap-2 transition-colors cursor-pointer ${active
      ? "bg-[#FDE3EC] border-accent-red/40 text-accent-red font-semibold"
      : "bg-bg-card border-border text-text-secondary hover:text-accent-red hover:border-accent-red/40"}`}
  >
    <Heart size={16} className={active ? "fill-accent-red" : ""} aria-hidden="true" />
    Favorites
    <span className="tabular-nums text-sm opacity-80">({count})</span>
  </button>
);

export default FavoritesToggle;
