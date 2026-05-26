import { memo } from "react";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ELEMENT_ICONS = {
  FIRE: '/assets/Type_Fire.webp',
  ICE: '/assets/Type_Ice.webp',
  LIGHTNING: '/assets/Type_Lightning.webp',
  WIND: '/assets/Type_Wind.webp',
  QUANTUM: '/assets/Type_Quantum.webp',
  IMAGINARY: '/assets/Type_Imaginary.webp',
  PHYSICAL: '/assets/Type_Physical.webp',
}

const ELEMENT_COLORS = {
  FIRE: 'element-border-fire',
  ICE: 'element-border-ice',
  LIGHTNING: 'element-border-lightning',
  WIND: 'element-border-wind',
  QUANTUM: 'element-border-quantum',
  IMAGINARY: 'element-border-imaginary',
  PHYSICAL: 'element-border-physical',
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

const CharInfoCard = ({char}) => {
  const elementIconPath = ELEMENT_ICONS[char.element];
  const pathIconPath = PATH_ICONS[char.path.toUpperCase()];
  const elementBorder = ELEMENT_COLORS[char.element] || '';
  const navigate = useNavigate();
  const idString = char.id.toString();

  return (
    <div
      className={`group bg-bg-card border ${elementBorder} rounded-xl p-4 shadow-lg hover:shadow-xl hover:shadow-accent-cyan/5 relative cursor-pointer transition-all duration-300 animate-fade-in hover:-translate-y-1 hsr-card`}
      onClick={() => navigate(`/char/${idString}`)}
      role="button"
      tabIndex={0}
      aria-label={`View ${char.name} details`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/char/${idString}`); } }}
    >
      <div className={`absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none ${char.rarity === 5 ? 'rarity-5-glow' : 'rarity-4-glow'}`} />

      <div className="flex justify-center mb-3 relative">
        <img
          src={`${char.splash}`}
          alt={char.name}
          className="h-40 object-contain drop-shadow-lg transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <h3 className="text-center font-bold text-lg mb-2 truncate text-text-primary">
        {char.name.replace('Trailblazer', 'TB').replace('#M', '♂').replace('#F', '♀')}
      </h3>

      <div className="flex justify-center mb-3">
        {Array.from({ length: char.rarity }).map((_, index) => (
          <Star key={index} className="text-accent-gold fill-accent-gold" size={14}/>
        ))}
      </div>

      <div className="flex justify-center items-center gap-5 mb-1">
        <div className="flex flex-col items-center">
          {elementIconPath && (
            <img
              src={elementIconPath}
              alt={char.element}
              className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
              title={`Element: ${char.element}`}
            />
          )}
          <span className="text-xs text-text-secondary mt-1">{char.element.charAt(0) + char.element.slice(1).toLowerCase()}</span>
        </div>

        <div className="flex flex-col items-center">
          {pathIconPath && (
            <img
              src={pathIconPath}
              alt={char.path}
              className="w-6 h-6 opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:scale-110"
              title={`Path: ${char.path}`}
            />
          )}
          <span className="text-xs text-text-secondary mt-1">{char.path.charAt(0) + char.path.slice(1).toLowerCase()}</span>
        </div>
      </div>
    </div>
  )
}

export default memo(CharInfoCard);
