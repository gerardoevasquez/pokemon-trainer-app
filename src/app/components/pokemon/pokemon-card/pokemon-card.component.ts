import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { Pokemon, PokemonListItem } from '../../../models/pokemon.model';
import { PokemonService } from '../../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './pokemon-card.component.html',
  styleUrls: ['./pokemon-card.component.scss']
})
export class PokemonCardComponent {
  @Input() pokemonItem!: PokemonListItem;
  @Input() isSelected: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() isDisabled: boolean = false;
  
  @Output() pokemonClick = new EventEmitter<PokemonListItem>();
  @Output() pokemonSelect = new EventEmitter<PokemonListItem>();
  @Output() pokemonRemove = new EventEmitter<PokemonListItem>();

  pokemon: Pokemon | null = null;
  imageUrl: string = '';
  pokemonId: number = 0;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.extractPokemonId();
    this.loadPokemonDetails();
  }

  private extractPokemonId(): void {
    // Extraer ID de la URL: https://pokeapi.co/api/v2/pokemon/1/
    const urlParts = this.pokemonItem.url.split('/');
    this.pokemonId = parseInt(urlParts[urlParts.length - 2]);
  }

  private loadPokemonDetails(): void {
    this.pokemonService.getPokemonById(this.pokemonId).subscribe({
      next: (pokemon) => {
        this.pokemon = pokemon;
        this.imageUrl = this.pokemonService.getPokemonSprite(pokemon);
      },
      error: (error) => {
        console.error('Error loading Pokemon details:', error);
        this.imageUrl = 'assets/images/pokemon/pokemon-placeholder.png';
      }
    });
  }

  onCardClick(): void {
    if (!this.isDisabled) {
      this.pokemonClick.emit(this.pokemonItem);
    }
  }

  onSelectClick(event: Event): void {
    event.stopPropagation();
    if (!this.isDisabled) {
      this.pokemonSelect.emit(this.pokemonItem);
    }
  }

  onRemoveClick(event: Event): void {
    event.stopPropagation();
    this.pokemonRemove.emit(this.pokemonItem);
  }

  getPokemonTypes(): string[] {
    return this.pokemon ? this.pokemonService.getPokemonTypes(this.pokemon) : [];
  }

  getTypeColor(type: string): string {
    const typeColors: { [key: string]: string } = {
      'normal': '#A8A878',
      'fire': '#F08030',
      'water': '#6890F0',
      'electric': '#F8D030',
      'grass': '#78C850',
      'ice': '#98D8D8',
      'fighting': '#C03028',
      'poison': '#A040A0',
      'ground': '#E0C068',
      'flying': '#A890F0',
      'psychic': '#F85888',
      'bug': '#A8B820',
      'rock': '#B8A038',
      'ghost': '#705898',
      'dragon': '#7038F8',
      'dark': '#705848',
      'steel': '#B8B8D0',
      'fairy': '#EE99AC'
    };
    return typeColors[type] || '#A8A878';
  }
} 