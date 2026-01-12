import axios from "axios";
import { Heart, Shield, Sparkles, Star, Swords, Target, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getLightConeByName } from "../services/lightConeService";

const ELEMENT_ICONS = {
    FIRE: '/assets/Type_Fire.webp',
    ICE: '/assets/Type_Ice.webp',
    LIGHTNING: '/assets/Type_Lightning.webp',
    WIND: '/assets/Type_Wind.webp',
    QUANTUM: '/assets/Type_Quantum.webp',
    IMAGINARY: '/assets/Type_Imaginary.webp',
    PHYSICAL: '/assets/Type_Physical.webp',
}

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

const CharDetails = () => {
    const {id} = useParams();
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [lightConeData, setLightConeData] = useState({});

    useEffect(() => {
        const fetchCharById = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`http://localhost:8080/api/characters/${id}`);
                if (response.status === 200) {
                    setChar(response.data);

                    if (response.data.build?.lightCones) {
                        fetchLightConeData(response.data.build.lightCones);
                    }
                }
            } catch (error) {
                console.error("Something went wrong", error);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchCharById();
        }
    }, [id]);

    const fetchLightConeData = async (lightCones) => {
        const lightConeMap = {};
        const promises = lightCones.map(async (cone) => {
            const data = await getLightConeByName(cone.name);
            if (data) {
                lightConeMap[cone.name] = data;
            }
        });

        await Promise.all(promises);
        setLightConeData(lightConeMap);
    };

    const getLightConeImage = (coneName) => {
        const coneData = lightConeData[coneName];
        return coneData?.icon || coneData?.image || '';
    };

    const getLightConePathIcon = (coneName) => {
        const coneData = lightConeData[coneName];
        if (!coneData?.path) return null;
        
        const path = coneData.path.replace("The ", "").toUpperCase();
        return PATH_ICONS[path] || null;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-white text-xl">Loading character...</div>
            </div>
        );
    }

    if (!char) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white text-xl">Character not found</div>
            </div>
        )
    }

    const formatCharName = (name) => {
        return name.replace('Trailblzer', 'TB').replace('#M', '♂').replace('#F', '♀');
    }

    const elementIconPath = ELEMENT_ICONS[char.element];
    const pathIconPath = PATH_ICONS[char.path.toUpperCase()];

    const calculateMaxStats = () => {
        if (!char.ascension || char.ascension.length === 0) return null;

        const baseStats = char.ascension[0];
        const level80Stats = {
            hp: baseStats.hp.base + (baseStats.hp.step * 79),
            atk: baseStats.atk.base + (baseStats.atk.step * 79),
            def: baseStats.def.base + (baseStats.def.step * 79),
            spd: baseStats.spd.base,
            critRate: baseStats.critRate.base,
            critDmg: baseStats.critDmg.base,
        };

        return level80Stats;
    };

    const maxStats = calculateMaxStats();

    const renderSkillValues = (skillData) => {
        if (!skillData.params || skillData.params.length === 0) {
            return <p className="text-gray-400">No skill data available</p>;
        }

        const level1Values = skillData.params[0] || [];

        return (
            <div className="mt-4">
                <div className="mb-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                    <h5 className="text-sm font-semibold text-blue-300 mb-2">Skill Effect:</h5>
                    <div className="text-gray-300 text-sm space-y-2">
                        {(() => {
                            let desc = skillData.desc;
                            let parts = [];
                            let lastIndex = 0;
                            
                            const regex = /\{(\d+)\}/g;
                            let match;
                            let paramIndex = 0;
                            
                            while ((match = regex.exec(desc)) !== null) {
                                if (match.index > lastIndex) {
                                    parts.push(desc.substring(lastIndex, match.index));
                                }
                                
                                const placeholderIndex = parseInt(match[1]);
                                const value = level1Values[placeholderIndex] || "N/A";
                                parts.push(
                                    <span key={`value-${paramIndex}`} className="text-yellow-300 font-bold mx-1">
                                        {value}
                                    </span>
                                );
                                
                                lastIndex = regex.lastIndex;
                                paramIndex++;
                            }
                            
                            if (lastIndex < desc.length) {
                                parts.push(desc.substring(lastIndex));
                            }
                            
                            if (parts.length === 0) {
                                return <p>{desc}</p>;
                            }
                            
                            return parts;
                        })()}
                    </div>
                    <div className="mt-2 text-xs text-gray-400">
                        <span className="text-yellow-400">Note:</span> Values shown in <span className="text-yellow-300 font-bold">yellow</span> are for Level 1.
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <tbody>
                            {skillData.params[0].map((_, paramIndex) => {
                                const values = skillData.params.map(levelParams => 
                                    levelParams[paramIndex] || "N/A"
                                );
                                
                                return (
                                    <tr key={paramIndex} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                                        <td className="py-3 px-2">
                                            <div className="font-mono text-lg text-yellow-300">
                                                {values.join("/")}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                <div className="mt-4 p-3 bg-gray-900/50 rounded-lg text-xs text-gray-400">
                    <p className="mt-1"><span className="text-green-400">Example:</span> "50/60/70" means 50 at level 1, 60 at level 2, 70 at level 3</p>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col items-center md:items-start">
                    <div className="relative">
                        <img 
                            src={`${char.icon}`} 
                            alt={char.name} 
                            className="w-75 h-100 rounded-xl border-4 border-[#5bc0be] shadow-lg"
                        />
                        <div className="absolute -top-3 -right-3 flex flex-col gap-2">
                            <div className="flex items-center gap-2 bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-700">
                                {elementIconPath && (
                                    <img 
                                        src={elementIconPath} 
                                        alt={char.element} 
                                        className="w-6 h-6"
                                    />
                                )}
                                <span className="font-bold text-sm">{char.element}</span>
                            </div>
                            <div className="flex items-center gap-2 bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-700">
                                {pathIconPath && (
                                    <img 
                                        src={pathIconPath} 
                                        alt={char.path}
                                        className="w-6 h-6" 
                                    />
                                )}
                                <span className="font-bold text-sm">{char.path}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 text-center md:text-left">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent">
                            {formatCharName(char.name)}
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                            {Array.from({ length: char.rarity }).map((_, index) => (
                                <Star key={index} className="text-amber-400 fill-amber-400" size={20}/>
                            ))}
                            <span className="text-gray-300 ml-2">• {char.rarity}-Star Character</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h2 className="text-2xl font-bold mb-6 text-bluw-300">Base Stats (Lvl 1)</h2>
                    {char.ascension && char.ascension.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors">
                                <div className="text-red-400 font-bold flex items-center gap-2">
                                    <span className="text-lg"><Heart/></span>
                                </div>
                                <div className="text-2xl font-mono mt-2">
                                    {char.ascension[0].hp.base.toFixed(0)}
                                </div>
                                <div className="text-gray-400 text-sm mt-1">
                                    +{char.ascension[0].hp.step}/lvl
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
                                <div className="text-yellow-400 font-bold flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg"><Swords/></span> ATK
                                    </div>
                                    <div className="text-xs text-gray-400">+{char.ascension[0].atk.step}/lvl</div>
                                </div>
                                <div className="flex justify-between items-baseline mt-2">
                                    <div>
                                        <div className="text-xl font-mono">{char.ascension[0].atk.base.toFixed(0)}</div>
                                        <div className="text-xs text-gray-400 mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-yellow-300">{Math.round(maxStats.atk)}</div>
                                        <div className="text-xs text-gray-400 mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
                                <div className="text-blue-400 font-bold flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg"><Shield/></span> DEF
                                    </div>
                                    <div className="text-xs text-gray-400">+{char.ascension[0].def.step}/lvl</div>
                                </div>
                                <div className="flex justify-between items-baseline mt-2">
                                    <div>
                                        <div className="text-xl font-mono">{char.ascension[0].def.base.toFixed(0)}</div>
                                        <div className="text-xs text-gray-400 mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-blue-300">{Math.round(maxStats.def)}</div>
                                        <div className="text-xs text-gray-400 mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 hover:border-green-500 transition-colors">
                                <div className="text-green-400 font-bold flex items-center gap-2">
                                    <span className="text-lg"><Zap/></span> SPD
                                </div>
                                <div className="text-2xl font-mono mt-2">
                                    {char.ascension[0].spd.base.toFixed(0)}
                                </div>
                                <div className="text-gray-400 text-xs">
                                    Static
                                </div>
                                <div className="flex justify-between items-baseline mt-2">
                                    <div>
                                        <div className="text-xl font-mono">{char.ascension[0].spd.base.toFixed(0)}</div>
                                        <div className="text-xs text-gray-400 mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-green-300">{char.ascension[0].spd.base.toFixed(0)}</div>
                                        <div className="text-xs text-gray-400 mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 hover:border-purple-500 transition-colors">
                                <div className="text-purple-400 font-bold flex items-center gap-2">
                                    <span className="text-lg"><Target/></span> CRIT Rate
                                </div>
                                <div className="text-xs text-gray-400">
                                    Base
                                </div>
                                <div className="flex justify-between items-baseline mt-2">
                                    <div>
                                        <div className="text-xl font-mono">{(char.ascension[0].critRate.base * 100).toFixed(1)}%</div>
                                        <div className="text-xs text-gray-400 mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-purple-300">{(char.ascension[0].critRate.base * 100).toFixed(1)}%</div>
                                        <div className="text-xs text-gray-400 mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
                                <div className="text-pink-400 font-bold flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg"><Sparkles/></span> CRIT DMG
                                    </div>
                                    <div className="text-xs text-gray-400">Base</div>
                                </div>
                                <div className="flex justify-between items-baseline mt-2">
                                    <div>
                                        <div className="text-xl font-mono">{(char.ascension[0].critDmg.base * 100).toFixed(0)}%</div>
                                        <div className="text-xs text-gray-400 mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-pink-300">{(char.ascension[0].critDmg.base * 100).toFixed(0)}%</div>
                                        <div className="text-xs text-gray-400 mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="mb-6">
                <nav className="flex flex-wrap gap-2">
                    {["overview", "skills", "eidolons", "traces", "builds"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg" : "bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50 border border-gray-700"}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-6">
                {activeTab === "skills" && char.skills && (
                    <div className="space-y-6">
                        {/* Basic Attack */}
                        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                                    <span className="text-blue-300 text-xl">A</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-blue-300">Basic Attack</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-yellow-400 text-sm font-semibold px-2 py-0.5 bg-yellow-400/10 rounded-full">
                                            Max Level: {char.skills.basic.maxLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <h4 className="text-lg font-semibold mb-2">{char.skills.basic.name}</h4>
                            {renderSkillValues(char.skills.basic)}
                        </div>

                        {/* Skill */}
                        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center border border-green-500/30">
                                    <span className="text-green-300 text-xl">S</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-green-300">Skill</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-yellow-400 text-sm font-semibold px-2 py-0.5 bg-yellow-400/10 rounded-full">
                                            Max Level: {char.skills.skill.maxLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <h4 className="text-lg font-semibold mb-2">{char.skills.skill.name}</h4>
                            {renderSkillValues(char.skills.skill)}
                        </div>

                        {/* Ultimate */}
                        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                                    <span className="text-purple-300 text-xl">U</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-purple-300">Ultimate</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-yellow-400 text-sm font-semibold px-2 py-0.5 bg-yellow-400/10 rounded-full">
                                            Max Level: {char.skills.ult.maxLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <h4 className="text-lg font-semibold mb-2">{char.skills.ult.name}</h4>
                            {renderSkillValues(char.skills.ult)}
                        </div>

                        {/* Talent */}
                        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center border border-yellow-500/30">
                                    <span className="text-yellow-300 text-xl">T</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-yellow-300">Talent</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-yellow-400 text-sm font-semibold px-2 py-0.5 bg-yellow-400/10 rounded-full">
                                            Max Level: {char.skills.talent.maxLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <h4 className="text-lg font-semibold mb-2">{char.skills.talent.name}</h4>
                            {renderSkillValues(char.skills.talent)}
                        </div>
                    </div>
                )}

                {activeTab === "eidolons" && char.eidolons && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {char.eidolons.map((eidolon, index) => (
                            <div 
                                key={index} 
                                className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30 hover:border-yellow-500/50 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-yellow-400 font-bold text-lg bg-yellow-400/10 px-3 py-1 rounded-full">
                                        E{index + 1}
                                    </div>
                                    <div className="text-sm text-gray-400">Eidolon {index + 1}</div>
                                </div>
                                <h3 className="text-lg font-semibold mb-3">{eidolon.name}</h3>
                                <p className="text-gray-300 text-sm mb-4">{eidolon.desc}</p>
                                
                                {eidolon.levelUpSkills && Object.keys(eidolon.levelUpSkills).length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-gray-700">
                                        <span className="text-green-400 text-sm font-semibold">Level Up: </span>
                                        {Object.entries(eidolon.levelUpSkills).map(([skill, levels]) => (
                                            <span key={skill} className="text-gray-300 text-sm ml-2 bg-gray-700/50 px-2 py-1 rounded">
                                                {skill} +{levels}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === "traces" && char.traces && (
                    <div className="space-y-6">
                        {char.traces.technique && (
                            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-pink-500/30">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center border border-pink-500/30">
                                        <span className="text-pink-300 text-xl">T</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-pink-300">Technique</h3>
                                </div>
                                <h4 className="text-lg font-semibold mb-2">{char.traces.technique.name}</h4>
                                <p className="text-gray-300 mt-2">{char.traces.technique.desc}</p>
                            </div>
                        )}

                        {char.traces.abilities && Object.keys(char.traces.abilities).length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-blue-300">Abilities</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(char.traces.abilities).map(([key, ability]) => (
                                        <div 
                                            key={key} 
                                            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
                                        >
                                            <h4 className="text-lg font-semibold text-green-300 mb-2">{ability.name}</h4>
                                            <p className="text-gray-300 text-sm">{ability.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {char.traces.stats && Object.keys(char.traces.stats).length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-yellow-300">Stat Bonuses</h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {Object.entries(char.traces.stats).map(([key, stat]) => (
                                        <div 
                                            key={key} 
                                            className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-4 border border-gray-700 hover:border-yellow-500/30 transition-colors"
                                        >
                                            <h4 className="font-semibold text-yellow-400 text-sm mb-2">{stat.name}</h4>
                                            <p className="text-gray-300 text-xs">{stat.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "builds" && char.build && (
                    <div className="space-y-6">
                        {char.build.lightCones && char.build.lightCones.length > 0 && (
                            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/30">
                                <h3 className="text-xl font-bold mb-4 text-yellow-300">Recommended Light Cones</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {char.build.lightCones.map((cone, index) => {
                                        const coneImage = getLightConeImage(cone.name);
                                        const pathIcon = getLightConePathIcon(cone.name);
                                        
                                        return (
                                            <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700 hover:border-blue-500/30 transition-colors">
                                                <div className="flex gap-3">
                                                    {coneImage && (
                                                        <div className="relative flex-shrink-0">
                                                            <img 
                                                                src={coneImage} 
                                                                alt={cone.name}
                                                                className="w-16 h-16 rounded-lg border border-blue-500/30"
                                                            />
                                                            {pathIcon && (
                                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-gray-900/80 rounded-full border border-gray-700 flex items-center justify-center">
                                                                    <img 
                                                                        src={pathIcon} 
                                                                        alt={cone.path}
                                                                        className="w-4 h-4"
                                                                        title={`Path: ${lightConeData[cone.name]?.path}`}
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div>
                                                                <h4 className="text-lg font-semibold text-blue-300">{cone.name}</h4>
                                                                {lightConeData[cone.name]?.path && (
                                                                    <div className="flex items-center gap-1 mt-1">
                                                                        <span className="text-xs text-gray-400">Path:</span>
                                                                        <span className="text-xs text-blue-200">{lightConeData[cone.name].path}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                {Array.from({ length: cone.rarity }).map((_, i) => (
                                                                    <Star key={i} className="text-amber-400 fill-amber-400" size={14}/>
                                                                ))}
                                                                {cone.priority === 1 && (
                                                                    <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded-full">
                                                                        Best
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-gray-300 text-sm">{cone.description}</p>                                                                                                            
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {Object.keys(lightConeData).length === 0 && (
                                    <div className="text-center py-4">
                                        <div className="text-gray-400 text-sm">Loading light cone images...</div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {char.build.relicSets && char.build.relicSets.length > 0 && (
                                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                                    <h3 className="text-xl font-bold mb-4 text-purple-300">Relic Sets</h3>
                                    <div className="space-y-4">
                                        {char.build.relicSets.map((set, index) => (
                                            <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="text-lg font-semibold">{set.name}</h4>
                                                    {set.priority === 1 && (
                                                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                                                            Recommended
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-300 text-sm">{set.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {char.build.planarSets && char.build.planarSets.length > 0 && (
                                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
                                    <h3 className="text-xl font-bold mb-4 text-blue-300">Planar Ornaments</h3>
                                    <div className="space-y-4">
                                        {char.build.planarSets.map((set, index) => (
                                            <div key={index} className="bg-gray-800/50 rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-2">
                                                    <h4 className="text-lg font-semibold">{set.name}</h4>
                                                    {set.priority === 1 && (
                                                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                                                            Recommended
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-gray-300 text-sm">{set.description}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {char.build.mainStats && (
                                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                                    <h3 className="text-xl font-bold mb-4 text-green-300">Main Stats Priority</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-gray-400 text-sm font-medium">Body</h4>
                                            <p className="text-white font-medium">{char.build.mainStats.body}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-gray-400 text-sm font-medium">Feet</h4>
                                            <p className="text-white font-medium">{char.build.mainStats.feet}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-gray-400 text-sm font-medium">Sphere</h4>
                                            <p className="text-white font-medium">{char.build.mainStats.sphere}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-gray-400 text-sm font-medium">Rope</h4>
                                            <p className="text-white font-medium">{char.build.mainStats.rope}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {char.build.subStats && (
                                <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
                                    <h3 className="text-xl font-bold mb-4 text-orange-300">Sub Stats Priority</h3>
                                    <div className="space-y-2">
                                        {char.build.subStats.priority && char.build.subStats.priority.map((stat, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <div className="w-6 h-6 flex items-center justify-center bg-gray-700 rounded-full text-sm font-bold">
                                                    {index + 1}
                                                </div>
                                                <span className="text-gray-300">{stat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {char.build.teams && char.build.teams.length > 0 && (
                            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-pink-500/30">
                                <h3 className="text-xl font-bold mb-4 text-pink-300">Team Compositions</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {char.build.teams.map((team, index) => (
                                        <div key={index} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-lg font-semibold text-blue-300">{team.name}</h4>
                                                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                                                    Team {index + 1}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 text-sm mb-3">{team.description}</p>
                                            
                                            <div className="mb-3">
                                                <h5 className="text-gray-400 text-sm font-medium mb-2">Team Members:</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {team.teamMembers.map((member, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                                                            {member}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "overview" && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold mb-4 text-white">Character Overview</h3>
                            <div className="flex items-start gap-4">
                                <div className="flex flex-col items-center gap-2">
                                    <img 
                                        src={`${char.miniIcon}`} 
                                        alt={char.name} 
                                        className="w-24 h-24 rounded-full border-2 border-[#5bc0be]"
                                    />
                                    <div className="flex gap-2">
                                        {elementIconPath && (
                                            <img 
                                                src={elementIconPath} 
                                                alt={char.element} 
                                                className="w-8 h-8"
                                                title={`Element: ${char.element}`}
                                            />
                                        )}
                                        {pathIconPath && (
                                            <img 
                                                src={pathIconPath} 
                                                alt={char.path} 
                                                className="w-8 h-8"
                                                title={`Path: ${char.path}`}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-300">
                                        <span className="font-bold text-blue-300">{formatCharName(char.name)}</span> is a 
                                        <span className="text-amber-400"> {char.rarity}-star </span>
                                        <span className="font-semibold"> {char.element} </span>
                                        character following the 
                                        <span className="font-semibold"> {char.path} </span>
                                        path.
                                    </p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-gray-400">Rarity:</span>
                                        <div className="flex">
                                            {Array.from({ length: char.rarity }).map((_, index) => (
                                                <Star key={index} className="text-amber-400 fill-amber-400" size={16}/>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {char.ascension && (
                            <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                                <h3 className="text-xl font-bold mb-4 text-green-300">Ascension Stats by Level Range</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-gray-700">
                                                <th className="text-left py-3 px-2 text-gray-300">Level Range</th>
                                                <th className="text-left py-3 px-2 text-red-400">Base HP</th>
                                                <th className="text-left py-3 px-2 text-yellow-400">Base ATK</th>
                                                <th className="text-left py-3 px-2 text-blue-400">Base DEF</th>
                                                <th className="text-left py-3 px-2 text-green-400">SPD</th>
                                                <th className="text-left py-3 px-2 text-purple-400">CRIT Rate</th>
                                                <th className="text-left py-3 px-2 text-pink-400">CRIT DMG</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {char.ascension.map((asc, index) => {
                                                let levelRange;
                                                switch(index) {
                                                    case 0: levelRange = "1-20"; break;
                                                    case 1: levelRange = "20-40"; break;
                                                    case 2: levelRange = "40-50"; break;
                                                    case 3: levelRange = "50-60"; break;
                                                    case 4: levelRange = "60-70"; break;
                                                    case 5: levelRange = "70-80"; break;
                                                    case 6: levelRange = "80"; break;
                                                    default: levelRange = `${index * 10 + 1}-${index * 10 + 10}`;
                                                }
                                                
                                                return (
                                                    <tr key={index} className="border-b border-gray-700 hover:bg-gray-700/30 transition-colors">
                                                        <td className="py-3 px-2 font-medium">
                                                            <div className="font-semibold">Level {levelRange}</div>
                                                            <div className="text-xs text-gray-400">Ascension {index + 1}</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="font-mono">{asc.hp.base.toFixed(0)}</div>
                                                            <div className="text-xs text-gray-400">+{asc.hp.step}/lvl</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="font-mono">{asc.atk.base.toFixed(0)}</div>
                                                            <div className="text-xs text-gray-400">+{asc.atk.step}/lvl</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="font-mono">{asc.def.base.toFixed(0)}</div>
                                                            <div className="text-xs text-gray-400">+{asc.def.step}/lvl</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="font-mono">{asc.spd.base.toFixed(0)}</div>
                                                            <div className="text-xs text-gray-400">Static</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="font-mono">{(asc.critRate.base * 100).toFixed(1)}%</div>
                                                            <div className="text-xs text-gray-400">Base</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="font-mono">{(asc.critDmg.base * 100).toFixed(0)}%</div>
                                                            <div className="text-xs text-gray-400">Base</div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 text-sm text-gray-400">
                                    <p>Note: Base stats shown are at the start of each level range. Stats increase by the shown amount with each character level.</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CharDetails;