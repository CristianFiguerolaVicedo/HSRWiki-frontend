import { useParams } from "react-router-dom";
import { PLANETS_DATA } from "../util/util";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";

const PlanetDetails = () => {
    const [loading, setLoading] = useState(false);
    const {id} = useParams();
    const planet = PLANETS_DATA.find((p) => p.id === id);
    const [characters, setCharacters] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

    useEffect(() => {
        const fetchChars = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:8080/api/characters"
                );
                if (response.status === 200) {
                    const sortedChars = [...response.data].sort((a, b) =>
                        a.name.localeCompare(b.name)
                    );
                    setCharacters(sortedChars);
                }
            } catch (error) {
                console.error("Something went wrong", error);
            } finally {
                setLoading(false);
            }
        };

        fetchChars();
    }, []);

    const planetCharacters = characters.filter((char) => 
        planet.characters.includes(char.name)
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-white text-xl">Loading Planet</div>
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

                {planetImages.length > 0 && (
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

                <h1 className="text-3xl font-bold mb-4 border-b border-t border-gray-400 p-2 mt-4">
                    Characters related to the planet
                </h1>
                <div className="grid grid-cols-4 gap-6">
                    {planetCharacters.map((char) => (
                        <div key={char.id} className="text-center">
                            <img 
                                src={char.miniIcon} 
                                alt={char.name}
                                className="w-40 h-40 objecto-cover rounded-lg mx-auto"
                            />
                            <p className="mt-2">{char.name}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default PlanetDetails;