import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { PokemonGridComponent } from '../pokemon-grid/pokemon-grid.component';
import { SearchBarComponent } from '../../forms/search-bar';
import { PrimaryButtonComponent } from '../../forms/primary-button';
import { ProfileData } from '../../profile/profile-image-uploader';
import { Pokemon, PokemonListItem } from '../../../models/pokemon.model';
import { PokemonService } from '../../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-selection',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    PokemonGridComponent,
    SearchBarComponent,
    PrimaryButtonComponent
  ],
  templateUrl: './pokemon-selection.component.html',
  styleUrls: ['./pokemon-selection.component.scss']
})
export class PokemonSelectionComponent implements OnInit {
  @Input() profileData?: ProfileData;
  @Input() selectedTeam: Pokemon[] = [];
  @Output() teamSelected = new EventEmitter<Pokemon[]>();

  pokemonList: PokemonListItem[] = [];
  filteredPokemon: PokemonListItem[] = [];
  selectedPokemon: Pokemon[] = [];
  isLoading = false;
  searchTerm = '';

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemon();
    this.initializeSelectedPokemon();
  }

  private initializeSelectedPokemon(): void {
    if (this.selectedTeam && this.selectedTeam.length > 0) {
      // Copiar los Pokémon ya seleccionados
      this.selectedPokemon = [...this.selectedTeam];
      
      // Marcar los Pokémon shiny como seleccionados en el cache
      this.selectedTeam.forEach(pokemon => {
        if (this.pokemonService.isPokemonShinyInCache(pokemon.id)) {
          this.pokemonService.markPokemonAsSelectedShiny(pokemon.id);
        }
      });
      
  
    }
  }

  loadPokemon(): void {
    this.isLoading = true;

    
    this.pokemonService.getPokemonList().subscribe({
      next: (pokemonList) => {
        
        this.pokemonList = pokemonList;
        this.filteredPokemon = [...this.pokemonList];
        this.isLoading = false;
    
      },
      error: (error) => {
        console.error('❌ Error loading Pokémon:', error);
        this.isLoading = false;
      }
    });
  }

  onSearchChange(term: string): void {
    this.searchTerm = term;
    this.filterPokemon();
  }

  filterPokemon(): void {
    if (!this.searchTerm.trim()) {
      this.filteredPokemon = [...this.pokemonList];
      
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredPokemon = this.pokemonList.filter(pokemon => 
      pokemon.name.toLowerCase().includes(term) ||
      this.extractPokemonId(pokemon.url).toString().includes(term)
    );

  }

  onPokemonSelected(pokemonItem: PokemonListItem): void {
    // Extraer el ID de la URL
    const pokemonId = this.extractPokemonId(pokemonItem.url);
    const isSelected = this.selectedPokemon.some(p => p.id === pokemonId);
    

    
    if (isSelected) {
      // Remover si ya está seleccionado
      this.selectedPokemon = this.selectedPokemon.filter(p => p.id !== pokemonId);
    } else {
      // Agregar si no está seleccionado y no hay más de 3
      if (this.selectedPokemon.length < 3) {
        // Cargar los datos completos del Pokémon
        this.pokemonService.getPokemonById(pokemonId).subscribe({
          next: (pokemon) => {
            // Verificar si el Pokémon es shiny
            const isShiny = this.pokemonService.isPokemonShinyInCache(pokemonId);
            
            // Si es shiny, marcarlo como seleccionado shiny (lock)
            if (isShiny) {
              this.pokemonService.markPokemonAsSelectedShiny(pokemonId);
            }
            
            this.selectedPokemon.push(pokemon);
        
          },
          error: (error) => {
            console.error('Error loading Pokémon details:', error);
          }
        });
      } else {
    
      }
    }
  }

  onPokemonRemoved(pokemonId: number): void {
    this.selectedPokemon = this.selectedPokemon.filter(p => p.id !== pokemonId);
  }

  onPokemonDeselected(pokemonItem: PokemonListItem): void {
    const pokemonId = this.extractPokemonId(pokemonItem.url);
    this.selectedPokemon = this.selectedPokemon.filter(p => p.id !== pokemonId);
  }

  isPokemonSelected(pokemonItem: PokemonListItem): boolean {
    const pokemonId = this.extractPokemonId(pokemonItem.url);
    return this.selectedPokemon.some(p => p.id === pokemonId);
  }

  private extractPokemonId(url: string): number {
    const urlParts = url.split('/');
    return parseInt(urlParts[urlParts.length - 2], 10);
  }

  onSaveTeam(): void {
    if (this.selectedPokemon.length === 3) {
      this.teamSelected.emit(this.selectedPokemon);
    }
  }

  get canSave(): boolean {
    return this.selectedPokemon.length === 3;
  }

  get isEditing(): boolean {
    return this.selectedTeam && this.selectedTeam.length > 0;
  }

  get saveButtonText(): string {
    return this.isEditing ? 'Guardar Cambios' : 'Guardar Equipo';
  }

  get selectedCount(): number {
    return this.selectedPokemon.length;
  }

  /**
   * Clear shiny cache (useful for testing or when starting over)
   */
  clearShinyCache(): void {
    this.pokemonService.clearAllCaches();

  }

  /**
   * Show shiny statistics (for debugging)
   */
  showShinyStatistics(): void {
    this.pokemonService.logShinyStatistics();
  }
} 