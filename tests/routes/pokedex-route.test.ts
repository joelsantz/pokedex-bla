import { describe, expect, it, vi } from "vitest";

import { GET as pokedexRoute } from "@/app/api/pokedex/route";

const POKE_API_BASE = "https://pokeapi.co/api/v2";

function jsonResponse(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return new Response(JSON.stringify(data), { ...init, headers });
}

describe("GET /api/pokedex", () => {
  it("returns a paginated list of Pokémon with normalized data", async () => {
    const listResponse = {
      count: 2,
      next: null,
      previous: null,
      results: [
        { name: "bulbasaur", url: `${POKE_API_BASE}/pokemon/1/` },
        { name: "ivysaur", url: `${POKE_API_BASE}/pokemon/2/` },
      ],
    };

    const bulbasaur = {
      id: 1,
      name: "bulbasaur",
      sprites: {
        front_default: "front-bulbasaur",
        other: { "official-artwork": { front_default: "art-bulbasaur" } },
      },
      types: [
        { slot: 2, type: { name: "poison" } },
        { slot: 1, type: { name: "grass" } },
      ],
    };

    const ivysaur = {
      id: 2,
      name: "ivysaur",
      sprites: {
        front_default: "front-ivysaur",
        other: { "official-artwork": { front_default: null } },
      },
      types: [{ slot: 1, type: { name: "grass" } }],
    };

    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.url ?? input.toString();
      if (url === `${POKE_API_BASE}/pokemon?offset=0&limit=2`) {
        return jsonResponse(listResponse);
      }
      if (url === `${POKE_API_BASE}/pokemon/1/`) {
        return jsonResponse(bulbasaur);
      }
      if (url === `${POKE_API_BASE}/pokemon/2/`) {
        return jsonResponse(ivysaur);
      }

      throw new Error(`Unexpected fetch call for ${url}`);
    });

    vi.stubGlobal("fetch", fetchMock as typeof fetch);

    const response = await pokedexRoute(new Request("http://localhost/api/pokedex?limit=2"));
    expect(response.status).toBe(200);
    const payload = await response.json();

    expect(payload).toMatchObject({
      page: 1,
      limit: 2,
      total: 2,
    });

    expect(payload.results).toHaveLength(2);
    expect(payload.results[0]).toMatchObject({
      id: 1,
      slug: "bulbasaur",
      number: "#001",
      name: "Bulbasaur",
      image: "art-bulbasaur",
      types: ["Grass", "Poison"],
    });
    expect(payload.results[1]).toMatchObject({
      id: 2,
      slug: "ivysaur",
      number: "#002",
      name: "Ivysaur",
      image: "front-ivysaur",
      types: ["Grass"],
    });
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("propagates errors from the upstream API", async () => {
    const fetchMock = vi.fn(async () =>
      jsonResponse({ message: "down" }, { status: 503 })
    );
    vi.stubGlobal("fetch", fetchMock as typeof fetch);

    const response = await pokedexRoute(new Request("http://localhost/api/pokedex"));
    expect(response.status).toBe(503);
    const payload = await response.json();
    expect(payload).toMatchObject({ error: "Unable to load Pokémon from source API." });
  });

  it("returns global search results honoring the limit parameter", async () => {
    const searchPool = {
      count: 3,
      next: null,
      previous: null,
      results: [
        { name: "bulbasaur", url: `${POKE_API_BASE}/pokemon/1/` },
        { name: "butterfree", url: `${POKE_API_BASE}/pokemon/12/` },
        { name: "buizel", url: `${POKE_API_BASE}/pokemon/418/` },
      ],
    };

    const createPokemon = (id: number, name: string) => ({
      id,
      name,
      sprites: { front_default: `${name}-sprite` },
      types: [{ slot: 1, type: { name: "bug" } }],
    });

    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.url ?? input.toString();
      if (url === `${POKE_API_BASE}/pokemon?offset=0&limit=2000`) {
        return jsonResponse(searchPool);
      }
      const match = url.match(/\/pokemon\/(\d+)\//);
      if (match) {
        const id = Number(match[1]);
        const entry = searchPool.results.find(item => item.url === url);
        return jsonResponse(createPokemon(id, entry?.name ?? `pokemon-${id}`));
      }

      throw new Error(`Unexpected fetch call for ${url}`);
    });

    vi.stubGlobal("fetch", fetchMock as typeof fetch);

    const response = await pokedexRoute(
      new Request("http://localhost/api/pokedex?search=bu&filterBy=name&limit=2"),
    );

    expect(response.status).toBe(200);
    const payload = await response.json();

    expect(payload.limit).toBe(2);
    expect(payload.total).toBe(3);
    expect(payload.results).toHaveLength(2);
    expect(payload.results.map((pokemon: { slug: string }) => pokemon.slug)).toEqual([
      "bulbasaur",
      "butterfree",
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1 + 2);
  });
});
