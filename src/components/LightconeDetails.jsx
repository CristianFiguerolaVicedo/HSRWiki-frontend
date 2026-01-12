import axios from "axios";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

const LightconeDetails = () => {
    const {id} = useParams();
    const [lightcone, setLightcone] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchLightconeById = async () => {
            setLoading(true);

            try {
                const response = await axios.get(`http://localhost:8080/api/lightcones/${id}`);
                if (response.status === 200) {
                    setLightcone(response.data);
                }
            } catch (error) {
                console.error("Something went wrong", error);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchLightconeById();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-white text-xl">Loading Light Cones</div>
            </div>
        );
    }

    if (!lightcone) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white text-xl">Light Cone not found</div>
            </div>
        )
    }

    const pathIconPath = PATH_ICONS[lightcone.path.toUpperCase()];

    const calculateMaxStats = () => {
        if (!lightcone.ascension || lightcone.ascension.length === 0) return null;

        const baseStats = lightcone.ascension[0];
        const level80Stats = {
            hp: baseStats.hp.base + (baseStats.hp.step * 79),
            atk: baseStats.atk.base + (baseStats.atk.step * 79),
            def: baseStats.def.base + (baseStats.def.step * 79)
        };

        return level80Stats;
    };

    const maxStats = calculateMaxStats();

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col items-center md:items-start">
                    <div className="relative">
                        <img 
                            src={`${lightcone.image}`} 
                            alt={lightcone.name}
                            className="w-75 h-100 rounded-xl border-4 border-[#5bc0be] shadow-lg" 
                        />
                        <div className="absolute -top-3 -right-3 flex flex-col gap-2">
                            <div className="flex items-center gap-2 bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-700">
                                {pathIconPath && (
                                    <img 
                                        src={pathIconPath}
                                        alt={lightcone.path} 
                                        className="w-6 h-6"
                                    />
                                )}
                                <span className="font-bold text-sm">{lightcone.path}</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 text-center md:text-left">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                            {lightcone.name}
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                            {Array.from({ length: lightcone.rarity }).map((_, index) => (
                                <Star key={index} className="text-amber-400 fill-amber-400" size={20}/>
                            ))}
                            <span className="text-gray-300 ml-2">• {lightcone.rarity}-Star Light Cone</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default LightconeDetails;