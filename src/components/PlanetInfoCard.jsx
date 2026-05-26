import { useNavigate } from "react-router-dom";

const PlanetInfoCard = ({planet}) => {
  const navigate = useNavigate();

  return (
    <div
      className="group hsr-card overflow-hidden p-0 cursor-pointer relative animate-fade-in"
      onClick={() => navigate(`/planets/${planet.id}`)}
      role="button"
      tabIndex={0}
      aria-label={`View ${planet.name} details`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); navigate(`/planets/${planet.id}`); } }}
    >
      <div className="relative">
        <img
          src={`../../assets/${planet.name}.jpg`}
          alt={planet.name}
          className="h-48 w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-4">
        <h3 className="text-center font-bold text-lg text-text-primary drop-shadow-lg">
          {planet.name}
        </h3>
      </div>
    </div>
  )
}

export default PlanetInfoCard;
