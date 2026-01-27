import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import Sidebar from '../components/Sidebar'
import ItemFilters from '../components/ItemFilters'
import { ChevronDown, ChevronRight } from "lucide-react";
import ItemInfoCard from '../components/ItemInfoCard'

const API_URL = "http://localhost:8080/";

const Items = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        rarities: [],
        types: [],
        sub_types: [],
    });
    const [sortBy, setSortBy] = useState("name");
    const [expandedSections, setExpandedSections] = useState({});
    const [sectionSortOrders, setSectionSortOrders] = useState({});


    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);

            try {
                const response = await axios.get(`${API_URL}api/items`);
                if (response.status === 200) {
                    setItems(response.data);
                }
            } catch (error) {
                console.error("Something went wrong", error);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const itemTypes = useMemo(() => {
        const types = new Set();
        const sub_types = new Set();

        items.forEach(item => {
            if (item.type) types.add(item.type);
            if (item.sub_type) sub_types.add(item.sub_type);
        });

        return {
            types: Array.from(types).sort(),
            subTypes: Array.from(sub_types).sort(),
        };
    }, [items]);

    const groupedItems = useMemo(() => {
        const groups = {};

        items.forEach(item => {
            const type = item.type || 'Other';
            const sub_type = item.sub_type || 'General';

            if (!groups[type]) {
                groups[type] = {
                    name: type,
                    subGroups: {},
                    expanded: expandedSections[type] || false
                };
            }

            if (!groups[type].subGroups[sub_type]) {
                groups[type].subGroups[sub_type] = {
                    name: sub_type,
                    items: [],
                    expanded: expandedSections[`${type}-${sub_type}`] || false,
                    sortOrder: sectionSortOrders[`${type}-${sub_type}`] || 'name'
                };
            }

            groups[type].subGroups[sub_type].items.push(item);
        });

        return groups;
    }, [items, expandedSections, sectionSortOrders]);

    const filteredGroupedItems = useMemo(() => {
        const filteredGroups = {};

        Object.keys(groupedItems).forEach(type => {
            filteredGroups[type] = {
                ...groupedItems[type],
                subGroups: {}
            };

            Object.keys(groupedItems[type].subGroups).forEach(subType => {
                const subGroup = groupedItems[type].subGroups[subType];
                
                const filteredItems = subGroup.items.filter((item) => {
                    if (filters.rarities.length > 0 && !filters.rarities.includes(item.rarity)) {
                        return false;
                    }
                    
                    if (filters.types.length > 0 && !filters.types.includes(item.type)) {
                        return false;
                    }
                    
                    if (filters.sub_types.length > 0 && !filters.sub_types.includes(item.sub_type)) {
                        return false;
                    }
                    
                    return true;
                });
                
                const sortedItems = [...filteredItems].sort((a, b) => {
                    const sortOrder = subGroup.sortOrder || 'name';
                    
                    switch (sortOrder) {
                        case "rarity":
                            return b.rarity - a.rarity;
                        case "name":
                        default:
                            return a.name.localeCompare(b.name);
                    }
                });
                
                if (sortedItems.length > 0) {
                    filteredGroups[type].subGroups[subType] = {
                        ...subGroup,
                        items: sortedItems
                    };
                }
            });
            
            if (Object.keys(filteredGroups[type].subGroups).length === 0) {
                delete filteredGroups[type];
            }
        });

        return filteredGroups;
    }, [groupedItems, filters]);

    const stats = useMemo(() => {
        const totalItems = items.length;
        const totalFiltered = Object.values(filteredGroupedItems).reduce((total, typeGroup) => {
            return total + Object.values(typeGroup.subGroups).reduce((subTotal, subGroup) => {
                return subTotal + subGroup.items.length;
            }, 0);
        }, 0);

        const rarityCounts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
        items.forEach(item => {
            if (item.rarity && rarityCounts[item.rarity] !== undefined) {
                rarityCounts[item.rarity]++;
            }
        });

        return {
            totalItems,
            totalFiltered,
            rarityCounts
        }
    }, [items, filteredGroupedItems]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    }

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
    }

    const toggleSection = (type, subType = null) => {
        const key = subType ? `${type}-${subType}` : type;
        setExpandedSections(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    }

    const toggleSubSectionSort = (type, subType) => {
        const key = `${type}-${subType}`;
        const currentSort = sectionSortOrders[key] || 'name';
        const newSort = currentSort === 'name' ? 'rarity' : 'name';
        setSectionSortOrders(prev => ({
            ...prev,
            [key]: newSort
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            rarities: [],
            types: [],
            subTypes: []
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-white text-xl">Loading items...</div>
            </div>
        );
    }


    return (
        <div className="text-white rounded-xl">
            <div className="flex">
                <Sidebar />
                <main className="flex-1 p-4 md:p-6">
                    <div className="max-w-7xl mx-auto bg-[#E1D9BC] px-8 py-5 rounded-lg">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-[#30364F] mb-2">
                                Items List
                            </h1>
                            <p className="text-[#30364F]">
                                Browse through all of the {stats.totalItems} available items.
                            </p>
                        </div>

                        <div className="mb-6">
                            <ItemFilters 
                                onFilterChange={handleFilterChange}
                                initialFilters={filters}
                                availableTypes={itemTypes.types}
                                availableSubTypes={itemTypes.subTypes}
                            />

                            <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-[#30364F]">Default Sort:</span>
                                    <select
                                        value={sortBy}
                                        onChange={handleSortChange}
                                        className="bg-[#30364F] border border-[#E1D9BC] text-[#E1D9BC] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="name">Name (A-Z)</option>
                                        <option value="rarity">Rarity (High to Low)</option>
                                    </select>
                                </div>

                                <div className="text-[#30364F]">
                                    Showing{" "}
                                    <span className="text-[#30364F] font-semibold">
                                        {stats.totalFiltered}
                                    </span>{" "}
                                    items
                                </div>
                            </div>
                        </div>

                        {stats.totalFiltered === 0 && (
                            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center mb-8">
                                <div className="text-5xl mb-4">🔍</div>
                                <h3 className="text-2xl font-bold mb-3 text-gray-300">
                                    No items found
                                </h3>
                                <p className="text-gray-400 mb-4">
                                    No items match your current filter settings
                                </p>
                                <button 
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                                    onClick={clearAllFilters}
                                >
                                    Clear all filters
                                </button>
                            </div>
                        )}

                        {stats.totalFiltered > 0 && (
                            <div className="space-y-6">
                                {Object.keys(filteredGroupedItems).sort().map(type => {
                                    const typeGroup = filteredGroupedItems[type];
                                    const typeItemCount = Object.values(typeGroup.subGroups).reduce((total, subGroup) => total + subGroup.items.length, 0);
                                    
                                    return (
                                        <div key={type} className="bg-white/10 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
                                            <button
                                                onClick={() => toggleSection(type)}
                                                className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 transition-all"
                                            >
                                                <div className="flex items-center gap-3">
                                                    {expandedSections[type] ? (
                                                        <ChevronDown className="text-blue-400" size={20} />
                                                    ) : (
                                                        <ChevronRight className="text-blue-400" size={20} />
                                                    )}
                                                    <div className="text-left">
                                                        <h3 className="text-xl font-bold text-blue-300">
                                                            {type}
                                                        </h3>
                                                        <div className="text-sm text-gray-400">
                                                            {typeItemCount} item{typeItemCount !== 1 ? 's' : ''}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                                                        {Object.keys(typeGroup.subGroups).length} category{Object.keys(typeGroup.subGroups).length !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                            </button>
                                            
                                            {expandedSections[type] && (
                                                <div className="p-4 bg-gray-900/50">
                                                    {Object.keys(typeGroup.subGroups).sort().map(subType => {
                                                        const subGroup = typeGroup.subGroups[subType];
                                                        
                                                        return (
                                                            <div key={subType} className="mb-6 last:mb-0">
                                                                <div className="flex items-center justify-between mb-4">
                                                                    <div className="flex items-center gap-2">
                                                                        <button
                                                                            onClick={() => toggleSection(type, subType)}
                                                                            className="flex items-center gap-2 text-left"
                                                                        >
                                                                            {expandedSections[`${type}-${subType}`] ? (
                                                                                <ChevronDown className="text-green-400" size={16} />
                                                                            ) : (
                                                                                <ChevronRight className="text-green-400" size={16} />
                                                                            )}
                                                                            <h4 className="text-lg font-semibold text-green-300">
                                                                                {subType}
                                                                            </h4>
                                                                            <span className="px-2 py-0.5 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                                                                                {subGroup.items.length}
                                                                            </span>
                                                                        </button>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => toggleSubSectionSort(type, subType)}
                                                                        className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-lg text-sm hover:bg-gray-600/50 transition-colors"
                                                                    >
                                                                        Sort: {sectionSortOrders[`${type}-${subType}`] === 'rarity' ? 'Rarity' : 'Name'}
                                                                    </button>
                                                                </div>
                                                                
                                                                {expandedSections[`${type}-${subType}`] && (
                                                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                                        {subGroup.items.map((item) => (
                                                                            <ItemInfoCard key={item.id} item={item} />
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-800">
                            <div className="flex flex-wrap justify-center gap-6 text-center text-gray-400">
                                <div>
                                    <div className="text-2xl font-bold text-white">
                                        {stats.totalItems}
                                    </div>
                                    <div className="text-sm text-[#30364F]">Total Items</div>
                                </div>
                                {Object.keys(stats.rarityCounts).map(rarity => (
                                    <div key={rarity}>
                                        <div className={`text-2xl font-bold ${
                                            rarity === '5' ? 'text-amber-300' :
                                            rarity === '4' ? 'text-purple-500' :
                                            rarity === '3' ? 'text-blue-500' :
                                            rarity === '2' ? 'text-green-500' :
                                            'text-gray-300'
                                        }`}>
                                            {stats.rarityCounts[rarity]}
                                        </div>
                                        <div className="text-sm text-[#30364F]">{rarity}★ Items</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Items;