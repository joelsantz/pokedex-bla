import { PokemonListItem } from './types';
import { PokemonCard } from './PokemonCard';

type PokemonGridProps = {
  pokemon: PokemonListItem[];
};

export function PokemonGrid({ pokemon }: PokemonGridProps) {
  if (pokemon.length === 0) {
    return <p className="text-center text-sm text-slate-400">No Pokémon found.</p>;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
      {pokemon.map(item => (
        <PokemonCard key={item.slug} pokemon={item} />
      ))}
    </div>
  );
}
