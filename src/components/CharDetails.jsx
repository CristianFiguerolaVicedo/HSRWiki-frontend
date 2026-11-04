import { ArrowLeft, ClipboardList, Columns3, Heart, Shield, Sparkles, Star, Swords, Target, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchJson } from "../services/apiClient";
import { getLightConeByName } from "../services/lightConeService";
import { getRelicSetByName } from "../services/relicService";
import { useCharacters } from "../hooks/useCharacters";
import SkeletonLoader from "./SkeletonLoader";
import FavoriteButton from "./FavoriteButton";
import CharLore from "./CharLore";
import SkillCard from "./SkillCard";
import { CollectionControl } from "./Collection";

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

const normalize = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, "");

// Build files name team members loosely ("Trailblazer (Harmony)", "Permansor Terrae", "Topaz"),
// so match them to real characters to be able to link them.
const resolveMember = (name, characters) => {
    const trailblazer = name.match(/^Trailblazer \((\w+)\)$/);
    if (trailblazer) {
        return characters.find((c) => c.name === `Trailblazer${trailblazer[1]}#F`) || null;
    }
    const key = normalize(name);
    const exact = characters.find((c) => normalize(c.name) === key);
    if (exact) return exact;
    const partial = characters.filter((c) => normalize(c.name).includes(key));
    return partial.length === 1 ? partial[0] : null;
};

const SKILL_LABELS = {
    basic: "Basic ATK", skill: "Skill", ult: "Ultimate", talent: "Talent",
    memo_skill: "Memosprite Skill", memo_talent: "Memosprite Talent", elation_skill: "Elation Skill",
};

// Extra skills are labelled by type; Eidolon level-ups use these keys
const EXTRA_SKILL_KEYS = {
    "Basic ATK": "basic", "Skill": "skill", "Ultimate": "ult", "Talent": "talent",
    "Memosprite Skill": "memo_skill", "Memosprite Talent": "memo_talent",
    "Elation Skill": "elation_skill", "Assist Skill": "assist",
};

const levelUpSkills = (eidolon) => {
    const skills = eidolon.level_up_skills || eidolon.levelUpSkills;
    return skills && Object.keys(skills).length > 0 ? skills : null;
};

const statAt = (stat, level) => stat.base + stat.step * (level - 1);

// Ascension phases: [first level, last level]
const ASCENSION_RANGES = [[1, 20], [20, 30], [30, 40], [40, 50], [50, 60], [60, 70], [70, 80]];

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
    const [kit, setKit] = useState("base");
    const [skillPreset, setSkillPreset] = useState("max");

    const navigate = useNavigate();
    const { characters: allCharacters } = useCharacters();

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
            setKit("base");
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
    const capitalize = (value) => value.charAt(0) + value.slice(1).toLowerCase();
    const elementLabel = capitalize(char.element);
    const pathLabel = char.path === "HUNT" ? "The Hunt" : capitalize(char.path);
    const pathIconPath = PATH_ICONS[char.path.toUpperCase()];

    const calculateMaxStats = () => {
        if (!char.ascension || char.ascension.length === 0) return null;

        // Each ascension phase has its own base/step: stat(level) = base + step * (level - 1).
        // Level 80 belongs to the last phase, so using phase 0 left out every ascension bonus.
        const lastPhase = char.ascension[char.ascension.length - 1];
        const level80Stats = {
            hp: statAt(lastPhase.hp, 80),
            atk: statAt(lastPhase.atk, 80),
            def: statAt(lastPhase.def, 80),
            spd: lastPhase.spd.base,
            critRate: lastPhase.critRate.base,
            critDmg: lastPhase.critDmg.base,
        };

        return level80Stats;
    };

    const maxStats = calculateMaxStats();

    const hasEnhancedKit = Boolean(char.enhanced?.skills);
    const activeSkills = kit === "enhanced" && hasEnhancedKit ? char.enhanced.skills : char.skills;
    const activeTraces = kit === "enhanced" && char.enhanced?.traces ? char.enhanced.traces : char.traces;

    const MAIN_SKILLS = [
        { key: "basic", label: "Basic Attack", letter: "A" },
        { key: "skill", label: "Skill", letter: "S" },
        { key: "ult", label: "Ultimate", letter: "U" },
        { key: "talent", label: "Talent", letter: "T" },
    ];

    const renderKitSelector = () => hasEnhancedKit && (
        <div className="flex flex-wrap items-center gap-3 mb-6 p-3 bg-bg-primary rounded-lg border border-accent-gold/30">
            <span className="text-sm text-text-secondary">This character received an enhanced kit.</span>
            <div className="flex gap-2">
                {[["base", "Original"], ["enhanced", "Enhanced"]].map(([value, label]) => (
                    <button
                        key={value}
                        onClick={() => setKit(value)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${kit === value ? "bg-accent-gold text-bg-primary font-semibold" : "bg-bg-elevated text-text-primary/80 hover:text-text-primary hover:cursor-pointer"}`}
                    >
                        {label}
                    </button>
                ))}
            </div>
        </div>
    );

    // Levels each skill gains from Eidolons (E3/E5 usually add +1 basic, +2 to the others)
    const eidolonBonus = {};
    (char.eidolons || []).forEach((eidolon) => {
        Object.entries(levelUpSkills(eidolon) || {}).forEach(([skill, levels]) => {
            eidolonBonus[skill] = (eidolonBonus[skill] || 0) + levels;
        });
    });

    const renderPresetSelector = () => (
        <div className="flex flex-wrap items-center gap-3 p-3 rounded-lg border border-border bg-bg-card/60">
            <span className="font-hand text-2xl leading-none text-text-secondary">show every skill at</span>
            <div className="flex flex-wrap gap-2">
                {[["min", "Level 1"], ["max", "Max level"], ["eidolon", "Max with Eidolons"]].map(([value, text]) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => setSkillPreset(value)}
                        aria-pressed={skillPreset === value}
                        className={`px-3 py-1 rounded-full text-sm border cursor-pointer transition-colors ${skillPreset === value
                            ? "bg-[#FFE68F] border-[#E3C552] text-text-primary font-semibold"
                            : "bg-bg-card border-border text-text-secondary hover:text-text-primary"}`}
                    >
                        {text}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="text-text-primary">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col items-center md:items-start">
                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-2 text-text-secondary hover:text-text-primary hover:cursor-pointer mb-8 font-hand text-2xl"
                    >
                        <ArrowLeft size={20} />
                        back to everyone
                    </button>
                    <div
                        className={`photo-card tape-${char.element.toLowerCase()} w-72`}
                        style={{ "--tilt": "-1.5deg", "--tape-tilt": "2deg" }}
                    >
                        <span className="washi" aria-hidden="true" />
                        <div className="photo-card__picture">
                            <img
                                src={`${char.icon}`}
                                alt={char.name}
                                className="w-full aspect-[376/512] object-cover"
                            />
                        </div>
                        <p className="font-hand text-2xl text-text-secondary text-center pt-2 leading-none">
                            {pathLabel}, {elementLabel}
                        </p>
                    </div>
                    <div className="mt-8 text-center md:text-left">
                        <h1 className="text-5xl font-extrabold tracking-tight text-text-primary">
                            {formatCharName(char.name)}
                        </h1>
                        <div className="flex items-center justify-center md:justify-start gap-1 mt-3" aria-label={`${char.rarity} stars`}>
                            {Array.from({ length: char.rarity }).map((_, index) => (
                                <Star key={index} className="text-accent-gold fill-accent-gold" size={20}/>
                            ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start md:max-w-72">
                            <FavoriteButton kind="characters" id={char.id} name={formatCharName(char.name)} variant="inline" />
                            <CollectionControl kind="characters" id={char.id} name={formatCharName(char.name)} />
                            <button type="button" onClick={() => navigate(`/planner?add=char:${char.id}`)}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold bg-bg-card border-border text-text-secondary hover:text-text-primary hover:border-border-hover cursor-pointer transition-colors">
                                <ClipboardList size={16} aria-hidden="true" /> Plan materials
                            </button>
                            <button type="button" onClick={() => {
                                    // Adds this character to the last comparison (three at most, the oldest leaves)
                                    let last = [];
                                    try { last = JSON.parse(localStorage.getItem("hsrwiki-compare") || "[]"); } catch { last = []; }
                                    const ids = [...(Array.isArray(last) ? last : []).filter((x) => x !== String(char.id)), String(char.id)].slice(-3);
                                    navigate(`/compare?ids=${ids.join(",")}`);
                                }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-semibold bg-bg-card border-border text-text-secondary hover:text-text-primary hover:border-border-hover cursor-pointer transition-colors">
                                <Columns3 size={16} aria-hidden="true" /> Compare
                            </button>
                        </div>
                    </div>
                </div>
                <div className="flex-1 glass-panel p-6 self-start">
                    <h2 className="text-2xl font-bold mb-6 text-text-primary">Base stats <span className="font-hand text-2xl font-normal text-text-secondary">level 1 and level 80</span></h2>
                    {char.ascension && char.ascension.length > 0 && (
                        <div className="grid grid-cols-2 xl:grid-cols-3 gap-3">
                            <div className="bg-bg-card p-4 rounded-lg border border-border min-w-0">
                                <div className="text-text-primary font-bold flex flex-wrap items-center justify-between gap-x-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg"><Heart/></span> HP
                                    </div>
                                    <div className="text-xs text-text-secondary whitespace-nowrap">+{char.ascension[0].hp.step.toFixed(2)}/lvl</div>
                                </div>
                                <div className="flex flex-wrap justify-between items-baseline gap-x-3 mt-2">
                                    <div>
                                        <div className="text-xl tabular-nums">{char.ascension[0].hp.base.toFixed(0)}</div>
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
                                    <div className="text-xs text-text-secondary whitespace-nowrap">+{char.ascension[0].atk.step.toFixed(2)}/lvl</div>
                                </div>
                                <div className="flex flex-wrap justify-between items-baseline gap-x-3 mt-2">
                                    <div>
                                        <div className="text-xl tabular-nums">{char.ascension[0].atk.base.toFixed(0)}</div>
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
                                    <div className="text-xs text-text-secondary whitespace-nowrap">+{char.ascension[0].def.step.toFixed(2)}/lvl</div>
                                </div>
                                <div className="flex flex-wrap justify-between items-baseline gap-x-3 mt-2">
                                    <div>
                                        <div className="text-xl tabular-nums">{char.ascension[0].def.base.toFixed(0)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl tabular-nums text-accent-gold">{Math.round(maxStats.def)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-bg-card p-4 rounded-lg border border-border transition-colors min-w-0">
                                <div className="text-text-primary font-bold flex items-center gap-2">
                                    <span className="text-lg"><Zap/></span> SPD
                                </div>
                                <div className="flex flex-wrap justify-between items-baseline gap-x-3 mt-2">
                                    <div>
                                        <div className="text-xl tabular-nums">{char.ascension[0].spd.base.toFixed(0)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl tabular-nums text-accent-gold">{char.ascension[0].spd.base.toFixed(0)}</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-bg-card p-4 rounded-lg border border-border transition-colors min-w-0">
                                <div className="text-text-primary font-bold flex items-center gap-2">
                                    <span className="text-lg"><Target/></span> CRIT Rate
                                </div>
                                <div className="flex flex-wrap justify-between items-baseline gap-x-3 mt-2">
                                    <div>
                                        <div className="text-xl tabular-nums">{(char.ascension[0].critRate.base * 100).toFixed(1)}%</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl tabular-nums text-accent-gold">{(char.ascension[0].critRate.base * 100).toFixed(1)}%</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-bg-card p-4 rounded-lg border border-border min-w-0">
                                <div className="text-text-primary font-bold flex flex-wrap items-center justify-between gap-x-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg"><Sparkles/></span> CRIT DMG
                                    </div>
                                </div>
                                <div className="flex flex-wrap justify-between items-baseline gap-x-3 mt-2">
                                    <div>
                                        <div className="text-xl tabular-nums">{(char.ascension[0].critDmg.base * 100).toFixed(0)}%</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 1</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl tabular-nums text-accent-gold">{(char.ascension[0].critDmg.base * 100).toFixed(0)}%</div>
                                        <div className="text-xs text-text-secondary mt-1">Lv. 80</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="mb-6">
                <nav className="flex flex-wrap gap-1 border-b-2 border-border-hover" role="tablist">
                    {["overview", "lore", "skills", "eidolons", "traces", "builds"].map((tab, i) => (
                        <button
                            key={tab}
                            role="tab"
                            aria-selected={activeTab === tab}
                            onClick={() => setActiveTab(tab)}
                            className={`relative -mb-[2px] px-5 py-2.5 rounded-t-lg border-2 font-semibold transition-colors duration-150 hover:cursor-pointer
                                ${activeTab === tab
                                    ? "bg-bg-card border-border-hover border-b-bg-card text-text-primary"
                                    : "bg-bg-elevated/70 border-transparent text-text-secondary hover:text-text-primary hover:bg-bg-elevated"}`}
                        >
                            {activeTab === tab && (
                                <span className={`absolute inset-x-2 -top-[2px] h-1 rounded-full tab-strip-${i}`} aria-hidden="true" />
                            )}
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </nav>
            </div>
            <div className="mt-6">
                {activeTab === "skills" && activeSkills && (
                    <div className="space-y-6">
                        {renderKitSelector()}
                        {renderPresetSelector()}
                        {MAIN_SKILLS.filter(({ key }) => activeSkills[key]).map(({ key, label, letter }) => (
                            <SkillCard key={`${kit}-${skillPreset}-${key}`} skill={activeSkills[key]} label={label} letter={letter}
                                preset={skillPreset} eidolonBonus={eidolonBonus[key] || 0} />
                        ))}
                        {activeSkills.extra?.length > 0 && (
                            <>
                                <h3 className="text-xl font-bold pt-2 text-text-primary border-b border-accent-red/50 pb-2">Additional Skills</h3>
                                {activeSkills.extra.map((extra, index) => (
                                    <SkillCard key={`${kit}-${skillPreset}-extra-${index}`} skill={extra}
                                        label={SKILL_LABELS[extra.type] || extra.type || "Skill"} letter={(SKILL_LABELS[extra.type] || extra.type || "?").charAt(0)}
                                        preset={skillPreset} eidolonBonus={eidolonBonus[EXTRA_SKILL_KEYS[extra.type]] || 0} />
                                ))}
                            </>
                        )}
                    </div>
                )}

                {activeTab === "eidolons" && char.eidolons && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {char.eidolons.map((eidolon, index) => (
                            <div 
                                key={index} 
                                className="glass-panel p-6 border border-accent-red/50"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="text-text-primary font-bold text-lg bg-accent-red/10 px-3 py-1 rounded-full">
                                        E{index + 1}
                                    </div>
                                    <div className="text-sm text-text-secondary">Eidolon {index + 1}</div>
                                </div>
                                <h3 className="text-lg font-semibold mb-3 text-text-primary">{eidolon.name}</h3>
                                <p className="text-text-primary/80 text-sm mb-4">{eidolon.desc}</p>
                                
                                {levelUpSkills(eidolon) && (
                                    <div className="mt-4 pt-4 border-t border-border">
                                        <span className="text-emerald-700 text-sm font-semibold">Level Up: </span>
                                        {Object.entries(levelUpSkills(eidolon)).map(([skill, levels]) => (
                                            <span key={skill} className="text-text-primary/80 text-sm ml-2 bg-bg-elevated/50 px-2 py-1 rounded">
                                                {SKILL_LABELS[skill] || skill} +{levels}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                {activeTab === "traces" && activeTraces && (
                    <div className="space-y-6">
                        {renderKitSelector()}
                        {activeTraces.technique && (
                            <div className="glass-panel p-6 border border-accent-red/20">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-accent-red/10 rounded-lg flex items-center justify-center border border-accent-red/20">
                                        <span className="text-accent-gold text-xl">T</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-primary">Technique</h3>
                                </div>
                                <h4 className="text-lg font-semibold mb-2 text-text-primary">{activeTraces.technique.name}</h4>
                                <p className="text-text-primary/80 mt-2">{activeTraces.technique.desc}</p>
                            </div>
                        )}

                        {activeTraces.abilities && Object.keys(activeTraces.abilities).length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-text-primary border-b border-accent-red/50 pb-2">Abilities</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {Object.entries(activeTraces.abilities).map(([key, ability]) => (
                                        <div 
                                            key={key} 
                                            className="glass-panel p-4 border border-border"
                                        >
                                            <h4 className="text-lg font-semibold text-text-primary mb-2">{ability.name}</h4>
                                            <p className="text-text-primary/80 text-sm">{ability.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTraces.extra?.length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-text-primary border-b border-accent-red/50 pb-2">Additional Traces</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {activeTraces.extra.map((trace, index) => (
                                        <div key={index} className="glass-panel p-4 border border-border">
                                            <h4 className="text-lg font-semibold text-text-primary mb-2">{trace.name}</h4>
                                            <p className="text-text-primary/80 text-sm whitespace-pre-line">{trace.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTraces.stats && Object.keys(activeTraces.stats).length > 0 && (
                            <div>
                                <h3 className="text-xl font-bold mb-4 text-text-primary border-b border-accent-red/50 pb-2">Stat Bonuses</h3>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    {Object.entries(activeTraces.stats).map(([key, stat]) => (
                                        <div 
                                            key={key} 
                                            className="glass-panel p-4 border border-border"
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

                {activeTab === "lore" && <CharLore lore={char.lore} name={formatCharName(char.name)} />}

                {activeTab === "builds" && !char.build && (
                    <div className="bg-bg-card/60 rounded-xl p-8 border border-border text-center text-text-secondary">
                        No recommended build for {formatCharName(char.name)} yet.
                    </div>
                )}

                {activeTab === "builds" && char.build && (
                    <div className="space-y-6">
                        {char.build.lightCones && char.build.lightCones.length > 0 && (
                            <div className="glass-panel p-6 border border-accent-gold/30">
                                <h3 className="text-xl font-bold mb-4 text-text-primary">Recommended Light Cones</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {char.build.lightCones.filter(cone => isValidBuildEntry(cone.name)).map((cone, index) => {
                                        const coneImage = getLightConeImage(cone.name);
                                        const pathIcon = getLightConePathIcon(cone.name);
                                        const lcId = getLightconeId(cone.name);
                                        
                                        return (
                                            <div key={index} className="bg-bg-primary rounded-lg p-4 border border-border hover:border-[#E8C547]/30 transition-colors duration-[300ms]">
                                                <div onClick={() => lcId && navigate(`/lightcones/${lcId}`)} className="flex gap-3 hover:cursor-pointer">
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
                                                                        className="w-4 h-4 invert opacity-75"
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
                                                                        <span className="text-xs text-sky-800">{lightConeData[cone.name].path}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="flex items-center gap-1">
                                                                {Array.from({ length: cone.rarity }).map((_, i) => (
                                                                    <Star key={i} className="text-accent-gold fill-accent-gold" size={14}/>
                                                                ))}
                                                                {cone.priority === 1 && (
                                                                    <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-rose-700 text-xs rounded-full">
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
                                <div className="glass-panel p-6 border border-purple-500/30">
                                    <h3 className="text-xl font-bold mb-4 text-text-primary">Relic Sets</h3>
                                    <div className="space-y-4">
                                        {char.build.relicSets.filter(set => isValidBuildEntry(set.name)).map((set, index) => {
                                            const setIcon = getRelicSetIcon(set.name);
                                            const setData = relicSetData[set.name] || allSetData[set.name];
                                            const pieceIcons = getPieceIcons(setData);
                                            const pieceCount = pieceIcons.length;
                                            
                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => setData && navigate(`/${isPlanarSet(setData) ? "planars" : "relics"}/${encodeURIComponent(set.name)}`)}
                                                    role={setData ? "link" : undefined}
                                                    className={`bg-bg-primary rounded-lg p-4 hover:bg-bg-elevated/60 transition-colors ${setData ? "hover:cursor-pointer" : ""}`}
                                                >
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
                                                                        <span className="text-xs font-bold text-purple-700">
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
                                                                    <span className="px-2 py-1 bg-green-500/20 text-emerald-700 text-xs rounded-full">
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
                                                                                className="w-8 h-8 rounded border border-border hover:border-purple-400 transition-colors"
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
                                <div className="glass-panel p-6 border border-blue-500/30">
                                    <h3 className="text-xl font-bold mb-4 text-text-primary">Planar Ornaments</h3>
                                    <div className="space-y-4">
                                        {char.build.planarSets.filter(set => isValidBuildEntry(set.name)).map((set, index) => {
                                            const setIcon = getPlanarSetIcon(set.name);
                                            const setData = planarSetData[set.name] || allSetData[set.name];
                                            const pieceIcons = getPieceIcons(setData);
                                            const pieceCount = pieceIcons.length;
                                            
                                            return (
                                                <div
                                                    key={index}
                                                    onClick={() => setData && navigate(`/${isPlanarSet(setData) ? "planars" : "relics"}/${encodeURIComponent(set.name)}`)}
                                                    role={setData ? "link" : undefined}
                                                    className={`bg-bg-primary rounded-lg p-4 hover:bg-bg-elevated/60 transition-colors ${setData ? "hover:cursor-pointer" : ""}`}
                                                >
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
                                                                    <span className="px-2 py-1 bg-green-500/20 text-emerald-700 text-xs rounded-full">
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
                                <div className="glass-panel p-6 border border-green-500/30">
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
                                <div className="glass-panel p-6 border border-orange-500/30">
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
                            <div className="glass-panel p-6 border border-pink-500/30">
                                <h3 className="text-xl font-bold mb-4 text-text-primary">Team Compositions</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {char.build.teams.map((team, index) => (
                                        <div key={index} className="bg-bg-primary rounded-lg p-4 border border-border">
                                            <div className="flex justify-between items-start mb-3">
                                                <h4 className="text-lg font-semibold text-text-primary">{team.name}</h4>
                                                <span className="px-2 py-1 bg-purple-500/20 text-purple-700 text-xs rounded-full">
                                                    Team {index + 1}
                                                </span>
                                            </div>
                                            <p className="text-text-primary/80 text-sm mb-3">{team.description}</p>
                                            
                                            <div className="mb-3">
                                                <h5 className="text-text-secondary text-sm font-medium mb-2">Team Members:</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {(team.teamMembers || []).flatMap((member) => member.split(" / ")).map((member, idx) => {
                                                        const linked = resolveMember(member, allCharacters);
                                                        return linked ? (
                                                            <button
                                                                key={idx}
                                                                onClick={() => navigate(`/char/${linked.id}`)}
                                                                className="flex items-center gap-2 pl-1 pr-3 py-1 bg-bg-elevated/50 text-text-primary/80 rounded-full text-sm hover:text-text-primary hover:bg-bg-elevated hover:cursor-pointer transition-colors"
                                                            >
                                                                <img src={linked.miniIcon} alt="" className="w-6 h-6 rounded-full" />
                                                                {member}
                                                            </button>
                                                        ) : (
                                                            <span key={idx} className="px-3 py-1 bg-bg-elevated/50 text-text-primary/80 rounded-full text-sm">
                                                                {member}
                                                            </span>
                                                        );
                                                    })}
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
                        <div className="glass-panel p-6 border border-border">
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
                                                className="w-8 h-8 invert opacity-75"
                                                title={`Path: ${char.path}`}
                                            />
                                        )}
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <p className="text-text-primary/80">
                                        <span className="font-bold text-accent-gold">{formatCharName(char.name)}</span> is a 
                                        <span className={`${char.rarity === 5 ? "text-accent-gold" : "text-purple-700"}`}> {char.rarity}-star </span>
                                        <span className="font-semibold"> {elementLabel} </span>
                                        character who walks the Path of
                                        <span className="font-semibold"> {pathLabel}</span>.
                                    </p>
                                    {char.lore?.description && (
                                        <div className="mt-3">
                                            <p className="text-text-secondary leading-relaxed line-clamp-3">
                                                {char.lore.description.replace(/<\/?[ib]>/g, "")}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setActiveTab("lore")}
                                                className="mt-1 font-hand text-xl text-accent-red hover:underline cursor-pointer"
                                            >
                                                read their story →
                                            </button>
                                        </div>
                                    )}
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
                            <div className="glass-panel p-6 border border-border">
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
                                                const [fromLevel, toLevel] = ASCENSION_RANGES[index] || [index * 10 + 1, index * 10 + 10];
                                                const levelRange = `${fromLevel}-${toLevel}`;

                                                return (
                                                    <tr key={index} className="border-b border-border hover:bg-bg-elevated/50 transition-colors">
                                                        <td className="py-3 px-2 font-medium">
                                                            <div className="font-semibold text-left">Level {levelRange}</div>
                                                            <div className="text-xs text-text-secondary text-left">{index === 0 ? "Not ascended" : `Ascension ${index}`}</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="tabular-nums text-left">{statAt(asc.hp, fromLevel).toFixed(0)} → {statAt(asc.hp, toLevel).toFixed(0)}</div>
                                                            <div className="text-xs text-text-secondary text-left">+{asc.hp.step.toFixed(2)}/lvl</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="tabular-nums text-left">{statAt(asc.atk, fromLevel).toFixed(0)} → {statAt(asc.atk, toLevel).toFixed(0)}</div>
                                                            <div className="text-xs text-text-secondary text-left">+{asc.atk.step.toFixed(2)}/lvl</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="tabular-nums text-left">{statAt(asc.def, fromLevel).toFixed(0)} → {statAt(asc.def, toLevel).toFixed(0)}</div>
                                                            <div className="text-xs text-text-secondary text-left">+{asc.def.step.toFixed(2)}/lvl</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="tabular-nums text-left">{asc.spd.base.toFixed(0)}</div>
                                                            <div className="text-xs text-text-secondary text-left">Static</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="tabular-nums text-left">{(asc.critRate.base * 100).toFixed(1)}%</div>
                                                            <div className="text-xs text-text-secondary text-left">Base</div>
                                                        </td>
                                                        <td className="py-3 px-2">
                                                            <div className="tabular-nums text-left">{(asc.critDmg.base * 100).toFixed(0)}%</div>
                                                            <div className="text-xs text-text-secondary text-left">Base</div>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="mt-4 text-sm text-text-secondary">
                                    <p>Note: Values show the stat at the first and last level of each range. Stats increase by the shown amount with each character level.</p>
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