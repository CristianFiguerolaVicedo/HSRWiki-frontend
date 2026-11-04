import { useState } from "react";
import { ChevronDown } from "lucide-react";

// Archive texts only carry <i> and <b>: turn them into elements, never into raw HTML
const RichText = ({ text }) => {
  const parts = [];
  let italic = false, bold = false, key = 0;
  for (const piece of text.split(/(<\/?[ib]>)/)) {
    if (piece === "<i>") italic = true;
    else if (piece === "</i>") italic = false;
    else if (piece === "<b>") bold = true;
    else if (piece === "</b>") bold = false;
    else if (piece) {
      let node = piece;
      if (bold) node = <strong key={`b${key}`}>{node}</strong>;
      if (italic) node = <em key={`i${key}`}>{node}</em>;
      parts.push(<span key={key++}>{node}</span>);
    }
  }
  return parts;
};

const VOICE_ORDER = ["English", "Japanese", "Chinese", "Korean"];

const Paragraphs = ({ text, className = "" }) => (
  <div className={`space-y-3 ${className}`}>
    {text.split(/\n+/).map((line, i) => (
      <p key={i}><RichText text={line} /></p>
    ))}
  </div>
);

const StoryEntry = ({ index, text, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen);
  const preview = text.replace(/<\/?[ib]>/g, "").split("\n")[0];

  return (
    <section className="glass-panel overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center gap-4 p-5 text-left cursor-pointer hover:bg-bg-elevated/50 transition-colors"
      >
        <span className="font-hand text-3xl text-accent-red leading-none w-10 shrink-0 text-center">{index}</span>
        <span className="flex-1 min-w-0">
          <span className="block font-bold text-lg text-text-primary">Character Story {index}</span>
          {!open && <span className="block text-sm text-text-muted truncate">{preview}</span>}
        </span>
        <ChevronDown size={20} className={`shrink-0 text-text-secondary transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="ruled-lore px-5 pb-6 pt-1 md:pl-[4.75rem]">
          <Paragraphs text={text} className="text-text-primary/90 leading-relaxed max-w-3xl" />
        </div>
      )}
    </section>
  );
};

const CharLore = ({ lore, name }) => {
  const [allOpen, setAllOpen] = useState(0); // bumping the key re-mounts the stories open/closed

  if (!lore) {
    return (
      <div className="glass-panel p-8 text-center">
        <p className="font-hand text-3xl text-accent-red mb-2">pages still blank</p>
        <p className="text-text-secondary">The archive texts for {name} aren't in the game data yet. They'll show up after the next data update.</p>
      </div>
    );
  }

  const voices = Object.entries(lore.voiceActors || {})
    .sort(([a], [b]) => VOICE_ORDER.indexOf(a) - VOICE_ORDER.indexOf(b));

  return (
    <div className="space-y-6">
      <section className="glass-panel p-6 md:p-8">
        <h3 className="text-xl font-bold text-text-primary">Character Details</h3>
        <p className="font-hand text-2xl text-text-secondary -mt-0.5 mb-4">from the Express archive</p>
        <Paragraphs text={lore.description} className="text-lg text-text-primary/90 leading-relaxed max-w-3xl" />

        {voices.length > 0 && (
          <dl className="mt-6 pt-5 border-t border-border flex flex-wrap gap-x-8 gap-y-3">
            {voices.map(([language, actor]) => (
              <div key={language}>
                <dt className="text-xs uppercase tracking-wide text-text-muted">{language} voice</dt>
                <dd className="font-semibold text-text-primary">{actor}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      {lore.stories?.length > 0 && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-2xl font-bold text-text-primary">
              Stories <span className="text-text-muted font-normal">({lore.stories.length})</span>
            </h3>
            <div className="flex gap-3 text-sm">
              <button type="button" onClick={() => setAllOpen(Math.abs(allOpen) + 1)} className="text-accent-cyan hover:underline cursor-pointer">Open all</button>
              <button type="button" onClick={() => setAllOpen(-(Math.abs(allOpen) + 1))} className="text-text-secondary hover:underline cursor-pointer">Close all</button>
            </div>
          </div>
          {lore.stories.map((story, i) => (
            <StoryEntry key={`${allOpen}-${i}`} index={i + 1} text={story} defaultOpen={allOpen > 0 || (allOpen === 0 && i === 0)} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CharLore;
