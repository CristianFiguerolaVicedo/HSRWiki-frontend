import { useState } from "react";

const TAPES = ["tape-imaginary", "tape-ice", "tape-fire", "tape-wind", "tape-lightning", "tape-quantum"];

// A postcard taped into the journal: used for planets and factions.
// `fallback` is rendered when the artwork in /assets is missing.
const Postcard = ({ title, image, note, onClick, seed = 0, fallback = null }) => {
  const [imageFailed, setImageFailed] = useState(false);
  const tilt = ((seed % 5) - 2) * 0.5;

  return (
    <div
      className={`photo-card ${TAPES[seed % TAPES.length]} cursor-pointer`}
      style={{ "--tilt": `${tilt}deg`, "--tape-tilt": `${((seed + 2) % 5 - 2) * 1.5}deg` }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`View ${title} details`}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
    >
      <span className="washi" aria-hidden="true" />
      <div className="photo-card__picture h-48">
        {imageFailed || !image ? (
          fallback
        ) : (
          <img
            src={image}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => setImageFailed(true)}
          />
        )}
      </div>
      <div className="pt-3 px-1 flex items-baseline justify-between gap-3">
        <h3 className="font-bold text-lg leading-tight text-text-primary">{title}</h3>
        {note && <span className="font-hand text-xl leading-none text-text-secondary shrink-0">{note}</span>}
      </div>
    </div>
  );
};

export default Postcard;
