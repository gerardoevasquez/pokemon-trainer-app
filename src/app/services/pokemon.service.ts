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
   * Get Pokemon sprite URL from home sprites
   */
  getPokemonSprite(pokemon: Pokemon): string {
    return pokemon.sprites.other.home.front_default || pokemon.sprites.front_default;
  }

  /**
   * Calculate stat percentage based on max values
   */
  getStatPercentage(statName: string, statValue: number): number {
    const maxStat = MAX_STATS[statName.toUpperCase() as keyof typeof MAX_STATS];
    return maxStat ? (statValue / maxStat) * 100 : 0;
  }

  /**
   * Get Pokemon types as array of strings
   */
  getPokemonTypes(pokemon: Pokemon): string[] {
    return pokemon.types.map(type => type.type.name);
  }
} 