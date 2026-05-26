import { memo, useState } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RARITY_STYLES = {
  5: { border: "border-accent-gold/50", bg: "bg-gradient-to-br from-accent-gold/[0.08] to-transparent", text: "text-accent-gold" },
  4: { border: "border-accent-purple/50", bg: "bg-gradient-to-br from-accent-purple/[0.08] to-transparent", text: "text-accent-purple" },
  3: { border: "border-blue-500/40", bg: "bg-gradient-to-br from-blue-500/[0.06] to-transparent", text: "text-blue-400" },
  2: { border: "border-green-500/40", bg: "bg-gradient-to-br from-green-500/[0.06] to-transparent", text: "text-green-400" },
  1: { border: "border-border", bg: "bg-bg-card", text: "text-text-muted" },
};

const ItemInfoCard = ({ item }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const itemName = item?.name || "Unknown Item";
  const itemRarity = item?.rarity || 1;
  const itemType = item?.type || 'Unknown';
  const itemSubType = item?.subType || '';
  const itemIcon = item?.icon || '';
  const itemId = item?.id || '';
  const style = RARITY_STYLES[itemRarity] || RARITY_STYLES[1];

  const handleClick = () => {
    if (itemId) {
      navigate(`/items/${itemId}`);
    } else if (itemName && itemName !== "Unknown Item") {
      navigate(`/items/${encodeURIComponent(itemName)}`);
    }
  };

  return (
    <div
      className={`group relative rounded-xl p-4 border ${style.border} ${style.bg} transition-all duration-300 cursor-pointer animate-fade-in hover:-translate-y-1 hover:shadow-lg`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${itemName} details`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(); } }}
    >
      <div className="absolute top-3 right-3 flex">
        {Array.from({ length: itemRarity }).map((_, index) => (
          <Star
            key={index}
            className={`${style.text} fill-current`}
            size={12}
          />
        ))}
      </div>

      <div className="flex justify-center mb-3">
        <div className="relative w-20 h-20">
          {itemIcon && !imageError ? (
            <img
              src={itemIcon}
              alt={itemName}
              className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-bg-elevated rounded-lg">
              <span className="text-text-muted text-sm">No Image</span>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-center font-semibold text-text-primary mb-2 line-clamp-2 min-h-[3rem] text-sm">
        {itemName}
      </h3>

      <div className="text-center">
        {itemSubType && itemSubType !== itemType && (
          <span className="text-xs px-2 py-1 bg-bg-elevated text-text-secondary rounded-full">
            {itemSubType}
          </span>
        )}
      </div>

      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-bg-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
        <span className="text-text-primary text-sm font-medium">View Details</span>
      </div>
    </div>
  );
};

export default memo(ItemInfoCard);
