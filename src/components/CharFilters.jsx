import { Check, Route, Star, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const ELEMENTS = [
  {id: "physical", name: "PHYSICAL", label: "Physical"},
  {id: "fire", name: "FIRE", label: "Fire"},
  {id: "ice", name: "ICE", label: "Ice"},
  {id: "lightning", name: "LIGHTNING", label: "Lightning"},
  {id: "wind", name: "WIND", label: "Wind"},
  {id: "quantum", name: "QUANTUM", label: "Quantum"},
  {id: "imaginary", name: "IMAGINARY", label: "Imaginary"},
]

const PATHS = [
  {id: "destruction", name: "DESTRUCTION", label: "Destruction"},
  {id: "hunt", name: "HUNT", label: "Hunt"},
  {id: "erudition", name: "ERUDITION", label: "Erudition"},
  {id: "harmony", name: "HARMONY", label: "Harmony"},
  {id: "nihility", name: "NIHILITY", label: "Nihility"},
  {id: "preservation", name: "PRESERVATION", label: "Preservation"},
  {id: "abundance", name: "ABUNDANCE", label: "Abundance"},
  {id: "remembrance", name: "REMEMBRANCE", label: "Remembrance"},
  {id: "elation", name: "ELATION", label: "Elation"},
]

const RARITIES = [
  {id: "5star", value: 5, label: <Star className="text-accent-gold fill-accent-gold"/>},
  {id: "4star", value: 4, label: <Star className="text-accent-purple fill-accent-purple"/>}
]

const CharFilters = ({onFilterChange, initialFilters}) => {
  const [filters, setFilters] = useState({
    elements: initialFilters.elements || [],
    paths: initialFilters.paths || [],
    rarities: initialFilters.rarities || [],
    showFilters: false,
  });

  const prevFiltersRef = useRef(null);

  useEffect(() => {
    const prev = prevFiltersRef.current;
    if (!prev || prev.elements !== filters.elements || prev.paths !== filters.paths || prev.rarities !== filters.rarities) {
      onFilterChange(filters);
    }
    prevFiltersRef.current = { elements: filters.elements, paths: filters.paths, rarities: filters.rarities };
  });

  const handleElementChange = (elementName) => {
    const newElements = filters.elements.includes(elementName)
      ? filters.elements.filter((el) => el !== elementName)
      : [...filters.elements, elementName];
    setFilters(prev => ({ ...prev, elements: newElements }));
  };

  const handlePathChange = (pathName) => {
    const newPaths = filters.paths.includes(pathName)
      ? filters.paths.filter((path) => path !== pathName)
      : [...filters.paths, pathName];
    setFilters(prev => ({ ...prev, paths: newPaths }));
  };

  const handleRarityChange = (rarity) => {
    const newRarities = filters.rarities.includes(rarity)
      ? filters.rarities.filter((r) => r !== rarity)
      : [...filters.rarities, rarity];
    setFilters(prev => ({ ...prev, rarities: newRarities }));
  };

  const toggleFilters = () => {
    setFilters(prev => ({ ...prev, showFilters: !prev.showFilters }));
  };

  const clearAllFilters = () => {
    setFilters(prev => ({
      elements: [],
      paths: [],
      rarities: [],
      showFilters: prev.showFilters
    }));
  };

  const getActiveFilterCount = () => {
    return filters.elements.length + filters.paths.length + filters.rarities.length;
  };

  const chipActiveClass = "bg-bg-elevated border border-accent-cyan/50 text-text-primary";
  const chipInactiveClass = "bg-bg-card border border-border text-text-secondary hover:bg-bg-elevated hover:border-accent-cyan/30 hover:text-text-primary";

  return (
    <div className="w-full glass-panel mb-6">
      <div
        onClick={toggleFilters}
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-bg-elevated/50 transition-colors rounded-t-xl"
      >
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-text-primary">Filters</h2>
          {getActiveFilterCount() > 0 && (
            <span className="px-2 py-1 bg-accent-cyan/20 text-accent-cyan text-xs rounded-full border border-accent-cyan/30">
              {getActiveFilterCount()} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {getActiveFilterCount() > 0 && (
            <button
              className="px-3 py-1 text-sm text-text-secondary hover:text-text-primary hover:bg-bg-elevated rounded-lg transition-colors"
              onClick={(e) => {e.stopPropagation(); clearAllFilters();}}
            >
              Clear All
            </button>
          )}
          <svg
            className={`w-5 h-5 text-text-secondary transition-transform ${filters.showFilters ? 'rotate-180' : ''}`}
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>

      {filters.showFilters && (
        <div className="p-4 border-t border-border space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-accent-gold mb-3 flex items-center gap-2">
              <Star className="text-accent-gold fill-accent-gold" size={18}/> Rarity
            </h3>
            <div className="flex flex-wrap gap-2">
              {RARITIES.map((rarity) => (
                <button
                  key={rarity.id}
                  onClick={() => handleRarityChange(rarity.value)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${filters.rarities.includes(rarity.value) ? chipActiveClass : chipInactiveClass}`}
                >
                  {filters.rarities.includes(rarity.value) && <Check size={16} className="text-accent-gold"/>}
                  {rarity.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Zap size={18} className="text-accent-cyan"/> Element
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {ELEMENTS.map((element) => (
                <button
                  key={element.id}
                  onClick={() => handleElementChange(element.name)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${filters.elements.includes(element.name) ? chipActiveClass : chipInactiveClass}`}
                >
                  {filters.elements.includes(element.name) && <Check size={16} className="text-accent-cyan"/>}
                  {element.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Route size={18} className="text-accent-gold"/> Path
            </h3>
            <div className="flex flex-wrap gap-2">
              {PATHS.map((path) => (
                <button
                  key={path.id}
                  onClick={() => handlePathChange(path.name)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${filters.paths.includes(path.name) ? chipActiveClass : chipInactiveClass}`}
                >
                  {filters.paths.includes(path.name) && <Check size={16} className="text-accent-cyan"/>}
                  {path.label}
                </button>
              ))}
            </div>
          </div>

          {getActiveFilterCount() > 0 && (
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-sm">Active filters:</span>
                <button className="text-sm text-accent-cyan hover:text-accent-cyan/80 transition-colors"
                  onClick={clearAllFilters}
                >
                  Clear All
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.rarities.map((rarity) => (
                  <span key={`rarity-${rarity}`} className="px-3 py-1 bg-bg-elevated text-accent-gold rounded-full text-sm flex items-center gap-1 border border-accent-gold/20">
                    {rarity === 5 ? "5★" : "4★"}
                    <button onClick={(e) => {e.stopPropagation(); handleRarityChange(rarity);}} className="ml-1 hover:text-accent-gold/80">&times;</button>
                  </span>
                ))}
                {filters.elements.map((element) => (
                  <span key={`element-${element}`} className="px-3 py-1 bg-bg-elevated text-text-primary rounded-full text-sm flex items-center gap-1 border border-accent-cyan/20">
                    {element}
                    <button onClick={(e) => {e.stopPropagation(); handleElementChange(element);}} className="ml-1 hover:text-accent-cyan">&times;</button>
                  </span>
                ))}
                {filters.paths.map((path) => (
                  <span key={`path-${path}`} className="px-3 py-1 bg-bg-elevated text-text-primary rounded-full text-sm flex items-center gap-1 border border-accent-cyan/20">
                    {path}
                    <button onClick={(e) => {e.stopPropagation(); handlePathChange(path);}} className="ml-1 hover:text-accent-cyan">&times;</button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CharFilters;
