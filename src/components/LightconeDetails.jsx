import axios from "axios";
import { Heart, Shield, Star, Swords } from "lucide-react";
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

    const renderAbilityDescription = () => {
        if (!lightcone || !lightcone.ability) return null;

        const {desc, params} = lightcone.ability;

        if (!params || params.length === 0) {
            return <div>{desc}</div>;
        }

        const level1Params = params[0];

        let formattedDesc = desc;
        level1Params.forEach((value, index) => {
            formattedDesc = formattedDesc.replace(
                `{${index}}`,
                `<span class="text-[#E1D9BC] font-bold">${value}</span>`
            );
        });

        return (
            <div className="space-y-4">
                <div 
                    className="text-gray-300"
                    dangerouslySetInnerHTML={{ __html: formattedDesc }}
                />

                <div className="mt-6">
                    <h4 className="text-lg font-bold mb-4 text-[#E1D9BC]">Superimposition Levels</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-700">
                                    <th className="text-left py-3 px-2 text-[#E1D9BC]">Superimposition</th>
                                    {params[0].map((_, paramIndex) => (
                                        <th key={paramIndex} className="text-center py-3 px-2 text-gray-300">
                                            Parameter {paramIndex + 1}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {params.map((paramArray, levelIndex) => (
                                    <tr key={levelIndex} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                                        <td className="py-3 px-2 font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 flex items-center justify-center bg-[#E1D9BC] rounded-full text-sm text-[#30364F]">
                                                    S{levelIndex + 1}
                                                </div>
                                            </div>
                                        </td>
                                        {paramArray.map((value, paramIndex) => (
                                            <td key={paramIndex} className="py-3 px-2">
                                                <div className="font-mono text-[#E1D9BC]">{value}</div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

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
        <div className=" text-white p-4 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col items-center md:items-start">
                    <div className="relative">
                        <img 
                            src={`${lightcone.image}`} 
                            alt={lightcone.name}
                            className="w-75 h-100 rounded-xl shadow-lg" 
                        />
                    </div>

                    <div className="mt-6 text-center md:text-left">
                        <h1 className="text-4xl font-bold text-[#E1D9BC]">
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
                
                <div className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h2 className="text-2xl font-bold mb-6 text-[#E1D9BC]">Base Stats (Lvl 1)</h2>
                    {lightcone.ascension && lightcone.ascension.length > 0 && (
                        <div className="grid grid-cols-2 grid-rows-1 md:grid-cols-3 md:grid-rows-1 gap-4">
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
                                <div className="text-[#E1D9BC] font-bold flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg"><Heart/></span> HP
                                    </div>
                                    <div className="text-xs text-gray-400">+{lightcone.ascension[0].hp.step}/lvl</div>
                                </div>
                                <div className="flex justify-between items-baseline mt-2">
                                    <div>
                                        <div className="text-xl font-mono">{lightcone.ascension[0].hp.base.toFixed(0)}</div>
                                        <div className="text-xs text-gray-400 mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-[#ACBAC4]">{Math.round(maxStats.hp)}</div>
                                        <div className="text-xs text-gray-400 mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
                                <div className="text-[#E1D9BC] font-bold flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg"><Swords/></span> ATK
                                    </div>
                                    <div className="text-xs text-gray-400">+{lightcone.ascension[0].atk.step}/lvl</div>
                                </div>
                                <div className="flex justify-between items-baseline mt-2">
                                    <div>
                                        <div className="text-xl font-mono">{lightcone.ascension[0].atk.base.toFixed(0)}</div>
                                        <div className="text-xs text-gray-400 mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-[#ACBAC4]">{Math.round(maxStats.atk)}</div>
                                        <div className="text-xs text-gray-400 mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
                                <div className="text-[#E1D9BC] font-bold flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg"><Shield/></span> DEF
                                    </div>
                                    <div className="text-xs text-gray-400">+{lightcone.ascension[0].def.step}/lvl</div>
                                </div>
                                <div className="flex justify-between items-baseline mt-2">
                                    <div>
                                        <div className="text-xl font-mono">{lightcone.ascension[0].def.base.toFixed(0)}</div>
                                        <div className="text-xs text-gray-400 mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-[#ACBAC4]">{Math.round(maxStats.def)}</div>
                                        <div className="text-xs text-gray-400 mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6">
                <h3 className="text-xl font-bold mb-4 text-[#E1D9BC]">Description</h3>
                <div className="text-gray-300">
                    {lightcone.desc}
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-[#E1D9BC]">{lightcone.ability.name}</h3>
                </div>
                
                {renderAbilityDescription()}
            </div>
        </div>
    )
}

export default LightconeDetails;