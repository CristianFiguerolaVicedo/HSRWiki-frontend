import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { fillDescription, naturalCap } from "../util/skills";

// {0}, {1}... in the description are replaced by the values of the chosen level
const Description = ({ desc, values }) => (
  <p className="text-text-primary/85 leading-relaxed whitespace-pre-line">
    {fillDescription(desc, values).map((part, i) => (part.text !== undefined
      ? part.text
      : <span key={i} className="font-bold text-accent-gold tabular-nums">{part.value}</span>))}
  </p>
);

/**
 * One skill with a level selector.
 * preset: "min" | "max" | "eidolon" (chosen at the top of the tab; each card can then be moved on its own)
 * eidolonBonus: levels the character's Eidolons add to this skill (0 if none)
 */
const SkillCard = ({ skill, label, letter, preset = "max", eidolonBonus = 0 }) => {
  const params = skill.params || [];
  const levels = params.length;
  const cap = Math.min(naturalCap(skill.maxLevel || levels), levels);
  const boosted = Math.min(cap + eidolonBonus, levels);
  const start = preset === "min" ? 1 : preset === "eidolon" ? boosted : cap;

  const [level, setLevel] = useState(Math.max(1, start));
  const [showTable, setShowTable] = useState(false);
  const hasLevels = levels > 1 && params[0]?.length > 0;
  const values = params[level - 1] || [];

  const chips = [
    ["Lv. 1", 1],
    [`Max (${cap})`, cap],
    ...(boosted > cap ? [[`With Eidolons (${boosted})`, boosted]] : []),
  ];

  return (
    <div className="glass-panel p-6 border border-border">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <div className="w-10 h-10 bg-accent-red/10 rounded-lg flex items-center justify-center border border-accent-red/20 shrink-0">
          <span className="text-accent-gold text-xl">{letter}</span>
        </div>
        <div className="min-w-0">
          <p className="text-sm text-text-secondary leading-tight">{label}</p>
          <h3 className="text-xl font-bold text-text-primary leading-tight">{skill.name}</h3>
        </div>
      </div>

      {!hasLevels ? (
        <Description desc={skill.desc || "No skill data available"} values={params[0] || []} />
      ) : (
        <>
          <div className="mb-4 p-3 rounded-lg bg-bg-primary border border-border flex flex-wrap items-center gap-x-4 gap-y-3">
            <label className="flex items-center gap-3 flex-1 min-w-[220px]">
              <span className="font-hand text-2xl leading-none text-accent-red w-16 shrink-0">Lv. {level}</span>
              <input
                type="range"
                min={1}
                max={levels}
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="flex-1 cursor-pointer"
                style={{ accentColor: "var(--color-accent-red)" }}
                aria-label={`${skill.name} level`}
              />
            </label>
            <div className="flex flex-wrap gap-1.5">
              {chips.map(([text, value]) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => setLevel(value)}
                  className={`px-2.5 py-1 rounded-full text-xs border cursor-pointer transition-colors ${level === value
                    ? "bg-[#FFE68F] border-[#E3C552] text-text-primary font-semibold"
                    : "bg-bg-card border-border text-text-secondary hover:text-text-primary"}`}
                >
                  {text}
                </button>
              ))}
            </div>
            {level > boosted && (
              <p className="w-full text-xs text-text-muted -mt-1">
                Above Lv. {boosted} is only reached with temporary buffs (some game modes raise skill levels).
              </p>
            )}
          </div>

          <Description desc={skill.desc} values={values} />

          <button
            type="button"
            onClick={() => setShowTable(!showTable)}
            aria-expanded={showTable}
            className="mt-4 flex items-center gap-1 text-sm text-accent-cyan hover:underline cursor-pointer"
          >
            <ChevronDown size={16} className={`transition-transform ${showTable ? "rotate-180" : ""}`} aria-hidden="true" />
            {showTable ? "Hide" : "Show"} every level
          </button>
          {showTable && (
            <div className="mt-3 overflow-x-auto">
              <table className="text-sm tabular-nums border-collapse">
                <thead>
                  <tr className="text-text-muted">
                    <th className="text-left font-normal pr-3 py-1">Value</th>
                    {params.map((_, i) => (
                      <th key={i} className="font-normal px-2 py-1 min-w-10">
                        <button type="button" onClick={() => setLevel(i + 1)} className={`cursor-pointer ${i + 1 === level ? "text-accent-red font-bold" : "hover:text-text-primary"}`}>
                          {i + 1}
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {params[0].map((_, p) => (
                    <tr key={p} className="border-t border-border">
                      <td className="pr-3 py-1.5 text-text-muted">{`{${p}}`}</td>
                      {params.map((row, i) => (
                        <td key={i} className={`px-2 py-1.5 text-center ${i + 1 === level ? "bg-[#FFE68F]/60 font-semibold" : i + 1 > boosted ? "text-text-muted" : ""}`}>
                          {row[p]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SkillCard;
