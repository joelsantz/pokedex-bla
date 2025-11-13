import "@testing-library/jest-dom";
import { describe, expect, it } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import { PokemonCard } from "@/app/(features)/pokedex/components/PokemonCard";
import type { PokemonListItem } from "@/domain/pokemon/types";

const basePokemon: PokemonListItem = {
  id: 1,
  slug: "bulbasaur",
  number: "#001",
  name: "Bulbasaur",
  image: "https://example.com/bulbasaur.png",
  types: ["Grass", "Poison"],
};

describe("PokemonCard", () => {
  it("renders a Pokémon card with its main image and metadata", () => {
    render(<PokemonCard pokemon={basePokemon} />);

    expect(screen.getByText("Grass")).toBeInTheDocument();
    expect(screen.getByText("#001")).toBeInTheDocument();
    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();

    const image = screen.getByRole("img", { name: basePokemon.name });
    expect(image).toHaveAttribute("src", basePokemon.image as string);

    const link = screen.getByRole("link", { name: /Bulbasaur/i });
    expect(link).toHaveAttribute("href", "/pokemon/bulbasaur");
  });

  it("falls back to the Pokéball illustration when no sprite is available", () => {
    render(<PokemonCard pokemon={{ ...basePokemon, image: null }} />);
    const fallbackImage = screen.getByAltText("");
    expect(fallbackImage).toHaveAttribute("src", "/Pokeball.svg");
  });
});
