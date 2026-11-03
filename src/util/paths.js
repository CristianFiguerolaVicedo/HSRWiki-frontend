// Light cones have no element, so their washi tape follows the Path instead
export const PATH_TAPES = {
  DESTRUCTION: 'tape-fire',
  HUNT: 'tape-wind',
  ERUDITION: 'tape-imaginary',
  HARMONY: 'tape-lightning',
  NIHILITY: 'tape-quantum',
  PRESERVATION: 'tape-ice',
  ABUNDANCE: 'tape-wind',
  REMEMBRANCE: 'tape-ice',
  ELATION: 'tape-fire',
}

export const pathLabel = (path) => path === "HUNT" ? "The Hunt" : path.charAt(0) + path.slice(1).toLowerCase();
