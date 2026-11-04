import { Heart } from "lucide-react";
import { useFavorites } from "../hooks/useFavorites";

/**
 * Heart toggle. "sticker" sits over a photo card corner; "inline" goes next to a page title.
 * It stops the click so tapping the heart never opens the card underneath.
 */
const FavoriteButton = ({ kind, id, name, variant = "sticker" }) => {
  const { isFavorite, toggle } = useFavorites(kind);
  const on = isFavorite(id);

  const onClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggle(id);
  };

  const base = "inline-flex items-center justify-center transition-all duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-accent-cyan";
  const look = variant === "inline"
    ? `gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold ${on ? "bg-[#FDE3EC] border-accent-red/40 text-accent-red" : "bg-bg-card border-border text-text-secondary hover:text-accent-red hover:border-accent-red/40"}`
    : `absolute top-3 right-3 z-10 w-9 h-9 rounded-full shadow-sm border ${on ? "bg-[#FDE3EC] border-accent-red/40 text-accent-red scale-100" : "bg-white/85 border-border text-text-muted hover:text-accent-red"}`;

  return (
    <button
      type="button"
      onClick={onClick}
      onKeyDown={(e) => e.stopPropagation()}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
      title={on ? "In your favorites" : "Add to favorites"}
      className={`${base} ${look}`}
    >
      <Heart size={variant === "inline" ? 16 : 17} className={on ? "fill-accent-red" : ""} aria-hidden="true" />
      {variant === "inline" && (on ? "Favorite" : "Add to favorites")}
    </button>
  );
};

export default FavoriteButton;
