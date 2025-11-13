import { NextResponse } from "next/server";

import { getTypeColor, getTypeGradient } from "@/domain/pokemon/colors";
import type { PokemonDetail, PokemonStat } from "@/domain/pokemon/types";

const POKE_API_BASE = "https://pokeapi.co/api/v2";

type PokeApiPokemon = {
  id: number;
  name: string;
  sprites: {
    front_default: string | null;
    other?: {
      ["official-artwork"]?: {
        front_default: string | null;
      };
    };
  };
  types: Array<{
    slot: number;
    type: { name: string };
  }>;
  height: number;
  weight: number;
  abilities: Array<{
    ability: { name: string };
  }>;
  stats: Array<{
    base_stat: number;
    stat: { name: string };
  }>;
};

type PokeApiSpecies = {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
};

const STAT_LABELS: Record<string, string> = {
  hp: "HP",
  attack: "ATK",
  defense: "DEF",
  "special-attack": "SATK",
  "special-defense": "SDEF",
  speed: "SPD",
};

function formatName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function formatNumber(id: number) {
  return `#${id.toString().padStart(3, "0")}`;
}

function toKilograms(hectograms: number) {
  return `${(hectograms / 10).toFixed(1)} kg`;
}

function toMeters(decimeters: number) {
  return `${(decimeters / 10).toFixed(1)} m`;
}

function normalizeDescription(entries: PokeApiSpecies["flavor_text_entries"]) {
  const english = entries.find(entry => entry.language.name === "en");
  if (!english) {
    return "No description available.";
  }
  return english.flavor_text.replace(/\f/g, " ").replace(/\s+/g, " ").trim();
}

function mapStats(stats: PokeApiPokemon["stats"]): PokemonStat[] {
  return stats.map(stat => ({
    key: stat.stat.name,
    label: STAT_LABELS[stat.stat.name] ?? stat.stat.name.toUpperCase(),
    value: stat.base_stat,
  }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ identifier: string }> }
) {
  const { identifier } = await params;
  const pokemonResponse = await fetch(`${POKE_API_BASE}/pokemon/${identifier}`, {
    next: { revalidate: 120 },
  });

  if (!pokemonResponse.ok) {
    return NextResponse.json({ error: "Pokémon not found." }, { status: 404 });
  }

  const pokemon = (await pokemonResponse.json()) as PokeApiPokemon;

  const speciesResponse = await fetch(`${POKE_API_BASE}/pokemon-species/${pokemon.id}`, {
    next: { revalidate: 3600 },
  });

  const species = speciesResponse.ok ? ((await speciesResponse.json()) as PokeApiSpecies) : null;

  const primaryType = pokemon.types.sort((a, b) => a.slot - b.slot)[0]?.type.name ?? "normal";

  const detail: PokemonDetail = {
    id: pokemon.id,
    slug: pokemon.name,
    number: formatNumber(pokemon.id),
    name: formatName(pokemon.name),
    image: pokemon.sprites.other?.["official-artwork"]?.front_default ?? pokemon.sprites.front_default,
    heroGradient: getTypeGradient(primaryType),
    themeColor: getTypeColor(primaryType),
    types: pokemon.types.map(entry => formatName(entry.type.name)),
    weight: toKilograms(pokemon.weight),
    height: toMeters(pokemon.height),
    moves: pokemon.abilities.map(ability => formatName(ability.ability.name)).slice(0, 3),
    description: species ? normalizeDescription(species.flavor_text_entries) : "No description available.",
    stats: mapStats(pokemon.stats),
  };

  return NextResponse.json(detail, { status: 200 });
}
