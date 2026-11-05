import { useNavigate } from "react-router-dom";
import { useCharacters } from "../hooks/useCharacters";
import Postcard from "./Postcard";
import MemberMosaic from "./MemberMosaic";

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
