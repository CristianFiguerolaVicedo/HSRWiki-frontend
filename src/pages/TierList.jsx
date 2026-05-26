import { useMemo } from "react";
import Sidebar from "../components/Sidebar";
import { useCharacters } from "../hooks/useCharacters";

const TierList = () => {
  const { characters, loading } = useCharacters();

  const tierConfig = {
    'T0': { label: 'T0', gradient: 'from-red-600 to-red-500', bg: 'bg-red-950/30', border: 'border-red-700/40', glow: 'shadow-red-600/20' },
    'T0.5': { label: 'T0.5', gradient: 'from-red-500 to-orange-500', bg: 'bg-red-950/20', border: 'border-red-500/30', glow: 'shadow-red-500/15' },
    'T1': { label: 'T1', gradient: 'from-orange-500 to-amber-500', bg: 'bg-orange-950/20', border: 'border-orange-600/30', glow: 'shadow-orange-600/15' },
    'T1.5': { label: 'T1.5', gradient: 'from-amber-500 to-yellow-500', bg: 'bg-amber-950/15', border: 'border-amber-500/25', glow: 'shadow-amber-500/10' },
    'T2': { label: 'T2', gradient: 'from-yellow-500 to-lime-500', bg: 'bg-lime-950/15', border: 'border-lime-500/25', glow: 'shadow-lime-500/10' },
    'T3': { label: 'T3', gradient: 'from-lime-500 to-emerald-500', bg: 'bg-emerald-950/15', border: 'border-emerald-500/25', glow: 'shadow-emerald-500/10' },
    'T4': { label: 'T4', gradient: 'from-emerald-500 to-cyan-500', bg: 'bg-cyan-950/15', border: 'border-cyan-500/25', glow: 'shadow-cyan-500/10' },
    'T5': { label: 'T5', gradient: 'from-cyan-500 to-sky-500', bg: 'bg-sky-950/15', border: 'border-sky-500/25', glow: 'shadow-sky-500/10' }
  };

  const tiers = useMemo(() => ({
    'T0': ['Castorice', 'Silver Wolf LV.999', 'Phainon', 'Anaxa', 'Sunday', 'Tribbie', 'Evernight', 'Sparkle', 'Hyacine', 'Yao Guang', 'Huohuo', 'Dan Heng • Permansor Terrae'],
    'T0.5': ['Evanescia', 'Sparxie', 'Cyrene', 'Firefly', 'Archer', 'The Herta', 'Cerydra', 'Ruan Mei', 'Robin', 'Acheron', 'Saber', 'Mydei', 'Ashveil', 'Feixiao', 'Cipher', 'The Dahlia', 'Kafka', 'Rappa', 'Bronya', 'TrailblazerRemembrance#F', 'TrailblazerRemembrance#M', 'Fugue', 'Hysilens', 'Aventurine', 'Lingsha', 'Black Swan', 'Welt', 'Gallagher', 'Aglaea', 'Seele', 'TrailblazerElation#F', 'TrailblazerElation#M'],
    'T1': ['Yunli', 'Jade', 'Jingliu', 'Blade', 'Boothill', 'Silver Wolf', 'Tingyun', 'Jing Yuan', 'Topaz & Numby', 'Jiaoqiu', 'Fu Xuan', 'Pela', 'Luocha', 'TrailblazerHarmony#F', 'TrailblazerHarmony#M'],
    'T1.5': ['Dr. Ratio', 'Dan Heng • Imbibitor Lunae', 'Himeko', 'Argenti', 'Clara', 'March 7th', 'Moze', 'Asta', 'Gepard', 'Bailu', 'Herta', 'Guinaifen', 'Lynx', 'Hanya', 'Xueyi'],
    'T2': ['Natasha', 'Qingque', 'Serval', 'Hook', 'Yanqing', 'Yukong', 'Misha', 'Luka', 'Sampo', 'Dan Heng', 'Sushang', 'TrailblazerPreservation#F', 'TrailblazerPreservation#M'],
    'T3': ['TrailblazerDestruction#F', 'TrailblazerDestruction#M', 'Arlan'],
    'T4': [],
    'T5': []
  }), []);

  const tierGroups = useMemo(() => {
    const grouped = {};
    for (const tier in tiers) {
      grouped[tier] = characters.filter(char => tiers[tier].includes(char.name));
    }
    return grouped;
  }, [characters, tiers]);

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-text-primary text-xl">Loading tier list...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="text-text-primary rounded-xl">
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold text-text-primary mb-2">Tier List</h1>
              <p className="text-text-secondary">
                Character rankings for the current meta. T0 is the strongest, T5 is the weakest.
              </p>
            </div>

            <div className="space-y-3">
              {Object.entries(tierGroups).map(([tier, chars]) => {
                const config = tierConfig[tier];
                return (
                  <div
                    key={tier}
                    className={`flex flex-col sm:flex-row rounded-xl overflow-hidden border ${config.border} ${config.bg} animate-fade-in shadow-lg ${config.glow}`}
                  >
                    <div className={`bg-gradient-to-br ${config.gradient} sm:w-20 flex items-center justify-center py-3 sm:py-0`}>
                      <span className="text-white font-black text-xl tracking-wider drop-shadow-lg">{config.label}</span>
                    </div>
                    <div className="flex-1 p-3 flex flex-wrap gap-2">
                      {chars.length > 0 ? chars.map(char => (
                        <div
                          key={char.name}
                          className="group relative flex flex-col items-center"
                        >
                          <img
                            src={char.miniIcon}
                            alt={char.name}
                            className="h-14 w-14 sm:h-16 sm:w-16 rounded-lg border-2 border-transparent hover:border-accent-gold/50 transition-all duration-200 hover:scale-110 hover:shadow-lg hover:shadow-accent-gold/10"
                          />
                          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-bg-primary/90 px-1.5 py-0.5 rounded">
                            {char.name.replace('Trailblazer', 'TB').replace('#M', '♂').replace('#F', '♀')}
                          </span>
                        </div>
                      )) : (
                        <span className="text-text-muted text-sm italic py-2">No characters in this tier</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default TierList;
