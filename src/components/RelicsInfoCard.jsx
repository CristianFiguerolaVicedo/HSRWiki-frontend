import { memo } from "react";
import { useNavigate } from "react-router-dom";

const RelicsInfoCard = ({relicSet}) => {
  const navigate = useNavigate();
  const relicName = relicSet.name;

  return (
    <div
      className="group hsr-card p-4 shadow-lg cursor-pointer relative animate-fade-in"
      onClick={() => navigate(`/relics/${relicName}`)}
      role="button"
      tabIndex={0}
      aria-label={`View ${relicName} details`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/relics/${relicName}`); } }}
    >
      <div className="flex justify-center mb-3">
        <img
          src={`${relicSet.pieces.Head.icon}`}
          alt={relicSet.name}
          className="h-40 object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <h3 className="text-center font-bold text-lg mb-2 text-text-primary">
        {relicName}
      </h3>
    </div>
  )
}

export default memo(RelicsInfoCard);
