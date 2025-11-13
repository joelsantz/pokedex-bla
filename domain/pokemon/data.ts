import { PokemonDetail, PokemonListItem } from "./types";

export const pokemonDetails: PokemonDetail[] = [
  {
    slug: "bulbasaur",
    number: "#001",
    name: "Bulbasaur",
    region: "Kanto",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png",
    accent: "from-emerald-50 to-emerald-200",
    heroGradient: "from-emerald-400 to-lime-500",
    themeColor: "#63BC5A",
    types: ["Grass", "Poison"],
    weight: "6.9 kg",
    height: "0.7 m",
    moves: ["Overgrow", "Chlorophyll"],
    description:
      "There is a plant seed on its back right from the day this Pokémon is born. The seed slowly grows larger.",
    stats: [
      { key: "hp", label: "HP", value: 45 },
      { key: "atk", label: "ATK", value: 49 },
      { key: "def", label: "DEF", value: 49 },
      { key: "satk", label: "SATK", value: 65 },
      { key: "sdef", label: "SDEF", value: 65 },
      { key: "spd", label: "SPD", value: 45 },
    ],
  },
  {
    slug: "charmander",
    number: "#004",
    name: "Charmander",
    region: "Kanto",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png",
    accent: "from-orange-50 to-orange-200",
    heroGradient: "from-orange-400 to-red-500",
    themeColor: "#FF9C54",
    types: ["Fire"],
    weight: "8.5 kg",
    height: "0.6 m",
    moves: ["Blaze", "Solar Power"],
    description:
      "Obviously prefers hot places. When it rains, steam is said to spout from the tip of its tail.",
    stats: [
      { key: "hp", label: "HP", value: 39 },
      { key: "atk", label: "ATK", value: 52 },
      { key: "def", label: "DEF", value: 43 },
      { key: "satk", label: "SATK", value: 60 },
      { key: "sdef", label: "SDEF", value: 50 },
      { key: "spd", label: "SPD", value: 65 },
    ],
  },
  {
    slug: "squirtle",
    number: "#007",
    name: "Squirtle",
    region: "Kanto",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/7.png",
    accent: "from-sky-50 to-sky-200",
    heroGradient: "from-sky-400 to-cyan-500",
    themeColor: "#4EC1F7",
    types: ["Water"],
    weight: "9.0 kg",
    height: "0.5 m",
    moves: ["Torrent", "Rain Dish"],
    description:
      "Shoots water at prey while in the water. Withdraws into its shell when in danger.",
    stats: [
      { key: "hp", label: "HP", value: 44 },
      { key: "atk", label: "ATK", value: 48 },
      { key: "def", label: "DEF", value: 65 },
      { key: "satk", label: "SATK", value: 50 },
      { key: "sdef", label: "SDEF", value: 64 },
      { key: "spd", label: "SPD", value: 43 },
    ],
  },
  {
    slug: "butterfree",
    number: "#012",
    name: "Butterfree",
    region: "Kanto",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/12.png",
    accent: "from-violet-50 to-violet-200",
    heroGradient: "from-violet-400 to-purple-500",
    themeColor: "#A7AAFF",
    types: ["Bug", "Flying"],
    weight: "32.0 kg",
    height: "1.1 m",
    moves: ["Compound Eyes", "Tinted Lens"],
    description:
      "This Pokémon loves the honey of flowers and can locate flower patches that have even tiny amounts of pollen.",
    stats: [
      { key: "hp", label: "HP", value: 60 },
      { key: "atk", label: "ATK", value: 45 },
      { key: "def", label: "DEF", value: 50 },
      { key: "satk", label: "SATK", value: 90 },
      { key: "sdef", label: "SDEF", value: 80 },
      { key: "spd", label: "SPD", value: 70 },
    ],
  },
  {
    slug: "pikachu",
    number: "#025",
    name: "Pikachu",
    region: "Kanto",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png",
    accent: "from-yellow-50 to-orange-100",
    heroGradient: "from-yellow-300 via-amber-300 to-orange-400",
    themeColor: "#F7D02C",
    types: ["Electric"],
    weight: "6.0 kg",
    height: "0.4 m",
    moves: ["Static", "Lightning Rod"],
    description:
      "When it is angered, it immediately discharges the energy stored in the pouches in its cheeks.",
    stats: [
      { key: "hp", label: "HP", value: 35 },
      { key: "atk", label: "ATK", value: 55 },
      { key: "def", label: "DEF", value: 40 },
      { key: "satk", label: "SATK", value: 50 },
      { key: "sdef", label: "SDEF", value: 50 },
      { key: "spd", label: "SPD", value: 90 },
    ],
  },
  {
    slug: "jigglypuff",
    number: "#039",
    name: "Jigglypuff",
    region: "Kanto",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/39.png",
    accent: "from-pink-50 to-rose-100",
    heroGradient: "from-pink-300 to-rose-400",
    themeColor: "#F4B5D6",
    types: ["Normal", "Fairy"],
    weight: "5.5 kg",
    height: "0.5 m",
    moves: ["Cute Charm", "Competitive"],
    description:
      "Jigglypuff's vocal cords can freely adjust the wavelength of its voice. It can sing at any pitch.",
    stats: [
      { key: "hp", label: "HP", value: 115 },
      { key: "atk", label: "ATK", value: 45 },
      { key: "def", label: "DEF", value: 20 },
      { key: "satk", label: "SATK", value: 45 },
      { key: "sdef", label: "SDEF", value: 25 },
      { key: "spd", label: "SPD", value: 20 },
    ],
  },
  {
    slug: "abra",
    number: "#063",
    name: "Abra",
    region: "Kanto",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/63.png",
    accent: "from-amber-50 to-yellow-100",
    heroGradient: "from-amber-300 to-yellow-400",
    themeColor: "#F0CA52",
    types: ["Psychic"],
    weight: "19.5 kg",
    height: "0.9 m",
    moves: ["Synchronize", "Inner Focus"],
    description:
      "Even while asleep, it maintains a telepathic radar. It teleports when it senses danger.",
    stats: [
      { key: "hp", label: "HP", value: 25 },
      { key: "atk", label: "ATK", value: 20 },
      { key: "def", label: "DEF", value: 15 },
      { key: "satk", label: "SATK", value: 105 },
      { key: "sdef", label: "SDEF", value: 55 },
      { key: "spd", label: "SPD", value: 90 },
    ],
  },
  {
    slug: "gastly",
    number: "#092",
    name: "Gastly",
    region: "Kanto",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/92.png",
    accent: "from-slate-100 to-purple-200",
    heroGradient: "from-slate-700 to-purple-800",
    themeColor: "#7C538C",
    types: ["Ghost", "Poison"],
    weight: "0.1 kg",
    height: "1.3 m",
    moves: ["Levitate"],
    description:
      "Born from gases, anyone would faint if engulfed by its gaseous body, which contains poison.",
    stats: [
      { key: "hp", label: "HP", value: 30 },
      { key: "atk", label: "ATK", value: 35 },
      { key: "def", label: "DEF", value: 30 },
      { key: "satk", label: "SATK", value: 100 },
      { key: "sdef", label: "SDEF", value: 35 },
      { key: "spd", label: "SPD", value: 80 },
    ],
  },
  {
    slug: "eevee",
    number: "#133",
    name: "Eevee",
    region: "Kanto",
    image:
      "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/133.png",
    accent: "from-amber-50 to-amber-200",
    heroGradient: "from-amber-200 to-orange-300",
    themeColor: "#D3B58B",
    types: ["Normal"],
    weight: "6.5 kg",
    height: "0.3 m",
    moves: ["Run Away", "Adaptability"],
    description:
      "Its genetic code is irregular. It may mutate if it is exposed to radiation from element stones.",
    stats: [
      { key: "hp", label: "HP", value: 55 },
      { key: "atk", label: "ATK", value: 55 },
      { key: "def", label: "DEF", value: 50 },
      { key: "satk", label: "SATK", value: 45 },
      { key: "sdef", label: "SDEF", value: 65 },
      { key: "spd", label: "SPD", value: 55 },
    ],
  },
];

export const pokemonListItems: PokemonListItem[] = pokemonDetails.map(
  ({ slug, number, name, region, image, accent, types }) => ({
    slug,
    number,
    name,
    region,
    image,
    accent,
    type: types[0],
  }),
);

export function getPokemonDetailBySlug(slug: string) {
  return pokemonDetails.find(pokemon => pokemon.slug === slug);
}

export function getPokemonDetailByNumber(number: string) {
  return pokemonDetails.find(pokemon => pokemon.number.replace("#", "") === number.replace("#", ""));
}
