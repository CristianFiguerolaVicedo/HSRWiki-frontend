import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import LightconeInfoCard from "../components/LightconeInfoCard";
import LightconeFilters from "../components/LightconeFilters";
import Sidebar from '../components/Sidebar'

const API_URL = "http://localhost:8080/";

const Lightcones = () => {
  const [lightcones, setLightcones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    paths: [],
    rarities: [],
  });
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchLightcones = async () => {
      try {
        const response = await axios.get(`${API_URL}api/lightcones`);
        if (response.status === 200) {
          setLightcones(response.data);
        }
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
      if (
        filters.rarities.length > 0 &&
        !filters.rarities.includes(lc.rarity)
      ) {
        return false;
      }

      if (filters.paths.length > 0 && !filters.paths.includes(lc.path)) {
        return false;
      }

      return true;
    });
  }, [lightcones, filters]);

  const sortedLightcones = useMemo(() => {
    const lightcones = [...filteredLightcones];

    switch (sortBy) {
      case "rarity":
        return lightcones.sort((a, b) => b.rarity - a.rarity);
      case "path":
        return lightcones.sort((a, b) => a.path.localeCompare(b.path));
      case "name":
      default:
        return lightcones.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [filteredLightcones, sortBy]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white text-xl">Loading lightcones...</div>
      </div>
    );
  }

  return (
    <div className="text-white rounded-xl">
      <div className="flex">
        <Sidebar/>
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto bg-[#E1D9BC] px-8 py-5 rounded-lg">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-[#30364F] mb-2">
                Light Cone List
              </h1>
              <p className="text-[#30364F]">
                Browse through all of the {lightcones.length} available light
                cones.
              </p>
            </div>

            <div className="mb-6">
              <LightconeFilters
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />

              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-[#30364F]">Sort By:</span>
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="rarity">Rarity (High to Low)</option>
                    <option value="path">Path</option>
                  </select>
                </div>

                <div className="text-[#30364F]">
                  Showing{" "}
                  <span className="text-[#30364F] font-semibold">
                    {sortedLightcones.length}
                  </span>{" "}
                  lightcones
                </div>
              </div>
            </div>

            {sortedLightcones.length === 0 && (
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center mb-8">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-300">
                  No lightcones found
                </h3>
                <p className="text-gray-400 mb-4">
                  No lightcones match your current filter settings.
                </p>
                <button
                  onClick={() => setFilters({ paths: [], rarities: [] })}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {sortedLightcones.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-[#30364F]">
                    Light Cones ({sortedLightcones.length})
                  </h2>
                  {sortedLightcones.length > 0 && (
                    <span className="text-sm text-[#30364F] px-3 py-1 bg-gray-800/50 rounded-full">
                      Available Light Cones
                    </span>
                  )}
                </div>

                {sortedLightcones.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No Light Cones available
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    {sortedLightcones.map((lc) => (
                      <LightconeInfoCard key={lc.id} lightcone={lc} />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="flex flex-wrap justify-center gap-6 text-center text-gray-400">
                <div>
                  <div className="text-2xl font-bold text-white">
                    {sortedLightcones.length}
                  </div>
                  <div className="text-sm text-[#30364F]">Total Lightcones</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-300">
                    {sortedLightcones.filter((lc) => lc.rarity === 5).length}
                  </div>
                  <div className="text-sm text-[#30364F]">5★ Light Cones</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-500">
                    {sortedLightcones.filter((lc) => lc.rarity === 4).length}
                  </div>
                  <div className="text-sm text-[#30364F]">4★ Light Cones</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">
                    {sortedLightcones.filter((lc) => lc.rarity === 3).length}
                  </div>
                  <div className="text-sm text-[#30364F]">3★ Light Cones</div>
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
