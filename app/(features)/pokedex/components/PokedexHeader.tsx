import Image from "next/image";

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
          <div className="flex items-center gap-3">
            <Image
              src="/Pokeball.svg"
              alt="Pokédex icon"
              width={48}
              height={48}
              className="h-12 w-12"
              priority
            />
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
            <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2">
              <Image
                src="/search.svg"
                alt=""
                width={20}
                height={20}
                className="h-5 w-5"
                aria-hidden="true"
              />
            </span>
            <input
              value={query}
              onChange={event => onQueryChange(event.target.value)}
              placeholder="Search"
              className="w-full bg-transparent pl-8 pr-8 text-base tracking-wide text-[rgba(var(--primary-rgb),0.9)] placeholder:text-[rgba(var(--primary-rgb),0.6)] focus:outline-none"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => onQueryChange("")}
                aria-label="Clear search"
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--primary)] transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(var(--primary-rgb),0.5)]"
              >
                <Image
                  src="/close.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </button>
            )}
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
