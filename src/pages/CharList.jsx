import { useCallback, useMemo, useState } from "react";
import { useCharacters } from "../hooks/useCharacters";
import CharInfoCard from "../components/CharInfoCard";
import CharFilters from "../components/CharFilters";
import { useSectionReveal } from "../components/Layout";
import SkeletonLoader from "../components/SkeletonLoader";
import FavoritesToggle from "../components/FavoritesToggle";
import { useFavorites } from "../hooks/useFavorites";
import { useCollection } from "../hooks/useCollection";
import { OwnershipFilter } from "../components/Collection";

const CharList = () => {
  const { characters, loading, error } = useCharacters();
  const [filters, setFilters] = useState({
    elements: [],
    rarities: [],
    paths: [],
  });
  const [sortBy, setSortBy] = useState("name");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [ownership, setOwnership] = useState("all");
  const { owned } = useCollection("characters");
  const ownedCount = characters.filter((char) => String(char.id) in owned).length;
  const { ids: favIds } = useFavorites("characters");
  const { SectionReveal } = useSectionReveal();

  const filteredCharacters = useMemo(() => {
    return characters.filter((char) => {
      if (favoritesOnly && !favIds.includes(String(char.id))) return false;
      if (ownership === "owned" && !(String(char.id) in owned)) return false;
      if (ownership === "missing" && String(char.id) in owned) return false;
      if (filters.rarities.length > 0 && !filters.rarities.includes(char.rarity)) return false;
      if (filters.elements.length > 0 && !filters.elements.includes(char.element)) return false;
      if (filters.paths.length > 0 && !filters.paths.includes(char.path)) return false;
      return true;
    });
  }, [characters, filters, favoritesOnly, favIds, ownership, owned]);

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
    return <SkeletonLoader type="card" count={8} />;
  }

  if (error) {
    return (
      <div className="glass-panel p-8 max-w-xl text-text-primary" role="alert">
        <p className="font-hand text-3xl text-accent-red mb-2">the Express lost signal</p>
        <p className="text-text-secondary mb-4">
          Couldn't load the characters from the server ({error.message || "no response"}). It may still be waking up: try again in a moment.
        </p>
        <button type="button" onClick={() => window.location.reload()}
          className="px-4 py-2 rounded-lg font-semibold bg-text-primary text-bg-card hover:opacity-90">
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="text-text-primary rounded-xl">
      <SectionReveal>
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary">
            Characters
          </h1>
          <p className="font-hand text-3xl text-accent-red mt-1 -rotate-1 origin-left">
            everyone we've met along the rails, {characters.length} so far
          </p>
        </div>
      </SectionReveal>

      <div className="mb-6">
        <CharFilters onFilterChange={handleFilterChange} initialFilters={filters} />

        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <FavoritesToggle active={favoritesOnly} count={favIds.length} onChange={setFavoritesOnly} />
            <OwnershipFilter value={ownership} onChange={setOwnership} ownedCount={ownedCount} total={characters.length} />
            <span className="text-text-secondary ml-2">Sort by:</span>
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


      {favoritesOnly && favIds.length === 0 && (
        <div className="glass-panel p-10 text-center mb-8">
          <p className="font-hand text-3xl text-accent-red mb-2">no favorites yet</p>
          <p className="text-text-secondary">Tap the heart on any card to keep it here.</p>
        </div>
      )}

      {sortedCharacters.length === 0 && !(favoritesOnly && favIds.length === 0) && (
        <div className="glass-panel p-12 text-center mb-8 animate-fade-in">
          <div className="text-5xl mb-4 opacity-50">◆</div>
          <h3 className="text-2xl font-bold mb-3 text-text-primary">No characters found</h3>
          <p className="text-text-secondary mb-4">No characters match your current filter settings.</p>
          <button
            onClick={() => { setFilters({ elements: [], paths: [], rarities: [] }); setFavoritesOnly(false); setOwnership("all"); }}
            className="px-6 py-3 bg-accent-cyan/20 text-accent-cyan rounded-lg border border-accent-cyan/30 hover:bg-accent-cyan/30 transition-all"
          >
            Clear all filters
          </button>
        </div>
      )}

      {trailblazers.length > 0 && (
        <SectionReveal>
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold flex items-baseline gap-3 text-text-primary">
                <span>The Trailblazer</span>
                <span className="font-hand text-2xl font-normal text-text-secondary">that's you, in {trailblazers.length} {trailblazers.length === 1 ? "form" : "forms"}</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-9 pt-3">
              {trailblazers.map((char) => (
                <CharInfoCard key={char.id} char={char} />
              ))}
            </div>
          </div>
        </SectionReveal>
      )}

      {regularChars.length > 0 && (
        <SectionReveal>
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-text-primary">Travel companions <span className="text-text-muted font-normal">({regularChars.length})</span></h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-9 pt-3">
              {regularChars.map((char, i) => (
                <div key={char.id} style={{ "--stagger-index": i }}>
                  <CharInfoCard char={char} />
                </div>
              ))}
            </div>
          </div>
        </SectionReveal>
      )}

      <SectionReveal>
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
      </SectionReveal>
    </div>
  );
};

export default CharList;
