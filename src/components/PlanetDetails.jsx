import { useNavigate, useParams } from "react-router-dom";
import { PLANETS_DATA } from "../util/util";
import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useCharacters } from "../hooks/useCharacters";

const PlanetDetails = () => {
    const {id} = useParams();
    const { characters } = useCharacters();
    const planet = PLANETS_DATA.find((p) => p.id === id);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const navigate = useNavigate();

    const IMAGES_CARROUSEL = {
        "Herta Space Station": [
            "/assets/herta1.png",
            "/assets/herta2.png",
            "/assets/herta3.png",
            "/assets/herta4.png",
            "/assets/herta5.png",
            "/assets/herta6.png",
        ],
        "Jarilo VI": [
            "/assets/jarilo1.png",
            "/assets/jarilo2.png",
            "/assets/jarilo3.png",
            "/assets/jarilo4.png",
            "/assets/jarilo5.png",
            "/assets/jarilo6.png",
        ],
        "The Xianzhou Luofu": [
            "/assets/xianzhou1.png",
            "/assets/xianzhou2.png",
            "/assets/xianzhou3.png",
            "/assets/xianzhou4.png",
            "/assets/xianzhou5.png",
            "/assets/xianzhou6.png",
            "/assets/xianzhou7.png",
            "/assets/xianzhou8.png",
            "/assets/xianzhou9.png",
        ],
        "Penacony": [
            "/assets/penacony1.png",
            "/assets/penacony2.png",
            "/assets/penacony3.png",
            "/assets/penacony4.png",
            "/assets/penacony5.png",
            "/assets/penacony6.png",
            "/assets/penacony7.png",
            "/assets/penacony8.png",
            "/assets/penacony9.png",
            "/assets/penacony10.png",
            "/assets/penacony11.png",
        ],
        "Planarcadia": [
            "/assets/planarcadia1.png",
            "/assets/planarcadia2.png",
            "/assets/planarcadia3.png",
            "/assets/planarcadia4.png",
            "/assets/planarcadia5.png",
            "/assets/planarcadia6.png",
            "/assets/planarcadia7.png",
            "/assets/planarcadia8.png",
            "/assets/planarcadia9.png",
            "/assets/planarcadia10.png",
            "/assets/planarcadia11.png",
        ],
        "Amphoreus": [
            "/assets/amph1.png",
            "/assets/amph2.png",
            "/assets/amph3.png",
            "/assets/amph4.png",
            "/assets/amph5.png",
            "/assets/amph6.png",
            "/assets/amph7.png",
            "/assets/amph8.png",
            "/assets/amph9.png",
            "/assets/amph10.png",
            "/assets/amph11.png",
            "/assets/amph12.png",
            "/assets/amph13.png",
            "/assets/amph14.png",
            "/assets/amph15.png",
            "/assets/amph16.png",
            "/assets/amph17.png",
        ]
    };

    const planetImages = IMAGES_CARROUSEL[planet?.name] || [];

    const handlePrev = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? planetImages.length - 1 : prev - 1
        );
    };

    const handleNext = () => {
        setCurrentImageIndex((prev) =>
            prev === planetImages.length - 1 ? 0 : prev + 1
        );
    };

    const planetCharacters = characters.filter((char) => 
        planet?.characters?.includes(char.name)
    );

    if (!planet) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-text-primary text-xl">Planet not found</div>
            </div>
        )
    }

    return (
        <div className="text-text-primary">
            <button
                onClick={() => navigate("/planets")}
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8 cursor-pointer"
            >
                <ArrowLeft size={20} />
                Back to planets
            </button>
            <h1 className="text-3xl font-bold mb-4 border-b border-border pb-3">
                {planet.name}
            </h1>

            {planetImages.length > 0 && (
                <div className="relative mb-6 rounded-xl overflow-hidden border border-border">
                    <img 
                        src={planetImages[currentImageIndex]} 
                        alt={`${planet.name} ${currentImageIndex + 1}`} 
                        className="w-full max-h-96 object-cover"
                    />

                    <button
                        onClick={handlePrev}
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-bg-sidebar/60 backdrop-blur-sm text-text-primary p-2 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-accent-cyan/20 border border-border"
                    >
                        <ChevronLeft />
                    </button>

                    <button
                        onClick={handleNext}
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-bg-sidebar/60 backdrop-blur-sm text-text-primary p-2 rounded-full cursor-pointer transition-all duration-300 hover:scale-110 hover:bg-accent-cyan/20 border border-border"
                    >
                        <ChevronRight />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {planetImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentImageIndex(i)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    i === currentImageIndex 
                                        ? 'bg-accent-cyan w-4' 
                                        : 'bg-text-muted/50 hover:bg-text-secondary'
                                }`}
                            />
                        ))}
                    </div>
                </div>
            )}

            <p className="text-text-secondary leading-relaxed mb-3">
                {planet.description1}
            </p>
            <p className="text-text-secondary leading-relaxed mb-3">
                {planet.description2}
            </p>
            <p className="text-text-secondary leading-relaxed mb-3">
                {planet.description3}
            </p>
            <p className="text-text-secondary leading-relaxed">
                {planet.description4}
            </p>

            <h2 className="text-2xl font-bold mb-4 border-b border-t border-border py-3 mt-8">
                Characters related to the planet
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {planetCharacters.map((char) => (
                    <div key={char.id} className="text-center group cursor-pointer" onClick={() => navigate(`/char/${char.id}`)}>
                        <img 
                            src={char.miniIcon} 
                            alt={char.name}
                            className="w-full max-w-[160px] mx-auto rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-accent-cyan/10"
                        />
                        <p className="mt-2 text-text-primary text-sm font-medium">
                            {char.name.replace('Trailblazer', 'TB').replace('#M', '♂').replace('#F', '♀')}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PlanetDetails;
