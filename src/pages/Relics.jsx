import { useEffect, useState } from "react";
import { fetchJson } from "../services/apiClient";
import RelicsInfoCard from "../components/RelicsInfoCard";
import PlanarsInfoCard from "../components/PlanarsInfoCard";
import Sidebar from '../components/Sidebar'

const Relics = () => {
  const [relics, setRelics] = useState([]);
  const [planars, setPlanars] = useState([]);
  const [loading, setLoading] = useState(false);

  const isRelicSet = (setData) => {
    if (!setData.pieces) return false;
    const piecesKey = Object.keys(setData.pieces);
    const relicPiecesNames = ["Head", "Hands", "Body", "Feet"];
    return piecesKey.some(key =>
      relicPiecesNames.includes(key) ||
      key.includes("Head") || key.includes("Hand") ||
      key.includes("Body") || key.includes("Foot") || key.includes("Feet")
    );
  };

  const isPlanarSet = (setData) => {
    if (!setData.pieces) return false;
    const piecesKey = Object.keys(setData.pieces);
    const relicPiecesNames = ["Planar Sphere", "Link Rope"];
    return piecesKey.some(key =>
      relicPiecesNames.includes(key) || key.includes("Sphere") || key.includes("Rope")
    );
  };

  useEffect(() => {
    const separateRelicsPlanars = (sets) => {
      const relicList = [];
      const planarList = [];
      sets.forEach((setData) => {
        if (isRelicSet(setData)) relicList.push(setData);
        else if (isPlanarSet(setData)) planarList.push(setData);
      });
      setRelics(relicList);
      setPlanars(planarList);
    };

    const fetchRelicData = async () => {
      setLoading(true);
      try {
        const data = await fetchJson("/relics");
        separateRelicsPlanars(data);
      } catch (error) {
        console.error("Something went wrong", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRelicData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-text-primary text-xl">Loading...</div>
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
              <h1 className="text-4xl font-bold text-text-primary mb-2">Relic and Planar Sets List</h1>
              <p className="text-text-secondary">
                Browse through all of the {relics.length} available relic sets and {planars.length} available planar sets.
              </p>
            </div>

            <div className="mb-6">
              {relics.length > 0 && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-text-primary">Relic Sets ({relics.length})</h2>
                    <span className="text-sm text-text-secondary px-3 py-1 bg-bg-elevated rounded-full border border-border">
                      Available Relic Sets
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    {relics.map((rel) => (
                      <RelicsInfoCard key={rel.name} relicSet={rel} />
                    ))}
                  </div>
                </div>
              )}

              {planars.length > 0 && (
                <div className="animate-fade-in">
                  <div className="flex items-center justify-between mb-4 border-t border-border mt-6">
                    <h2 className="text-2xl font-bold text-text-primary mt-6">Planar Sets ({planars.length})</h2>
                    <span className="text-sm text-text-secondary px-3 py-1 bg-bg-elevated rounded-full border border-border mt-6">
                      Available Planar Sets
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                    {planars.map((pl) => (
                      <PlanarsInfoCard key={pl.name} planarSet={pl} />
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex flex-wrap justify-center gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-text-primary">{relics.length}</div>
                    <div className="text-sm text-text-secondary">Total Relic Sets</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-text-primary">{planars.length}</div>
                    <div className="text-sm text-text-secondary">Total Planar Sets</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Relics;
