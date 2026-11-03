import { useNavigate, useParams } from "react-router-dom";
import { PLANETS_DATA } from "../util/util";
import { useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useCharacters } from "../hooks/useCharacters";
import MemberPhotos from "./MemberPhotos";

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
        ],
        "Astral Express": [
            "/assets/Astral Express.jpg",
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
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8 cursor-pointer font-hand text-2xl"
            >
                <ArrowLeft size={20} />
                back to the map
            </button>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary">
                {planet.name}
            </h1>
            <p className="font-hand text-3xl text-accent-red mt-1 mb-8 -rotate-1 origin-left">
                notes from our stop here
            </p>

            {planetImages.length > 0 && (
                <div className="photo-card tape-imaginary mb-10 max-w-4xl" style={{ "--tilt": "-0.6deg" }}>
                    <span className="washi" aria-hidden="true" />
                    <div className="relative photo-card__picture">
                    <img 
                        src={planetImages[currentImageIndex]} 
                        alt={`${planet.name} ${currentImageIndex + 1}`} 
                        className="w-full max-h-[28rem] object-cover"
                    />

                    {planetImages.length > 1 && <button
                        onClick={handlePrev}
                        aria-label="Previous picture"
                        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-bg-card/90 text-text-primary p-2 rounded-full cursor-pointer transition-transform duration-150 hover:scale-105 border border-border shadow-sm"
                    >
                        <ChevronLeft />
                    </button>}

                    {planetImages.length > 1 && <button
                        onClick={handleNext}
                        aria-label="Next picture"
                        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-bg-card/90 text-text-primary p-2 rounded-full cursor-pointer transition-transform duration-150 hover:scale-105 border border-border shadow-sm"
                    >
                        <ChevronRight />
                    </button>}

                    {planetImages.length > 1 && <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
                        {planetImages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentImageIndex(i)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    i === currentImageIndex 
                                        ? 'bg-accent-cyan w-4' 
                                        : 'bg-white/70 hover:bg-white'
                                }`}
                                aria-label={`Show picture ${i + 1}`}
                            />
                        ))}
                    </div>}
                    </div>
                    {planetImages.length > 1 && (
                        <p className="font-hand text-xl text-text-secondary text-right pt-1.5 pr-1 leading-none">
                            photo {currentImageIndex + 1} of {planetImages.length}
                        </p>
                    )}
                </div>
            )}

            <div className="max-w-3xl space-y-4 text-[1.05rem] leading-relaxed text-text-secondary">
                {[planet.description1, planet.description2, planet.description3, planet.description4]
                    .filter(Boolean)
                    .map((paragraph, i) => <p key={i}>{paragraph}</p>)}
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4 pt-6 border-t-2 border-dashed border-border-hover text-text-primary">
                People we met here
            </h2>
            <MemberPhotos characters={planetCharacters} emptyText="no one from here has joined us yet" />
        </div>
    );
}

export default PlanetDetails;
