import { NextResponse } from "next/server";

import { getTypeColor, getTypeGradient } from "@/domain/pokemon/colors";
import type { PokemonDetail, PokemonStat, PokemonVariant } from "@/domain/pokemon/types";

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
  forms: Array<{ name: string; url: string }>;
};

type PokeApiPokemonForm = {
  name: string;
  sprites: {
    front_default: string | null;
    other?: {
      ["official-artwork"]?: {
        front_default: string | null;
      };
    };
  };
};

type PokeApiSpecies = {
  flavor_text_entries: Array<{
    flavor_text: string;
    language: { name: string };
  }>;
  evolution_chain: { url: string } | null;
};

type PokeApiEvolutionChain = {
  chain: EvolutionNode;
};

type EvolutionNode = {
  species: { name: string };
  evolves_to: EvolutionNode[];
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
  const heroImage = pokemon.sprites.other?.["official-artwork"]?.front_default ?? pokemon.sprites.front_default;
  const forms = await loadFormVariants(pokemon, heroImage, pokemon.name);
  const evolutions = await loadEvolutionVariants(pokemon.name, heroImage, species?.evolution_chain?.url ?? null);

  const detail: PokemonDetail = {
    id: pokemon.id,
    slug: pokemon.name,
    number: formatNumber(pokemon.id),
    name: formatName(pokemon.name),
    image: heroImage,
    heroGradient: getTypeGradient(primaryType),
    themeColor: getTypeColor(primaryType),
    types: pokemon.types.map(entry => formatName(entry.type.name)),
    weight: toKilograms(pokemon.weight),
    height: toMeters(pokemon.height),
    moves: pokemon.abilities.map(ability => formatName(ability.ability.name)).slice(0, 3),
    description: species ? normalizeDescription(species.flavor_text_entries) : "No description available.",
    stats: mapStats(pokemon.stats),
    forms,
    evolutions,
  };

  return NextResponse.json(detail, { status: 200 });
}

async function loadFormVariants(
  pokemon: PokeApiPokemon,
  fallbackImage: string | null,
  fallbackName: string
): Promise<PokemonVariant[]> {
  const baseVariant: PokemonVariant = {
    slug: pokemon.name,
    name: formatName(fallbackName),
    image: fallbackImage,
  };

  if (!pokemon.forms || pokemon.forms.length === 0) {
    return [baseVariant];
  }

  const formDetails = await Promise.all(
    pokemon.forms.map(async form => {
      try {
        const response = await fetch(form.url, { next: { revalidate: 3600 } });
        if (!response.ok) {
          return null;
        }
        const formData = (await response.json()) as PokeApiPokemonForm;
        const image =
          formData.sprites.other?.["official-artwork"]?.front_default ?? formData.sprites.front_default ?? fallbackImage;
        return {
          slug: form.name,
          name: formatName(formData.name),
          image,
        } satisfies PokemonVariant;
      } catch {
        return null;
      }
    })
  );

  const variants = formDetails.filter((variant): variant is PokemonVariant => Boolean(variant));

  if (variants.length === 0) {
    return [baseVariant];
  }

  const seen = new Set<string>();
  const ordered: PokemonVariant[] = [];

  function pushUnique(variant: PokemonVariant) {
    const key = variant.slug.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    ordered.push(variant);
  }

  pushUnique(baseVariant);
  variants.forEach(pushUnique);

  return ordered;
}

async function loadEvolutionVariants(
  currentSlug: string,
  currentImage: string | null,
  chainUrl: string | null,
): Promise<PokemonVariant[]> {
  const fallback: PokemonVariant = {
    slug: currentSlug,
    name: formatName(currentSlug),
    image: currentImage,
  };

  if (!chainUrl) {
    return [fallback];
  }

  try {
    const response = await fetch(chainUrl, { next: { revalidate: 3600 } });
    if (!response.ok) {
      return [fallback];
    }
    const chain = (await response.json()) as PokeApiEvolutionChain;
    const collected = collectEvolutionNames(chain.chain);
    if (collected.length === 0) {
      return [fallback];
    }

    const seen = new Set<string>();
    const variants: PokemonVariant[] = [];

    collected.forEach(name => {
      const slug = name.toLowerCase();
      if (seen.has(slug)) {
        return;
      }
      seen.add(slug);
      variants.push({
        slug,
        name: formatName(name),
        image: slug === currentSlug ? currentImage : null,
      });
    });

    // Ensure current pokemon is included even if chain data omitted it
    if (!seen.has(currentSlug.toLowerCase())) {
      variants.unshift(fallback);
    }

    return variants;
  } catch {
    return [fallback];
  }
}

function collectEvolutionNames(node: EvolutionNode, acc: string[] = []): string[] {
  acc.push(node.species.name);
  node.evolves_to.forEach(child => collectEvolutionNames(child, acc));
  return acc;
}
