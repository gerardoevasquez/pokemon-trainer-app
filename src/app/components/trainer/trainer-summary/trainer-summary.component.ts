import { Component, Input, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { register } from 'swiper/element/bundle';

import { ProfileData } from '../../profile/profile-image-uploader';
import { Pokemon } from '../../../models/pokemon.model';
import { PokemonService } from '../../../services/pokemon.service';

// Registrar elementos de Swiper
register();

@Component({
  selector: 'app-trainer-summary',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './trainer-summary.component.html',
  styleUrls: ['./trainer-summary.component.scss']
})
export class TrainerSummaryComponent implements OnInit {
  @Input() profileData?: ProfileData;
  @Input() selectedTeam: Pokemon[] = [];
  @Output() editProfile = new EventEmitter<void>();

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    // Asegurar que Swiper esté registrado
    console.log('TrainerSummaryComponent initialized');
  }

  getMaxHeight(): number {
    // Altura del componente izquierdo (600px) - altura del header - padding
    const leftComponentHeight = 600;
    const headerHeight = 80; // Altura aproximada del header
    const padding = 40; // Padding del contenedor
    return leftComponentHeight - headerHeight - padding;
  }

  trackByPokemonId(index: number, pokemon: Pokemon): number {
    return pokemon.id;
  }

  getPokemonSprite(pokemon: Pokemon): string {
    return this.pokemonService.getPokemonSprite(pokemon);
  }

  getPokemonTypes(pokemon: Pokemon): string[] {
    return this.pokemonService.getPokemonTypes(pokemon);
  }

  getStatPercentage(statName: string, statValue: number): number {
    return this.pokemonService.getStatPercentage(statName, statValue);
  }

  getStatName(statName: string): string {
    const statNames: { [key: string]: string } = {
      'hp': 'HP',
      'attack': 'Ataque',
      'defense': 'Defensa',
      'special-attack': 'Ataque Especial',
      'special-defense': 'Defensa Especial',
      'speed': 'Velocidad'
    };
    return statNames[statName] || statName;
  }

  getStatColor(statName: string): string {
    const statColors: { [key: string]: string } = {
      'hp': '#4CAF50',
      'attack': '#FF5722',
      'defense': '#2196F3',
      'special-attack': '#9C27B0',
      'special-defense': '#FF9800',
      'speed': '#00BCD4'
    };
    return statColors[statName] || '#666';
  }

  onEditProfile(): void {
    this.editProfile.emit();
  }
} 