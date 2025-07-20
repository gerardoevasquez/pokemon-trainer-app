import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

import { PokemonCardComponent } from '../pokemon-card';
import { PokemonListItem, Pokemon } from '../../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-grid',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    PokemonCardComponent
  ],
  templateUrl: './pokemon-grid.component.html',
  styleUrls: ['./pokemon-grid.component.scss']
})
export class PokemonGridComponent {
  @Input() pokemonList: PokemonListItem[] = [];
  @Input() selectedPokemon: Pokemon[] = [];
  @Input() isLoading: boolean = false;
  @Input() maxSelection: number = 3;
  @Input() showSelectionControls: boolean = true;
  
  @Output() pokemonSelected = new EventEmitter<Pokemon>();
  @Output() pokemonRemoved = new EventEmitter<number>();

  get isSelectionFull(): boolean {
    return this.selectedPokemon.length >= this.maxSelection;
  }

  isPokemonSelected(pokemonItem: PokemonListItem): boolean {
    return this.selectedPokemon.some(pokemon => {
      const urlParts = pokemonItem.url.split('/');
      const pokemonId = parseInt(urlParts[urlParts.length - 2]);
      return pokemon.id === pokemonId;
    });
  }

  onPokemonSelect(pokemonItem: PokemonListItem): void {
    if (this.isSelectionFull) {
      return;
    }
    
    // Emitir el evento para que el componente padre maneje la lógica
    // El componente padre deberá cargar los detalles del Pokémon
    this.pokemonSelected.emit(pokemonItem as any);
  }

  onPokemonRemove(pokemonItem: PokemonListItem): void {
    const urlParts = pokemonItem.url.split('/');
    const pokemonId = parseInt(urlParts[urlParts.length - 2]);
    this.pokemonRemoved.emit(pokemonId);
  }

  onPokemonClick(pokemonItem: PokemonListItem): void {
    // Opcional: Mostrar detalles del Pokémon en un modal
    console.log('Pokemon clicked:', pokemonItem);
  }

  getPokemonId(pokemonItem: PokemonListItem): number {
    const urlParts = pokemonItem.url.split('/');
    return parseInt(urlParts[urlParts.length - 2]);
  }

  trackByPokemonId(index: number, pokemonItem: PokemonListItem): number {
    return this.getPokemonId(pokemonItem);
  }
} 