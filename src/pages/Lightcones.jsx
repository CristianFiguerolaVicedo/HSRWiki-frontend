import axios from "axios";
import { useEffect, useState } from "react";
import LightconeInfoCard from "../components/LightconeInfoCard";
import { Star } from "lucide-react";

const API_URL = "http://localhost:8080/";

const PATH_ICONS = {
    ABUNDANCE: '/assets/Icon_Abundance.webp', 
    DESTRUCTION: '/assets/Icon_Destruction.webp',
    ERUDITION: '/assets/Icon_Erudition.webp',
    HARMONY: '/assets/Icon_Harmony.webp',
    NIHILITY: '/assets/Icon_Nihility.webp',
    PRESERVATION: '/assets/Icon_Preservation.webp',
    REMEMBRANCE: '/assets/Icon_Remembrance.webp',
    HUNT: '/assets/Icon_The_Hunt.webp',
}

const Lightcones = () => {
    const [lightcones, setLightcones] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLightcones = async () => {
            try {
                const response = await axios.get(`${API_URL}api/lightcones`);
                if (response.status === 200) {
                    setLightcones(response.data);
                }
            } catch (error) {
                console.error("Something went wrong", error);
            } finally {
                setLoading(false);
            }
        };

        fetchLightcones();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-white text-xl">Loading lightcones...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent mb-2">
                        Light Cone List
                    </h1>
                    <p className="text-gray-400">
                        Browse through all of the {lightcones.length} available light cones.
                    </p>
                </div>

                <div className="mb-6">
                    {/*Filters */}
                </div>

                {lightcones.length > 0 && (
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-white">
                                Light Cones ({lightcones.length})
                            </h2>
                            {lightcones.length > 0 && (
                                <span className="text-sm text-gray-400 px-3 py-1 bg-gray-800/50 rounded-full">
                                    Available Light Cones
                                </span>
                            )}
                        </div>

                        {lightcones.length === 0 ? (
                            <div className="text-center py-8 text-gray-400">
                                No Light Cones available
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                                {lightcones.map(lc => (
                                    <LightconeInfoCard key={lc.id} lightcone={lc}/>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-800">
                    <div className="flex flex-wrap justify-center gap-6 text-center text-gray-400">
                        <div>
                            <div className="text-2xl font-bold text-white">{lightcones.length}</div>
                            <div className="text-sm">Total Lightcones</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-amber-300">
                                {lightcones.filter(lc => lc.rarity === 5).length}
                            </div>
                            <div className="text-sm">5★ Light Cones</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-purple-300">
                                {lightcones.filter(lc => lc.rarity === 4).length}
                            </div>
                            <div className="text-sm">4★ Light Cones</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-300">
                                {lightcones.filter(lc => lc.rarity === 3).length}
                            </div>
                            <div className="text-sm">3★ Light Cones</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Lightcones;