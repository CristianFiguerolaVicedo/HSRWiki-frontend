import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PlanarsDetails = () => {
    const {name} = useParams();
    const [planar, setPlanar] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRelicSetByName = async () => {
            setLoading(true);

            try {
                const reponse = await axios.get(`http://localhost:8080/api/relics/${name}`);
                if (reponse.status === 200) {
                    setPlanar(reponse.data);
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
                <div className="text-white text-xl">Loading Planar Set...</div>
            </div>
        )
    }

    if (!planar) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-white text-xl">Planar Set not found</div>
            </div>
        )
    }
    return (
        <div className=" text-white p-4 md:p-8">
            <button
                onClick={() => navigate("/relics")}
                className="flex items-center gap-2 text-[#E1D9BC] hover:cursor-pointer mb-8"
            >
                <ArrowLeft size={20} />
                Back to relics and planars
            </button>
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col items-center md:items-start">
                    <div className="relative">
                        <img 
                            src={`${planar.pieces["Planar Sphere"].icon.replace(/ /g, "%20")}`}
                            alt={planar.name} 
                            className="w-100 h-110 rounded-xl shadow-lg"
                        />
                    </div>
                </div>

                <div className="flex-1 bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
                    <h2 className="text-2xl font-bold mb-6 text-[#E1D9BC]">Set Effects</h2>
                    <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-lg border border-gray-700">
                        <div className="text-[#E1D9BC] font-bold flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">Set Effect</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-baseline mt-2">
                            <div>
                                <div className="text-xl text-gray-400 mt-1">{planar.desc}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700 mb-6">
                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-4 text-[#E1D9BC]">Planar Set Pieces</h3>
                </div>

                <div className="grid grid-cols-2">
                    <div className="flex items-center justify-center flex-col">
                        <img 
                            src={`${planar.pieces["Planar Sphere"].icon.replace(/ /g, "%20")}`}
                            alt={`${planar.pieces["Planar Sphere"].name.replace(/ /g, "%20")}`}
                            className="w-40 h-40 rounded-lg" 
                        />
                        <p>{planar.pieces["Planar Sphere"].name}</p>
                        <p>(Planar Sphere)</p>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <img 
                            src={`${planar.pieces["Link Rope"].icon.replace(/ /g, "%20")}`} 
                            alt={`${planar.pieces["Link Rope"].name.replace(/ /g, "%20")}`}
                            className="w-40 h-40 rounded-lg" 
                        />
                        <p>{planar.pieces["Link Rope"].name}</p>
                        <p>(Link Rope)</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlanarsDetails;