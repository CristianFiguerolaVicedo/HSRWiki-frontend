import { memo } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { PATH_TAPES, pathLabel } from "../util/paths";
import FavoriteButton from "./FavoriteButton";

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

const tiltFor = (id, spread) => ((Math.abs(id) % 7) - 3) * spread;

const LightconeInfoCard = ({lightcone}) => {
  const path = lightcone.path.toUpperCase();
  const navigate = useNavigate();
  const idString = lightcone.id.toString();

  return (
    <div
      className={`photo-card ${PATH_TAPES[path] || 'tape-physical'} cursor-pointer`}
      style={{ "--tilt": `${tiltFor(lightcone.id, 0.6)}deg`, "--tape-tilt": `${tiltFor(lightcone.id + 2, 1.4)}deg` }}
      onClick={() => navigate(`/lightcones/${idString}`)}
      role="button"
      tabIndex={0}
      aria-label={`View ${lightcone.name} details`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/lightcones/${idString}`); } }}
    >
      <span className="washi" aria-hidden="true" />
      <FavoriteButton kind="lightcones" id={lightcone.id} name={lightcone.name} />

      <div className="photo-card__picture h-44 flex items-center justify-center p-2">
        {/* "icon" is the 348x408 preview; "image" is the full 902x1260 art used on the detail page */}
        <img
          src={lightcone.icon || lightcone.image}
          alt=""
          loading="lazy"
          className="h-full object-contain"
        />
      </div>

      <div className="pt-3 px-1">
        <h3 className="font-semibold text-[1.02rem] leading-tight text-text-primary line-clamp-2 min-h-[2.5rem]">
          {lightcone.name}
        </h3>
        <div className="mt-1.5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-text-secondary min-w-0">
            {PATH_ICONS[path] && (
              <img src={PATH_ICONS[path]} alt="" className="w-5 h-5 invert opacity-70 shrink-0" />
            )}
            <span className="font-hand text-xl leading-none truncate">{pathLabel(path)}</span>
          </div>
          <div className="flex shrink-0" aria-label={`${lightcone.rarity} stars`}>
            {Array.from({ length: lightcone.rarity }).map((_, index) => (
              <Star key={index} className="text-accent-gold fill-accent-gold" size={11}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(LightconeInfoCard);
