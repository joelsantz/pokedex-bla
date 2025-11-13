const COLOR_MAP = {
  grass: { solid: "#63BC5A", gradient: ["from-emerald-400", "to-lime-500"] },
  poison: { solid: "#A864C7", gradient: ["from-purple-500", "to-purple-700"] },
  fire: { solid: "#FF9C54", gradient: ["from-orange-400", "to-red-500"] },
  water: { solid: "#4EC1F7", gradient: ["from-sky-400", "to-cyan-500"] },
  bug: { solid: "#8CC84B", gradient: ["from-green-500", "to-lime-600"] },
  flying: { solid: "#8FA8DD", gradient: ["from-indigo-300", "to-indigo-500"] },
  electric: { solid: "#F7D02C", gradient: ["from-yellow-300", "to-amber-400"] },
  fairy: { solid: "#F4B5D6", gradient: ["from-pink-300", "to-rose-400"] },
  normal: { solid: "#B5B9C4", gradient: ["from-slate-300", "to-slate-500"] },
  psychic: { solid: "#FA7179", gradient: ["from-rose-500", "to-pink-600"] },
  ghost: { solid: "#7C538C", gradient: ["from-purple-700", "to-slate-800"] },
  fighting: { solid: "#CE4069", gradient: ["from-red-600", "to-rose-700"] },
  rock: { solid: "#C7B78B", gradient: ["from-amber-200", "to-amber-400"] },
  ground: { solid: "#E2BF65", gradient: ["from-amber-300", "to-yellow-500"] },
  steel: { solid: "#B7B7CE", gradient: ["from-slate-300", "to-slate-500"] },
  ice: { solid: "#96D9D6", gradient: ["from-cyan-200", "to-sky-400"] },
  dragon: { solid: "#6F35FC", gradient: ["from-purple-500", "to-indigo-700"] },
  dark: { solid: "#705746", gradient: ["from-stone-600", "to-stone-800"] },
};

const DEFAULT_COLOR = { solid: "#94a3b8", gradient: ["from-slate-500", "to-slate-700"] };

export function getTypeColor(type: string) {
  return (COLOR_MAP[type.toLowerCase() as keyof typeof COLOR_MAP] ?? DEFAULT_COLOR).solid;
}

export function getTypeGradient(type: string) {
  const gradient = COLOR_MAP[type.toLowerCase() as keyof typeof COLOR_MAP]?.gradient ?? DEFAULT_COLOR.gradient;
  return gradient.join(" ");
}
