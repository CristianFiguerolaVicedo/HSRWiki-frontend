import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ItemInfoCard = ({ item }) => {
    const navigate = useNavigate();

    const getBackgroundColor = () => {
        if (!item.rarity) return "bg-gray-800";
        switch(item.rarity) {
            case 5: return "bg-gradient-to-br from-amber-900/30 to-amber-700/10";
            case 4: return "bg-gradient-to-br from-purple-900/30 to-purple-700/10";
            case 3: return "bg-gradient-to-br from-blue-900/30 to-blue-700/10";
            case 2: return "bg-gradient-to-br from-green-900/30 to-green-700/10";
            case 1: 
            default: return "bg-gradient-to-br from-gray-800 to-gray-900";
        }
    };

    const getRarityColor = () => {
        if (!item.rarity) return "text-gray-300";
        switch(item.rarity) {
            case 5: return "text-amber-400";
            case 4: return "text-purple-400";
            case 3: return "text-blue-400";
            case 2: return "text-green-400";
            case 1: 
            default: return "text-gray-300";
        }
    };

    const getBorderColor = () => {
        if (!item.rarity) return "border-gray-700";
        switch(item.rarity) {
            case 5: return "border-amber-600/50";
            case 4: return "border-purple-600/50";
            case 3: return "border-blue-600/50";
            case 2: return "border-green-600/50";
            case 1: 
            default: return "border-gray-600";
        }
    };

    return (
        <div 
            className={`relative rounded-lg p-4 border-2 ${getBorderColor()} ${getBackgroundColor()} hover:scale-[1.02] transition-transform duration-300 cursor-pointer group`}
            onClick={() => navigate(`/items/${item.id}`)}
        >
            <div className="absolute top-3 right-3 flex">
                {Array.from({ length: item.rarity || 1 }).map((_, index) => (
                    <Star 
                        key={index} 
                        className={`${getRarityColor()} fill-current`} 
                        size={14}
                    />
                ))}
            </div>

            <div className="flex justify-center mb-3">
                <div className="relative w-20 h-20">
                    {item.icon ? (
                        <img 
                            src={item.icon} 
                            alt={item.name}
                            className="w-full h-full object-contain"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `
                                    <div class="w-full h-full flex items-center justify-center bg-gray-700 rounded-lg">
                                        <span class="text-gray-400 text-sm">No Image</span>
                                    </div>
                                `;
                            }}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-700 rounded-lg">
                            <span className="text-gray-400 text-sm">No Image</span>
                        </div>
                    )}
                </div>
            </div>

            <h3 className="text-center font-semibold text-white mb-2 line-clamp-2 min-h-[3rem]">
                {item.name}
            </h3>

            <div className="text-center">
                <span className="text-xs px-2 py-1 bg-gray-700/50 text-gray-300 rounded-full">
                    {item.type || 'Unknown'}
                </span>
                {item.subType && item.subType !== item.type && (
                    <span className="text-xs px-2 py-1 bg-gray-700/30 text-gray-400 rounded-full ml-1">
                        {item.subType}
                    </span>
                )}
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-center p-4">
                <span className="text-white text-sm font-medium">View Details</span>
            </div>
        </div>
    );
};

export default ItemInfoCard;