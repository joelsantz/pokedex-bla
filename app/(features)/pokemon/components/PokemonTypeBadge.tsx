const TYPE_COLORS: Record<string, string> = {
  grass: "#63BC5A",
  poison: "#A864C7",
  fire: "#FF9C54",
  water: "#4EC1F7",
  bug: "#8CC84B",
  flying: "#8FA8DD",
  electric: "#F7D02C",
  fairy: "#F4B5D6",
  normal: "#B5B9C4",
  psychic: "#FA7179",
  ghost: "#7C538C",
  fighting: "#CE4069",
  rock: "#C7B78B",
};

type PokemonTypeBadgeProps = {
  type: string;
};

export function PokemonTypeBadge({ type }: PokemonTypeBadgeProps) {
  const color = TYPE_COLORS[type.toLowerCase()] ?? "var(--primary)";
  return (
    <span
      className="rounded-full px-4 py-1 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
      style={{ backgroundColor: color }}
    >
      {type}
    </span>
  );
}
