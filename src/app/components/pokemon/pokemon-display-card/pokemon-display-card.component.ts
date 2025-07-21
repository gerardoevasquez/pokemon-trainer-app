import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { Pokemon } from '../../../models/pokemon.model';
import { PokemonService } from '../../../services/pokemon.service';

@Component({
  selector: 'app-pokemon-display-card',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    MatProgressBarModule
  ],
  templateUrl: './pokemon-display-card.component.html',
  styleUrls: ['./pokemon-display-card.component.scss']
})
export class PokemonDisplayCardComponent {
  @Input() pokemon!: Pokemon;

  constructor(private pokemonService: PokemonService) {}

  getPokemonSprite(): string {
    return this.pokemonService.getPokemonSprite(this.pokemon);
  }

  getPokemonTypes(): string[] {
    return this.pokemonService.getPokemonTypes(this.pokemon);
  }

  getStatPercentage(statName: string, statValue: number): number {
    return this.pokemonService.getStatPercentage(statName, statValue);
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

  getStatName(statName: string): string {
    const statNames: { [key: string]: string } = {
      'hp': 'Salud',
      'attack': 'Ataque',
      'defense': 'Defensa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defensa Especial',
      'speed': 'Velocidad'
    };
    return statNames[statName] || statName;
  }
} 