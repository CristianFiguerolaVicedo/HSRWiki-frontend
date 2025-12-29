import axios from "axios";
import { useEffect, useState } from "react";
import CharInfoCard from "../components/CharInfoCard";

const CharList = () => {
    const [characters, setCharacters] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChars = async () => {
            try {
                const response = await axios.get("http://localhost:8080/api/characters");
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

    const trailblazers = characters.filter(char => 
        char.name.includes('Trailblazer')
    );
    
    const regularChars = characters.filter(char => 
        !char.name.includes('Trailblazer')
    );

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-white text-xl">Loading characters...</div>
            </div>
        );
    }

    return (
        <div className="p-6">
            {trailblazers.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                        <span className="bg-gradient-to-r from-amber-500 to-yellow-300 bg-clip-text text-transparent">
                            Trailblazer
                        </span>
                        <span className="text-sm text-gray-400">({trailblazers.length} variants)</span>
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {trailblazers.map(char => (
                            <CharInfoCard key={char.id} char={char}/>
                        ))}
                    </div>
                </div>
            )}
            
            <div>
                <h2 className="text-2xl font-bold text-white mb-4">
                    Characters ({regularChars.length})
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                    {regularChars.map(char => (
                        <CharInfoCard key={char.id} char={char}/>
                    ))}
                </div>
            </div>
            
            <div className="mt-8 text-center text-gray-400">
                Total Characters: {characters.length}
            </div>
        </div>
    )
}

export default CharList;