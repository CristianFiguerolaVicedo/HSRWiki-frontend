import { useEffect, useMemo, useState } from "react";
import { fetchJson } from "../services/apiClient";
import LightconeInfoCard from "../components/LightconeInfoCard";
import LightconeFilters from "../components/LightconeFilters";
import Sidebar from '../components/Sidebar'
import SkeletonLoader from "../components/SkeletonLoader"

const Lightcones = () => {
  const [lightcones, setLightcones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ paths: [], rarities: [] });
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchLightcones = async () => {
      try {
        const data = await fetchJson("/lightcones");
        setLightcones(data);
      } catch (error) {
        console.error("Something went wrong", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLightcones();
  }, []);

  const filteredLightcones = useMemo(() => {
    return lightcones.filter((lc) => {
      if (filters.rarities.length > 0 && !filters.rarities.includes(lc.rarity)) return false;
      if (filters.paths.length > 0 && !filters.paths.includes(lc.path)) return false;
      return true;
    });
  }, [lightcones, filters]);

  const sortedLightcones = useMemo(() => {
    const cones = [...filteredLightcones];
    switch (sortBy) {
      case "rarity": return cones.sort((a, b) => b.rarity - a.rarity);
      case "path": return cones.sort((a, b) => a.path.localeCompare(b.path));
      case "name":
      default: return cones.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [filteredLightcones, sortBy]);

  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const handleSortChange = (e) => setSortBy(e.target.value);

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <SkeletonLoader type="card" count={8} />
        </main>
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
              <h1 className="text-4xl font-bold text-text-primary mb-2">Light Cone List</h1>
              <p className="text-text-secondary">Browse through all of the {lightcones.length} available light cones.</p>
            </div>

            <div className="mb-6">
              <LightconeFilters onFilterChange={handleFilterChange} initialFilters={filters} />

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
                    <option value="path">Path</option>
                  </select>
                </div>
                <div className="text-text-secondary">
                  Showing <span className="text-text-primary font-semibold">{sortedLightcones.length}</span> lightcones
                </div>
              </div>
            </div>

            {sortedLightcones.length === 0 && (
              <div className="glass-panel p-12 text-center mb-8 animate-fade-in">
                <div className="text-5xl mb-4 opacity-50">◆</div>
                <h3 className="text-2xl font-bold mb-3 text-text-primary">No lightcones found</h3>
                <p className="text-text-secondary mb-4">No lightcones match your current filter settings.</p>
                <button onClick={() => setFilters({ paths: [], rarities: [] })}
                  className="px-6 py-3 bg-accent-cyan/20 text-accent-cyan rounded-lg border border-accent-cyan/30 hover:bg-accent-cyan/30 transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {sortedLightcones.length > 0 && (
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-text-primary">Light Cones ({sortedLightcones.length})</h2>
                  <span className="text-sm text-text-secondary px-3 py-1 bg-bg-elevated rounded-full border border-border">
                    Available Light Cones
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                  {sortedLightcones.map((lc) => (
                    <LightconeInfoCard key={lc.id} lightcone={lc} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-wrap justify-center gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-text-primary">{sortedLightcones.length}</div>
                  <div className="text-sm text-text-secondary">Total Lightcones</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-gold">{sortedLightcones.filter((lc) => lc.rarity === 5).length}</div>
                  <div className="text-sm text-text-secondary">5★ Light Cones</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-purple">{sortedLightcones.filter((lc) => lc.rarity === 4).length}</div>
                  <div className="text-sm text-text-secondary">4★ Light Cones</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-400">{sortedLightcones.filter((lc) => lc.rarity === 3).length}</div>
                  <div className="text-sm text-text-secondary">3★ Light Cones</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Lightcones;
