import "@testing-library/jest-dom";
import { beforeEach, describe, expect, it, jest } from "@jest/globals";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ComponentProps } from "react";

import {
  PokedexHeader,
  type SearchFilter,
} from "@/app/(features)/pokedex/components/PokedexHeader";

const mockReplace = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}));

const fetchMock = jest.fn<typeof fetch>();

function createProps(overrides: Partial<ComponentProps<typeof PokedexHeader>> = {}) {
  return {
    query: "",
    onQueryChange: jest.fn(),
    total: 2,
    filterBy: "name" as SearchFilter,
    onFilterChange: jest.fn(),
    ...overrides,
  };
}

beforeEach(() => {
  mockReplace.mockReset();
  fetchMock.mockReset();
  global.fetch = fetchMock as unknown as typeof fetch;
});

describe("PokedexHeader", () => {
  it("calls onQueryChange when the search input or clear button are used", () => {
    const props = createProps();
    const { rerender } = render(<PokedexHeader {...props} />);

    const input = screen.getByPlaceholderText("Search");
    fireEvent.change(input, { target: { value: "Pika" } });
    expect(props.onQueryChange).toHaveBeenCalledWith("Pika");

    rerender(<PokedexHeader {...props} query="Pika" />);
    const clearButton = screen.getByRole("button", { name: "Clear search" });
    fireEvent.click(clearButton);
    expect(props.onQueryChange).toHaveBeenCalledWith("");
  });

  it("toggles the filter panel and applies the selected filter", async () => {
    const props = createProps({ filterBy: "name" });
    render(<PokedexHeader {...props} />);

    const filterToggle = screen.getByRole("button", { name: /Filter by Name/i });
    await userEvent.click(filterToggle);
    expect(screen.getByText("Filter by:")).toBeInTheDocument();

    const numberOption = screen.getByRole("button", { name: /Number/ });
    await userEvent.click(numberOption);
    expect(props.onFilterChange).toHaveBeenCalledWith("number");
    expect(screen.queryByText("Filter by:")).not.toBeInTheDocument();
  });

  it("signs out successfully and redirects to the login page", async () => {
    fetchMock.mockResolvedValue({ ok: true } as Response);
    const props = createProps();
    render(<PokedexHeader {...props} />);

    const button = screen.getByRole("button", { name: "Sign Out" });
    await userEvent.click(button);

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/logout", { method: "POST" });
    await waitFor(() => expect(mockReplace).toHaveBeenCalledWith("/login"));
    expect(screen.getByRole("button", { name: "Sign Out" })).toBeEnabled();
  });

  it("surfaces an error when the logout request fails", async () => {
    fetchMock.mockResolvedValue({ ok: false } as Response);
    const props = createProps();
    render(<PokedexHeader {...props} />);

    const button = screen.getByRole("button", { name: "Sign Out" });
    await userEvent.click(button);

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent("Unable to sign out. Please try again."),
    );
    expect(button).toBeEnabled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
