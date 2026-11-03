import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCharacters } from "../hooks/useCharacters";

const TierList = () => {
  const { characters, loading } = useCharacters();
  const navigate = useNavigate();

  // Each tier is a strip of paper; the label is a coloured sticker (warm = stronger)
  const tierConfig = {
    'T0': { label: 'T0', sticker: '#F28B9B', note: 'carries the team' },
    'T0.5': { label: 'T0.5', sticker: '#F6A57A', note: 'almost there' },
    'T1': { label: 'T1', sticker: '#F7C46C', note: 'great pick' },
    'T1.5': { label: 'T1.5', sticker: '#F3DE7A', note: 'solid' },
    'T2': { label: 'T2', sticker: '#B9DC8A', note: 'does the job' },
    'T3': { label: 'T3', sticker: '#8FD3B6', note: 'for fans' },
    'T4': { label: 'T4', sticker: '#8EC9E8', note: '' },
    'T5': { label: 'T5', sticker: '#A9B7E8', note: '' },
  };

  // Version 4.6 rankings (Game8 overall tier list, October 2026): SS -> T0, S+ -> T0.5, S -> T1, A -> T1.5, B -> T2, C -> T3
  const tiers = useMemo(() => ({
    'T0': ['Himeko • Nova', 'Silver Wolf LV.999', 'Evanescia', 'Castorice', 'Archer', 'Mortenax Blade', 'Robin • Summeretto', 'Sunday', 'Tribbie', 'Evernight', 'Rin Tohsaka', 'Sparkle', 'Hyacine', 'Yao Guang', 'Huohuo', 'Dan Heng • Permansor Terrae', 'Aventurine • Waveflair', 'Pearl', 'Ashveil'],
    'T0.5': ['Sparxie', 'Cyrene', 'Phainon', 'Firefly', 'Anaxa', 'The Herta', 'Cerydra', 'Ruan Mei', 'Robin', 'Acheron', 'Saber', 'Gilgamesh', 'Mydei', 'Cipher', 'The Dahlia', 'Kafka', 'Bronya', 'TrailblazerRemembrance#F', 'TrailblazerRemembrance#M', 'Fugue', 'Hysilens', 'Aventurine', 'Lingsha', 'Black Swan', 'Welt', 'Gallagher', 'Aglaea', 'Seele', 'TrailblazerElation#F', 'TrailblazerElation#M'],
    'T1': ['Yunli', 'Jade', 'Jingliu', 'Blade', 'Boothill', 'Silver Wolf', 'Tingyun', 'Jing Yuan', 'Topaz & Numby', 'Jiaoqiu', 'Fu Xuan', 'Pela', 'Luocha', 'Feixiao', 'TrailblazerHarmony#F', 'TrailblazerHarmony#M', 'Rappa'],
    'T1.5': ['Dr. Ratio', 'Dan Heng • Imbibitor Lunae', 'Himeko', 'Argenti', 'Clara', 'March 7th (Imaginary)', 'Moze', 'Asta', 'Gepard', 'Bailu', 'Herta', 'Guinaifen', 'Lynx', 'Hanya', 'Xueyi'],
    'T2': ['Natasha', 'Qingque', 'March 7th', 'TrailblazerPreservation#F', 'TrailblazerPreservation#M', 'Serval', 'Hook', 'Yanqing', 'Yukong', 'Misha', 'Luka', 'Sampo', 'Dan Heng', 'Sushang'],
    'T3': ['TrailblazerDestruction#F', 'TrailblazerDestruction#M', 'Arlan'],
    'T4': [],
    'T5': []
  }), []);

  const tierGroups = useMemo(() => {
    const grouped = {};
    for (const tier in tiers) {
      grouped[tier] = tiers[tier]
        .map(name => characters.find(char => char.name === name))
        .filter(Boolean);
    }
    return grouped;
  }, [characters, tiers]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-text-primary text-xl">Loading tier list...</div>
      </div>
    );
  }

  return (
    <div className="text-text-primary rounded-xl">
      <div className="mb-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-text-primary">Tier List</h1>
        <p className="font-hand text-3xl text-accent-red mt-1 -rotate-1 origin-left">
          who's carrying the team in version 4.6
        </p>
      </div>

      <div className="space-y-4">
        {Object.entries(tierGroups)
          .filter(([, chars]) => chars.length > 0)
          .map(([tier, chars]) => {
          const config = tierConfig[tier];
          return (
            <section
              key={tier}
              aria-label={`Tier ${config.label}`}
              className="glass-panel flex flex-col sm:flex-row sm:items-stretch overflow-visible"
            >
              <div className="sm:w-28 shrink-0 flex sm:flex-col items-center justify-center gap-x-3 px-4 py-3 border-b sm:border-b-0 sm:border-r-2 border-dashed border-border-hover">
                <span
                  className="px-3 py-1.5 rounded-md text-2xl font-extrabold text-text-primary shadow-sm -rotate-3"
                  style={{ background: config.sticker }}
                >
                  {config.label}
                </span>
                {config.note && <span className="font-hand text-lg leading-tight text-text-secondary sm:mt-2 text-center">{config.note}</span>}
              </div>
              <div className="flex-1 p-3 flex flex-wrap gap-2.5">
                {chars.map(char => (
                  <button
                    key={char.name}
                    onClick={() => navigate(`/char/${char.id}`)}
                    title={char.name}
                    aria-label={char.name}
                    className="group relative cursor-pointer"
                  >
                    <img
                      src={char.miniIcon}
                      alt=""
                      loading="lazy"
                      className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg bg-bg-elevated border-2 border-white shadow-sm transition-transform duration-150 group-hover:-translate-y-0.5 group-hover:-rotate-2"
                    />
                    <span className="pointer-events-none absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-text-primary px-1.5 py-0.5 text-[11px] text-bg-primary opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity z-10">
                      {char.name.replace('Trailblazer', 'TB ').replace('#M', ' ♂').replace('#F', ' ♀')}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  )
}

export default TierList;
