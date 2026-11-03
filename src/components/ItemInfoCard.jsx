import { memo, useState } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Item "stickers": white paper with a rarity-coloured edge (same order as the in-game frames)
const RARITY_STYLES = {
  5: { edge: "border-[#D9A12E]", text: "text-[#B8820F]" },
  4: { edge: "border-[#9B7FD9]", text: "text-[#6E55BE]" },
  3: { edge: "border-[#6FA3D6]", text: "text-[#2F6FAE]" },
  2: { edge: "border-[#7CBF9A]", text: "text-[#2F7D57]" },
  1: { edge: "border-border-hover", text: "text-text-muted" },
};

const ItemInfoCard = ({ item }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const itemName = item?.name || "Unknown Item";
  const itemRarity = item?.rarity || 1;
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
      className={`group relative bg-bg-card rounded-lg p-4 border border-border border-b-4 ${style.edge} shadow-[0_6px_14px_-12px_rgba(31,42,68,0.45)] transition-transform duration-200 cursor-pointer hover:-translate-y-0.5`}
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
              <span className="font-hand text-lg text-text-muted">no photo</span>
            </div>
          )}
        </div>
      </div>

      <h3 className="text-center font-semibold text-text-primary line-clamp-2 min-h-[2.5rem] text-sm">
        {itemName}
      </h3>

    </div>
  );
};

export default memo(ItemInfoCard);
