export type PokemonStat = {
  key: string;
  label: string;
  value: number;
};

export type PokemonDetail = {
  slug: string;
  number: string;
  name: string;
  region: string;
  image: string;
  accent: string;
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
  slug: string;
  number: string;
  name: string;
  type: string;
  region: string;
  image: string;
  accent: string;
};
