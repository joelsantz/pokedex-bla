import { FiSearch } from "react-icons/fi";

type PokedexHeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
  total: number;
};

export function PokedexHeader({ query, onQueryChange, total }: PokedexHeaderProps) {
  return (
    <header className="rounded-t-[38px] bg-[var(--primary)] px-8 py-8 text-white">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative h-14 w-14 rounded-full bg-white shadow-[inset_0_4px_8px_rgba(0,0,0,0.2)] flex items-center justify-center">
            <div className="h-10 w-10 rounded-full border-4 border-[var(--primary)]" />
            <span className="absolute -left-3 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white shadow" />
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">Pokédex</h1>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white/80 uppercase tracking-[0.3em]">
          {total} Pokemon
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row">
        <div className="flex flex-1 items-center gap-3 rounded-full bg-white px-5 py-3 text-[var(--primary)] shadow-[inset_0_4px_12px_rgba(0,0,0,0.15)]">
          <div className="relative flex-1">
            <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-[var(--primary)]">
              <FiSearch className="h-5 w-5" aria-hidden="true" />
            </span>
            <input
              value={query}
              onChange={event => onQueryChange(event.target.value)}
              placeholder="Search"
              className="w-full bg-transparent pl-8 text-base font-semibold tracking-wide text-[rgba(var(--primary-rgb),0.9)] placeholder:text-[rgba(var(--primary-rgb),0.6)] focus:outline-none"
            />
          </div>
        </div>
        <button
          type="button"
          className="flex items-center justify-center rounded-full border border-white/50 bg-white/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.4em] text-white transition hover:bg-white/30"
        >
          Sort
        </button>
      </div>
    </header>
  );
}
