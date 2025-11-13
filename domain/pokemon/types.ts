export type PokemonStat = {
  key: string;
  label: string;
  value: number;
};

export type PokemonDetail = {
  id: number;
  slug: string;
  number: string;
  name: string;
  image: string | null;
  heroGradient: string;
  themeColor: string;
  types: string[];
  weight: string;
  height: string;
  moves: string[];
  description: string;
  stats: PokemonStat[];
};

export type PokemonListItem = {
  id: number;
  slug: string;
  number: string;
  name: string;
  image: string | null;
  types: string[];
};

export type PokemonListResponse = {
  page: number;
  limit: number;
  total: number;
  results: PokemonListItem[];
};
