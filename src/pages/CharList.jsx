import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import CharInfoCard from "../components/CharInfoCard";
import CharFilters from "../components/CharFilters";
import Sidebar from "../components/Sidebar";

const CharList = () => {
  const [characters, setCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    elements: [],
    rarities: [],
    paths: [],
  });
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    const fetchChars = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/characters"
        );
        if (response.status === 200) {
          const sortedChars = [...response.data].sort((a, b) =>
            a.name.localeCompare(b.name)
          );
          setCharacters(sortedChars);
        }
      } catch (error) {
        console.error("Something went wrong", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChars();
  }, []);

  const filteredCharacters = useMemo(() => {
    return characters.filter((char) => {
      if (
        filters.rarities.length > 0 &&
        !filters.rarities.includes(char.rarity)
      ) {
        return false;
      }

      if (
        filters.elements.length > 0 &&
        !filters.elements.includes(char.element)
      ) {
        return false;
      }

      if (filters.paths.length > 0 && !filters.paths.includes(char.path)) {
        return false;
      }

      return true;
    });
  }, [characters, filters]);

  const sortedCharacters = useMemo(() => {
    const chars = [...filteredCharacters];

    switch (sortBy) {
      case "rarity":
        return chars.sort((a, b) => b.rarity - a.rarity);
      case "element":
        return chars.sort((a, b) => a.element.localeCompare(b.element));
      case "path":
        return chars.sort((a, b) => a.path.localeCompare(b.path));
      case "name":
      default:
        return chars.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [filteredCharacters, sortBy]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const trailblazers = sortedCharacters.filter((char) =>
    char.name.includes("Trailblazer")
  );

  const regularChars = sortedCharacters.filter(
    (char) => !char.name.includes("Trailblazer")
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-white text-xl">Loading characters...</div>
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
                Honkai Star Rail Characters
              </h1>
              <p className="text-[#30364F]">
                Browse through all available characters.{" "}
                {sortedCharacters.length} of {characters.length} characters
                shown.
              </p>
            </div>

            <div className="mb-6">
              <CharFilters
                onFilterChange={handleFilterChange}
                initialFilters={filters}
              />

              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-[#30364F]">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="bg-[#30364F] border border-[#E1D9BC] text-[#E1D9BC] rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="rarity">Rarity (High to Low)</option>
                    <option value="element">Element</option>
                    <option value="path">Path</option>
                  </select>
                </div>

                <div className="text-[#30364F]">
                  Showing{" "}
                  <span className="text-[#30364F] font-semibold">
                    {sortedCharacters.length}
                  </span>{" "}
                  characters
                </div>
              </div>
            </div>

            {sortedCharacters.length === 0 && (
              <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-12 border border-gray-700 text-center mb-8">
                <div className="text-5xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold mb-3 text-gray-300">
                  No characters found
                </h3>
                <p className="text-gray-400 mb-4">
                  No characters match your current filter settings.
                </p>
                <button
                  onClick={() =>
                    setFilters({ elements: [], paths: [], rarities: [] })
                  }
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {trailblazers.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <span className="text-[#30364F]">
                      Trailblazer
                    </span>
                    <span className="text-sm text-[#30364F]">
                      ({trailblazers.length} variants)
                    </span>
                  </h2>
                  <span className="text-sm text-[#30364F] px-3 py-1 bg-gray-800/50 rounded-full">
                    Main Character
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {trailblazers.map((char) => (
                    <CharInfoCard key={char.id} char={char} />
                  ))}
                </div>
              </div>
            )}

            {regularChars.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-[#30364F]">
                    Characters ({regularChars.length})
                  </h2>
                  {regularChars.length > 0 && (
                    <span className="text-sm text-[#30364F] px-3 py-1 bg-gray-800/50 rounded-full">
                      Playable Characters
                    </span>
                  )}
                </div>

                {regularChars.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    No regular characters match the current filters.
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {regularChars.map((char) => (
                      <CharInfoCard key={char.id} char={char} />
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-800">
              <div className="flex flex-wrap justify-center gap-6 text-center text-gray-400">
                <div>
                  <div className="text-2xl font-bold text-white">
                    {characters.length}
                  </div>
                  <div className="text-sm text-[#30364F]">Total Characters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-amber-300">
                    {characters.filter((c) => c.rarity === 5).length}
                  </div>
                  <div className="text-sm text-[#30364F]">5★ Characters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-500">
                    {characters.filter((c) => c.rarity === 4).length}
                  </div>
                  <div className="text-sm text-[#30364F]">4★ Characters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-300">
                    {new Set(characters.map((c) => c.element)).size}
                  </div>
                  <div className="text-sm text-[#30364F]">Elements</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-500">
                    {new Set(characters.map((c) => c.path)).size}
                  </div>
                  <div className="text-sm text-[#30364F]">Paths</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CharList;
