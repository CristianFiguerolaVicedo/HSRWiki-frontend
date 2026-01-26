import { useNavigate } from "react-router-dom";

const RelicsInfoCard = ({relicSet}) => {
    const navigate = useNavigate();

    const relicName = relicSet.name;

    return (
        <div
            className="bg-[#30364F] text-[#E1D9BC] border border-[#4a5568] rounded-lg p-4 shadow-lg hover:cursor-pointer transition-all duration-[300ms] hover:border-blue-300"
            onClick={() => navigate(`/relics/${relicName}`)}
        >
            <div className="flex justify-center mb-3">
                <img 
                    src={`${relicSet.pieces.Head.icon}`} 
                    alt={relicSet.name}
                    className="h-40" 
                />
            </div>

            <h3 className="text-center font-bold text-lg mb-2">
                {relicName}
            </h3>
        </div>
    )
}

export default RelicsInfoCard;