import { useState } from "react";
import { PLANETS_DATA } from "../util/util";
import PlanetInfoCard from "../components/PlanetInfoCard";
import Sidebar from '../components/Sidebar'

const Planets = () => {
    const [planets] = useState(PLANETS_DATA);

    return (
        <div className="bg-gray-50/12 text-white rounded-xl">
            <div className="flex">
                <Sidebar/>
                <main className="flex-1 p-4 md:p-6">
                    <div className="max-w-7xl mx-auto bg-[#ACBAC4] px-8 py-5 rounded-lg">
                        {planets.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <span className="text-[#30364F]">
                                            Planets
                                        </span>
                                        <span className="text-sm text-[#30364F]">
                                            ({planets.length} planets)
                                        </span>
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                    {planets.map((pl) => (
                                        <PlanetInfoCard key={pl.id} planet={pl}/>
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