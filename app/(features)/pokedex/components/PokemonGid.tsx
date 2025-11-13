import { PokemonListItem } from './types';
import { PokemonCard } from './PokemonCard';

type PokemonGridProps = {
  pokemon: PokemonListItem[];
};

export function PokemonGrid({ pokemon }: PokemonGridProps) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {pokemon.map(item => (
        <PokemonCard key={item.number} pokemon={item} />
      ))}
    </div>
  );
}
