import { useNavigate } from "react-router-dom";

const FactionInfoCard = ({faction}) => {
    const navigate = useNavigate();

    return (
        <div
            className="bg-[#30364F] text-[#E1D9BC] rounded-lg p-4 shadow-lg hover:cursor-pointer relative hover:scale-[1.02] transition-transform duration-300"
            onClick={() => navigate(`/factions/${faction.id}`)}
        >
            <div className="flex justify-center mb-3">
                <img 
                    src={`../../assets/${faction.name}.jpg`}
                    alt={faction.name} 
                    className="h-50 rounded-lg"
                />
            </div>

            <h3 className="text-center font-bold text-lg mb-2 truncate">
                {faction.name}
            </h3>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-end justify-center p-4">
                <span className="text-white text-sm font-medium">View Details</span>
            </div>
        </div>
    )
}

export default FactionInfoCard;