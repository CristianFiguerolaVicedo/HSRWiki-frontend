import { ArrowLeft, ClipboardList, Heart, Shield, Star, Swords } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PATH_TAPES, pathLabel } from "../util/paths";
import FavoriteButton from "./FavoriteButton";
import { CollectionControl } from "./Collection";

import { fetchJson } from "../services/apiClient";

const PATH_ICONS = {
    ABUNDANCE: '/assets/Icon_Abundance.webp', 
    DESTRUCTION: '/assets/Icon_Destruction.webp',
    ERUDITION: '/assets/Icon_Erudition.webp',
    HARMONY: '/assets/Icon_Harmony.webp',
    NIHILITY: '/assets/Icon_Nihility.webp',
    PRESERVATION: '/assets/Icon_Preservation.webp',
    REMEMBRANCE: '/assets/Icon_Remembrance.webp',
    HUNT: '/assets/Icon_The_Hunt.webp',
    ELATION: '/assets/Icon_Elation.png',
}

const LightconeDetails = () => {
    const {id} = useParams();
    const [lightcone, setLightcone] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLightconeById = async () => {
            setLoading(true);
            try {
                const data = await fetchJson(`/lightcones/${id}`);
                if (data) {
                    setLightcone(data);
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
                `<span class="text-text-primary font-bold">${value}</span>`
            );
        });

        return (
            <div className="space-y-4">
                <div 
                    className="text-text-secondary"
                    dangerouslySetInnerHTML={{ __html: formattedDesc }}
                />

                <div className="mt-6">
                    <h4 className="text-lg font-bold mb-4 text-text-primary">Superimposition Levels</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-border">
                                    <th className="text-left py-3 px-2 text-text-primary">Superimposition</th>
                                    {params[0].map((_, paramIndex) => (
                                        <th key={paramIndex} className="text-center py-3 px-2 text-text-secondary">
                                            Parameter {paramIndex + 1}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {params.map((paramArray, levelIndex) => (
                                    <tr key={levelIndex} className="border-b border-border hover:bg-bg-elevated/30 transition-colors">
                                        <td className="py-3 px-2 font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 flex items-center justify-center bg-accent-cyan/20 text-accent-cyan rounded-full text-sm">
                                                    S{levelIndex + 1}
                                                </div>
                                            </div>
                                        </td>
                                        {paramArray.map((value, paramIndex) => (
                                            <td key={paramIndex} className="py-3 px-2">
                                                <div className="tabular-nums text-text-primary">{value}</div>
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
                <div className="text-text-primary text-xl">Loading Light Cones</div>
            </div>
        );
    }

    if (!lightcone) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-text-primary text-xl">Light Cone not found</div>
            </div>
        )
    }

    const calculateMaxStats = () => {
        if (!lightcone.ascension || lightcone.ascension.length === 0) return null;

        // Level 80 belongs to the last ascension phase: stat(level) = base + step * (level - 1).
        // Using phase 0 left out every ascension bonus (e.g. 617 HP instead of 1058).
        const lastPhase = lightcone.ascension[lightcone.ascension.length - 1];
        const statAt80 = (stat) => stat.base + stat.step * 79;
        const level80Stats = {
            hp: statAt80(lastPhase.hp),
            atk: statAt80(lastPhase.atk),
            def: statAt80(lastPhase.def)
        };

        return level80Stats;
    };

    const maxStats = calculateMaxStats();

    return (
        <div className="text-text-primary">
            <button
                onClick={() => navigate("/lightcones")}
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8 cursor-pointer font-hand text-2xl"
            >
                <ArrowLeft size={20} />
                back to light cones
            </button>
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col items-center md:items-start">
                    <div
                        className={`photo-card ${PATH_TAPES[lightcone.path?.toUpperCase()] || 'tape-physical'} w-72`}
                        style={{ "--tilt": "1.5deg", "--tape-tilt": "-2deg" }}
                    >
                        <span className="washi" aria-hidden="true" />
                        <div className="photo-card__picture">
                            <img
                                src={`${lightcone.image}`}
                                alt={lightcone.name}
                                className="w-full aspect-[902/1260] object-cover"
                            />
                        </div>
                        <p className="font-hand text-2xl text-text-secondary text-center pt-2 leading-none">
                            Path of {pathLabel(lightcone.path?.toUpperCase() || "")}
                        </p>
                    </div>

                    <div className="mt-8 text-center md:text-left max-w-sm">
                        <h1 className="text-4xl font-extrabold tracking-tight text-text-primary">
                            {lightcone.name}
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-1 mt-3" aria-label={`${lightcone.rarity} stars`}>
                            {Array.from({ length: lightcone.rarity }).map((_, index) => (
                                <Star key={index} className="text-accent-gold fill-accent-gold" size={20}/>
                            ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start md:max-w-72">
                            <FavoriteButton kind="lightcones" id={lightcone.id} name={lightcone.name} variant="inline" />
                            <CollectionControl kind="lightcones" id={lightcone.id} name="it" />
                            <button type="button" onClick={() => navigate(`/planner?add=lc:${lightcone.id}`)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold bg-bg-card border-border text-text-secondary hover:text-text-primary hover:border-border-hover cursor-pointer transition-colors">
                                <ClipboardList size={16} aria-hidden="true" /> Plan materials
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="flex-1 glass-panel p-6 self-start">
                    <h2 className="text-2xl font-bold mb-6 text-text-primary">Base stats <span className="font-hand text-2xl font-normal text-text-secondary">level 1 and level 80</span></h2>
                    {lightcone.ascension && lightcone.ascension.length > 0 && (
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                            <div className="bg-bg-card p-4 rounded-lg border border-border min-w-0">
                                <div className="text-text-primary font-bold flex flex-wrap items-center justify-between gap-x-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg"><Heart/></span> HP
                                    </div>
                                    <div className="text-xs text-text-secondary whitespace-nowrap">+{lightcone.ascension[0].hp.step.toFixed(2)}/lvl</div>
                                </div>
                                <div className="flex flex-wrap justify-between items-baseline gap-x-3 mt-2">
                                    <div>
                                        <div className="text-xl tabular-nums">{lightcone.ascension[0].hp.base.toFixed(0)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl tabular-nums text-accent-gold">{Math.round(maxStats.hp)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-bg-card p-4 rounded-lg border border-border min-w-0">
                                <div className="text-text-primary font-bold flex flex-wrap items-center justify-between gap-x-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg"><Swords/></span> ATK
                                    </div>
                                    <div className="text-xs text-text-secondary whitespace-nowrap">+{lightcone.ascension[0].atk.step.toFixed(2)}/lvl</div>
                                </div>
                                <div className="flex flex-wrap justify-between items-baseline gap-x-3 mt-2">
                                    <div>
                                        <div className="text-xl tabular-nums">{lightcone.ascension[0].atk.base.toFixed(0)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl tabular-nums text-accent-gold">{Math.round(maxStats.atk)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-bg-card p-4 rounded-lg border border-border min-w-0">
                                <div className="text-text-primary font-bold flex flex-wrap items-center justify-between gap-x-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg"><Shield/></span> DEF
                                    </div>
                                    <div className="text-xs text-text-secondary whitespace-nowrap">+{lightcone.ascension[0].def.step.toFixed(2)}/lvl</div>
                                </div>
                                <div className="flex flex-wrap justify-between items-baseline gap-x-3 mt-2">
                                    <div>
                                        <div className="text-xl tabular-nums">{lightcone.ascension[0].def.base.toFixed(0)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl tabular-nums text-accent-gold">{Math.round(maxStats.def)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="glass-panel p-6 mb-6">
                <h3 className="text-xl font-bold mb-4 text-text-primary">Description</h3>
                <div className="text-text-secondary">
                    {lightcone.desc}
                </div>
            </div>

            <div className="glass-panel p-6">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-text-primary">{lightcone.ability.name}</h3>
                </div>
                
                {renderAbilityDescription()}
            </div>
        </div>
    )
}

export default LightconeDetails;
