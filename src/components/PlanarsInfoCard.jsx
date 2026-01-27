import { useNavigate } from "react-router-dom";

const PlanarsInfoCard = ({planarSet}) => {
    const navigate = useNavigate();

    const planarName = planarSet.name;

    return (
        <div
            className="bg-[#30364F] text-[#E1D9BC] border border-[#4a5568] rounded-lg p-4 shadow-lg hover:cursor-pointer relative hover:scale-[1.02] transition-transform duration-300"
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