import { useNavigate } from "react-router-dom";

const PlanarsInfoCard = ({planarSet}) => {
    const navigate = useNavigate();

    const planarName = planarSet.name;

    return (
        <div
            className="bg-gradient-to-br from-[#3a506b] to-[#1c2541] text-white border border-[#4a5568] rounded-lg p-4 shadow-lg hover:cursor-pointer transition-all duration-[300ms] hover:border-blue-600"
            onClick={() => navigate(`/planars/${planarName}`)}
        >
            <div className="flex justify-center mb-3">
                <img 
                    src={`${planarSet.pieces["Planar Sphere"].icon.replace(/ /g, "%20")}`}
                    alt={planarSet.name}
                    className="h-40" 
                />
            </div>

            <h3 className="text-center font-bold text-lg mb-2">
                {planarName}
            </h3>
        </div>
    )
}

export default PlanarsInfoCard;