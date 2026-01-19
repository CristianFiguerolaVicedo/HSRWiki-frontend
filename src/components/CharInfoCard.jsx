import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ELEMENT_ICONS = {
    FIRE: '/assets/Type_Fire.webp',
    ICE: '/assets/Type_Ice.webp',
    LIGHTNING: '/assets/Type_Lightning.webp',
    WIND: '/assets/Type_Wind.webp',
    QUANTUM: '/assets/Type_Quantum.webp',
    IMAGINARY: '/assets/Type_Imaginary.webp',
    PHYSICAL: '/assets/Type_Physical.webp',
}

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

const CharInfoCard = ({char}) => {
    const elementIconPath = ELEMENT_ICONS[char.element];
    const pathIconPath = PATH_ICONS[char.path.toUpperCase()];

    const navigate = useNavigate();

    const idString = char.id.toString();

    return (
        <div className="bg-gradient-to-br from-[#3a506b] to-[#1c2541] text-white border border-[#4a5568] rounded-lg p-4 shadow-lg hover:cursor-pointer transition-all duration-[300ms] hover:border-blue-600" 
            onClick={() => navigate(`/char/${idString}`)}
        >
            <div className="flex justify-center mb-3">
                <img 
                    src={`${char.splash}`} 
                    alt={char.name}
                    className="h-40" 
                />
            </div>
            
            <h3 className="text-center font-bold text-lg mb-2 truncate">
                {char.name.replace('Trailblazer', 'TB').replace('#M', '♂').replace('#F', '♀')}
            </h3>
            
            <div className="flex justify-center mb-3">
                {Array.from({ length: char.rarity }).map((_, index) => (
                    <Star key={index} className="text-amber-400 fill-amber-400" size={16}/>
                ))}
            </div>
            
            <div className="flex justify-center items-center gap-4 mb-3">
                <div className="flex flex-col items-center">
                    {elementIconPath && (
                        <img 
                            src={elementIconPath} 
                            alt={char.element} 
                            className="w-6 h-6"
                            title={`Element: ${char.element}`}
                        />
                    )}
                    <span className="text-xs text-gray-300 mt-1">{char.element}</span>
                </div>
                
                <div className="flex flex-col items-center">
                    {pathIconPath && (
                        <img 
                            src={pathIconPath} 
                            alt={char.path} 
                            className="w-6 h-6"
                            title={`Path: ${char.path}`}
                        />
                    )}
                    <span className="text-xs text-gray-300 mt-1">{char.path}</span>
                </div>
            </div>
        </div>
    )
}

export default CharInfoCard;