import { useState } from "react";
import { Filter } from "lucide-react";

const ItemFilters = ({ onFilterChange, initialFilters, availableTypes, availableSubTypes }) => {
    const [filters, setFilters] = useState(initialFilters);
    const [showFilters, setShowFilters] = useState(false);

    const rarities = [5, 4, 3, 2, 1];

    const handleRarityChange = (rarity) => {
        const newRarities = filters.rarities.includes(rarity)
            ? filters.rarities.filter(r => r !== rarity)
            : [...filters.rarities, rarity];
        
        const newFilters = { ...filters, rarities: newRarities };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

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

    const clearAllFilters = () => {
        const newFilters = { rarities: [], types: [], subTypes: [] };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const getRarityColor = (rarity) => {
        switch(rarity) {
            case 5: return "text-amber-400 border-amber-400";
            case 4: return "text-purple-400 border-purple-400";
            case 3: return "text-blue-400 border-blue-400";
            case 2: return "text-green-400 border-green-400";
            case 1: return "text-gray-400 border-gray-400";
            default: return "text-gray-400 border-gray-400";
        }
    };

    return (
        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <Filter className="text-blue-400" size={24} />
                    <h3 className="text-xl font-bold text-white">Filters</h3>
                </div>
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-600/50 transition-colors"
                >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
            </div>

            {showFilters && (
                <>
                    <div className="mb-6">
                        <h4 className="text-lg font-semibold mb-3 text-gray-300">Rarity</h4>
                        <div className="flex flex-wrap gap-2">
                            {rarities.map(rarity => (
                                <button
                                    key={rarity}
                                    onClick={() => handleRarityChange(rarity)}
                                    className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                        filters.rarities.includes(rarity)
                                            ? `${getRarityColor(rarity)} bg-gray-700`
                                            : "border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold">{rarity}★</span>
                                        <span className="text-sm">
                                            {filters.rarities.includes(rarity) ? "✓" : ""}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {availableTypes.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold mb-3 text-gray-300">Type</h4>
                            <div className="flex flex-wrap gap-2">
                                {availableTypes.map(type => (
                                    <button
                                        key={type}
                                        onClick={() => handleTypeChange(type)}
                                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                            filters.types.includes(type)
                                                ? "border-blue-500 text-blue-400 bg-gray-700"
                                                : "border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{type}</span>
                                            <span className="text-sm">
                                                {filters.types.includes(type) ? "✓" : ""}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {availableSubTypes.length > 0 && (
                        <div className="mb-6">
                            <h4 className="text-lg font-semibold mb-3 text-gray-300">Sub-Type</h4>
                            <div className="flex flex-wrap gap-2">
                                {availableSubTypes.map(subType => (
                                    <button
                                        key={subType}
                                        onClick={() => handleSubTypeChange(subType)}
                                        className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                            filters.subTypes.includes(subType)
                                                ? "border-green-500 text-green-400 bg-gray-700"
                                                : "border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{subType}</span>
                                            <span className="text-sm">
                                                {filters.subTypes.includes(subType) ? "✓" : ""}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {(filters.rarities.length > 0 || filters.types.length > 0 || filters.subTypes.length > 0) && (
                        <div className="mt-6 pt-4 border-t border-gray-700">
                            <div className="flex items-center justify-between">
                                <div className="text-gray-400">
                                    Active filters:{" "}
                                    {filters.rarities.length + filters.types.length + filters.subTypes.length}
                                </div>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ItemFilters;