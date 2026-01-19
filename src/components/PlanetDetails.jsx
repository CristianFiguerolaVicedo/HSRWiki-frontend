import { useParams } from "react-router-dom";
import { PLANETS_DATA } from "../util/util";
import { useState } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const PlanetDetails = () => {
    const [loading] = useState(false);
    const {id} = useParams();
    const planet = PLANETS_DATA.find((p) => p.id === id);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const IMAGES_CARROUSEL = {
        "Herta Space Station": [
            "/public/assets/herta1.png",
            "/public/assets/herta2.png",
            "/public/assets/herta3.png",
            "/public/assets/herta4.png",
            "/public/assets/herta5.png",
            "/public/assets/herta6.png",
        ],
        "Jarilo VI": [
            "/public/assets/jarilo1.png",
            "/public/assets/jarilo2.png",
            "/public/assets/jarilo3.png",
            "/public/assets/jarilo4.png",
            "/public/assets/jarilo5.png",
            "/public/assets/jarilo6.png",
        ],
        "The Xianzhou Luofu": [
            "/public/assets/xianzhou1.png",
            "/public/assets/xianzhou2.png",
            "/public/assets/xianzhou3.png",
            "/public/assets/xianzhou4.png",
            "/public/assets/xianzhou5.png",
            "/public/assets/xianzhou6.png",
            "/public/assets/xianzhou7.png",
            "/public/assets/xianzhou8.png",
            "/public/assets/xianzhou9.png",
        ],
        "Penacony": [
            "/public/assets/penacony1.png",
            "/public/assets/penacony2.png",
            "/public/assets/penacony3.png",
            "/public/assets/penacony4.png",
            "/public/assets/penacony5.png",
            "/public/assets/penacony6.png",
            "/public/assets/penacony7.png",
            "/public/assets/penacony8.png",
            "/public/assets/penacony9.png",
            "/public/assets/penacony10.png",
            "/public/assets/penacony11.png",
        ],
        "Amphoreus": [
            "/public/assets/amph1.png",
            "/public/assets/amph2.png",
            "/public/assets/amph3.png",
            "/public/assets/amph4.png",
            "/public/assets/amph5.png",
            "/public/assets/amph6.png",
            "/public/assets/amph7.png",
            "/public/assets/amph8.png",
            "/public/assets/amph9.png",
            "/public/assets/amph10.png",
            "/public/assets/amph11.png",
            "/public/assets/amph12.png",
            "/public/assets/amph13.png",
            "/public/assets/amph14.png",
            "/public/assets/amph15.png",
            "/public/assets/amph16.png",
            "/public/assets/amph17.png",
        ]
    };

    const planetImages = IMAGES_CARROUSEL[planet.name] || [];

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


    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-white text-xl">Loading Planets</div>
            </div>
        );
    }

    if (!planet) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white text-xl">Planet not found</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4 border-b border-gray-400 pb-3">
                    {planet.name}
                </h1>

                {planetImages.length > 0 ? (
                    <div className="relative mb-6">
                        <img 
                            src={planetImages[currentImageIndex]} 
                            alt={`${planet.name} ${currentImageIndex + 1}`} 
                            className="w-full max-h-96 object-cover rounded-lg"
                        />

                        <button
                            onClick={handlePrev}
                            className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:cursor-pointer transition-all duration-[300ms] hover:scale-[1.1]"
                        >
                            <ChevronLeft />
                        </button>

                        <button
                            onClick={handleNext}
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-gray-800 bg-opacity-50 text-white p-2 rounded-full hover:cursor-pointer transition-all duration-[300ms] hover:scale-[1.1]"
                        >
                            <ChevronRight />
                        </button>
                    </div>
                ) : (
                    <div>No va</div>
                )}

                <p className="text-gray-300 leading-relaxed mb-3">
                    {planet.description1}
                </p>
                <p className="text-gray-300 leading-relaxed mb-3">
                    {planet.description2}
                </p>
                <p className="text-gray-300 leading-relaxed mb-3">
                    {planet.description3}
                </p>
                <p className="text-gray-300 leading-relaxed">
                    {planet.description4}
                </p>
            </div>
        </div>
    );
}

export default PlanetDetails;