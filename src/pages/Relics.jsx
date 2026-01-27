import axios from "axios";
import { useEffect, useState } from "react";
import RelicsInfoCard from "../components/RelicsInfoCard";
import PlanarsInfoCard from "../components/PlanarsInfoCard";
import Sidebar from '../components/Sidebar'

const Relics = () => {
    const [relics, setRelics] = useState({});
    const [planars, setPlanars] = useState({});
    const [loading, setLoading] = useState(false);

    const isRelicSet = (setData) => {
        if (!setData.pieces) return false;

        const piecesKey = Object.keys(setData.pieces);
        const relicPiecesNames = ["Head", "Hands", "Body", "Feet"];

        return piecesKey.some(key => 
            relicPiecesNames.includes(key) || 
            key.includes("Head") ||
            key.includes("Hand") ||
            key.includes("Body") ||
            key.includes("Foot") ||
            key.includes("Feet")
        );
    };

    const isPlanarSet = (setData) => {
        if (!setData.pieces) return false;

        const piecesKey = Object.keys(setData.pieces);
        const relicPiecesNames = ["Planar Sphere", "Link Rope"];

        return piecesKey.some(key => 
            relicPiecesNames.includes(key) || 
            key.includes("Sphere") ||
            key.includes("Rope")
        );
    };

    useEffect(() => {
        const separateRelicsPlanars = (sets) => {
            const relics = [];
            const planars = [];

            sets.forEach((setData) => {
                if (isRelicSet(setData)) {
                    relics.push(setData);
                } else if (isPlanarSet(setData)) {
                    planars.push(setData);
                }
            });
            
            setRelics(relics); 
            setPlanars(planars);
    };

        const fetchRelicData = async () => {
            setLoading(true);

            try {
                const response = await axios.get(`http://localhost:8080/api/relics`);
                if (response.status === 200) {
                    separateRelicsPlanars(response.data);
                }
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
            <div className="text-white text-xl">Loading lightcones...</div>
        </div>
        );
    }

    return (
        <div className="text-white rounded-xl">
            <div className="flex">
                <Sidebar/>
                <main className="flex-1 p-4 md:p-6">
                    <div className="max-w-7xl mx-auto bg-[#E1D9BC] px-8 py-5 rounded-lg">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold text-[#30364F] mb-2">
                                Relic and Planar Sets List
                            </h1>
                            <p className="text-[#30364F]">
                                Browse through all of the {relics.length} available relic sets and {planars.length} available planar sets.
                            </p>
                        </div>

                        <div className="mb-6">
                            {relics.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold text-[#30364F]">
                                            Relic Sets ({relics.length})
                                        </h2>
                                        {relics.length > 0 && (
                                            <span className="text-sm text-[#30364F] px-3 py-1 gr-gray-800/50 rounded-full">
                                                Available Relic Sets
                                            </span>
                                        )}
                                    </div>

                                    {relics.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400">
                                            No Relic Sets Available
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                                            {relics.map((rel) => (
                                                <RelicsInfoCard key={rel.name} relicSet={rel} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {planars.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-4 border-t border-gray-700 mt-6">
                                        <h2 className="text-2xl font-bold text-[#30364F] mt-6">
                                            Planar Sets ({planars.length})
                                        </h2>
                                        {planars.length > 0 && (
                                            <span className="text-sm text-[#30364F] px-3 py-1 gr-gray-800/50 rounded-full mt-6">
                                                Available Planar Sets
                                            </span>
                                        )}
                                    </div>

                                    {planars.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400">
                                            No Planar Sets Available
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                                            {planars.map((pl) => (
                                                <PlanarsInfoCard key={pl.name} planarSet={pl} />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-8 pt-6 border-t border-gray-800">
                                <div className="flex flex-wrap justify-center gap-6 text-center text-gray-400">
                                    <div>
                                        <div className="text-2xl font-bold text-[#30364F]">
                                            {relics.length}
                                        </div>
                                        <div className="text-sm text-[#30364F]">Total Relic Sets</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-[#30364F]">
                                            {planars.length}
                                        </div>
                                        <div className="text-sm text-[#30364F]">Total Planar Sets</div>
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