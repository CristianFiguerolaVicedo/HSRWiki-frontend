import { useState } from "react";
import { FACTIONS } from "../util/util";
import FactionInfoCard from "../components/FactionInfoCard";

const Factions = () => {
  const [factions] = useState(FACTIONS);

  return (
    <div className="text-text-primary rounded-xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gradient mb-2">Factions</h1>
        <p className="text-text-secondary">Browse through all factions in Honkai: Star Rail.</p>
      </div>
      {factions.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold flex items-center gap-2 text-text-primary">
              <span>Factions</span>
              <span className="text-sm text-text-muted">({factions.length} factions)</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
            {factions.map((fc) => (
              <FactionInfoCard key={fc.id} faction={fc} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Factions;
