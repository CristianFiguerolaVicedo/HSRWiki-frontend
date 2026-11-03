import { useState } from "react";
import { FACTIONS } from "../util/util";
import FactionInfoCard from "../components/FactionInfoCard";

const Factions = () => {
  const [factions] = useState(FACTIONS);

  return (
    <div className="text-text-primary rounded-xl">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary">Factions</h1>
        <p className="font-hand text-3xl text-accent-red mt-1 -rotate-1 origin-left">who works with whom across the stars</p>
      </div>
      {factions.length > 0 && (
        <div className="mb-8">

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10 pt-3">
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
