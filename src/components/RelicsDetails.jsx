import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RelicsDetails = () => {
    const {name} = useParams();
    const [relic, setRelic] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchRelicSetByName = async () => {
            setLoading(true);

            try {
                const reponse = await axios.get(`http://localhost:8080/api/relics/${name}`);
                if (reponse.status === 200) {
                    setRelic(reponse.data);
                }
            } catch (error) {
                console.error("Something went wrong", error);
            } finally {
                setLoading(false);
            }
        }

        if (name) {
            fetchRelicSetByName();
        }
    }, [name]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-white text-xl">Loading Relic Set...</div>
            </div>
        )
    }

    if (!relic) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white text-xl">Relic Set not found</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-4 md:p-8">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col items-center md:items-start">
                    <div className="relative">
                        <img 
                            src={`${relic.pieces.Head.icon}`}
                            alt={relic.name} 
                            className="w-100 h-110 rounded-xl border-4 border-[#5bc0be] shadow-lg"
                        />
                    </div>
                </div>

                <div className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h2 className="text-2xl font-bold mb-6 text-blue-300">Set Effects</h2>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="text-blue-400 font-bold flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">2-pc Effect</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-baseline mt-2">
                            <div>
                                <div className="text-xl text-gray-400 mt-1">{relic.desc[0]}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700 mt-4">
                        <div className="text-blue-400 font-bold flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">4-pc Effect</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-baseline mt-2">
                            <div>
                                <div className="text-xl text-gray-400 mt-1">{relic.desc[1]}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6">
                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-4 text-blue-300">Relic Set Pieces</h3>
                </div>

                <div className="grid grid-cols-4">
                    <div className="flex items-center justify-center flex-col">
                        <img 
                            src={`${relic.pieces.Head.icon}`} 
                            alt={`${relic.pieces.Head.name}`}
                            className="w-40 h-40 rounded-lg" 
                        />
                        <p>{relic.pieces.Head.name}</p>
                        <p>(Head)</p>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <img 
                            src={`${relic.pieces.Hands.icon}`} 
                            alt={`${relic.pieces.Hands.name}`}
                            className="w-40 h-40 rounded-lg" 
                        />
                        <p>{relic.pieces.Hands.name}</p>
                        <p>(Hands)</p>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <img 
                            src={`${relic.pieces.Body.icon}`} 
                            alt={`${relic.pieces.Body.name}`}
                            className="w-40 h-40 rounded-lg" 
                        />
                        <p>{relic.pieces.Body.name}</p>
                        <p>(Body)</p>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <img 
                            src={`${relic.pieces.Feet.icon}`} 
                            alt={`${relic.pieces.Feet.name}`}
                            className="w-40 h-40 rounded-lg" 
                        />
                        <p>{relic.pieces.Feet.name}</p>
                        <p>(Feet)</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RelicsDetails;