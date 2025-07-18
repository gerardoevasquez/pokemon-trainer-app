

export const ASSETS_CONFIG = {
 
  logos: {
    pokemon: {
      primary: 'assets/images/logos/pokemon-logo-optimized.svg',
      png: 'assets/images/logos/pokemon-logo.png',     // PNG como fallback
      highDensity: 'assets/images/logos/pokemon-logo@2x.png',
      fallback: 'assets/images/logos/pokemon-logo-fallback.png'
    }
  },

  icons: {
    search: 'assets/images/icons/icon-search.svg',
    user: 'assets/images/icons/icon-user.svg',
    settings: 'assets/images/icons/icon-settings.svg',
    logout: 'assets/images/icons/icon-logout.svg'
  },

  backgrounds: {
    pokemonPattern: 'assets/images/backgrounds/bg-pokemon-pattern.png',
    gradient: 'assets/images/backgrounds/bg-gradient.jpg'
  },

  pokemon: {
    // Base URL for Pokémon sprites from PokeAPI
    sprites: {
      official: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/',
      dreamWorld: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/',
      home: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/',
      showdown: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/'
    },
    // Local fallback images
    local: {
      placeholder: 'assets/images/pokemon/pokemon-placeholder.png',
      error: 'assets/images/pokemon/pokemon-error.png'
    }
  },

  // Font paths
  fonts: {
    primary: 'assets/fonts/PokemonFont.woff2',
    secondary: 'assets/fonts/PokemonFont.woff'
  },

  // Data files
  data: {
    pokemonTypes: 'assets/data/pokemon-types.json',
    regions: 'assets/data/regions.json'
  }
} as const;

/**
 * Helper function to get Pokémon sprite URL
 * @param id - Pokémon ID
 * @param type - Sprite type (official, dreamWorld, home, showdown)
 * @returns Complete URL for the sprite
 */
export function getPokemonSpriteUrl(id: number, type: keyof typeof ASSETS_CONFIG.pokemon.sprites = 'official'): string {
  return `${ASSETS_CONFIG.pokemon.sprites[type]}${id}.png`;
}

/**
 * Helper function to get logo path with fallback
 * @param logoType - Type of logo to get
 * @param format - Preferred format (svg, png)
 * @returns Logo path
 */
export function getLogoPath(logoType: keyof typeof ASSETS_CONFIG.logos = 'pokemon', format: 'svg' | 'png' = 'svg'): string {
  const logo = ASSETS_CONFIG.logos[logoType];
  return format === 'svg' ? logo.primary : logo.png;
}

/**
 * Helper function to get icon path
 * @param iconName - Name of the icon
 * @returns Icon path
 */
export function getIconPath(iconName: keyof typeof ASSETS_CONFIG.icons): string {
  return ASSETS_CONFIG.icons[iconName];
} 