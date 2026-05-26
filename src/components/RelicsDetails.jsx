import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchJson } from "../services/apiClient";

const RelicsDetails = () => {
    const {name} = useParams();
    const [relic, setRelic] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRelicSetByName = async () => {
            setLoading(true);
            try {
                const data = await fetchJson(`/relics/${name}`);
                if (data) {
                    setRelic(data);
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
                <div className="text-text-primary text-xl">Loading Relic Set...</div>
            </div>
        )
    }

    if (!relic) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-text-primary text-xl">Relic Set not found</div>
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
                                <span className="text-lg">2-pc Effect</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-baseline mt-2">
                            <div>
                                <div className="text-xl text-text-secondary mt-1">{relic.desc[0]}</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-bg-card to-bg-primary p-4 rounded-lg border border-border mt-4">
                        <div className="text-text-primary font-bold flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-lg">4-pc Effect</span>
                            </div>
                        </div>
                        <div className="flex justify-between items-baseline mt-2">
                            <div>
                                <div className="text-xl text-text-secondary mt-1">{relic.desc[1]}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-6 mb-6">
                <div className="mb-6">
                    <h3 className="text-xl font-bold mb-4 text-text-primary">Relic Set Pieces</h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex items-center justify-center flex-col">
                        <img 
                            src={`${relic.pieces.Head.icon}`} 
                            alt={`${relic.pieces.Head.name}`}
                            className="w-32 h-32 object-contain rounded-lg" 
                        />
                        <p className="text-text-primary mt-2 text-sm font-medium">{relic.pieces.Head.name}</p>
                        <p className="text-text-muted text-xs">(Head)</p>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <img 
                            src={`${relic.pieces.Hands.icon}`} 
                            alt={`${relic.pieces.Hands.name}`}
                            className="w-32 h-32 object-contain rounded-lg" 
                        />
                        <p className="text-text-primary mt-2 text-sm font-medium">{relic.pieces.Hands.name}</p>
                        <p className="text-text-muted text-xs">(Hands)</p>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <img 
                            src={`${relic.pieces.Body.icon}`} 
                            alt={`${relic.pieces.Body.name}`}
                            className="w-32 h-32 object-contain rounded-lg" 
                        />
                        <p className="text-text-primary mt-2 text-sm font-medium">{relic.pieces.Body.name}</p>
                        <p className="text-text-muted text-xs">(Body)</p>
                    </div>
                    <div className="flex items-center justify-center flex-col">
                        <img 
                            src={`${relic.pieces.Feet.icon}`} 
                            alt={`${relic.pieces.Feet.name}`}
                            className="w-32 h-32 object-contain rounded-lg" 
                        />
                        <p className="text-text-primary mt-2 text-sm font-medium">{relic.pieces.Feet.name}</p>
                        <p className="text-text-muted text-xs">(Feet)</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RelicsDetails;
