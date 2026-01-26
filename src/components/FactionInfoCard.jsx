import { useNavigate } from "react-router-dom";

const FactionInfoCard = ({faction}) => {
    const navigate = useNavigate();

    return (
        <div
            className="bg-[#30364F] text-[#E1D9BC] rounded-lg p-4 shadow-lg hover:cursor-pointer"
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
        </div>
    )
}

export default FactionInfoCard;