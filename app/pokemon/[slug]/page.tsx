import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { PokemonStatList } from "../../(features)/pokemon/components/PokemonStatList";
import { PokemonTypeBadge } from "../../(features)/pokemon/components/PokemonTypeBadge";
import { getPokemonDetailBySlug, pokemonDetails } from "@/domain/pokemon/data";

type PokemonDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return pokemonDetails.map(pokemon => ({ slug: pokemon.slug }));
}

export async function generateMetadata({ params }: PokemonDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pokemon = getPokemonDetailBySlug(slug);
  if (!pokemon) {
    return {
      title: "Pokémon not found",
    };
  }

  return {
    title: `${pokemon.name} · Pokédex`,
    description: `See detailed information about ${pokemon.name}, including stats, moves, and lore.`,
  };
}

export default async function PokemonDetailPage({ params }: PokemonDetailPageProps) {
  const { slug } = await params;
  const pokemon = getPokemonDetailBySlug(slug);

  if (!pokemon) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#222222] px-2 py-6 text-slate-900 sm:px-6 lg:px-10">
      <div className="w-full">
        <div className={`relative rounded-[40px] bg-gradient-to-br ${pokemon.heroGradient} p-1 shadow-[0_35px_70px_rgba(0,0,0,0.55)]`}>
          <article className="overflow-hidden rounded-[38px] bg-[#f7f6f4]">
            <section className={`relative overflow-hidden rounded-t-[36px] bg-gradient-to-br ${pokemon.heroGradient} px-6 py-10 text-white sm:px-12`}>
              <div className="pointer-events-none absolute inset-y-0 right-0 -mr-24 hidden w-[28rem] opacity-15 sm:block">
                <Image
                  src="/Pokeball.svg"
                  alt=""
                  width={500}
                  height={500}
                  className="h-full w-full object-contain"
                  aria-hidden="true"
                />
              </div>
              <div className="flex items-center justify-between gap-4">
                <Link
                  href="/pokedex"
                  className="flex items-center gap-3 text-lg font-semibold text-white transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
                >
                  <Image
                    src="/arrow_back.svg"
                    alt="Back to Pokédex"
                    width={28}
                    height={28}
                    className="h-7 w-7 brightness-0 invert"
                  />
                  <span className="hidden sm:inline">Back to Pokédex</span>
                  <span className="sm:hidden">Back</span>
                </Link>
                <span className="text-xl font-semibold text-white/90">{pokemon.number}</span>
              </div>

              <div className="mt-8 flex flex-col items-center text-center">
                <h1 className="text-4xl font-black drop-shadow-sm sm:text-5xl">{pokemon.name}</h1>
                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  {pokemon.types.map(type => (
                    <PokemonTypeBadge key={type} type={type} />
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-center">
                  <div className="flex h-72 w-72 items-center justify-center sm:h-80 sm:w-80">
                    <Image
                      src={pokemon.image}
                      alt={pokemon.name}
                      width={320}
                      height={320}
                      priority
                      className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.35)]"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-t-[36px] bg-white px-6 py-12 text-slate-800 sm:px-12">
              <div className="flex flex-wrap justify-center gap-3">
                {pokemon.types.map(type => (
                  <PokemonTypeBadge key={`card-${type}`} type={type} />
                ))}
              </div>

              <div className="mt-10">
                <h2 className="text-center text-2xl font-extrabold text-[var(--primary)]">About</h2>
                <div className="mt-6 grid gap-6 text-center text-sm text-slate-500 sm:grid-cols-3">
                  <DetailMetric
                    label="Weight"
                    value={pokemon.weight}
                    icon={<Image src="/weight.svg" alt="" width={32} height={32} className="h-6 w-6" aria-hidden="true" />}
                  />
                  <DetailMetric
                    label="Height"
                    value={pokemon.height}
                    icon={<Image src="/straighten.svg" alt="" width={32} height={32} className="h-6 w-6" aria-hidden="true" />}
                  />
                  <DetailMetric label="Moves" value={pokemon.moves.join(", ")} />
                </div>
                <p className="mt-6 text-center text-base leading-relaxed text-slate-600">{pokemon.description}</p>
              </div>

              <div className="mt-10 rounded-[30px] border border-slate-100 bg-slate-50/60 p-6 shadow-inner">
                <h3 className="text-center text-xl font-extrabold text-[var(--primary)]">Base Stats</h3>
                <PokemonStatList stats={pokemon.stats} themeColor={pokemon.themeColor} />
              </div>
            </section>
          </article>
        </div>
      </div>
    </main>
  );
}

type DetailMetricProps = {
  icon?: ReactNode;
  label: string;
  value: string;
};

function DetailMetric({ icon, label, value }: DetailMetricProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3 text-base text-slate-700">
        {icon && <span className="flex h-6 w-6 items-center justify-center text-[var(--primary)]">{icon}</span>}
        <span>{value}</span>
      </div>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}
