import "@testing-library/jest-dom";
import { describe, expect, it, jest } from "@jest/globals";
import { render, screen } from "@testing-library/react";

import { PokemonTypeBadge } from "@/app/(features)/pokemon/components/PokemonTypeBadge";
import { getTypeColor } from "@/domain/pokemon/colors";

jest.mock("@/domain/pokemon/colors", () => ({
  getTypeColor: jest.fn().mockReturnValue("#123456"),
}));

describe("PokemonTypeBadge", () => {
  it("displays the provided type label with the themed color", () => {
    render(<PokemonTypeBadge type="Electric" />);

    const badge = screen.getByText("Electric");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveStyle({ backgroundColor: "#123456" });
    const mockedGetTypeColor = getTypeColor as jest.MockedFunction<typeof getTypeColor>;
    expect(mockedGetTypeColor).toHaveBeenCalledWith("Electric");
  });
});
