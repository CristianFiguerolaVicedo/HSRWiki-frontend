import { ArrowLeft, Heart, Shield, Sparkles, Star, Swords, Target, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchJson } from "../services/apiClient";
import { getLightConeByName } from "../services/lightConeService";
import { getRelicSetByName } from "../services/relicService";
import SkeletonLoader from "./SkeletonLoader";

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
    ELATION: '/assets/Icon_Elation.png',
}

const CharDetails = () => {
    const {id} = useParams();
    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [lightConeData, setLightConeData] = useState({});
    const [allSetData, setAllSetData] = useState({});
    const [relicSetData, setRelicSetData] = useState({});
    const [planarSetData, setPlanarSetData] = useState({});
    const [buildDataLoaded, setBuildDataLoaded] = useState(false);

    const navigate = useNavigate();

    const fetchRelicData = async (sets) => {
        const allSetMap = {};
        const validSets = sets.filter(set => isValidBuildEntry(set.name));
        const promises = validSets.map(async (set) => {
            const data = await getRelicSetByName(set.name);
            if (data) {
                allSetMap[set.name] = data;
            }
        });

        await Promise.all(promises);
        setAllSetData(allSetMap);
        
        const relics = {};
        const planars = {};
        
        Object.entries(allSetMap).forEach(([setName, setData]) => {
            if (isRelicSet(setData)) {
                relics[setName] = setData;
            } else if (isPlanarSet(setData)) {
                planars[setName] = setData;
            }
        });
        
        setRelicSetData(relics);
        setPlanarSetData(planars);
    };

    const isRelicSet = (setData) => {
        if (!setData.pieces) return false;
        
        const pieceKeys = Object.keys(setData.pieces);
        const relicPieceNames = ["Head", "Hands", "Body", "Feet"];
        
        return pieceKeys.some(key => 
            relicPieceNames.includes(key) || 
            key.includes("Head") || 
            key.includes("Hand") || 
            key.includes("Body") || 
            key.includes("Foot") || 
            key.includes("Feet")
        );
    };

    const isPlanarSet = (setData) => {
        if (!setData.pieces) return false;
        
        const pieceKeys = Object.keys(setData.pieces);
        const planarPieceNames = ["Planar Sphere", "Link Rope"];
        
        return pieceKeys.some(key => 
            planarPieceNames.includes(key) || 
            key.includes("Sphere") || 
            key.includes("Rope")
        );
    };


    useEffect(() => {
        const fetchCharById = async () => {
            setLoading(true);
            setBuildDataLoaded(false);
            try {
                const charData = await fetchJson(`/characters/${id}`);
                if (charData) {
                    setChar(charData);

                    const promises = [];

                    if (charData.build?.lightCones) {
                        promises.push(fetchLightConeData(charData.build.lightCones));
                    }

                    if (charData.build?.relicSets || charData.build?.planarSets) {
                        const allSets = [
                            ...(charData.build.relicSets || []),
                            ...(charData.build.planarSets || [])
                        ];
                        promises.push(fetchRelicData(allSets));
                    }

                    if (promises.length > 0) {
                        await Promise.all(promises);
                    }
                    setBuildDataLoaded(true);
                } else {
                    setBuildDataLoaded(true);
                }
            } catch (error) {
                console.error("Something went wrong", error);
                setBuildDataLoaded(true);
            } finally {
                setLoading(false);
            }
        }

        if (id) {
            fetchCharById();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchLightConeData = async (lightCones) => {
        const lightConeMap = {};
        const validCones = lightCones.filter(cone => isValidBuildEntry(cone.name));
        const promises = validCones.map(async (cone) => {
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

    const getLightconeId = (coneName) => {
        const coneData = lightConeData[coneName];
        return coneData?.id || '';
    }

    const getLightConePathIcon = (coneName) => {
        const coneData = lightConeData[coneName];
        if (!coneData?.path) return null;
        
        const path = coneData.path.replace("The ", "").toUpperCase();
        return PATH_ICONS[path] || null;
    };

    const getRelicSetIcon = (setName) => {
        const setData = relicSetData[setName] || allSetData[setName];
        if (!setData?.pieces) return null;
        
        const firstPieceKey = Object.keys(setData.pieces)[0];
        return setData.pieces[firstPieceKey]?.icon || null;
    };

    const getPlanarSetIcon = (setName) => {
        const setData = planarSetData[setName] || allSetData[setName];
        if (!setData?.pieces) return null;
        
        const firstPieceKey = Object.keys(setData.pieces)[0];
        return setData.pieces[firstPieceKey]?.icon || null;
    };

    const getPieceIcons = (setData) => {
        if (!setData?.pieces) return [];
        
        return Object.entries(setData.pieces).map(([pieceType, pieceData]) => ({
            type: pieceType,
            name: pieceData.name,
            icon: pieceData.icon
        }));
    };

    const isValidBuildEntry = (name) => {
        if (!name || typeof name !== 'string') return false;
        const statKeys = ['Body:', 'Feet:', 'Sphere:', 'Rope:'];
        if (statKeys.some(key => name.includes(key))) return false;
        const statNames = ['CRIT Rate', 'CRIT DMG', 'ATK%', 'SPD', 'Energy Regen', 'Effect Hit Rate'];
        if (statNames.includes(name.trim())) return false;
        return true;
    };

    if (loading) {
        return <SkeletonLoader type="detail" />;
    }

    if (!char) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-text-primary text-xl">Character not found</div>
            </div>
        )
    }

    const formatCharName = (name) => {
        return name.replace('Trailblazer', 'TB').replace('#M', '♂').replace('#F', '♀');
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
            return <p className="text-text-secondary">No skill data available</p>;
        }

        const level1Values = skillData.params[0] || [];

        return (
            <div className="mt-4">
                <div className="mb-6 p-4 bg-bg-card/40 rounded-lg border border-border">
                    <h5 className="text-sm font-semibold text-accent-gold mb-2">Skill Effect:</h5>
                    <div className="text-text-primary/80 text-sm space-y-2">
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
                                    <span key={`value-${paramIndex}`} className="text-text-primary font-bold mx-1">
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
                    <div className="mt-2 text-xs text-text-secondary">
                        <span className="text-text-primary">Note:</span> Values shown in <span className="text-text-primary font-bold">yellow</span> are for Level 1.
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
                                    <tr key={paramIndex} className="border-b border-border hover:bg-bg-elevated/50 transition-colors">
                                        <td className="py-3 px-2">
                                            <div className="font-mono text-lg text-text-primary">
                                                {values.join("/")}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                
                <div className="mt-4 p-3 bg-bg-primary/50 rounded-lg text-xs text-text-secondary">
                    <p className="mt-1"><span className="text-green-400">Example:</span> "50/60/70" means 50 at level 1, 60 at level 2, 70 at level 3</p>
                </div>
            </div>
        );
    };

    return (
        <div className="text-text-primary p-4 md:p-8 bg-bg-card/40 backdrop-blur-sm rounded-xl">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col items-center md:items-start">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-text-primary hover:cursor-pointer mb-8"
                    >
                        <ArrowLeft size={20} />
                        Back to characters
                    </button>
                    <div className="relative">
                        <img 
                            src={`${char.icon}`} 
                            alt={char.name} 
                            className="w-75 h-100 rounded-xl"
                        />
                    </div>
                    <div className="mt-6 text-center md:text-left">
                        <h1 className="text-4xl font-bold text-text-primary">
                            {formatCharName(char.name)}
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                            {Array.from({ length: char.rarity }).map((_, index) => (
                                <Star key={index} className="text-accent-gold fill-accent-gold" size={20}/>
                            ))}
                            <span className="text-text-primary/80 ml-2">• {char.rarity}-Star Character</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 bg-bg-card/60 backdrop-blur-sm rounded-xl p-6 border border-border">
                    <h2 className="text-2xl font-bold mb-6 text-text-primary">Base Stats (Lvl 1)</h2>
                    {char.ascension && char.ascension.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-bg-card to-bg-primary p-4 rounded-lg border border-border">
                                <div className="text-text-primary font-bold flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg"><Heart/></span> HP
                                    </div>
                                    <div className="text-xs text-text-secondary">+{char.ascension[0].hp.step}/lvl</div>
                                </div>
                                <div className="flex justify-between items-baseline mt-2">
                                    <div>
                                        <div className="text-xl font-mono">{char.ascension[0].hp.base.toFixed(0)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-accent-gold">{Math.round(maxStats.hp)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-bg-card to-bg-primary p-4 rounded-lg border border-border">
                                <div className="text-text-primary font-bold flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg"><Swords/></span> ATK
                                    </div>
                                    <div className="text-xs text-text-secondary">+{char.ascension[0].atk.step}/lvl</div>
                                </div>
                                <div className="flex justify-between items-baseline mt-2">
                                    <div>
                                        <div className="text-xl font-mono">{char.ascension[0].atk.base.toFixed(0)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-accent-gold">{Math.round(maxStats.atk)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-bg-card to-bg-primary p-4 rounded-lg border border-border">
                                <div className="text-text-primary font-bold flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg"><Shield/></span> DEF
                                    </div>
                                    <div className="text-xs text-text-secondary">+{char.ascension[0].def.step}/lvl</div>
                                </div>
                                <div className="flex justify-between items-baseline mt-2">
                                    <div>
                                        <div className="text-xl font-mono">{char.ascension[0].def.base.toFixed(0)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-accent-gold">{Math.round(maxStats.def)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-bg-card to-bg-primary p-4 rounded-lg border border-border transition-colors">
                                <div className="text-text-primary font-bold flex items-center gap-2">
                                    <span className="text-lg"><Zap/></span> SPD
                                </div>
                                <div className="flex justify-between items-baseline mt-2">
                                    <div>
                                        <div className="text-xl font-mono">{char.ascension[0].spd.base.toFixed(0)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-accent-gold">{char.ascension[0].spd.base.toFixed(0)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-bg-card to-bg-primary p-4 rounded-lg border border-border transition-colors">
                                <div className="text-text-primary font-bold flex items-center gap-2">
                                    <span className="text-lg"><Target/></span> CRIT Rate
                                </div>
                                <div className="flex justify-between items-baseline mt-2">
                                    <div>
                                        <div className="text-xl font-mono">{(char.ascension[0].critRate.base * 100).toFixed(1)}%</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-accent-gold">{(char.ascension[0].critRate.base * 100).toFixed(1)}%</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gradient-to-br from-bg-card to-bg-primary p-4 rounded-lg border border-border">
                                <div className="text-text-primary font-bold flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg"><Sparkles/></span> CRIT DMG
                                    </div>
                                </div>
                                <div className="flex justify-between items-baseline mt-2">
                                    <div>
                                        <div className="text-xl font-mono">{(char.ascension[0].critDmg.base * 100).toFixed(0)}%</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-mono text-accent-gold">{(char.ascension[0].critDmg.base * 100).toFixed(0)}%</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 80</div>
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
                            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${activeTab === tab ? "bg-accent-red text-text-primary border border-accent-red shadow-lg shadow-accent-red/20" : "bg-bg-card/60 text-text-primary/80 hover:text-text-primary hover:bg-bg-elevated/60 border border-border hover:cursor-pointer"}`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-6">
                {activeTab === "skills" && char.skills && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-bg-card/80 to-bg-primary/80 backdrop-blur-sm rounded-xl p-6 border border-border">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-accent-red/10 rounded-lg flex items-center justify-center border border-accent-red/20">
                                    <span className="text-accent-gold text-xl">A</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-text-primary">Basic Attack</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-accent-gold text-sm font-semibold px-2 py-0.5 bg-bg-elevated rounded-full">
                                            Max Level: {char.skills.basic.maxLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <h4 className="text-lg font-semibold mb-2">{char.skills.basic.name}</h4>
                            {renderSkillValues(char.skills.basic)}
                        </div>

                        <div className="bg-gradient-to-br from-bg-card/80 to-bg-primary/80 backdrop-blur-sm rounded-xl p-6 border border-border">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-accent-red/10 rounded-lg flex items-center justify-center border border-accent-red/20">
                                    <span className="text-accent-gold text-xl">S</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-text-primary">Skill</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-accent-gold text-sm font-semibold px-2 py-0.5 bg-bg-elevated rounded-full">
                                            Max Level: {char.skills.skill.maxLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <h4 className="text-lg font-semibold mb-2">{char.skills.skill.name}</h4>
                            {renderSkillValues(char.skills.skill)}
                        </div>

                        <div className="bg-gradient-to-br from-bg-card/80 to-bg-primary/80 backdrop-blur-sm rounded-xl p-6 border border-border">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-accent-red/10 rounded-lg flex items-center justify-center border border-accent-red/20">
                                    <span className="text-accent-gold text-xl">U</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-text-primary">Ultimate</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-accent-gold text-sm font-semibold px-2 py-0.5 bg-bg-elevated rounded-full">
                                            Max Level: {char.skills.ult.maxLevel}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <h4 className="text-lg font-semibold mb-2">{char.skills.ult.name}</h4>
                            {renderSkillValues(char.skills.ult)}
                        </div>

                        <div className="bg-gradient-to-br from-bg-card/80 to-bg-primary/80 backdrop-blur-sm rounded-xl p-6 border border-border">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-accent-red/10 rounded-lg flex items-center justify-center border border-accent-red/20">
                                    <span className="text-accent-gold text-xl">T</span>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-text-primary">Talent</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-accent-gold text-sm font-semibold px-2 py-0.5 bg-bg-elevated rounded-full">
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
                                className="bg-gradient-to-br from-bg-card/80 to-bg-primary/80 backdrop-blur-sm rounded-xl p-6 border border-accent-red/50"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-text-primary font-bold text-lg bg-accent-red/10 px-3 py-1 rounded-full">
                                        E{index + 1}
                                    </div>
                                    <div className="text-sm text-text-secondary">Eidolon {index + 1}</div>
                                </div>
                                <h3 className="text-lg font-semibold mb-3 text-text-primary">{eidolon.name}</h3>
                                <p className="text-text-primary/80 text-sm mb-4">{eidolon.desc}</p>
                                
                                {eidolon.levelUpSkills && Object.keys(eidolon.levelUpSkills).length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <span className="text-green-400 text-sm font-semibold">Level Up: </span>
                                        {Object.entries(eidolon.levelUpSkills).map(([skill, levels]) => (
                                            <span key={skill} className="text-text-primary/80 text-sm ml-2 bg-bg-elevated/50 px-2 py-1 rounded">
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
                            <div className="bg-gradient-to-br from-bg-card/80 to-bg-primary/80 backdrop-blur-sm rounded-xl p-6 border border-accent-red/20">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-accent-red/10 rounded-lg flex items-center justify-center border border-accent-red/20">
                                        <span className="text-accent-gold text-xl">T</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-primary">Technique</h3>
                                </div>
                                <h4 className="text-lg font-semibold mb-2 text-text-primary">{char.traces.technique.name}</h4>
                                <p className="text-text-primary/80 mt-2">{char.traces.technique.desc}</p>
                            </div>
                        )}

                        {char.traces.abilities && Object.keys(char.traces.abilities).length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-text-primary border-b border-accent-red/50 pb-2">Abilities</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(char.traces.abilities).map(([key, ability]) => (
                                        <div 
                                            key={key} 
                                            className="bg-gradient-to-br from-bg-card/80 to-bg-primary/80 backdrop-blur-sm rounded-xl p-4 border border-border"
                                        >
                                            <h4 className="text-lg font-semibold text-text-primary mb-2">{ability.name}</h4>
                                            <p className="text-text-primary/80 text-sm">{ability.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {char.traces.stats && Object.keys(char.traces.stats).length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-text-primary border-b border-accent-red/50 pb-2">Stat Bonuses</h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {Object.entries(char.traces.stats).map(([key, stat]) => (
                                        <div 
                                            key={key} 
                                            className="bg-gradient-to-br from-bg-card/80 to-bg-primary/80 backdrop-blur-sm rounded-xl p-4 border border-border"
                                        >
                                            <h4 className="font-semibold text-text-primary text-sm mb-2">{stat.name}</h4>
                                            <p className="text-text-primary/80 text-xs">{stat.desc}</p>
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
                            <div className="bg-gradient-to-br from-bg-card/80 to-bg-primary/80 backdrop-blur-sm rounded-xl p-6 border border-accent-gold/30">
                                <h3 className="text-xl font-bold mb-4 text-text-primary">Recommended Light Cones</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {char.build.lightCones.filter(cone => isValidBuildEntry(cone.name)).map((cone, index) => {
                                        const coneImage = getLightConeImage(cone.name);
                                        const pathIcon = getLightConePathIcon(cone.name);
                                        const lcId = getLightconeId(cone.name);
                                        
                                        return (
                                            <div key={index} className="bg-bg-card/60 rounded-lg p-4 border border-border hover:border-[#E8C547]/30 transition-colors duration-[300ms]">
                                                <div onClick={() => navigate(`/lightcones/${lcId}`)} className="flex gap-3 hover:cursor-pointer">
                                                    {coneImage && (
                                                        <div className="relative flex-shrink-0">
                                                            <img 
                                                                src={coneImage} 
                                                                alt={cone.name}
                                                                className="w-16 h-16 rounded-lg border border-blue-500/30"
                                                            />
                                                            {pathIcon && (
                                                                <div className="absolute -top-1 -right-1 w-6 h-6 bg-bg-primary/60 rounded-full border border-border flex items-center justify-center">
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
                                                                <h4 className="text-lg font-semibold text-accent-gold">{cone.name}</h4>
                                                                {lightConeData[cone.name]?.path && (
                                                                    <div className="flex items-center gap-1 mt-1">
                                                                        <span className="text-xs text-text-secondary">Path:</span>
                                                                        <span className="text-xs text-blue-200">{lightConeData[cone.name].path}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                {Array.from({ length: cone.rarity }).map((_, i) => (
                                                                    <Star key={i} className="text-accent-gold fill-accent-gold" size={14}/>
                                                                ))}
                                                                {cone.priority === 1 && (
                                                                    <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-300 text-xs rounded-full">
                                                                        Best
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <p className="text-text-primary/80 text-sm">{cone.description}</p>                                                                                                            
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                                
                                {!buildDataLoaded && Object.keys(lightConeData).length === 0 && (
                                    <div className="text-center py-4">
                                        <div className="text-text-secondary text-sm">Loading light cone images...</div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {char.build.relicSets && char.build.relicSets.length > 0 && (
                                <div className="bg-gradient-to-br from-bg-card/80 to-bg-primary/80 backdrop-blur-sm rounded-xl p-6 border border-purple-500/30">
                                    <h3 className="text-xl font-bold mb-4 text-text-primary">Relic Sets</h3>
                                    <div className="space-y-4">
                                        {char.build.relicSets.filter(set => isValidBuildEntry(set.name)).map((set, index) => {
                                            const setIcon = getRelicSetIcon(set.name);
                                            const setData = relicSetData[set.name] || allSetData[set.name];
                                            const pieceIcons = getPieceIcons(setData);
                                            const pieceCount = pieceIcons.length;
                                            
                                            return (
                                                <div key={index} className="bg-bg-card/60 rounded-lg p-4 hover:bg-bg-elevated/60 transition-colors">
                                                    <div className="flex gap-4 items-start">
                                                        {setIcon && (
                                                            <div className="relative flex-shrink-0">
                                                                <img 
                                                                    src={setIcon} 
                                                                    alt={set.name}
                                                                    className="w-16 h-16 rounded-lg border border-purple-500/30"
                                                                    title={set.name}
                                                                />
                                                                {pieceCount > 0 && (
                                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-bg-primary/80 rounded-full border border-border flex items-center justify-center">
                                                                        <span className="text-xs font-bold text-purple-300">
                                                                            {pieceCount}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <h4 className="text-lg font-semibold text-accent-gold">{set.name}</h4>
                                                                    {pieceCount > 0 && (
                                                                        <div className="mt-1 text-xs text-text-secondary">
                                                                            {pieceCount} pieces
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {set.priority === 1 && (
                                                                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                                                                        Recommended
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-text-primary/80 text-sm mb-3">{set.description}</p>
                                                            
                                                            {pieceIcons.length > 0 && (
                                                                <div className="mt-3 flex gap-2 flex-wrap">
                                                                    {pieceIcons.map((piece, idx) => (
                                                                        <div key={idx} className="relative group">
                                                                            <img 
                                                                                src={piece.icon} 
                                                                                alt={piece.name}
                                                                                className="w-8 h-8 rounded border border-gray-600 hover:border-purple-400 transition-colors"
                                                                                title={`${piece.type}: ${piece.name}`}
                                                                            />
                                                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-bg-primary text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-border">
                                                                                {piece.type}: {piece.name}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {!buildDataLoaded && Object.keys(relicSetData).length === 0 && (
                                        <div className="text-center py-4">
                                            <div className="text-text-secondary text-sm">Loading relic set images...</div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {char.build.planarSets && char.build.planarSets.length > 0 && (
                                <div className="bg-gradient-to-br from-bg-card/80 to-bg-primary/80 backdrop-blur-sm rounded-xl p-6 border border-blue-500/30">
                                    <h3 className="text-xl font-bold mb-4 text-text-primary">Planar Ornaments</h3>
                                    <div className="space-y-4">
                                        {char.build.planarSets.filter(set => isValidBuildEntry(set.name)).map((set, index) => {
                                            const setIcon = getPlanarSetIcon(set.name);
                                            const setData = planarSetData[set.name] || allSetData[set.name];
                                            const pieceIcons = getPieceIcons(setData);
                                            const pieceCount = pieceIcons.length;
                                            
                                            return (
                                                <div key={index} className="bg-bg-card/60 rounded-lg p-4 hover:bg-bg-elevated/60 transition-colors">
                                                    <div className="flex gap-4 items-start">
                                                        {setIcon && (
                                                            <div className="relative flex-shrink-0">
                                                                <img 
                                                                    src={setIcon} 
                                                                    alt={set.name}
                                                                    className="w-16 h-16 rounded-lg border border-blue-500/30"
                                                                    title={set.name}
                                                                />
                                                                {pieceCount > 0 && (
                                                                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-bg-primary/80 rounded-full border border-border flex items-center justify-center">
                                                                        <span className="text-xs font-bold text-accent-gold">
                                                                            {pieceCount}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div>
                                                                    <h4 className="text-lg font-semibold text-accent-gold">{set.name}</h4>
                                                                    {pieceCount > 0 && (
                                                                        <div className="mt-1 text-xs text-text-secondary">
                                                                            {pieceCount} pieces
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                {set.priority === 1 && (
                                                                    <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">
                                                                        Recommended
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <p className="text-text-primary/80 text-sm mb-3">{set.description}</p>
                                                            
                                                            {pieceIcons.length > 0 && (
                                                                <div className="mt-3 flex gap-3">
                                                                    {pieceIcons.map((piece, idx) => (
                                                                        <div key={idx} className="relative group">
                                                                            <div className="flex flex-col items-center">
                                                                                <img 
                                                                                    src={piece.icon} 
                                                                                    alt={piece.name}
                                                                                    className="w-10 h-10 rounded border border-blue-500/30 hover:border-blue-400 transition-colors"
                                                                                    title={`${piece.type}: ${piece.name}`}
                                                                                />
                                                                                <span className="text-xs text-text-secondary mt-1">{piece.type.split(' ')[0]}</span>
                                                                            </div>
                                                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-bg-primary text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 border border-border">
                                                                                {piece.name}
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    
                                    {!buildDataLoaded && Object.keys(planarSetData).length === 0 && (
                                        <div className="text-center py-4">
                                            <div className="text-text-secondary text-sm">Loading planar set images...</div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {char.build.mainStats && (
                                <div className="bg-gradient-to-br from-bg-card/80 to-bg-primary/80 backdrop-blur-sm rounded-xl p-6 border border-green-500/30">
                                    <h3 className="text-xl font-bold mb-4 text-text-primary">Main Stats Priority</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-text-secondary text-sm font-medium">Body</h4>
                                            <p className="text-text-primary font-medium">{char.build.mainStats.body}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-text-secondary text-sm font-medium">Feet</h4>
                                            <p className="text-text-primary font-medium">{char.build.mainStats.feet}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-text-secondary text-sm font-medium">Sphere</h4>
                                            <p className="text-text-primary font-medium">{char.build.mainStats.sphere}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-text-secondary text-sm font-medium">Rope</h4>
                                            <p className="text-text-primary font-medium">{char.build.mainStats.rope}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {char.build.subStats && (
                                <div className="bg-gradient-to-br from-bg-card/80 to-bg-primary/80 backdrop-blur-sm rounded-xl p-6 border border-orange-500/30">
                                    <h3 className="text-xl font-bold mb-4 text-text-primary">Sub Stats Priority</h3>
                                    <div className="space-y-2">
                                        {char.build.subStats.priority && char.build.subStats.priority.map((stat, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <div className="w-6 h-6 flex items-center justify-center bg-bg-elevated rounded-full text-sm font-bold">
                                                    {index + 1}
                                                </div>
                                                <span className="text-text-primary/80">{stat}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {char.build.teams && char.build.teams.length > 0 && (
                            <div className="bg-gradient-to-br from-bg-card/80 to-bg-primary/80 backdrop-blur-sm rounded-xl p-6 border border-pink-500/30">
                                <h3 className="text-xl font-bold mb-4 text-text-primary">Team Compositions</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {char.build.teams.map((team, index) => (
                                        <div key={index} className="bg-bg-card/60 rounded-lg p-4 border border-border">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-lg font-semibold text-text-primary">{team.name}</h4>
                                                <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                                                    Team {index + 1}
                                                </span>
                                            </div>
                                            <p className="text-text-primary/80 text-sm mb-3">{team.description}</p>
                                            
                                            <div className="mb-3">
                                                <h5 className="text-text-secondary text-sm font-medium mb-2">Team Members:</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {team.teamMembers.map((member, idx) => (
                                                        <span key={idx} className="px-3 py-1 bg-bg-elevated/50 text-text-primary/80 rounded-full text-sm">
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
                        <div className="bg-gradient-to-br from-bg-card/80 to-bg-primary/80 backdrop-blur-sm rounded-xl p-6 border border-border">
                            <h3 className="text-xl font-bold mb-4 text-text-primary">Character Overview</h3>
                            <div className="flex items-start gap-4">
                                <div className="flex flex-col items-center gap-2">
                                    <img 
                                        src={`${char.miniIcon}`} 
                                        alt={char.name} 
                                        className="w-24 h-24 rounded-full border-2 border-accent-red/50"
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
                                    <p className="text-text-primary/80">
                                        <span className="font-bold text-accent-gold">{formatCharName(char.name)}</span> is a 
                                        <span className={`${char.rarity === 5 ? "text-accent-gold" : "text-purple-400"}`}> {char.rarity}-star </span>
                                        <span className="font-semibold"> {char.element} </span>
                                        character following the 
                                        <span className="font-semibold"> {char.path} </span>
                                        path.
                                    </p>
                                    <div className="mt-4 flex items-center gap-2">
                                        <span className="text-text-secondary">Rarity:</span>
                                        <div className="flex">
                                            {Array.from({ length: char.rarity }).map((_, index) => (
                                                <Star key={index} className="text-accent-gold fill-accent-gold" size={16}/>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {char.ascension && (
                            <div className="bg-gradient-to-br from-bg-card/80 to-bg-primary/80 backdrop-blur-sm rounded-xl p-6 border border-border">
                                <h3 className="text-xl font-bold mb-4 text-text-primary">Ascension Stats by Level Range</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="text-left py-3 px-2 text-text-primary/80">Level Range</th>
                                                <th className="text-left py-3 px-2 text-text-primary">Base HP</th>
                                                <th className="text-left py-3 px-2 text-text-primary">Base ATK</th>
                                                <th className="text-left py-3 px-2 text-text-primary">Base DEF</th>
                                                <th className="text-left py-3 px-2 text-text-primary">SPD</th>
                                                <th className="text-left py-3 px-2 text-text-primary">CRIT Rate</th>
                                                <th className="text-left py-3 px-2 text-text-primary">CRIT DMG</th>
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
                                                    <tr key={index} className="border-b border-border hover:bg-bg-elevated/50 transition-colors">
                                                        <td className="py-3 px-2 font-medium">
                                                            <div className="font-semibold text-left">Level {levelRange}</div>
                                                            <div className="text-xs text-text-secondary text-left">Ascension {index + 1}</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="font-mono text-left">{asc.hp.base.toFixed(0)}</div>
                                                            <div className="text-xs text-text-secondary text-left">+{asc.hp.step}/lvl</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="font-mono text-left">{asc.atk.base.toFixed(0)}</div>
                                                            <div className="text-xs text-text-secondary text-left">+{asc.atk.step}/lvl</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="font-mono text-left">{asc.def.base.toFixed(0)}</div>
                                                            <div className="text-xs text-text-secondary text-left">+{asc.def.step}/lvl</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="font-mono text-left">{asc.spd.base.toFixed(0)}</div>
                                                            <div className="text-xs text-text-secondary text-left">Static</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="font-mono text-left">{(asc.critRate.base * 100).toFixed(1)}%</div>
                                                            <div className="text-xs text-text-secondary text-left">Base</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="font-mono text-left">{(asc.critDmg.base * 100).toFixed(0)}%</div>
                                                            <div className="text-xs text-text-secondary text-left">Base</div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 text-sm text-text-secondary">
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