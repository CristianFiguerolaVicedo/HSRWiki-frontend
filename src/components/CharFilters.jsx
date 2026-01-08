import { Check, Route, Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";

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
]

const RARITIES = [
    {id: "5star", value: 5, label: <Star className="text-amber-400 fill-amber-400"/>},
    {id: "4star", value: 4, label: <Star className="text-purple-400 fill-purple-400"/>}
]

const CharFilters = ({onFilterChange, initialFilters}) => {
    const [filters, setFilters] = useState({
        elements: initialFilters.elements || [],
        paths: initialFilters.paths || [],
        rarities: initialFilters.rarities || [],
        showFilters: true,
    });

    useEffect(() => {
        onFilterChange(filters);
    }, [filters, onFilterChange]);

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

    return (
        <div className="w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 mb-6">
            <div onClick={toggleFilters} className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-800/50 transition-colors rounded-t-xl">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-bold text-white">
                        Filters
                    </h2>
                    {getActiveFilterCount() > 0 && (
                        <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded-full">
                            {getActiveFilterCount()} active
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {getActiveFilterCount() > 0 && (
                        <button className="px-3 py-1 text-sm text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                            onClick={(e) => {e.stopPropagation(); clearAllFilters();}}
                        >
                            Clear All
                        </button>
                    )}
                    <svg className={`w-5 h-5 text-gray-400 transition-transform ${filters.showFilters ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {filters.showFilters && (
                <div className="p-4 border-t border-gray-700 space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-amber-300 mb-3 flex items-center gap-2">
                            <span className="text-amber-400">
                                <Star className="text-amber-400 fill-amber-400"/>
                            </span> Rarity
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {RARITIES.map((rarity) => (
                                <button
                                key={rarity.id}
                                onClick={() => handleRarityChange(rarity.value)}
                                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${filters.rarities.includes(rarity.value) ? 'bg-amber-500/20 border border-amber-500/50 text-amber-300' : 'bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-600'}`}
                                >
                                    {filters.rarities.includes(rarity.value) && (
                                        <Check size={16} className="text-amber-400"/>
                                    )}
                                    {rarity.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center gap-2">
                            <span className="text-blue-400">
                                <Zap className="text-blue-400"/>
                            </span> Element
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {ELEMENTS.map((element) => (
                                <button
                                key={element.id}
                                onClick={() => handleElementChange(element.name)}
                                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${filters.elements.includes(element.name) ? 'bg-blue-500/20 border border-blue-500/50 text-blue-300' : 'bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-600'}`}
                                >
                                    {filters.rarities.includes(element.name) && (
                                        <Check size={16} className="text-blue-400"/>
                                    )}
                                    {element.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-lg font-semibold text-purple-300 mb-3 flex items-center gap-2">
                            <span className="text-purple-400">
                                <Route className="text-purple-400"/>
                            </span> Path
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {PATHS.map((path) => (
                                <button
                                key={path.id}
                                onClick={() => handlePathChange(path.name)}
                                    className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${filters.paths.includes(path.name) ? 'bg-purple-500/20 border border-purple-500/50 text-purple-300' : 'bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-600'}`}
                                >
                                    {filters.rarities.includes(path.name) && (
                                        <Check size={16} className="text-purple-400"/>
                                    )}
                                    {path.label}
                                </button>
                            ))}
                        </div>
                    </div>

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
                                    <span key={`rarity-${rarity}`} className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-sm flex items-center gap-1">
                                        {rarity === 5 ? "5★" : "4★"}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRarityChange(rarity);
                                            }}
                                            className="ml-1 hover:text-amber-200"
                                        >
                                            X
                                        </button>
                                    </span>
                                ))}
                                {filters.elements.map((element) => (
                                    <span key={`element-${element}`} className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center gap-1">
                                        {element}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleElementChange(element);
                                            }}
                                            className="ml-1 hover:text-blue-200"
                                        >
                                            X
                                        </button>
                                    </span>
                                ))}
                                {filters.paths.map((path) => (
                                    <span key={`path-${path}`} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm flex items-center gap-1">
                                        {path}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePathChange(path);
                                            }}
                                            className="ml-1 hover:text-purple-200"
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
    )
}

export default CharFilters;