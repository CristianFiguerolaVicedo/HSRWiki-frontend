import { Check, Filter, Star } from "lucide-react";
import { useState } from "react";

const RARITIES = [
    {id: "5star", value: 5, label: <Star className="text-amber-400 fill-amber-400"/>},
    {id: "4star", value: 4, label: <Star className="text-purple-400 fill-purple-400"/>},
    {id: "3star", value: 3, label: <Star className="text-blue-400 fill-blue-400"/>},
    {id: "2star", value: 2, label: <Star className="text-green-400 fill-green-400"/>},
    {id: "1star", value: 1, label: <Star className="text-gray-400 fill-gray-400"/>}
];

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
        const newFilters = {
            types: [],
            subTypes: [],
            rarities: [],
            showFilters: filters.showFilters
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const getActiveFilterCount = () => {
        return filters.types.length + filters.subTypes.length + filters.rarities.length;
    };

    const getRarityLabel = (rarity) => {
        switch(rarity) {
            case 5: return <Star className="text-amber-400 fill-amber-400" />;
            case 4: return <Star className="text-purple-400 fill-purple-400" />;
            case 3: return <Star className="text-blue-400 fill-blue-400" />;
            case 2: return <Star className="text-green-400 fill-green-400" />;
            case 1: return <Star className="text-gray-400 fill-gray-400" />;
            default: return <Star className="text-gray-400" />;
        }
    };

    const getRarityTextColor = (rarity) => {
        switch(rarity) {
            case 5: return "text-amber-400";
            case 4: return "text-purple-400";
            case 3: return "text-blue-400";
            case 2: return "text-green-400";
            case 1: return "text-gray-400";
            default: return "text-gray-400";
        }
    };

    const getTypeColor = (isActive) => {
        return isActive 
            ? 'bg-[#E1D9BC]/20 border border-[#30364F]/50 text-[#E1D9BC]' 
            : 'bg-[#E1D9BC] border border-[#30364F] text-[#30364F] hover:bg-[#30364F] hover:text-[#E1D9BC] hover:border-[#E1D9BC] hover:cursor-pointer';
    };

    return (
        <div className="w-full bg-[#30364F] rounded-xl border border-gray-700 mb-6">
            <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50 transition-colors rounded-t-xl"
                onClick={toggleFilters}
            >
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-[#E1D9BC]">
                        Filters
                    </h2>
                    {getActiveFilterCount() > 0 && (
                        <span className="px-2 py-1 bg-[#E1D9BC] text-[#30364F] text-xs rounded-full">
                            {getActiveFilterCount()} active
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {getActiveFilterCount() > 0 && (
                        <button 
                            className="px-3 py-1 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                            onClick={(e) => {e.stopPropagation(); clearAllFilters();}}
                        >
                            Clear All
                        </button>
                    )}
                    <svg
                        className={`w-5 h-5 text-gray-400 transition-transform ${filters.showFilters ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>
            </div>

            {filters.showFilters && (
                <div className="p-4 border-t border-gray-700 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-amber-300 mb-3 flex items-center gap-2">
                            <span className="text-[#E1D9BC]">
                                <Star className="text-[#E1D9BC] fill-[#E1D9BC]"/>
                            </span> 
                            <p className="text-[#E1D9BC]">Rarity</p>
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {RARITIES.map((rarity) => (
                                <button
                                    key={rarity.id}
                                    onClick={() => handleRarityChange(rarity.value)}
                                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${filters.rarities.includes(rarity.value) ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300' : 'bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-[#30364F] hover:border-[#E1D9BC] hover:cursor-pointer'}`}
                                >
                                    {filters.rarities.includes(rarity.value) && (
                                        <Check size={16} className="text-amber-400"/>
                                    )}
                                    {rarity.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {availableTypes && availableTypes.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                                <span className="text-blue-400">
                                    <Filter className="text-[#E1D9BC]"/>
                                </span> 
                                <p className="text-[#E1D9BC]">Type</p>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {availableTypes.map((type) => (
                                    <button
                                        key={`type-${type}`}
                                        onClick={() => handleTypeChange(type)}
                                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${getTypeColor(filters.types.includes(type))}`}
                                    >
                                        {filters.types.includes(type) && (
                                            <Check size={16} className="inline mr-2 text-blue-400"/>
                                        )}
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {availableSubTypes && availableSubTypes.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-green-300 mb-3 flex items-center gap-2">
                                <span className="text-green-400">
                                    <Filter className="text-[#E1D9BC]"/>
                                </span> 
                                <p className="text-[#E1D9BC]">Sub-Type</p>
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {availableSubTypes.map((subType) => (
                                    <button
                                        key={`subtype-${subType}`}
                                        onClick={() => handleSubTypeChange(subType)}
                                        className={`px-4 py-2 rounded-lg transition-all duration-200 ${getTypeColor(filters.subTypes.includes(subType))}`}
                                    >
                                        {filters.subTypes.includes(subType) && (
                                            <Check size={16} className="inline mr-2 text-green-400"/>
                                        )}
                                        {subType}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {getActiveFilterCount() > 0 && (
                        <div className="pt-4 border-t border-gray-700">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-gray-400 text-sm">
                                    Active filters:
                                </span>
                                <button className="text-sm text-red-400 hover:text-red-300 transition-colors"
                                    onClick={clearAllFilters}
                                >
                                    Clear All
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {filters.rarities.map((rarity) => (
                                    <span key={`rarity-${rarity}`} className={`px-3 py-1 ${getRarityTextColor(rarity)}/20 ${getRarityTextColor(rarity)} rounded-full text-sm flex items-center gap-1`}>
                                        {getRarityLabel(rarity)}
                                        <span className="ml-1">{rarity}★</span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRarityChange(rarity);
                                            }}
                                            className="ml-1 hover:opacity-70"
                                        >
                                            X
                                        </button>
                                    </span>
                                ))}
                                {filters.types.map((type) => (
                                    <span key={`type-${type}`} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center gap-1">
                                        Type: {type}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleTypeChange(type);
                                            }}
                                            className="ml-1 hover:text-blue-200"
                                        >
                                            X
                                        </button>
                                    </span>
                                ))}
                                {filters.subTypes.map((subType) => (
                                    <span key={`subtype-${subType}`} className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm flex items-center gap-1">
                                        Sub: {subType}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSubTypeChange(subType);
                                            }}
                                            className="ml-1 hover:text-green-200"
                                        >
                                            X
                                        </button>
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