import { useState } from "react";
import { FACTIONS } from "../util/util";
import FactionInfoCard from "../components/FactionInfoCard";
import Sidebar from "../components/Sidebar";

const Factions = () => {
    const [factions] = useState(FACTIONS);

    return (
        <div className="text-white rounded-xl">
            <div className="flex">
                <Sidebar/>
                <main className="flex-1 p-4 md:p-6">
                    <div className="max-w-7xl mx-auto bg-[#E1D9BC] px-8 py-5 rounded-lg">
                        {factions.length > 0 && (
                            <div className="mb-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <span className="text-[#30364F]">
                                            Factions
                                        </span>
                                        <span className="text-sm text-[#30364F]">
                                            ({factions.length} factions)
                                        </span>
                                    </h2>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 lg:grid-cols-2 gap-4">
                                    {factions.map((fc) => (
                                        <FactionInfoCard key={fc.id} faction={fc}/>
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

export default Factions;