import Image from 'next/image';
import { PokemonListItem } from './types';

type PokemonCardProps = {
  pokemon: PokemonListItem;
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <article className="rounded-[28px] border border-slate-100 bg-white/90 p-5 shadow-lg shadow-slate-200/70 transition hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-center justify-between text-[14px] uppercase text-slate-500">
        <span>{pokemon.type}</span>
        <span>{pokemon.number}</span>
      </div>

      <div className="mt-5 flex justify-center">
        <div className={`flex h-28 w-28 items-center justify-center rounded-[26px] bg-gradient-to-br ${pokemon.accent} shadow-inner`}>
          <Image
            src={pokemon.image}
            alt={pokemon.name}
            width={110}
            height={110}
            className="object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.2)]"
            priority={false}
          />
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-lg text-slate-800">{pokemon.name}</p>
      </div>
    </article>
  );
}
