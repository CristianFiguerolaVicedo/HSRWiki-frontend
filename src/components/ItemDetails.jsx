import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchJson } from "../services/apiClient";
import { ArrowLeft, Star } from "lucide-react";

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
                if (data) {
                    setItem(data);
                } else {
                    console.log("Item not found");
                }
            } catch (err) {
                console.error("Error fetching item:", err);
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

    const getRarityColor = (rarity) => {
        switch(rarity) {
            case 5: return 'fill-accent-gold text-accent-gold';
            case 4: return 'fill-accent-purple text-accent-purple';
            case 3: return 'fill-blue-400 text-blue-400';
            case 2: return 'fill-green-400 text-green-400';
            default: return 'fill-text-muted text-text-muted';
        }
    };

    return (
        <div className="text-text-primary p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate("/items")}
                    className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8 cursor-pointer"
                >
                    <ArrowLeft size={20} />
                    Back to Items
                </button>

                <div className="flex flex-col md:flex-row gap-8 mb-8">
                    <div className="flex flex-col items-center md:items-start">
                        <div className="relative">
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
                    </div>

                    <div className="flex-1 glass-panel p-6">
                        <h1 className="text-4xl font-bold mb-4 text-text-primary">{item.name}</h1>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-text-primary">Type</h3>
                                    <p className="text-text-primary font-medium">{item.type || "Unknown"}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-text-primary">Sub-Type</h3>
                                    <p className="text-text-primary font-medium">{item.sub_type || "None"}</p>
                                </div>
                                <div className="flex items-center flex-col">
                                    <h3 className="text-lg font-semibold mb-2 text-text-primary">Rarity</h3>
                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: item.rarity || 1 }).map((_, index) => (
                                            <Star key={index} className={getRarityColor(item.rarity)} size={16}/>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetails;
