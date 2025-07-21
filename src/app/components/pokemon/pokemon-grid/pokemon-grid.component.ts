import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatIconModule } from '@angular/material/icon';

import { PokemonCardComponent } from '../pokemon-card/pokemon-card.component';
import { PokemonListItem, Pokemon } from '../../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-grid',
  standalone: true,
  imports: [
    CommonModule,
    ScrollingModule,
    MatIconModule,
    PokemonCardComponent
  ],
  templateUrl: './pokemon-grid.component.html',
  styleUrls: ['./pokemon-grid.component.scss']
})
export class PokemonGridComponent implements OnInit, OnDestroy, OnChanges {
  @Input() pokemonList: PokemonListItem[] = [];
  @Input() selectedPokemon: Pokemon[] = [];
  @Input() loading: boolean = false;
  @Input() maxSelection: number = 3;
  
  @Output() pokemonSelected = new EventEmitter<PokemonListItem>();
  @Output() pokemonDeselected = new EventEmitter<PokemonListItem>();

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['pokemonList'] && this.pokemonList) {
      
    }
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  isPokemonSelected(pokemonId: number): boolean {
    return this.selectedPokemon.some(pokemon => pokemon.id === pokemonId);
  }

  isSelectionFull(): boolean {
    return this.selectedPokemon.length >= this.maxSelection;
  }

  onPokemonSelected(pokemon: PokemonListItem): void {

    this.pokemonSelected.emit(pokemon);
  }

  onPokemonDeselected(pokemon: PokemonListItem): void {

    this.pokemonDeselected.emit(pokemon);
  }

  trackByPokemonId = (index: number, pokemon: PokemonListItem): string => {
    const urlParts = pokemon.url.split('/');
    const id = urlParts[urlParts.length - 2];
    return `${id}-${pokemon.name}`;
  }

  getPokemonId(pokemon: PokemonListItem): number {
    const urlParts = pokemon.url.split('/');
    return parseInt(urlParts[urlParts.length - 2]);
  }

  getGridRows(): PokemonListItem[][] {
    const rows: PokemonListItem[][] = [];
    for (let i = 0; i < this.pokemonList.length; i += 3) {
      rows.push(this.pokemonList.slice(i, i + 3));
    }

    return rows;
  }

  trackByRow = (index: number, row: PokemonListItem[]): number => {
    return index;
  }
} 