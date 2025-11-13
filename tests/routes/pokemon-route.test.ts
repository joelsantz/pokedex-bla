import { describe, expect, it, vi } from "vitest";

import { GET as pokemonRoute } from "@/app/api/pokemon/[identifier]/route";

const POKE_API_BASE = "https://pokeapi.co/api/v2";

function jsonResponse(data: unknown, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return new Response(JSON.stringify(data), { ...init, headers });
}

function extractUrl(input: RequestInfo | URL) {
  if (typeof input === "string") {
    return input;
  }
  if (input instanceof URL) {
    return input.toString();
  }
  return input.url;
}

describe("GET /api/pokemon/[identifier]", () => {
  it("returns a rich pokemon detail payload for a valid identifier", async () => {
    const pokemon = {
      id: 25,
      name: "pikachu",
      sprites: {
        front_default: "front-pikachu",
        other: { "official-artwork": { front_default: "hero-pikachu" } },
      },
      types: [
        { slot: 2, type: { name: "steel" } },
        { slot: 1, type: { name: "electric" } },
      ],
      height: 4,
      weight: 60,
      abilities: [
        { ability: { name: "static" } },
        { ability: { name: "lightning-rod" } },
        { ability: { name: "surge-surfer" } },
        { ability: { name: "volt-tackle" } },
      ],
      stats: [
        { base_stat: 35, stat: { name: "hp" } },
        { base_stat: 55, stat: { name: "attack" } },
      ],
      forms: [
        { name: "pikachu", url: `${POKE_API_BASE}/pokemon-form/25/` },
        { name: "pikachu-rock-star", url: `${POKE_API_BASE}/pokemon-form/10080/` },
      ],
    };

    const species = {
      flavor_text_entries: [
        { flavor_text: "Shocks\f foes with power.", language: { name: "en" } },
        { flavor_text: "Texto", language: { name: "es" } },
      ],
      evolution_chain: { url: `${POKE_API_BASE}/evolution-chain/10/` },
    };

    const formDetail = {
      name: "pikachu-rock-star",
      sprites: { other: { "official-artwork": { front_default: "rock-star-art" } } },
    };

    const evolutionChain = {
      chain: {
        species: { name: "pichu" },
        evolves_to: [
          {
            species: { name: "pikachu" },
            evolves_to: [{ species: { name: "raichu" }, evolves_to: [] }],
          },
        ],
      },
    };

    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = extractUrl(input);
      if (url === `${POKE_API_BASE}/pokemon/25`) {
        return jsonResponse(pokemon);
      }
      if (url === `${POKE_API_BASE}/pokemon-species/25`) {
        return jsonResponse(species);
      }
      if (url === `${POKE_API_BASE}/pokemon-form/10080/`) {
        return jsonResponse(formDetail);
      }
      if (url === `${POKE_API_BASE}/pokemon-form/25/`) {
        return jsonResponse({
          name: "pikachu",
          sprites: { other: { "official-artwork": { front_default: null } } },
        });
      }
      if (url === `${POKE_API_BASE}/evolution-chain/10/`) {
        return jsonResponse(evolutionChain);
      }

      throw new Error(`Unexpected fetch call for ${url}`);
    });

    vi.stubGlobal("fetch", fetchMock as typeof fetch);

    const response = await pokemonRoute(new Request("http://localhost/api/pokemon/25"), {
      params: Promise.resolve({ identifier: "25" }),
    });

    expect(response.status).toBe(200);
    const payload = await response.json();

    expect(payload).toMatchObject({
      id: 25,
      slug: "pikachu",
      number: "#025",
      name: "Pikachu",
      image: "hero-pikachu",
      themeColor: "#F7D02C",
      heroGradient: "from-yellow-300 to-amber-400",
      types: ["Electric", "Steel"],
      weight: "6.0 kg",
      height: "0.4 m",
      description: "Shocks foes with power.",
    });

    expect(payload.moves).toEqual(["Static", "Lightning-rod", "Surge-surfer"]);
    expect(payload.stats).toEqual([
      { key: "hp", label: "HP", value: 35 },
      { key: "attack", label: "ATK", value: 55 },
    ]);
    expect(payload.forms.map((form: { slug: string }) => form.slug)).toEqual([
      "pikachu",
      "pikachu-rock-star",
    ]);
    expect(payload.evolutions.map((variant: { slug: string }) => variant.slug)).toEqual([
      "pichu",
      "pikachu",
      "raichu",
    ]);
  });

  it("returns 404 when the upstream Pokémon resource is missing", async () => {
    const fetchMock = vi.fn(async () => jsonResponse({ error: "missing" }, { status: 404 }));
    vi.stubGlobal("fetch", fetchMock as typeof fetch);

    const response = await pokemonRoute(new Request("http://localhost/api/pokemon/missing"), {
      params: Promise.resolve({ identifier: "missing" }),
    });

    expect(response.status).toBe(404);
    const payload = await response.json();
    expect(payload).toMatchObject({ error: "Pokémon not found." });
  });
});
