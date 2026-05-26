import { useState } from "react";
import { PLANETS_DATA } from "../util/util";
import PlanetInfoCard from "../components/PlanetInfoCard";
import Sidebar from '../components/Sidebar'

const Planets = () => {
  const [planets] = useState(PLANETS_DATA);

  return (
    <div className="text-text-primary rounded-xl">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold text-text-primary mb-2">Planets</h1>
              <p className="text-text-secondary">Explore the worlds of Honkai: Star Rail.</p>
            </div>
            {planets.length > 0 && (
              <div className="mb-8 animate-fade-in">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold flex items-center gap-2 text-text-primary">
                    <span>Planets</span>
                    <span className="text-sm text-text-muted">({planets.length} planets)</span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {planets.map((pl) => (
                    <PlanetInfoCard key={pl.id} planet={pl} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Planets;
