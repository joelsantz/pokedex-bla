'use client';

import { useEffect, useMemo, useState } from 'react';

import type { PokemonListItem, PokemonListResponse } from './components/types';
import { PokedexHeader, type SearchFilter } from './components/PokedexHeader';
import { PokemonGrid } from './components/PokemonGid';

const PAGE_SIZE = 20;

export default function PokedexPage() {
  const [query, setQuery] = useState('');
  const [filterBy, setFilterBy] = useState<SearchFilter>('name');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<PokemonListItem[] | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  const trimmedQuery = query.trim();
  const isSearching = trimmedQuery.length > 0;

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPokemons() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/pokedex?page=${page}&limit=${PAGE_SIZE}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error('Failed to load Pok\u00e9mon.');
        }
        const data = (await response.json()) as PokemonListResponse;
        setPokemons(data.results);
        setTotal(data.total);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setError('Unable to load Pokémon. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchPokemons();

    return () => controller.abort();
  }, [page]);

  useEffect(() => {
    if (!isSearching) {
      setSearchResults(null);
      setSearchError(null);
      setSearchLoading(false);
      return undefined;
    }

    const controller = new AbortController();

    async function fetchSearchResults() {
      setSearchLoading(true);
      setSearchError(null);
      try {
        const searchParams = new URLSearchParams({
          search: trimmedQuery,
          filterBy,
          limit: `${PAGE_SIZE}`,
        });
        const response = await fetch(`/api/pokedex?${searchParams.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) {
          throw new Error('Failed to search Pok\u00e9mon.');
        }
        const data = (await response.json()) as PokemonListResponse;
        setSearchResults(data.results);
        setSearchError(data.results.length === 0 ? 'No Pok\u00e9mon matched that search.' : null);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setSearchResults([]);
          setSearchError('Unable to find Pok\u00e9mon. Please try again.');
        }
      } finally {
        setSearchLoading(false);
      }
    }

    fetchSearchResults();

    return () => controller.abort();
  }, [filterBy, isSearching, trimmedQuery]);

  const filteredPokemon = useMemo(() => {
    const normalizedQuery = trimmedQuery.toLowerCase();
    if (!normalizedQuery) {
      return pokemons;
    }

    if (filterBy === 'name') {
      return pokemons.filter(pokemon => pokemon.name.toLowerCase().includes(normalizedQuery));
    }

    const numericQuery = normalizedQuery.replace(/^#/, '');
    return pokemons.filter(pokemon =>
      pokemon.number.replace(/^#/, '').toLowerCase().includes(numericQuery),
    );
  }, [filterBy, pokemons, trimmedQuery]);

  const displayedPokemon = isSearching ? searchResults ?? [] : filteredPokemon;
  const isBusy = isSearching ? searchLoading : loading;
  const activeError = isSearching ? searchError : error;

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-[var(--canvas-charcoal)] px-3 pb-10 pt-8 text-slate-900 sm:px-6 lg:px-10">
      <div className="w-full rounded-[40px] bg-[var(--surface-card)] shadow-[0_35px_70px_rgba(0,0,0,0.55)]">
        <PokedexHeader
          query={query}
          onQueryChange={setQuery}
          total={displayedPokemon.length}
          filterBy={filterBy}
          onFilterChange={setFilterBy}
        />

        <section className="space-y-8 rounded-b-[36px] bg-white px-6 py-8 sm:px-10 sm:py-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Pokemon List</p>
            </div>
            <p className="text-sm text-slate-400">
              Showing <span className="font-semibold text-slate-600">{displayedPokemon.length}</span> results
            </p>
          </div>

          {activeError && <p className="text-sm font-medium text-red-500">{activeError}</p>}

          {isBusy ? (
            <p className="text-center text-sm text-slate-400">
              {isSearching ? 'Searching the Pok\u00e9dex...' : 'Loading Pokémon...'}
            </p>
          ) : (
            <PokemonGrid pokemon={displayedPokemon} />
          )}

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              disabled={page === 1 || loading || isSearching}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            >
              Previous
            </button>
            <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
              {isSearching ? 'Search Results' : `Page ${page} / ${totalPages}`}
            </p>
            <button
              type="button"
              disabled={page >= totalPages || loading || isSearching}
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              className="rounded-full border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </section>

      </div>
    </main>
  );
}
