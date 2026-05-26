import { memo } from "react";
import { useNavigate } from "react-router-dom";

const PlanarsInfoCard = ({planarSet}) => {
  const navigate = useNavigate();
  const planarName = planarSet.name;

  return (
    <div
      className="group hsr-card p-4 shadow-lg cursor-pointer relative animate-fade-in"
      onClick={() => navigate(`/planars/${planarName}`)}
      role="button"
      tabIndex={0}
      aria-label={`View ${planarName} details`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/planars/${planarName}`); } }}
    >
      <div className="flex justify-center mb-3">
        <img
          src={`${planarSet.pieces["Planar Sphere"].icon.replace(/ /g, "%20")}`}
          alt={planarSet.name}
          className="h-40 object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <h3 className="text-center font-bold text-lg mb-2 text-text-primary">
        {planarName}
      </h3>
    </div>
  )
}

export default memo(PlanarsInfoCard);
