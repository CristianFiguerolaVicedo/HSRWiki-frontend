import { useEffect, useState } from "react";
import { fetchJson } from "../services/apiClient";
import RelicsInfoCard from "../components/RelicsInfoCard";
import PlanarsInfoCard from "../components/PlanarsInfoCard";

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
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary">Relics</h1>
        <p className="font-hand text-3xl text-accent-red mt-1 -rotate-1 origin-left">
          {relics.length} relic sets and {planars.length} planar ornaments, in that order
        </p>
      </div>

      <div className="mb-6">
        {relics.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-text-primary flex items-baseline gap-3">
                Relic sets <span className="text-text-muted font-normal">({relics.length})</span>
                <span className="font-hand text-2xl font-normal text-text-secondary">head, hands, body and feet</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {relics.map((rel, i) => (
                <div key={rel.name} style={{ "--stagger-index": i }}>
                  <RelicsInfoCard relicSet={rel} />
                </div>
              ))}
            </div>
          </div>
        )}

        {planars.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4 border-t-2 border-dashed border-border-hover mt-10">
              <h2 className="text-2xl font-bold text-text-primary mt-6 flex items-baseline gap-3">
                Planar ornaments <span className="text-text-muted font-normal">({planars.length})</span>
                <span className="font-hand text-2xl font-normal text-text-secondary">a sphere and a rope</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
              {planars.map((pl, i) => (
                <div key={pl.name} style={{ "--stagger-index": i }}>
                  <PlanarsInfoCard planarSet={pl} />
                </div>
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
  )
}

export default Relics;
