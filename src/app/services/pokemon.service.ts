import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { 
  Pokemon, 
  PokemonListResponse, 
  PokemonListItem,
  MAX_STATS 
} from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private readonly baseUrl = 'https://pokeapi.co/api/v2';
  
  // Cache para mantener el estado shiny de los Pokémon vistos
  private shinyCache: { [pokemonId: number]: boolean } = {};
  
  // Cache para Pokémon seleccionados como shiny
  private selectedShinyCache: { [pokemonId: number]: boolean } = {};
  
  // Cache para ataques aleatorios de cada Pokémon
  private movesCache: { [pokemonId: number]: string[] } = {};
  
  // Mapeo de ataques a tipos (ejemplos comunes)
  private moveTypeMapping: { [moveName: string]: string } = {
    // Normal
    'Tackle': 'normal',
    'Scratch': 'normal',
    'Pound': 'normal',
    'Quick Attack': 'normal',
    'Body Slam': 'normal',
    'Hyper Beam': 'normal',
    
    // Fire
    'Ember': 'fire',
    'Fire Punch': 'fire',
    'Flamethrower': 'fire',
    'Fire Blast': 'fire',
    'Flare Blitz': 'fire',
    'Inferno': 'fire',
    
    // Water
    'Water Gun': 'water',
    'Bubble': 'water',
    'Surf': 'water',
    'Hydro Pump': 'water',
    'Aqua Jet': 'water',
    'Liquidation': 'water',
    
    // Electric
    'Thunder Shock': 'electric',
    'Thunderbolt': 'electric',
    'Thunder': 'electric',
    'Thunder Wave': 'electric',
    'Volt Tackle': 'electric',
    'Zap Cannon': 'electric',
    
    // Grass
    'Vine Whip': 'grass',
    'Razor Leaf': 'grass',
    'Solar Beam': 'grass',
    'Leaf Blade': 'grass',
    'Giga Drain': 'grass',
    'Seed Bomb': 'grass',
    
    // Ice
    'Ice Beam': 'ice',
    'Blizzard': 'ice',
    'Ice Punch': 'ice',
    'Aurora Beam': 'ice',
    'Frost Breath': 'ice',
    'Freeze-Dry': 'ice',
    
    // Fighting
    'Karate Chop': 'fighting',
    'Low Kick': 'fighting',
    'Rock Smash': 'fighting',
    'Close Combat': 'fighting',
    'Focus Blast': 'fighting',
    'Dynamic Punch': 'fighting',
    
    // Poison
    'Poison Sting': 'poison',
    'Sludge': 'poison',
    'Sludge Bomb': 'poison',
    'Toxic': 'poison',
    'Venoshock': 'poison',
    'Gunk Shot': 'poison',
    
    // Ground
    'Earthquake': 'ground',
    'Dig': 'ground',
    'Mud Shot': 'ground',
    'Earth Power': 'ground',
    'Drill Run': 'ground',
    'High Horsepower': 'ground',
    
    // Flying
    'Wing Attack': 'flying',
    'Aerial Ace': 'flying',
    'Air Slash': 'flying',
    'Hurricane': 'flying',
    'Brave Bird': 'flying',
    'Sky Attack': 'flying',
    
    // Psychic
    'Confusion': 'psychic',
    'Psychic': 'psychic',
    'Psybeam': 'psychic',
    'Future Sight': 'psychic',
    'Zen Headbutt': 'psychic',
    'Psycho Cut': 'psychic',
    
    // Bug
    'Bug Bite': 'bug',
    'Signal Beam': 'bug',
    'X-Scissor': 'bug',
    'Megahorn': 'bug',
    'Bug Buzz': 'bug',
    'U-turn': 'bug',
    
    // Rock
    'Rock Throw': 'rock',
    'Rock Slide': 'rock',
    'Stone Edge': 'rock',
    'Power Gem': 'rock',
    'Ancient Power': 'rock',
    'Rock Blast': 'rock',
    
    // Ghost
    'Lick': 'ghost',
    'Shadow Ball': 'ghost',
    'Shadow Claw': 'ghost',
    'Hex': 'ghost',
    'Phantom Force': 'ghost',
    'Shadow Sneak': 'ghost',
    
    // Dragon
    'Dragon Rage': 'dragon',
    'Dragon Claw': 'dragon',
    'Dragon Pulse': 'dragon',
    'Outrage': 'dragon',
    'Draco Meteor': 'dragon',
    'Dragon Rush': 'dragon',
    
    // Dark
    'Bite': 'dark',
    'Crunch': 'dark',
    'Dark Pulse': 'dark',
    'Night Slash': 'dark',
    'Foul Play': 'dark',
    'Sucker Punch': 'dark',
    
    // Steel
    'Metal Claw': 'steel',
    'Iron Tail': 'steel',
    'Flash Cannon': 'steel',
    'Meteor Mash': 'steel',
    'Iron Head': 'steel',
    'Steel Wing': 'steel',
    
    // Fairy
    'Fairy Wind': 'fairy',
    'Dazzling Gleam': 'fairy',
    'Moonblast': 'fairy',
    'Play Rough': 'fairy',
    'Draining Kiss': 'fairy',
    'Spirit Break': 'fairy'
  };

  constructor(private http: HttpClient) {}

  /**
   * Get list of Pokemon from first generation (151 Pokemon)
   */
  getPokemonList(): Observable<PokemonListItem[]> {
    return this.http.get<PokemonListResponse>(`${this.baseUrl}/pokemon?limit=151`)
      .pipe(
        map(response => response.results)
      );
  }

  /**
   * Get detailed Pokemon information by ID or name
   */
  getPokemonById(idOrName: string | number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.baseUrl}/pokemon/${idOrName}`);
  }

  /**
   * Get multiple Pokemon by their IDs
   */
  getPokemonByIds(ids: number[]): Observable<Pokemon[]> {
    const requests = ids.map(id => this.getPokemonById(id));
    return new Observable(observer => {
      const results: Pokemon[] = [];
      let completed = 0;

      requests.forEach((request, index) => {
        request.subscribe({
          next: (pokemon) => {
            results[index] = pokemon;
            completed++;
            if (completed === requests.length) {
              observer.next(results);
              observer.complete();
            }
          },
          error: (error) => {
            observer.error(error);
          }
        });
      });
    });
  }

  /**
   * Search Pokemon by name or ID
   */
  searchPokemon(query: string): Observable<PokemonListItem[]> {
    return this.getPokemonList().pipe(
      map(pokemonList => {
        const searchTerm = query.toLowerCase();
        return pokemonList.filter(pokemon => 
          pokemon.name.toLowerCase().includes(searchTerm) ||
          pokemon.url.split('/').slice(-2)[0] === searchTerm // Check ID
        );
      })
    );
  }

  /**
   * Get Pokemon sprite URL from home sprites with random shiny chance (1/90)
   */
  getPokemonSprite(pokemon: Pokemon): string {
    const pokemonId = pokemon.id;
    
    // Si el Pokémon ya fue seleccionado como shiny, mantenerlo shiny
    if (this.selectedShinyCache[pokemonId]) {
  
      return this.getPokemonShinySprite(pokemon);
    }
    
    // Si ya se determinó si es shiny antes, usar el cache
    if (this.shinyCache.hasOwnProperty(pokemonId)) {
      const isShiny = this.shinyCache[pokemonId];

      return isShiny ? 
        this.getPokemonShinySprite(pokemon) : 
        this.getPokemonNormalSprite(pokemon);
    }
    
    // Determinar si es shiny (3/90 probabilidad) y guardar en cache
    const isShiny = Math.random() < (3 / 90);
    this.shinyCache[pokemonId] = isShiny;
    
    // Contar cuántos Pokémon están lockeados como shiny
    const lockedCount = Object.values(this.selectedShinyCache).filter(Boolean).length;
    
    
    
    if (isShiny) {
      return this.getPokemonShinySprite(pokemon);
    }
    
    return this.getPokemonNormalSprite(pokemon);
  }

  /**
   * Mark a Pokemon as selected shiny (lock the shiny state)
   */
  markPokemonAsSelectedShiny(pokemonId: number): void {
    this.selectedShinyCache[pokemonId] = true;

  }

  /**
   * Check if a Pokemon is selected as shiny
   */
  isPokemonSelectedAsShiny(pokemonId: number): boolean {
    return this.selectedShinyCache[pokemonId] || false;
  }

  /**
   * Check if a Pokemon is shiny in cache
   */
  isPokemonShinyInCache(pokemonId: number): boolean {
    return this.shinyCache[pokemonId] || false;
  }

  /**
   * Clear shiny cache (useful for testing or reset)
   */
  clearShinyCache(): void {
    this.shinyCache = {};
    this.selectedShinyCache = {};

  }

  /**
   * Clear all caches (shiny and moves)
   */
  clearAllCaches(): void {
    this.shinyCache = {};
    this.selectedShinyCache = {};
    this.movesCache = {};

  }

  /**
   * Get debug information about shiny cache
   */
  getShinyCacheDebugInfo(): { shinyCount: number; selectedShinyCount: number; totalCached: number } {
    const shinyCount = Object.values(this.shinyCache).filter(Boolean).length;
    const selectedShinyCount = Object.values(this.selectedShinyCache).filter(Boolean).length;
    const totalCached = Object.keys(this.shinyCache).length;
    
    return {
      shinyCount,
      selectedShinyCount,
      totalCached
    };
  }

  /**
   * Log current shiny statistics
   */
  logShinyStatistics(): void {
    const debugInfo = this.getShinyCacheDebugInfo();
    const shinyPercentage = debugInfo.totalCached > 0 ? 
      ((debugInfo.shinyCount / debugInfo.totalCached) * 100).toFixed(2) : '0';
    

    
    if (debugInfo.shinyCount > 0) {
      const shinyIds = Object.keys(this.shinyCache)
        .filter(id => this.shinyCache[parseInt(id)])
        .map(id => parseInt(id))
        .sort((a, b) => a - b);

    }
    
    if (debugInfo.selectedShinyCount > 0) {
      const lockedIds = Object.keys(this.selectedShinyCache)
        .filter(id => this.selectedShinyCache[parseInt(id)])
        .map(id => parseInt(id))
        .sort((a, b) => a - b);
    }
  }

  /**
   * Get Pokemon normal sprite URL (without random shiny chance)
   */
  getPokemonNormalSprite(pokemon: Pokemon): string {
    return pokemon.sprites.other.home.front_default || pokemon.sprites.front_default;
  }

  /**
   * Get Pokemon shiny sprite URL
   */
  getPokemonShinySprite(pokemon: Pokemon): string {
    return pokemon.sprites.other.home.front_shiny || 
           pokemon.sprites.front_shiny || 
           pokemon.sprites.other.home.front_default || 
           pokemon.sprites.front_default;
  }

  /**
   * Get Pokemon sprite with preference for shiny if available
   */
  getPokemonSpriteWithShinyPreference(pokemon: Pokemon): string {
    const pokemonId = pokemon.id;
    
    // Si el Pokémon fue seleccionado como shiny, usar sprite shiny
    if (this.selectedShinyCache[pokemonId]) {
      return this.getPokemonShinySprite(pokemon);
    }
    
    // Si está en cache como shiny, usar sprite shiny
    if (this.shinyCache[pokemonId]) {
      return this.getPokemonShinySprite(pokemon);
    }
    
    // Usar sprite normal
    return this.getPokemonNormalSprite(pokemon);
  }

  /**
   * Calculate stat percentage based on max values
   */
  getStatPercentage(statName: string, statValue: number): number {
    // Mapear nombres de estadísticas a las constantes MAX_STATS
    const statMapping: { [key: string]: keyof typeof MAX_STATS } = {
      'hp': 'HP',
      'attack': 'ATTACK',
      'defense': 'DEFENSE',
      'special-attack': 'SPECIAL_ATTACK',
      'special-defense': 'SPECIAL_DEFENSE',
      'speed': 'SPEED'
    };
    
    const maxStatKey = statMapping[statName];
    const maxStat = maxStatKey ? MAX_STATS[maxStatKey] : undefined;
    
    return maxStat ? (statValue / maxStat) * 100 : 0;
  }

  /**
   * Get Pokemon types as array of strings
   */
  getPokemonTypes(pokemon: Pokemon): string[] {
    return pokemon.types.map(type => type.type.name);
  }

  /**
   * Get 4 random moves for a Pokemon (cached)
   */
  getPokemonRandomMoves(pokemon: Pokemon): string[] {
    const pokemonId = pokemon.id;
    
    // Si ya están cacheados, devolver los cacheados
    if (this.movesCache[pokemonId]) {
      return this.movesCache[pokemonId];
    }
    
    // Obtener 4 ataques aleatorios
    const allMoves = pokemon.moves || [];
    const randomMoves: string[] = [];
    
    if (allMoves.length > 0) {
      // Mezclar el array de ataques
      const shuffledMoves = [...allMoves].sort(() => Math.random() - 0.5);
      
      // Tomar los primeros 4 ataques únicos
      for (const move of shuffledMoves) {
        if (randomMoves.length >= 4) break;
        
        const moveName = this.formatMoveName(move.move.name);
        if (!randomMoves.includes(moveName)) {
          randomMoves.push(moveName);
        }
      }
    }
    
    // Si no hay suficientes ataques, agregar ataques por defecto
    while (randomMoves.length < 4) {
      randomMoves.push('Tackle');
    }
    
    // Cachear los ataques
    this.movesCache[pokemonId] = randomMoves;
    

    
    // Log de información de tipos para cada ataque
    randomMoves.forEach(move => {
      this.logMoveTypeInfo(move);
    });
    
    return randomMoves;
  }

  /**
   * Format move name to be more readable
   */
  private formatMoveName(moveName: string): string {
    return moveName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Clear moves cache
   */
  clearMovesCache(): void {
    this.movesCache = {};

  }

  /**
   * Get the type of a move
   */
  getMoveType(moveName: string): string {
    return this.moveTypeMapping[moveName] || 'normal';
  }

  /**
   * Get the color for a move type
   */
  getMoveTypeColor(moveName: string): string {
    const moveType = this.getMoveType(moveName);
    const typeColors: { [key: string]: string } = {
      'normal': '#a8a878',
      'fire': '#f08030',
      'water': '#6890f0',
      'electric': '#f8d030',
      'grass': '#78c850',
      'ice': '#98d8d8',
      'fighting': '#c03028',
      'poison': '#a040a0',
      'ground': '#e0c068',
      'flying': '#a890f0',
      'psychic': '#f85888',
      'bug': '#a8b820',
      'rock': '#b8a038',
      'ghost': '#705898',
      'dragon': '#7038f8',
      'dark': '#705848',
      'steel': '#b8b8d0',
      'fairy': '#ee99ac'
    };
    
    return typeColors[moveType] || typeColors['normal'];
  }

  /**
   * Log move type information for debugging
   */
  logMoveTypeInfo(moveName: string): void {
    const moveType = this.getMoveType(moveName);
    const moveColor = this.getMoveTypeColor(moveName);

  }
} 