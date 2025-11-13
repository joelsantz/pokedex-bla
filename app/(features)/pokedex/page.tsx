'use client';

import { useMemo, useState } from 'react';
import { PokedexHeader } from './components/PokedexHeader';
import { PokemonGrid } from './components/PokemonGid';
import { PokemonListItem } from './components/types';

const pokemonList: PokemonListItem[] = [
  {
    number: '#001',
    name: 'Bulbasaur',
    type: 'Grass',
    region: 'Kanto',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    accent: 'from-emerald-50 to-emerald-200',
  },
  {
    number: '#004',
    name: 'Charmander',
    type: 'Fire',
    region: 'Kanto',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    accent: 'from-orange-50 to-orange-200',
  },
  {
    number: '#007',
    name: 'Squirtle',
    type: 'Water',
    region: 'Kanto',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png',
    accent: 'from-sky-50 to-sky-200',
  },
  {
    number: '#012',
    name: 'Butterfree',
    type: 'Bug',
    region: 'Kanto',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/12.png',
    accent: 'from-violet-50 to-violet-200',
  },
  {
    number: '#025',
    name: 'Pikachu',
    type: 'Electric',
    region: 'Kanto',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    accent: 'from-yellow-50 to-orange-100',
  },
  {
    number: '#039',
    name: 'Jigglypuff',
    type: 'Fairy',
    region: 'Kanto',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png',
    accent: 'from-pink-50 to-rose-100',
  },
  {
    number: '#063',
    name: 'Abra',
    type: 'Psychic',
    region: 'Kanto',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/63.png',
    accent: 'from-amber-50 to-yellow-100',
  },
  {
    number: '#092',
    name: 'Gastly',
    type: 'Ghost',
    region: 'Kanto',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png',
    accent: 'from-slate-100 to-purple-200',
  },
  {
    number: '#133',
    name: 'Eevee',
    type: 'Normal',
    region: 'Kanto',
    image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png',
    accent: 'from-amber-50 to-amber-200',
  },
];

export default function PokedexPage() {
  const [query, setQuery] = useState('');

  const filteredPokemon = useMemo(() => {
    if (!query.trim()) {
      return pokemonList;
    }

    return pokemonList.filter(pokemon => pokemon.name.toLowerCase().includes(query.trim().toLowerCase()));
  }, [query]);

  return (
    <main className="min-h-screen bg-[#111111] px-2 py-6 text-slate-900 sm:px-6 lg:px-10">
      <div className="w-full">
        <div className="relative rounded-[40px] bg-gradient-to-br from-[#b8001b] via-[#d8002c] to-[#ff2150] p-1 shadow-[0_35px_70px_rgba(0,0,0,0.55)]">
          <div className="rounded-[38px] bg-[#f7f6f4] overflow-hidden">
            <PokedexHeader query={query} onQueryChange={setQuery} total={filteredPokemon.length} />

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
      </div>
    </main>
  );
}
