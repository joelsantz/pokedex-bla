import type { PokemonStat } from "@/domain/pokemon/types";

type PokemonStatListProps = {
  stats: PokemonStat[];
  themeColor: string;
};

const MAX_STAT_VALUE = 120;

export function PokemonStatList({ stats, themeColor }: PokemonStatListProps) {
  return (
    <div className="mt-6 flex flex-col gap-4">
      {stats.map(stat => {
        const widthPercentage = Math.min(stat.value / MAX_STAT_VALUE, 1) * 100;
        return (
          <div key={stat.key} className="flex items-center gap-4 text-sm font-semibold text-slate-800">
            <span className="w-12 text-[12px] uppercase text-[var(--primary)]">{stat.label}</span>
            <span className="w-10 text-slate-500">{stat.value.toString().padStart(3, "0")}</span>
            <div className="h-3 flex-1 rounded-full bg-slate-200">
              <div
                className="h-full rounded-full"
                style={{ width: `${widthPercentage}%`, backgroundColor: themeColor }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
