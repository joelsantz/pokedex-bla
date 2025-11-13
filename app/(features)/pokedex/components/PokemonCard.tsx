import Image from 'next/image';
import Link from 'next/link';

import type { PokemonListItem } from './types';

type PokemonCardProps = {
  pokemon: PokemonListItem;
};

export function PokemonCard({ pokemon }: PokemonCardProps) {
  const primaryType = pokemon.types[0] ?? 'Unknown';

  return (
    <Link
      href={`/pokemon/${pokemon.slug}`}
      className="rounded-[28px] border border-slate-100 bg-white p-5 shadow-lg shadow-slate-200/60 transition hover:-translate-y-1 hover:shadow-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--primary)]"
    >
      <article className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-slate-400">
          <span>{primaryType}</span>
          <span>{pokemon.number}</span>
        </div>

        <div className="flex justify-center">
          <div className="flex h-40 w-full items-center justify-center rounded-[24px] border border-slate-100 bg-gradient-to-b from-white to-slate-50">
            {pokemon.image ? (
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                width={150}
                height={150}
                className="object-contain drop-shadow-[0_20px_25px_rgba(0,0,0,0.25)]"
              />
            ) : (
              <Image src="/Pokeball.svg" alt="" width={80} height={80} className="opacity-70" />
            )}
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg text-slate-800">{pokemon.name}</p>
        </div>
      </article>
    </Link>
  );
}
