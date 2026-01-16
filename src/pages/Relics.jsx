import axios from "axios";
import { GalleryVertical, Gamepad2, Menu, Swords, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import RelicsInfoCard from "../components/RelicsInfoCard";
import PlanarsInfoCard from "../components/PlanarsInfoCard";

const Relics = () => {
    const [sets, setSets] = useState({});
    const [relics, setRelics] = useState({});
    const [planars, setPlanars] = useState({});
    const [loading, setLoading] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigate = useNavigate();

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
                    setSets(response.data);
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
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white">
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700 hover:bg-gray-700/90 transition-colors"
            >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className="flex">
                <aside
                className={`
                            fixed lg:sticky lg:top-0 left-0 z-40 h-screen
                            bg-gradient-to-b from-gray-900 to-gray-950 border-r border-gray-800
                            transition-transform duration-300 ease-in-out
                            ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} w-64
                            flex flex-col`
                        }
                >
                <div className="p-6 border-b border-gray-800">
                    <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <Gamepad2 size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                        HSR Wiki
                        </h2>
                        <p className="text-xs text-gray-400">v3.8</p>
                    </div>
                    </div>
                </div>

                <nav className="flex-1 p-4 overflow-y-auto">
                    <div className="space-y-1">
                    <button
                        onClick={() => navigate("/")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 text-white hover:cursor-pointer"
                    >
                        <Users size={20} />
                        <span className="font-medium">Characters</span>
                    </button>

                    <button
                        onClick={() => navigate("/lightcones")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 text-white hover:cursor-pointer"
                    >
                        <Swords size={20} />
                        <span className="font-medium">Light Cones</span>
                    </button>

                    <button
                        onClick={() => navigate("/relics")}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/20 text-white hover:cursor-pointer"
                    >
                        <GalleryVertical size={20} />
                        <span className="font-medium">Relics</span>
                        <span className="ml-auto bg-gray-800 text-sm px-2 py-1 rounded">
                        {sets.length}
                        </span>
                    </button>
                    </div>

                    <div className="my-6 border-t border-gray-800"></div>
                </nav>
                </aside>

                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm lg:hidden z-30"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}
                <main className="flex-1 p-4 md:p-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="mb-8">
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mb-2">
                                Relic and Planar Sets List
                            </h1>
                            <p className="text-gray-400">
                                Browse through all of the {relics.length} available relic sets and {planars.length} available planar sets.
                            </p>
                        </div>

                        <div className="mb-6">
                            {relics.length > 0 && (
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-2xl font-bold text-white">
                                            Relic Sets ({relics.length})
                                        </h2>
                                        {relics.length > 0 && (
                                            <span className="text-sm text-gray-400 px-3 py-1 gr-gray-800/50 rounded-full">
                                                Available Relic Sets
                                            </span>
                                        )}
                                    </div>

                                    {relics.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400">
                                            No Relic Sets Available
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
                                        <h2 className="text-2xl font-bold text-white mt-6">
                                            Planar Sets ({planars.length})
                                        </h2>
                                        {planars.length > 0 && (
                                            <span className="text-sm text-gray-400 px-3 py-1 gr-gray-800/50 rounded-full mt-6">
                                                Available Planar Sets
                                            </span>
                                        )}
                                    </div>

                                    {planars.length === 0 ? (
                                        <div className="text-center py-8 text-gray-400">
                                            No Planar Sets Available
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-4">
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
                                        <div className="text-2xl font-bold text-white">
                                            {relics.length}
                                        </div>
                                        <div className="text-sm">Total Relic Sets</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-bold text-white">
                                            {planars.length}
                                        </div>
                                        <div className="text-sm">Total Planar Sets</div>
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