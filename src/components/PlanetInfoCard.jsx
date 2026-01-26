import { useNavigate } from "react-router-dom";

const PlanetInfoCard = ({planet}) => {
    const navigate = useNavigate();

    return (
        <div
            className="bg-gradient-to-br from-[#3a506b] to-[#1c2541] text-white border border-[#4a5568] rounded-lg p-4 shadow-lg hover:cursor-pointer transition-all duration-[300ms] hover:border-blue-300"
            onClick={() => navigate(`/planets/${planet.id}`)}
        >
            <div className="flex justify-center mb-3">
                <img 
                    src={`../../assets/${planet.name}.jpg`}
                    alt={planet.name} 
                    className="h-50"
                />
            </div>

            <h3 className="text-center font-bold text-lg mb-2 truncate">
                {planet.name}
            </h3>
        </div>
    )
}

export default PlanetInfoCard;