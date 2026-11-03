import { useNavigate } from "react-router-dom";
import { useCharacters } from "../hooks/useCharacters";
import Postcard from "./Postcard";

// Factions added later have no artwork in /assets, so their postcard shows the members' icons
const MemberMosaic = ({ names }) => {
  const { characters } = useCharacters();
  const members = names
    .map((name) => characters.find((c) => c.name === name))
    .filter(Boolean)
    .slice(0, 6);

  return (
    <div className="h-full w-full flex flex-wrap items-center justify-center gap-2 p-4">
      {members.map((member) => (
        <img
          key={member.id}
          src={member.miniIcon}
          alt=""
          className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover"
        />
      ))}
    </div>
  );
};

const FactionInfoCard = ({faction}) => {
  const navigate = useNavigate();
  const { characters } = useCharacters();
  // count only playable characters that exist in the data (lists also mention NPCs)
  const count = characters.filter((c) => (faction.characters || []).includes(c.name)).length;

  return (
    <Postcard
      title={faction.name}
      image={`/assets/${faction.name}.jpg`}
      note={characters.length ? `${count} playable` : null}
      seed={Number(faction.id)}
      onClick={() => navigate(`/factions/${faction.id}`)}
      fallback={<MemberMosaic names={faction.characters || []} />}
    />
  )
}

export default FactionInfoCard;
