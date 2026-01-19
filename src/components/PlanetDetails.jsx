import { useParams } from "react-router-dom";
import { PLANETS_DATA } from "../util/util";
import { useState } from "react";

const PlanetDetails = () => {
    const [loading, setLoading] = useState(false);
    const {id} = useParams();
    const planet = PLANETS_DATA.find(p => p.id === id);

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

                <img
                    src={`/public/assets/${planet.name}.jpg`}
                    alt={planet.name}
                    className="w-full max-h-96 object-cover rounded-lg mb-6"
                />

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