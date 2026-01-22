import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FACTIONS } from "../util/util";
import axios from "axios";

const FactionDetails = () => {
    const {id} = useParams();
    const [loading, setLoading] = useState(false);
    const faction = FACTIONS.find((f) => f.id === id);
    const [characters, setCharacters] = useState([]);

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
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 text-white p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-4 border-b border-gray-400 pb-3">
                    {faction.name}
                </h1>

                <div className="border border-gray-800">
                    <h2 className="text-xl font-bold mb-4">
                        Playable characters from this faction
                    </h2>
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