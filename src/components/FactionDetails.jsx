import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FACTIONS } from "../util/util";
import axios from "axios";
import { ArrowLeft } from "lucide-react";

const FactionDetails = () => {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const faction = FACTIONS.find((f) => f.id === id);
    const [characters, setCharacters] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChars = async () => {
            setLoading(true);

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

    const factionCharacters = characters.filter((char) =>
        faction.characters.includes(char.name)
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-white text-xl">Loading Faction...</div>
            </div>
        )
    }

    if (!faction) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-white text-xl">Faction not found</div>
            </div>
        )
    }

    return (
        <div className="text-white p-4 md:p-8 rounded-xl">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate("/factions")}
                    className="flex items-center gap-2 text-[#E1D9BC] hover:cursor-pointer mb-8"
                >
                    <ArrowLeft size={20} />
                    Back to factions
                </button>
                <h1 className="text-3xl font-bold mb-4 border-b border-gray-400 pb-3">
                    {faction.name}
                </h1>

                <h1>
                    {faction.info.map(p => <p className="my-2">{p}</p>)}
                </h1>

                <h2 className="text-xl font-bold mb-4 border-b border-t border-gray-400 mt-4 py-2">
                    Playable characters from this faction
                </h2>
                
                <div>
                    <div className="grid grid-cols-4 gap-6">
                        {factionCharacters.map((char) => (
                            <div key={char.id} className="text-center">
                            <img
                                src={char.miniIcon}
                                alt={char.name}
                                className="w-40 h-40 object-cover rounded-lg mx-auto"
                            />
                            <p className="mt-2">{char.name.replace('Trailblazer', 'TB').replace('#M', '♂').replace('#F', '♀')}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default FactionDetails;