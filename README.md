# Pokedex Test
Live Demo
https://pokedex-bla-8tlv.vercel.app/

<img width="1905" height="925" alt="image" src="https://github.com/user-attachments/assets/c4a55921-08c4-4356-aa0f-319850f67dcd" />

## Architecture Overview

- **Tech stack**: Next.js 16 App Router, React 19, Tailwind CSS 4, and TypeScript. The root layout (`app/layout.tsx`) wires the Poppins font plus shared styles from `app/globals.css`.
- **Folder layout**: Feature code sits under `app/(features)` (auth, pokedex, pokemon). API routes reside in `app/api`, and reusable domain models/utilities live in `domain/pokemon`.
- **Routing & auth**: `app/page.tsx` redirects to `/pokedex`, while `middleware.ts` guards `/`, `/pokedex`, and `/pokemon/**`, redirecting anonymous users to `/login` and preserving a safe `redirectTo` query param.
- **State sharing**: Domain typings (`domain/pokemon/types.ts`) and theming helpers (`domain/pokemon/colors.ts`) are imported by both API handlers and UI components to keep payloads/colors consistent.

## Frontend

- **Login (`app/(features)/(auth)/login/page.tsx`)**: Client component that validates credentials locally, calls `/api/auth/login`, displays field-level errors, and routes to either `/pokedex` or a provided `redirectTo`.
- **Pokédex list (`app/(features)/pokedex/page.tsx`)**: Manages pagination, filters, and search state. Fetches `/api/pokedex` for paged data and, when searching, calls `/api/pokedex?search=...` with AbortController cancellation and error handling.
- **Detail page (`app/pokemon/[slug]/page.tsx`)**: Server component that fetches from `/api/pokemon/[slug]`, sets metadata dynamically, and renders sections for hero artwork, badges, metrics, moves, and stats using feature components.
- **Shared widgets**: `PokedexHeader` hosts search, filter, and logout actions; `PokemonGrid` and `PokemonCard` render list items with sprite fallbacks; detail components (`PokemonFormViewer`, `PokemonStatList`, `PokemonTypeBadge`) visualize variants, stats, and types using domain helpers.

## Backend / API

- **`GET /api/pokedex`**: Proxies PokeAPI list data, supports pagination (`page`, `limit`), normalizes sprites/types, and caches results. When `search` is present, `handleGlobalSearch` scans up to 2,000 entries, filters by `name` or `number`, caps results (60), and returns `PokemonListResponse`.
- **`GET /api/pokemon/[identifier]`**: Fetches a single Pokémon, converts units, cleans flavor text, limits moves, maps stats, and augments with form/evolution variants while deriving theme colors/gradients.
- **`POST /api/auth/login`**: Validates JSON credentials against the demo `admin/admin` pair, returning field errors or issuing the `pokedex-session` HTTP-only cookie.
- **`POST /api/auth/logout`**: Clears the same session cookie and confirms logout.

## Components

- `app/(features)/pokedex/components/PokedexHeader.tsx`: Branding bar with search, filter dropdown, external links, and logout flow.
- `app/(features)/pokedex/components/PokemonCard.tsx`: Displays a Pokémon entry with accessible link and sprite fallback.
- `app/(features)/pokedex/components/PokemonGid.tsx`: Renders responsive grid or an empty state message.
- `app/(features)/pokemon/components/PokemonFormViewer.tsx`: Cycles through evolutions/forms and routes to another slug.
- `app/(features)/pokemon/components/PokemonStatList.tsx`: Shows normalized stat bars themed by the server-provided color.
- `app/(features)/pokemon/components/PokemonTypeBadge.tsx`: Styles each type pill using `getTypeColor`.

## Testing

- **Route tests (Vitest)**: `npm run test:routes` executes Vitest with Node environment (`vitest.config.ts`), resetting globals via `vitest.setup.ts`. Specs in `tests/routes` stub `fetch` to verify pagination, search, detail enrichment, and auth flows.
- **Component tests (Jest)**: `npm run test:components` runs Jest + Testing Library using `jest.setup.tsx` to mock `next/link` and `next/image`. Specs cover rendering states, event handling, logout flows, and visual props.

## Middleware

`middleware.ts` skips `_next/**` and `/api/**`, checks the `pokedex-session` cookie, redirects signed-in users away from `/login`, and sends anonymous users to `/login?redirectTo=...` for protected paths.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Example Prompts I used

- "Refactor `app/(features)/pokedex/components/PokemonCard.tsx` to ensure render stability under rapid pagination: profile expensive props, memoize derived sprites, and replace inline handlers with callbacks so React 19 stays concurrent-safe."
- "Author a Vitest suite under `tests/routes/pokedex-route.test.ts` that exercises edge cases: mock the PokeAPI, assert pagination links, confirm search throttling, and validate error normalization for both success and failure responses."
- "Enforce Tailwind-based visual consistency across every screen: audit `app/globals.css`, codify tokens for spacing, typography, and gradients, then adjust `PokedexHeader`, `PokemonGrid`, and login screens so shared utility classes produce identical vertical rhythm."
