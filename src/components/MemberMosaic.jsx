import { useCharacters } from "../hooks/useCharacters";

// Planets and factions added later have no artwork in /assets, so their postcard shows the icons
// of the characters who belong there
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

export default MemberMosaic;
