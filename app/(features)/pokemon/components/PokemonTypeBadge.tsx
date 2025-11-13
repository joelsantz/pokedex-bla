import { getTypeColor } from "@/domain/pokemon/colors";

type PokemonTypeBadgeProps = {
  type: string;
};

export function PokemonTypeBadge({ type }: PokemonTypeBadgeProps) {
  const color = getTypeColor(type);
  return (
    <span
      className="rounded-full px-4 py-1 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(0,0,0,0.15)]"
      style={{ backgroundColor: color }}
    >
      {type}
    </span>
  );
}
