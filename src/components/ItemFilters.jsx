import { Check, Filter, Star } from "lucide-react";
import { useState } from "react";

const RARITIES = [
  {id: "5star", value: 5, label: <Star className="text-accent-gold fill-accent-gold"/>},
  {id: "4star", value: 4, label: <Star className="text-accent-purple fill-accent-purple"/>},
  {id: "3star", value: 3, label: <Star className="text-blue-400 fill-blue-400"/>},
  {id: "2star", value: 2, label: <Star className="text-green-400 fill-green-400"/>},
  {id: "1star", value: 1, label: <Star className="text-text-muted fill-text-muted"/>}
];

const chipActiveClass = "bg-bg-elevated border border-accent-cyan/50 text-text-primary";
const chipInactiveClass = "bg-bg-card border border-border text-text-secondary hover:bg-bg-elevated hover:border-accent-cyan/30 hover:text-text-primary";

const ItemFilters = ({ onFilterChange, initialFilters, availableTypes, availableSubTypes }) => {
  const [filters, setFilters] = useState({
    types: initialFilters.types || [],
    subTypes: initialFilters.subTypes || [],
    rarities: initialFilters.rarities || [],
    showFilters: initialFilters.showFilters || false,
  });

  const handleTypeChange = (type) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type];
    const newFilters = { ...filters, types: newTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSubTypeChange = (subType) => {
    const newSubTypes = filters.subTypes.includes(subType)
      ? filters.subTypes.filter(st => st !== subType)
      : [...filters.subTypes, subType];
    const newFilters = { ...filters, subTypes: newSubTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleRarityChange = (rarity) => {
    const newRarities = filters.rarities.includes(rarity)
      ? filters.rarities.filter(r => r !== rarity)
      : [...filters.rarities, rarity];
    const newFilters = { ...filters, rarities: newRarities };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const toggleFilters = () => {
    setFilters(prev => ({...prev, showFilters: !prev.showFilters}));
  };

  const clearAllFilters = () => {
    const newFilters = { types: [], subTypes: [], rarities: [], showFilters: filters.showFilters };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const getActiveFilterCount = () => {
    return filters.types.length + filters.subTypes.length + filters.rarities.length;
  };

  const getRarityLabel = (rarity) => {
    switch(rarity) {
      case 5: return <Star className="text-accent-gold fill-accent-gold" />;
      case 4: return <Star className="text-accent-purple fill-accent-purple" />;
      case 3: return <Star className="text-blue-400 fill-blue-400" />;
      case 2: return <Star className="text-green-400 fill-green-400" />;
      case 1: return <Star className="text-text-muted fill-text-muted" />;
      default: return <Star className="text-text-muted" />;
    }
  };

  const getRarityTextColor = (rarity) => {
    switch(rarity) {
      case 5: return "text-accent-gold";
      case 4: return "text-accent-purple";
      case 3: return "text-blue-400";
      case 2: return "text-green-400";
      case 1: return "text-text-muted";
      default: return "text-text-muted";
    }
  };

  return (
    <div className="w-full glass-panel mb-6">
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-bg-elevated/50 transition-colors rounded-t-xl"
        onClick={toggleFilters}
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

          {availableTypes && availableTypes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Filter size={18} className="text-accent-cyan"/> Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableTypes.map((type) => (
                  <button
                    key={`type-${type}`}
                    onClick={() => handleTypeChange(type)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${filters.types.includes(type) ? chipActiveClass : chipInactiveClass}`}
                  >
                    {filters.types.includes(type) && <Check size={16} className="text-accent-cyan"/>}
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {availableSubTypes && availableSubTypes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-text-primary mb-3 flex items-center gap-2">
                <Filter size={18} className="text-accent-gold"/> Sub-Type
              </h3>
              <div className="flex flex-wrap gap-2">
                {availableSubTypes.map((subType) => (
                  <button
                    key={`subtype-${subType}`}
                    onClick={() => handleSubTypeChange(subType)}
                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${filters.subTypes.includes(subType) ? chipActiveClass : chipInactiveClass}`}
                  >
                    {filters.subTypes.includes(subType) && <Check size={16} className="text-accent-gold"/>}
                    {subType}
                  </button>
                ))}
              </div>
            </div>
          )}

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
                  <span key={`rarity-${rarity}`} className={`px-3 py-1 bg-bg-elevated ${getRarityTextColor(rarity)} rounded-full text-sm flex items-center gap-1 border border-current/20`}>
                    {getRarityLabel(rarity)}
                    <span className="ml-1">{rarity}★</span>
                    <button onClick={(e) => {e.stopPropagation(); handleRarityChange(rarity);}} className="ml-1 hover:opacity-70">&times;</button>
                  </span>
                ))}
                {filters.types.map((type) => (
                  <span key={`type-${type}`} className="px-3 py-1 bg-bg-elevated text-text-primary rounded-full text-sm flex items-center gap-1 border border-accent-cyan/20">
                    Type: {type}
                    <button onClick={(e) => {e.stopPropagation(); handleTypeChange(type);}} className="ml-1 hover:text-accent-cyan">&times;</button>
                  </span>
                ))}
                {filters.subTypes.map((subType) => (
                  <span key={`subtype-${subType}`} className="px-3 py-1 bg-bg-elevated text-text-primary rounded-full text-sm flex items-center gap-1 border border-accent-gold/20">
                    Sub: {subType}
                    <button onClick={(e) => {e.stopPropagation(); handleSubTypeChange(subType);}} className="ml-1 hover:text-accent-gold">&times;</button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemFilters;
