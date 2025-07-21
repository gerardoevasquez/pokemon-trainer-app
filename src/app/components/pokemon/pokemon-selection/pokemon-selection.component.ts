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
  @Output() teamSelected = new EventEmitter<Pokemon[]>();

  pokemonList: PokemonListItem[] = [];
  filteredPokemon: PokemonListItem[] = [];
  selectedPokemon: Pokemon[] = [];
  isLoading = false;
  searchTerm = '';

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.loadPokemon();
  }

  loadPokemon(): void {
    this.isLoading = true;
    console.log(' Iniciando carga de Pokémon...');
    
    this.pokemonService.getPokemonList().subscribe({
      next: (pokemonList) => {
        console.log('✅ Pokémon cargados:', pokemonList.length);
        console.log('🔍 Primeros 9 Pokémon (orden exacto):');
        pokemonList.slice(0, 9).forEach((pokemon, index) => {
          const id = pokemon.url.split('/').slice(-2)[0];
          console.log(`  ${index + 1}. #${id.padStart(3, '0')} ${pokemon.name}`);
        });
        console.log('🎮 Virtual scroll activado:', pokemonList.length > 9 ? 'SÍ' : 'NO');
        this.pokemonList = pokemonList;
        this.filteredPokemon = [...this.pokemonList];
        this.isLoading = false;
        console.log(' filteredPokemon:', this.filteredPokemon.length);
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
      console.log('🎮 PokemonSelection - filterPokemon: Mostrando todos los Pokémon:', this.filteredPokemon.length);
      console.log('🎮 PokemonSelection - Primeros 12 Pokémon en filteredPokemon:');
      this.filteredPokemon.slice(0, 12).forEach((pokemon, index) => {
        const id = pokemon.url.split('/').slice(-2)[0];
        console.log(`  ${index + 1}. #${id.padStart(3, '0')} ${pokemon.name}`);
      });
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredPokemon = this.pokemonList.filter(pokemon => 
      pokemon.name.toLowerCase().includes(term) ||
      this.extractPokemonId(pokemon.url).toString().includes(term)
    );
    console.log('🎮 PokemonSelection - filterPokemon: Búsqueda "' + this.searchTerm + '" - Resultados:', this.filteredPokemon.length);
  }

  onPokemonSelected(pokemonItem: PokemonListItem): void {
    // Extraer el ID de la URL
    const pokemonId = this.extractPokemonId(pokemonItem.url);
    const isSelected = this.selectedPokemon.some(p => p.id === pokemonId);
    
    console.log('🎯 PokemonSelection - onPokemonSelected:', pokemonItem.name, 'ID:', pokemonId, 'isSelected:', isSelected, 'selectedCount:', this.selectedPokemon.length);
    
    if (isSelected) {
      // Remover si ya está seleccionado
      this.selectedPokemon = this.selectedPokemon.filter(p => p.id !== pokemonId);
    } else {
      // Agregar si no está seleccionado y no hay más de 3
      if (this.selectedPokemon.length < 3) {
        // Cargar los datos completos del Pokémon
        this.pokemonService.getPokemonById(pokemonId).subscribe({
          next: (pokemon) => {
            this.selectedPokemon.push(pokemon);
            console.log('✅ PokemonSelection - Pokémon agregado:', pokemon.name, 'total seleccionados:', this.selectedPokemon.length);
          },
          error: (error) => {
            console.error('Error loading Pokémon details:', error);
          }
        });
      } else {
        console.log('❌ PokemonSelection - No se puede agregar más Pokémon, límite alcanzado');
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

  get selectedCount(): number {
    return this.selectedPokemon.length;
  }
} 