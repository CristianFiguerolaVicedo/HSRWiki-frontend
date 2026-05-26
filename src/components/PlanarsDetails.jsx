import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchJson } from "../services/apiClient";

const PlanarsDetails = () => {
    const {name} = useParams();
    const [planar, setPlanar] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPlanarSetByName = async () => {
            setLoading(true);
            try {
                const data = await fetchJson(`/planars/${name}`);
                if (data) {
                    setPlanar(data);
                }
            } catch (error) {
                console.error("Something went wrong", error);
            } finally {
                setLoading(false);
            }
        }

        if (name) {
            fetchPlanarSetByName();
        }
    }, [name]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-text-primary text-xl">Loading Planar Set...</div>
            </div>
        )
    }

    if (!planar) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-text-primary text-xl">Planar Set not found</div>
            </div>
        )
    }
    return (
        <div className="text-text-primary p-4 md:p-8">
            <button
                onClick={() => navigate("/relics")}
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8 cursor-pointer"
            >
                <ArrowLeft size={20} />
                Back to relics and planars
            </button>
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex-1 glass-panel p-6">
                    <h2 className="text-2xl font-bold mb-6 text-text-primary">Set Effects</h2>
                    <div className="bg-gradient-to-br from-bg-card to-bg-primary p-4 rounded-lg border border-border">
                        <div className="text-text-primary font-bold flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">Set Effect</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-baseline mt-2">
                            <div>
                                <div className="text-xl text-text-secondary mt-1">{planar.desc}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6 mb-6">
                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-4 text-text-primary">Planar Set Pieces</h3>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-center flex-col">
                        <img 
                            src={`${planar.pieces["Planar Sphere"].icon}`}
                            alt={`${planar.pieces["Planar Sphere"].name}`}
                            className="w-32 h-32 object-contain rounded-lg" 
                        />
                        <p className="text-text-primary mt-2 text-sm font-medium">{planar.pieces["Planar Sphere"].name}</p>
                        <p className="text-text-muted text-xs">(Planar Sphere)</p>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <img 
                            src={`${planar.pieces["Link Rope"].icon}`} 
                            alt={`${planar.pieces["Link Rope"].name}`}
                            className="w-32 h-32 object-contain rounded-lg" 
                        />
                        <p className="text-text-primary mt-2 text-sm font-medium">{planar.pieces["Link Rope"].name}</p>
                        <p className="text-text-muted text-xs">(Link Rope)</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PlanarsDetails;
