import { useNavigate } from "react-router-dom";
import Postcard from "./Postcard";
import { useCharacters } from "../hooks/useCharacters";

const PlanetInfoCard = ({planet}) => {
  const navigate = useNavigate();
  const { characters } = useCharacters();
  const count = characters.filter((c) => planet.characters.includes(c.name)).length;

  return (
    <Postcard
      title={planet.name}
      image={`/assets/${planet.name}.jpg`}
      note={characters.length ? `${count} friends here` : null}
      seed={Number(planet.id)}
      onClick={() => navigate(`/planets/${planet.id}`)}
    />
  )
}

export default PlanetInfoCard;
