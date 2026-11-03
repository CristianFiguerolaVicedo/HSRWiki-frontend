import { useNavigate, useParams } from "react-router-dom";
import { FACTIONS } from "../util/util";
import { useCharacters } from "../hooks/useCharacters";
import { ArrowLeft } from "lucide-react";
import MemberPhotos from "./MemberPhotos";

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
                className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors mb-8 cursor-pointer font-hand text-2xl"
            >
                <ArrowLeft size={20} />
                back to factions
            </button>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary">
                {faction.name}
            </h1>
            <p className="font-hand text-3xl text-accent-red mt-1 mb-8 -rotate-1 origin-left">
                what we know about them
            </p>

            <div className="max-w-3xl space-y-4 text-[1.05rem] leading-relaxed text-text-secondary">
                {faction.info.map((p, i) => <p key={i}>{p}</p>)}
            </div>

            <h2 className="text-2xl font-bold mt-12 mb-4 pt-6 border-t-2 border-dashed border-border-hover text-text-primary">
                Members you can play
            </h2>

            <MemberPhotos characters={factionCharacters} emptyText="none of them travel with us yet" />
        </div>
    )
}

export default FactionDetails;
