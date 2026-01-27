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
        <div className="text-white p-4 md:p-8">
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
                                    className="w-48 h-48 rounded-xl shadow-lg"
                                />
                            ) : (
                                <div className="w-48 h-48 rounded-xl border-4 border-[#5bc0be] shadow-lg bg-gray-800 flex items-center justify-center">
                                    <span className="text-gray-400">No Image</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                        <h1 className="text-4xl font-bold mb-4 text-[#E1D9BC]">{item.name}</h1>
                        
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-[#E1D9BC]">Type</h3>
                                    <p className="text-white font-medium">{item.type || "Unknown"}</p>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold mb-2 text-[#E1D9BC]">Sub-Type</h3>
                                    <p className="text-white font-medium">{item.sub_type || "None"}</p>
                                </div>
                                <div className="flex items-center justify-center flex-col">
                                    <h3 className="text-lg font-semibold mb-2 text-[#E1D9BC]">Rarity</h3>
                                    <div className="flex items-center gap-2">
                                        {Array.from({ length: item.rarity || 1 }).map((_, index) => (
                                            <Star key={index} className={`${item.rarity === 5 ? 'fill-amber-400 text-amber-400' : item.rarity === 4 ? 'fill-purple-400 text-purple-400' : item.rarity === 3 ? 'fill-blue-400 text-blue-400' : item.rarity === 2 ? 'fill-green-400 text-green-400' : 'fill-gray-400 text-gray-400'}`} size={16}/>
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