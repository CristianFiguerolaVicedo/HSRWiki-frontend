import { useNavigate, useParams } from "react-router-dom";
import { FACTIONS } from "../util/util";
import { useCharacters } from "../hooks/useCharacters";
import { ArrowLeft } from "lucide-react";

const FactionDetails = () => {
    const {id} = useParams();
    const { characters } = useCharacters();
    const faction = FACTIONS.find((f) => f.id === id);
    const navigate = useNavigate();

    const factionCharacters = characters.filter((char) =>
        faction?.characters?.includes(char.name)
    );

    if (!faction) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-text-primary text-xl">Faction not found</div>
            </div>
        )
    }

    return (
        <div className="text-text-primary">
            <button
                onClick={() => navigate("/factions")}
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8 cursor-pointer"
            >
                <ArrowLeft size={20} />
                Back to factions
            </button>
            <h1 className="text-3xl font-bold mb-4 border-b border-border pb-3 text-text-primary">
                {faction.name}
            </h1>

            <div className="space-y-2">
                {faction.info.map((p, i) => <p key={i} className="text-text-secondary leading-relaxed">{p}</p>)}
            </div>

            <h2 className="text-xl font-bold mb-4 border-b border-t border-border mt-8 py-3 text-text-primary">
                Playable characters from this faction
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {factionCharacters.map((char) => (
                    <div key={char.id} className="text-center group cursor-pointer" onClick={() => navigate(`/char/${char.id}`)}>
                        <img
                            src={char.miniIcon}
                            alt={char.name}
                            className="w-full max-w-[160px] mx-auto rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-accent-cyan/10"
                        />
                        <p className="mt-2 text-text-primary text-sm font-medium">
                            {char.name.replace('Trailblazer', 'TB').replace('#M', '♂').replace('#F', '♀')}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default FactionDetails;
