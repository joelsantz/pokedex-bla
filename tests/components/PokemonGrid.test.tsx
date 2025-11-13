import "@testing-library/jest-dom";
import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import { PokemonGrid } from "@/app/(features)/pokedex/components/PokemonGid";
import type { PokemonListItem } from "@/domain/pokemon/types";

const samplePokemon: PokemonListItem[] = [
  {
    id: 1,
    slug: "bulbasaur",
    number: "#001",
    name: "Bulbasaur",
    image: "https://example.com/bulbasaur.png",
    types: ["Grass"],
  },
  {
    id: 4,
    slug: "charmander",
    number: "#004",
    name: "Charmander",
    image: "https://example.com/charmander.png",
    types: ["Fire"],
  },
];

describe("PokemonGrid", () => {
  it("renders an empty state when no Pokémon are provided", () => {
    render(<PokemonGrid pokemon={[]} />);
    expect(screen.getByText("No Pokémon found.")).toBeInTheDocument();
  });

  it("renders a card for each Pokémon entry", () => {
    render(<PokemonGrid pokemon={samplePokemon} />);
    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();
    expect(screen.getByText("Charmander")).toBeInTheDocument();

    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(samplePokemon.length);
  });
});
