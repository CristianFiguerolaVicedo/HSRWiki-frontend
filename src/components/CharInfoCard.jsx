import { memo } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";

const ELEMENT_ICONS = {
  FIRE: '/assets/Type_Fire.webp',
  ICE: '/assets/Type_Ice.webp',
  LIGHTNING: '/assets/Type_Lightning.webp',
  WIND: '/assets/Type_Wind.webp',
  QUANTUM: '/assets/Type_Quantum.webp',
  IMAGINARY: '/assets/Type_Imaginary.webp',
  PHYSICAL: '/assets/Type_Physical.webp',
}

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

const PATH_NAMES = { HUNT: "The Hunt" };

const capitalize = (value) => value.charAt(0) + value.slice(1).toLowerCase();

// Small, stable tilt per character so the journal looks hand-assembled but never reshuffles
const tiltFor = (id, spread) => ((Math.abs(id) % 7) - 3) * spread;

const CharInfoCard = ({char}) => {
  const navigate = useNavigate();
  const element = char.element;
  const path = char.path.toUpperCase();
  const idString = char.id.toString();
  // "TrailblazerHarmony#F" -> "Trailblazer ♀" (the Path is already in the handwritten note)
  const name = char.name.startsWith('Trailblazer')
    ? `Trailblazer ${char.name.endsWith('#F') ? '♀' : '♂'}`
    : char.name;

  return (
    <div
      className={`photo-card tape-${element.toLowerCase()} cursor-pointer`}
      style={{ "--tilt": `${tiltFor(char.id, 0.6)}deg`, "--tape-tilt": `${tiltFor(char.id + 3, 1.4)}deg` }}
      onClick={() => navigate(`/char/${idString}`)}
      role="button"
      tabIndex={0}
      aria-label={`View ${char.name} details`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/char/${idString}`); } }}
    >
      <span className="washi" aria-hidden="true" />
      <FavoriteButton kind="characters" id={char.id} name={char.name.startsWith("Trailblazer") ? `${name} (${PATH_NAMES[path] || capitalize(path)})` : name} />

      <div className="photo-card__picture h-44 flex items-end justify-center">
        {/* "icon" is the 376x512 preview; "splash" is a 2048px portrait meant for detail views */}
        <img
          src={char.icon || char.splash}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover object-top"
        />
      </div>

      <div className="pt-3 px-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-[1.05rem] leading-tight text-text-primary">
            {name}
          </h3>
          <div className="flex shrink-0 pt-0.5" aria-label={`${char.rarity} stars`}>
            {Array.from({ length: char.rarity }).map((_, index) => (
              <Star key={index} className="text-accent-gold fill-accent-gold" size={11}/>
            ))}
          </div>
        </div>

        <div className="mt-1.5 flex items-center gap-1.5 text-text-secondary min-w-0">
          {ELEMENT_ICONS[element] && (
            <img src={ELEMENT_ICONS[element]} alt="" className="w-5 h-5" title={capitalize(element)} />
          )}
          {PATH_ICONS[path] && (
            <img src={PATH_ICONS[path]} alt="" className="w-5 h-5 invert opacity-70" title={PATH_NAMES[path] || capitalize(path)} />
          )}
          <span className="font-hand text-xl leading-[0.95] ml-0.5 min-w-0 break-words">
            {PATH_NAMES[path] || capitalize(path)}, {capitalize(element)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default memo(CharInfoCard);
