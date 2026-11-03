import { useNavigate } from "react-router-dom";

const formatName = (name) => name.startsWith("Trailblazer")
  ? `Trailblazer ${name.endsWith("#F") ? "♀" : "♂"}`
  : name;

// Small taped photos of the characters linked to a planet or faction
const MemberPhotos = ({ characters, emptyText }) => {
  const navigate = useNavigate();

  if (characters.length === 0) {
    return <p className="font-hand text-2xl text-text-muted">{emptyText}</p>;
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-x-5 gap-y-8 pt-3">
      {characters.map((char) => (
        <button
          key={char.id}
          onClick={() => navigate(`/char/${char.id}`)}
          className={`photo-card tape-${char.element.toLowerCase()} p-2! pb-2.5! text-center cursor-pointer`}
          style={{ "--tilt": `${((Math.abs(char.id) % 5) - 2) * 0.8}deg` }}
        >
          <span className="washi w-12! h-4! -top-2!" aria-hidden="true" />
          <div className="photo-card__picture aspect-square">
            <img src={char.miniIcon} alt="" loading="lazy" className="w-full h-full object-cover" />
          </div>
          <p className="mt-1.5 text-sm font-semibold leading-tight text-text-primary">{formatName(char.name)}</p>
        </button>
      ))}
    </div>
  );
};

export default MemberPhotos;
