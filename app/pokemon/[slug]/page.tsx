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
    <main className="min-h-screen bg-[#111111] px-3 py-6 text-slate-900 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-5xl">
        <article className="overflow-hidden rounded-[40px] bg-[#f7f6f4] shadow-[0_35px_70px_rgba(0,0,0,0.55)]">
          <section className={`relative overflow-hidden bg-gradient-to-br ${pokemon.heroGradient} px-6 py-8 text-white sm:px-10`}>
            <div className="absolute inset-y-0 right-0 -mr-10 hidden w-80 opacity-15 sm:block">
              <Image
                src="/Pokeball.svg"
                alt=""
                width={320}
                height={320}
                className="h-full w-full object-contain"
                aria-hidden="true"
              />
            </div>
            <div className="flex items-center justify-between gap-6">
              <Link
                href="/pokedex"
                className="flex items-center gap-3 text-lg font-semibold text-white transition hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/80"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-2xl font-bold">
                  &larr;
                </span>
                <span className="hidden sm:inline">Back to Pokédex</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <span className="text-xl font-semibold text-white/90">{pokemon.number}</span>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <h1 className="text-4xl font-black drop-shadow-sm">{pokemon.name}</h1>
                <div className="mt-4 flex flex-wrap gap-3">
                  {pokemon.types.map(type => (
                    <PokemonTypeBadge key={type} type={type} />
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="flex h-64 w-64 items-center justify-center">
                  <Image
                    src={pokemon.image}
                    alt={pokemon.name}
                    width={260}
                    height={260}
                    priority
                    className="object-contain drop-shadow-[0_25px_45px_rgba(0,0,0,0.35)]"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-t-[36px] bg-white px-6 py-10 text-slate-800 sm:px-10">
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
                  icon={
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[var(--primary)]"
                    >
                      <path d="M5 22h14l1.5-8h-17z" />
                      <path d="M9 10a3 3 0 0 1 6 0" />
                    </svg>
                  }
                />
                <DetailMetric
                  label="Height"
                  value={pokemon.height}
                  icon={
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[var(--primary)]"
                    >
                      <path d="M12 3v18" />
                      <path d="m8 7 4-4 4 4" />
                      <path d="m8 17 4 4 4-4" />
                    </svg>
                  }
                />
                <DetailMetric
                  label="Moves"
                  value={pokemon.moves.join(", ")}
                  icon={
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-[var(--primary)]"
                    >
                      <path d="M12 2v20" />
                      <path d="M17 7H7l5-5z" />
                      <path d="M7 17h10l-5 5z" />
                    </svg>
                  }
                />
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
    </main>
  );
}

type DetailMetricProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function DetailMetric({ icon, label, value }: DetailMetricProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 text-base font-semibold text-slate-700">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)]/10 text-[var(--primary)]">
          {icon}
        </span>
        <span>{value}</span>
      </div>
      <span className="text-xs uppercase tracking-[0.2em] text-slate-400">{label}</span>
    </div>
  );
}
