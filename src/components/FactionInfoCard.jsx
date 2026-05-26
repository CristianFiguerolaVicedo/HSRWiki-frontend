import { useNavigate } from "react-router-dom";

const FactionInfoCard = ({faction}) => {
  const navigate = useNavigate();

  return (
    <div
      className="group hsr-card overflow-hidden p-0 cursor-pointer relative animate-fade-in"
      onClick={() => navigate(`/factions/${faction.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`View ${faction.name} details`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/factions/${faction.id}`); } }}
    >
      <div className="relative">
        <img
          src={`../../assets/${faction.name}.jpg`}
          alt={faction.name}
          className="h-48 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-center font-bold text-lg text-text-primary drop-shadow-lg">
          {faction.name}
        </h3>
      </div>

      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-bg-primary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
        <span className="text-accent-cyan text-sm font-medium">View Details</span>
      </div>
    </div>
  )
}

export default FactionInfoCard;
