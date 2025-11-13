import { NextResponse } from "next/server";

import type { PokemonListItem, PokemonListResponse } from "@/domain/pokemon/types";

const POKE_API_BASE = "https://pokeapi.co/api/v2";

const DEFAULT_LIMIT = 9;
const SEARCH_SOURCE_LIMIT = 2000;
const MAX_SEARCH_RESULTS = 60;

type SearchFilter = "name" | "number";

type PokeApiListResponse = {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<{ name: string; url: string }>;
};

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
    type: {
      name: string;
    };
  }>;
};

function formatName(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

function formatNumber(id: number) {
  return `#${id.toString().padStart(3, "0")}`;
}

function normalizeTypeName(type: string) {
  return formatName(type);
}

function createListItem(pokemon: PokeApiPokemon): PokemonListItem {
  const official = pokemon.sprites.other?.["official-artwork"]?.front_default;
  return {
    id: pokemon.id,
    slug: pokemon.name,
    number: formatNumber(pokemon.id),
    name: formatName(pokemon.name),
    image: official ?? pokemon.sprites.front_default,
    types: pokemon.types
      .sort((a, b) => a.slot - b.slot)
      .map(entry => normalizeTypeName(entry.type.name)),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchQuery = searchParams.get("search")?.trim();

  if (searchQuery) {
    return handleGlobalSearch(searchQuery, searchParams);
  }

  const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10), 1);
  const limit = Math.max(parseInt(searchParams.get("limit") ?? `${DEFAULT_LIMIT}`, 10), 1);
  const offset = (page - 1) * limit;

  const listResponse = await fetch(`${POKE_API_BASE}/pokemon?offset=${offset}&limit=${limit}`, {
    next: { revalidate: 120 },
  });

  if (!listResponse.ok) {
    return NextResponse.json(
      { error: "Unable to load Pokémon from source API." },
      { status: listResponse.status },
    );
  }

  const listJson = (await listResponse.json()) as PokeApiListResponse;
  const detailedResults = await Promise.all(
    listJson.results.map(async entry => {
      try {
        const pokemonRes = await fetch(entry.url, { next: { revalidate: 120 } });
        if (!pokemonRes.ok) {
          return null;
        }
        const pokemonJson = (await pokemonRes.json()) as PokeApiPokemon;
        return createListItem(pokemonJson);
      } catch {
        return null;
      }
    }),
  );

  const detailed = detailedResults.filter((item): item is PokemonListItem => Boolean(item));

  const payload: PokemonListResponse = {
    page,
    limit,
    total: listJson.count,
    results: detailed,
  };

  return NextResponse.json(payload, { status: 200 });
}

function normalizeSearchFilter(value: string | null): SearchFilter {
  return value === "number" ? "number" : "name";
}

function sanitizeNumberQuery(value: string) {
  return value.replace(/[^0-9]/g, "");
}

function extractPokemonId(url: string) {
  const match = url.match(/\/pokemon\/(\d+)\/?$/);
  return match ? match[1] : null;
}

async function handleGlobalSearch(query: string, params: URLSearchParams) {
  const filterBy = normalizeSearchFilter(params.get("filterBy"));
  const limitParam = Math.max(parseInt(params.get("limit") ?? `${DEFAULT_LIMIT}`, 10), 1);
  const limit = Math.min(limitParam, MAX_SEARCH_RESULTS);
  const normalizedQuery = filterBy === "name" ? query.toLowerCase() : sanitizeNumberQuery(query);

  if (!normalizedQuery) {
    const emptyPayload: PokemonListResponse = { page: 1, limit: 0, total: 0, results: [] };
    return NextResponse.json(emptyPayload, { status: 200 });
  }

  const listResponse = await fetch(`${POKE_API_BASE}/pokemon?offset=0&limit=${SEARCH_SOURCE_LIMIT}`, {
    next: { revalidate: 3600 },
  });

  if (!listResponse.ok) {
    return NextResponse.json(
      { error: "Unable to load Pokémon from source API." },
      { status: listResponse.status },
    );
  }

  const listJson = (await listResponse.json()) as PokeApiListResponse;
  const matches = listJson.results.filter(entry => {
    if (filterBy === "name") {
      return entry.name.toLowerCase().includes(normalizedQuery);
    }
    const id = extractPokemonId(entry.url);
    return id ? id.includes(normalizedQuery) : false;
  });

  const limitedMatches = matches.slice(0, limit);
  const detailedResults = await Promise.all(
    limitedMatches.map(async entry => {
      try {
        const pokemonRes = await fetch(entry.url, { next: { revalidate: 120 } });
        if (!pokemonRes.ok) {
          return null;
        }
        const pokemonJson = (await pokemonRes.json()) as PokeApiPokemon;
        return createListItem(pokemonJson);
      } catch {
        return null;
      }
    }),
  );

  const detailed = detailedResults.filter((item): item is PokemonListItem => Boolean(item));

  const payload: PokemonListResponse = {
    page: 1,
    limit,
    total: matches.length,
    results: detailed,
  };

  return NextResponse.json(payload, { status: 200 });
}
