import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJson } from "../services/apiClient";
import { ArrowLeft, Star } from "lucide-react";

const getRarityColor = (rarity) => {
    switch (rarity) {
        case 5: return 'fill-accent-gold text-accent-gold';
        case 4: return 'fill-accent-purple text-accent-purple';
        case 3: return 'fill-sky-600 text-sky-700';
        case 2: return 'fill-emerald-600 text-emerald-700';
        default: return 'fill-text-muted text-text-muted';
    }
};

const formatName = (name) => name.replace('Trailblazer', 'TB ').replace('#M', '♂').replace('#F', '♀');

// Characters / light cones that need this item, as clickable chips
const UsageList = ({ title, entries, basePath, navigate }) => (
    <div>
        <h3 className="text-sm font-semibold text-text-secondary mb-3">{title} ({entries.length})</h3>
        <div className="flex flex-wrap gap-2">
            {entries.map((entry) => (
                <button
                    key={entry.id}
                    onClick={() => navigate(`${basePath}/${entry.id}`)}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 bg-bg-elevated/50 text-text-primary/80 rounded-full text-sm hover:text-text-primary hover:bg-bg-elevated cursor-pointer transition-colors"
                >
                    {entry.icon && <img src={entry.icon} alt="" className="w-7 h-7 rounded-full object-cover" />}
                    {formatName(entry.name)}
                </button>
            ))}
        </div>
    </div>
);

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                setLoading(true);
                const data = await fetchJson(`/items/${id}`);
                setItem(data || null);
            } catch (err) {
                console.error("Error fetching item:", err);
                setItem(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchItem();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-text-primary text-xl">Loading item details...</div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-text-primary text-xl">Item not found</div>
            </div>
        )
    }

    const usedBy = item.usedBy;
    const usedByCharacters = usedBy?.characters || [];
    const usedByLightCones = usedBy?.lightCones || [];
    const sources = item.come_from || [];

    return (
        <div className="text-text-primary p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate("/items")}
                    className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8 cursor-pointer font-hand text-2xl"
                >
                    <ArrowLeft size={20} />
                    back to the backpack
                </button>

                <div className="flex flex-col md:flex-row gap-8 mb-6">
                    <div className="flex flex-col items-center md:items-start">
                        {item.icon ? (
                            <img
                                src={item.icon}
                                alt={item.name}
                                className="w-48 h-48 rounded-xl shadow-lg"
                            />
                        ) : (
                            <div className="w-48 h-48 rounded-xl border border-border shadow-lg bg-bg-card flex items-center justify-center">
                                <span className="text-text-muted">No Image</span>
                            </div>
                        )}
                    </div>

                    <div className="flex-1 glass-panel p-6">
                        <h1 className="text-4xl font-bold mb-3 text-text-primary">{item.name}</h1>
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                            <span className="px-3 py-1 rounded-full text-sm bg-bg-elevated text-text-primary border border-border">
                                {item.category || item.sub_type || item.type || "Item"}
                            </span>
                            <div className="flex items-center gap-1" title={`${item.rarity || 1}-star`}>
                                {Array.from({ length: item.rarity || 1 }).map((_, index) => (
                                    <Star key={index} className={getRarityColor(item.rarity)} size={16}/>
                                ))}
                            </div>
                        </div>
                        {item.desc ? (
                            <p className="text-text-primary/90 whitespace-pre-line">{item.desc}</p>
                        ) : !item.lore && (
                            <p className="text-text-muted italic">No description available for this item yet.</p>
                        )}
                    </div>
                </div>

                {item.lore && (
                    <div className="glass-panel p-6 mb-6">
                        <h2 className="text-xl font-bold mb-3 text-text-primary">Lore</h2>
                        <p className="text-text-primary/75 italic whitespace-pre-line leading-relaxed">{item.lore}</p>
                    </div>
                )}

                {sources.length > 0 && (
                    <div className="glass-panel p-6 mb-6">
                        <h2 className="text-xl font-bold mb-3 text-text-primary">How to obtain</h2>
                        <ul className="space-y-2">
                            {sources.map((source) => (
                                <li key={source} className="flex gap-2 text-text-primary/85">
                                    <span className="text-accent-gold">•</span>
                                    {source}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {usedBy && (usedBy.everyone || usedByCharacters.length > 0 || usedByLightCones.length > 0) && (
                    <div className="glass-panel p-6 space-y-5">
                        <h2 className="text-xl font-bold text-text-primary">Used by</h2>
                        {usedBy.everyone ? (
                            <p className="text-text-primary/85">Used by almost every character and light cone to level up.</p>
                        ) : (
                            <>
                                {usedByCharacters.length > 0 && (
                                    <UsageList title="Characters" entries={usedByCharacters} basePath="/char" navigate={navigate} />
                                )}
                                {usedByLightCones.length > 0 && (
                                    <UsageList title="Light Cones" entries={usedByLightCones} basePath="/lightcones" navigate={navigate} />
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ItemDetails;
