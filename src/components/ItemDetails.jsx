// components/ItemDetails.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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
                const response = await axios.get(`http://localhost:8080/api/items/${id}`);
                if (response.status === 200) {
                    setItem(response.data);
                } else {
                    const nameResponse = await axios.get(`http://localhost:8080/api/items/${id}`);
                    if (nameResponse.status === 200) {
                        setItem(nameResponse.data);
                    } else {
                        console.log("Item not found");
                    }
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
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white flex items-center justify-center">
                <div className="text-xl">Loading item details...</div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white text-xl">Item not found</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate("/items")}
                    className="flex items-center gap-2 text-[#E1D9BC] hover:cursor-pointer mb-8"
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
                                    className="w-48 h-48 rounded-xl border-4 border-[#5bc0be] shadow-lg"
                                />
                            ) : (
                                <div className="w-48 h-48 rounded-xl border-4 border-[#5bc0be] shadow-lg bg-gray-800 flex items-center justify-center">
                                    <span className="text-gray-400">No Image</span>
                                </div>
                            )}
                            <div className="absolute -top-3 -right-3 flex flex-col gap-2">
                                <div className="flex items-center gap-2 bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-700">
                                    <span className="font-bold text-sm">{item.type}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-gray-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-700">
                                    {Array.from({ length: item.rarity || 1 }).map((_, index) => (
                                        <Star key={index} className="text-amber-400 fill-amber-400" size={16}/>
                                    ))}
                                    <span className="font-bold text-sm">{item.rarity || 1}★</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                        <h1 className="text-4xl font-bold mb-4 text-blue-300">{item.name}</h1>
                        
                        <div className="space-y-4">
                            {item.desc && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Description</h3>
                                    <p className="text-gray-300">{item.desc}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Type</h3>
                                    <p className="text-white font-medium">{item.type || "Unknown"}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Sub-Type</h3>
                                    <p className="text-white font-medium">{item.sub_type || "None"}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Rarity</h3>
                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: item.rarity || 1 }).map((_, index) => (
                                            <Star key={index} className="text-amber-400 fill-amber-400" size={16}/>
                                        ))}
                                        <span className="text-white font-medium">{item.rarity || 1} Stars</span>
                                    </div>
                                </div>
                                {item.maxStackCount && (
                                    <div>
                                        <h3 className="text-lg font-semibold mb-2 text-gray-300">Max Stack</h3>
                                        <p className="text-white font-medium">{item.maxStackCount}</p>
                                    </div>
                                )}
                            </div>

                            {item.comeFrom && item.comeFrom.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Sources</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {item.comeFrom.map((source, index) => (
                                            <span key={index} className="px-3 py-1 bg-gray-700/50 text-gray-300 rounded-full text-sm">
                                                {source}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {item.usage && (
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Usage</h3>
                                    <p className="text-gray-300">{item.usage}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-blue-300">Additional Information</h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {item.canDiscard !== undefined && (
                            <div className="text-center">
                                <div className={`text-lg font-bold ${item.canDiscard ? 'text-green-400' : 'text-red-400'}`}>
                                    {item.canDiscard ? '✓' : '✗'}
                                </div>
                                <div className="text-sm text-gray-400">Can Discard</div>
                            </div>
                        )}
                        
                        {item.canSell !== undefined && (
                            <div className="text-center">
                                <div className={`text-lg font-bold ${item.canSell ? 'text-green-400' : 'text-red-400'}`}>
                                    {item.canSell ? '✓' : '✗'}
                                </div>
                                <div className="text-sm text-gray-400">Can Sell</div>
                            </div>
                        )}
                        
                        {item.canUse !== undefined && (
                            <div className="text-center">
                                <div className={`text-lg font-bold ${item.canUse ? 'text-green-400' : 'text-red-400'}`}>
                                    {item.canUse ? '✓' : '✗'}
                                </div>
                                <div className="text-sm text-gray-400">Can Use</div>
                            </div>
                        )}
                        
                        {item.canSynthesize !== undefined && (
                            <div className="text-center">
                                <div className={`text-lg font-bold ${item.canSynthesize ? 'text-green-400' : 'text-red-400'}`}>
                                    {item.canSynthesize ? '✓' : '✗'}
                                </div>
                                <div className="text-sm text-gray-400">Can Synthesize</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetails;