import { memo } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PATH_ICONS = {
  ABUNDANCE: '/assets/Icon_Abundance.webp',
  DESTRUCTION: '/assets/Icon_Destruction.webp',
  ERUDITION: '/assets/Icon_Erudition.webp',
  HARMONY: '/assets/Icon_Harmony.webp',
  NIHILITY: '/assets/Icon_Nihility.webp',
  PRESERVATION: '/assets/Icon_Preservation.webp',
  REMEMBRANCE: '/assets/Icon_Remembrance.webp',
  HUNT: '/assets/Icon_The_Hunt.webp',
  ELATION: '/assets/Icon_Elation.png',
}

const LightconeInfoCard = ({lightcone}) => {
  const pathIconPath = PATH_ICONS[lightcone.path.toUpperCase()];
  const navigate = useNavigate();
  const idString = lightcone.id.toString();

  return (
    <div
      className={`group hsr-card p-4 shadow-lg cursor-pointer relative animate-fade-in ${lightcone.rarity === 5 ? 'hsr-card-gold' : 'hsr-card'}`}
      onClick={() => navigate(`/lightcones/${idString}`)}
      role="button"
      tabIndex={0}
      aria-label={`View ${lightcone.name} details`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/lightcones/${idString}`); } }}
    >
      <div className="flex justify-center mb-3">
        <img
          src={`${lightcone.image}`}
          alt={lightcone.name}
          className="h-40 object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <h3 className="text-center font-bold text-lg mb-2 truncate text-text-primary">
        {lightcone.name}
      </h3>

      <div className="flex justify-center mb-3">
        {Array.from({ length: lightcone.rarity }).map((_, index) => (
          <Star key={index} className="text-accent-gold fill-accent-gold" size={14}/>
        ))}
      </div>

      <div className="flex justify-center items-center gap-4 mb-1">
        <div className="flex flex-col items-center">
          {pathIconPath && (
            <img
              src={pathIconPath}
              alt={lightcone.path}
              className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-all duration-300"
              title={`Path: ${lightcone.path}`}
            />
          )}
          <span className="text-xs text-text-secondary mt-1">{lightcone.path}</span>
        </div>
      </div>
    </div>
  )
}

export default memo(LightconeInfoCard);
