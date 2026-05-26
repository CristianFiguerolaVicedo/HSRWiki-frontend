import { useCallback, useMemo, useState } from "react";
import { useCharacters } from "../hooks/useCharacters";
import CharInfoCard from "../components/CharInfoCard";
import CharFilters from "../components/CharFilters";
import Sidebar from "../components/Sidebar";
import SkeletonLoader from "../components/SkeletonLoader";

const CharList = () => {
  const { characters, loading } = useCharacters();
  const [filters, setFilters] = useState({
    elements: [],
    rarities: [],
    paths: [],
  });
  const [sortBy, setSortBy] = useState("name");

  const filteredCharacters = useMemo(() => {
    return characters.filter((char) => {
      if (filters.rarities.length > 0 && !filters.rarities.includes(char.rarity)) return false;
      if (filters.elements.length > 0 && !filters.elements.includes(char.element)) return false;
      if (filters.paths.length > 0 && !filters.paths.includes(char.path)) return false;
      return true;
    });
  }, [characters, filters]);

  const sortedCharacters = useMemo(() => {
    const chars = [...filteredCharacters];
    switch (sortBy) {
      case "rarity": return chars.sort((a, b) => b.rarity - a.rarity);
      case "element": return chars.sort((a, b) => a.element.localeCompare(b.element));
      case "path": return chars.sort((a, b) => a.path.localeCompare(b.path));
      case "name":
      default: return chars.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [filteredCharacters, sortBy]);

  const handleFilterChange = useCallback((newFilters) => setFilters(newFilters), []);
  const handleSortChange = (e) => setSortBy(e.target.value);

  const trailblazers = sortedCharacters.filter((char) => char.name.includes("Trailblazer"));
  const regularChars = sortedCharacters.filter((char) => !char.name.includes("Trailblazer"));

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
              <h1 className="text-4xl font-bold text-text-primary mb-2">
                Honkai Star Rail Characters
              </h1>
              <p className="text-text-secondary">
                Browse through all available characters. {sortedCharacters.length} of {characters.length} characters shown.
              </p>
            </div>

            <div className="mb-6">
              <CharFilters onFilterChange={handleFilterChange} initialFilters={filters} />

              <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <span className="text-text-secondary">Sort by:</span>
                  <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="bg-bg-card border border-border text-text-primary rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-accent-cyan"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="rarity">Rarity (High to Low)</option>
                    <option value="element">Element</option>
                    <option value="path">Path</option>
                  </select>
                </div>

                <div className="text-text-secondary">
                  Showing <span className="text-text-primary font-semibold">{sortedCharacters.length}</span> characters
                </div>
              </div>
            </div>

            {sortedCharacters.length === 0 && (
              <div className="glass-panel p-12 text-center mb-8 animate-fade-in">
                <div className="text-5xl mb-4 opacity-50">◆</div>
                <h3 className="text-2xl font-bold mb-3 text-text-primary">No characters found</h3>
                <p className="text-text-secondary mb-4">No characters match your current filter settings.</p>
                <button
                  onClick={() => setFilters({ elements: [], paths: [], rarities: [] })}
                  className="px-6 py-3 bg-accent-cyan/20 text-accent-cyan rounded-lg border border-accent-cyan/30 hover:bg-accent-cyan/30 transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {trailblazers.length > 0 && (
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2 text-text-primary">
                    <span>Trailblazer</span>
                    <span className="text-sm text-text-muted">({trailblazers.length} variants)</span>
                  </h2>
                  <span className="text-sm text-text-secondary px-3 py-1 bg-bg-elevated rounded-full border border-border">
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
              <div className="animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-text-primary">Characters ({regularChars.length})</h2>
                  <span className="text-sm text-text-secondary px-3 py-1 bg-bg-elevated rounded-full border border-border">
                    Playable Characters
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {regularChars.map((char) => (
                    <CharInfoCard key={char.id} char={char} />
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex flex-wrap justify-center gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-text-primary">{characters.length}</div>
                  <div className="text-sm text-text-secondary">Total Characters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-gold">{characters.filter((c) => c.rarity === 5).length}</div>
                  <div className="text-sm text-text-secondary">5★ Characters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-purple">{characters.filter((c) => c.rarity === 4).length}</div>
                  <div className="text-sm text-text-secondary">4★ Characters</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-cyan">{new Set(characters.map((c) => c.element)).size}</div>
                  <div className="text-sm text-text-secondary">Elements</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent-red">{new Set(characters.map((c) => c.path)).size}</div>
                  <div className="text-sm text-text-secondary">Paths</div>
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
