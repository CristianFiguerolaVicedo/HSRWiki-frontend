import { useEffect, useMemo, useState } from "react";
import { fetchJson } from "../services/apiClient";
import ItemInfoCard from "../components/ItemInfoCard";
import ItemFilters from "../components/ItemFilters";
import Sidebar from '../components/Sidebar';
import { ChevronDown, ChevronRight } from "lucide-react";

const Items = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ types: [], subTypes: [], rarities: [] });
  const [sortBy, setSortBy] = useState("name");
  const [expandedTypes, setExpandedTypes] = useState({});

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const data = await fetchJson("/items");
        setItems(data);
      } catch (error) {
        console.error("Something went wrong", error);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  const availableTypes = useMemo(() => {
    const types = new Set();
    items.forEach(item => { if (item.type) types.add(item.type); });
    return Array.from(types).sort();
  }, [items]);

  const availableSubTypes = useMemo(() => {
    const subTypes = new Set();
    items.forEach(item => { if (item.subType) subTypes.add(item.subType); });
    return Array.from(subTypes).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      if (filters.rarities.length > 0 && !filters.rarities.includes(item.rarity)) return false;
      if (filters.types.length > 0 && !filters.types.includes(item.type)) return false;
      if (filters.subTypes.length > 0 && !filters.subTypes.includes(item.subType)) return false;
      return true;
    });
  }, [items, filters]);

  const sortedItems = useMemo(() => {
    const itemsArray = [...filteredItems];
    switch (sortBy) {
      case "rarity":
        return itemsArray.sort((a, b) => b.rarity - a.rarity);
      case "type":
        return itemsArray.sort((a, b) => {
          const typeCompare = (a.type || '').localeCompare(b.type || '');
          if (typeCompare === 0) return (a.subType || '').localeCompare(b.subType || '');
          return typeCompare;
        });
      case "name":
      default:
        return itemsArray.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [filteredItems, sortBy]);

  const groupedItems = useMemo(() => {
    const groups = {};
    sortedItems.forEach(item => {
      const type = item.type || 'Other';
      const subType = item.sub_type || 'No Subtype';
      if (!groups[type]) {
        groups[type] = { name: type, expanded: expandedTypes[type] || false, subGroups: {} };
      }
      if (!groups[type].subGroups[subType]) {
        groups[type].subGroups[subType] = {
          name: subType, expanded: expandedTypes[`${type}-${subType}`] || false, items: []
        };
      }
      groups[type].subGroups[subType].items.push(item);
    });
    return groups;
  }, [sortedItems, expandedTypes]);

  const toggleTypeExpansion = (type) => {
    setExpandedTypes(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const toggleSubTypeExpansion = (type, subType) => {
    const key = `${type}-${subType}`;
    setExpandedTypes(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const handleSortChange = (e) => setSortBy(e.target.value);
  const clearAllFilters = () => setFilters({ types: [], subTypes: [], rarities: [] });

  const stats = useMemo(() => {
    const rarityCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    items.forEach(item => { if (item.rarity && rarityCounts[item.rarity] !== undefined) rarityCounts[item.rarity]++; });
    return { totalItems: items.length, totalFiltered: filteredItems.length, rarityCounts };
  }, [items, filteredItems]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-text-primary text-xl">Loading items...</div>
      </div>
    );
  }

  return (
    <div className="text-text-primary rounded-xl">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold text-text-primary mb-2">Items List</h1>
              <p className="text-text-secondary">Browse through all of the {stats.totalItems} available items.</p>
            </div>

            <div className="mb-6">
              <ItemFilters
                onFilterChange={handleFilterChange}
                initialFilters={filters}
                availableTypes={availableTypes}
                availableSubTypes={availableSubTypes}
              />

              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="bg-bg-card border border-border text-text-primary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="rarity">Rarity (High to Low)</option>
                    <option value="type">Type</option>
                  </select>
                </div>
                <div className="text-text-secondary">
                  Showing <span className="text-text-primary font-semibold">{sortedItems.length}</span> items
                </div>
              </div>
            </div>

            {sortedItems.length === 0 && (
              <div className="glass-panel p-12 text-center mb-8 animate-fade-in">
                <div className="text-5xl mb-4 opacity-50">◆</div>
                <h3 className="text-2xl font-bold mb-3 text-text-primary">No items found</h3>
                <p className="text-text-secondary mb-4">No items match your current filter settings.</p>
                <button onClick={clearAllFilters}
                  className="px-6 py-3 bg-accent-cyan/20 text-accent-cyan rounded-lg border border-accent-cyan/30 hover:bg-accent-cyan/30 transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {sortedItems.length > 0 && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-text-primary">Items ({sortedItems.length})</h2>
                  <span className="text-sm text-text-secondary px-3 py-1 bg-bg-elevated rounded-full border border-border">
                    Available Items
                  </span>
                </div>

                <div className="space-y-6">
                  {Object.keys(groupedItems).sort().map(type => {
                    const group = groupedItems[type];
                    const subTypes = Object.keys(group.subGroups).sort();
                    return (
                      <div key={type} className="glass-panel overflow-hidden animate-fade-in">
                        <button
                          onClick={() => toggleTypeExpansion(type)}
                          className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-bg-card to-bg-primary hover:from-bg-elevated hover:to-bg-card transition-all"
                        >
                          <div className="flex items-center gap-3">
                            {group.expanded ? (
                              <ChevronDown className="text-text-primary" size={20} />
                            ) : (
                              <ChevronRight className="text-text-primary" size={20} />
                            )}
                            <div className="text-left">
                              <h3 className="text-xl font-bold text-text-primary">{group.name}</h3>
                              <div className="text-sm text-text-secondary">
                                {subTypes.length} sub-type{subTypes.length !== 1 ? 's' : ''} &bull;{' '}
                                {sortedItems.filter(item => item.type === type).length} item{sortedItems.filter(item => item.type === type).length !== 1 ? 's' : ''}
                              </div>
                            </div>
                          </div>
                        </button>

                        {group.expanded && (
                          <div className="p-4 bg-bg-primary/50 space-y-4">
                            {subTypes.map(subType => {
                              const subGroup = group.subGroups[subType];
                              return (
                                <div key={`${type}-${subType}`} className="bg-bg-card/50 rounded-lg overflow-hidden">
                                  <button
                                    onClick={() => toggleSubTypeExpansion(type, subType)}
                                    className="w-full flex items-center justify-between p-3 hover:bg-bg-elevated/50 transition-all"
                                  >
                                    <div className="flex items-center gap-2">
                                      {subGroup.expanded ? (
                                        <ChevronDown className="text-text-secondary" size={16} />
                                      ) : (
                                        <ChevronRight className="text-text-secondary" size={16} />
                                      )}
                                      <div className="text-left">
                                        <h4 className="font-medium text-text-primary">{subType}</h4>
                                        <div className="text-xs text-text-secondary">
                                          {subGroup.items.length} item{subGroup.items.length !== 1 ? 's' : ''}
                                        </div>
                                      </div>
                                    </div>
                                  </button>

                                  {subGroup.expanded && (
                                    <div className="p-4 pt-3">
                                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                        {subGroup.items.map((item) => (
                                          <ItemInfoCard key={item.id} item={item} />
                                        ))}
                                      </div>
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
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-wrap justify-center gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-text-primary">{sortedItems.length}</div>
                  <div className="text-sm text-text-secondary">Filtered Items</div>
                </div>
                {Object.keys(stats.rarityCounts).map(rarity => (
                  <div key={rarity}>
                    <div className={`text-2xl font-bold ${
                      rarity === '5' ? 'text-accent-gold' :
                      rarity === '4' ? 'text-accent-purple' :
                      rarity === '3' ? 'text-blue-400' :
                      rarity === '2' ? 'text-green-400' :
                      'text-text-muted'
                    }`}>{stats.rarityCounts[rarity]}</div>
                    <div className="text-sm text-text-secondary">{rarity}★ Items</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Items;
