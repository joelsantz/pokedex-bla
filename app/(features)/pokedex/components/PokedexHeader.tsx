'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export type SearchFilter = "number" | "name";

type PokedexHeaderProps = {
  query: string;
  onQueryChange: (value: string) => void;
  total: number;
  filterBy: SearchFilter;
  onFilterChange: (value: SearchFilter) => void;
};

const filterOptions: Array<{ label: string; value: SearchFilter; icon: string }> = [
  { label: "Number", value: "number", icon: "/tag.svg" },
  { label: "Name", value: "name", icon: "/text_format.svg" },
];

export function PokedexHeader({ query, onQueryChange, filterBy, onFilterChange }: PokedexHeaderProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isFilterOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isFilterOpen]);

  const activeFilter = filterOptions.find(option => option.value === filterBy) ?? filterOptions[0];

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
        <div className="flex items-center gap-4 rounded-full bg-white/15 px-6 py-3 text-xs font-semibold tracking-[0.35em] text-white/80">
          <nav className="flex items-center gap-4 text-[0.7rem] tracking-[0.2em]">
            <a
              href="https://pokeapi.co/"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              API
            </a>
            <a
              href="https://github.com/joelsantz/pokedex-bla"
              target="_blank"
              rel="noreferrer"
              className="transition hover:text-white"
            >
              GITHUB
            </a>
          </nav>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
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
        <div ref={filterRef} className="relative flex-shrink-0">
          <button
            type="button"
            onClick={() => setIsFilterOpen(prev => !prev)}
            aria-label={`Filter by ${activeFilter.label}`}
            aria-expanded={isFilterOpen}
            className="flex h-14 w-14 items-center justify-center rounded-full border border-white/50 bg-white text-[var(--primary)] shadow-[0_10px_25px_rgba(0,0,0,0.25)] transition hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
          >
            <Image
              src={activeFilter.icon}
              alt=""
              width={24}
              height={24}
              className="h-6 w-6"
              aria-hidden="true"
              priority={activeFilter.value === "name"}
            />
          </button>
          {isFilterOpen && (
            <div className="absolute right-0 z-20 mt-3 w-48 rounded-[20px] bg-white p-4 shadow-lg shadow-slate-200">
              <div className="rounded-[22px] bg-white px-4 py-4">
                <p className="text-sm text-[var(--primary)]">Filter by:</p>
                <div className="mt-4 flex flex-col gap-2">
                  {filterOptions.map(option => {
                    const selected = option.value === filterBy;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          onFilterChange(option.value);
                          setIsFilterOpen(false);
                        }}
                        className="flex items-center gap-3 rounded-full px-1 py-2 text-left text-sm font-semibold text-slate-900 transition hover:text-[var(--primary)]"
                      >
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            selected ? "border-[var(--primary)]" : "border-slate-300"
                          }`}
                        >
                          {selected && <span className="h-2 w-2 rounded-full bg-[var(--primary)]" />}
                        </span>
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
