'use client';

import { useMemo, useState } from 'react';
import { pokemonListItems } from '@/domain/pokemon/data';
import { PokedexHeader, type SearchFilter } from './components/PokedexHeader';
import { PokemonGrid } from './components/PokemonGid';

export default function PokedexPage() {
  const [query, setQuery] = useState('');
  const [filterBy, setFilterBy] = useState<SearchFilter>('name');

  const filteredPokemon = useMemo(() => {
    const trimmedQuery = query.trim().toLowerCase();
    if (!trimmedQuery) {
      return pokemonListItems;
    }

    if (filterBy === 'name') {
      return pokemonListItems.filter(pokemon => pokemon.name.toLowerCase().includes(trimmedQuery));
    }

    const numericQuery = trimmedQuery.replace(/^#/, '');
    return pokemonListItems.filter(pokemon =>
      pokemon.number.replace(/^#/, '').toLowerCase().includes(numericQuery),
    );
  }, [filterBy, query]);

  return (
    <main className="min-h-screen bg-[#222222] px-2 py-6 text-slate-900 sm:px-6 lg:px-10">
      <div className="w-full">
        <div className="rounded-[40px] bg-[#f7f6f4] shadow-[0_35px_70px_rgba(0,0,0,0.55)]">
          <PokedexHeader
            query={query}
            onQueryChange={setQuery}
            total={filteredPokemon.length}
            filterBy={filterBy}
            onFilterChange={setFilterBy}
          />

          <section className="rounded-b-[36px] bg-white px-6 py-8 sm:px-10 sm:py-12">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Pokemon List</p>
              </div>
              <p className="text-sm text-slate-400">
                Showing <span className="font-semibold text-slate-600">{filteredPokemon.length}</span> results
              </p>
            </div>

            <div className="mt-8">
              <PokemonGrid pokemon={filteredPokemon} />
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
