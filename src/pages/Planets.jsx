import { useState } from "react";
import { PLANETS_DATA } from "../util/util";
import PlanetInfoCard from "../components/PlanetInfoCard";

const Planets = () => {
  const [planets] = useState(PLANETS_DATA);

  return (
    <div className="text-text-primary rounded-xl">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary">Planets</h1>
        <p className="font-hand text-3xl text-accent-red mt-1 -rotate-1 origin-left">every stop the Express has made so far</p>
      </div>
      {planets.length > 0 && (
        <div className="mb-8">

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-10 pt-3">
            {planets.map((pl) => (
              <PlanetInfoCard key={pl.id} planet={pl} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Planets;
