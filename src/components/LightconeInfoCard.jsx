import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PATH_ICONS = {
    ABUNDANCE: '/assets/Icon_Abundance.webp', 
    DESTRUCTION: '/assets/Icon_Destruction.webp',
    ERUDITION: '/assets/Icon_Erudition.webp',
    HARMONY: '/assets/Icon_Harmony.webp',
    NIHILITY: '/assets/Icon_Nihility.webp',
    PRESERVATION: '/assets/Icon_Preservation.webp',
    REMEMBRANCE: '/assets/Icon_Remembrance.webp',
    HUNT: '/assets/Icon_The_Hunt.webp',
}

const LightconeInfoCard = ({lightcone}) => {
    const pathIconPath = PATH_ICONS[lightcone.path.toUpperCase()];
    const navigate = useNavigate();

    const idString = lightcone.id.toString();
    return (
        <div 
            className="bg-[#0C2C55] text-white border border-[#4a5568] rounded-lg p-4 shadow-lg hover:cursor-pointer transition-all duration-[300ms] hover:border-blue-300"
            onClick={() => navigate(`/lightcones/${idString}`)}
        >
            <div className="flex justify-center mb-3">
                <img 
                    src={`${lightcone.image}`} 
                    alt={lightcone.name}
                    className="h-40" 
                />
            </div>

            <h3 className="text-center font-bold text-lg mb-2 truncate">
                {lightcone.name}
            </h3>

            <div className="flex justify-center mb-3">
                {Array.from({ length: lightcone.rarity }).map((_, index) => (
                    <Star key={index} className="text-amber-400 fill-amber-400" size={16}/>
                ))}
            </div>

            <div className="flex justify-center items-center gap-4 mb-3">
                <div className="flex flex-col items-center">
                    {pathIconPath && (
                        <img 
                            src={pathIconPath} 
                            alt={lightcone.path}
                            className="w-6 h-6"
                            title={`Path: ${lightcone.path}`}
                        />
                    )}
                    <span className="text-xs text-gray-300 mt-1">{lightcone.path}</span>
                </div>
            </div>
        </div>
    )
}

export default LightconeInfoCard;