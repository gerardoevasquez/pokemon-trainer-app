import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
export class PokemonCardComponent implements OnInit {
  @Input() pokemon!: PokemonListItem;
  @Input() isSelected: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() isDisabled: boolean = false;
  
  @Output() pokemonSelected = new EventEmitter<PokemonListItem>();
  @Output() pokemonDeselected = new EventEmitter<PokemonListItem>();

  pokemonDetails: Pokemon | null = null;
  imageUrl: string = '';
  pokemonId: number = 0;
  isLoadingDetails: boolean = true;
  isShiny: boolean = false;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.extractPokemonId();
    this.loadPokemonDetails();
  }

  private extractPokemonId(): void {
    // Extraer ID de la URL: https://pokeapi.co/api/v2/pokemon/1/
    const urlParts = this.pokemon.url.split('/');
    this.pokemonId = parseInt(urlParts[urlParts.length - 2]);
    console.log('🎴 PokemonCard - ID extraído:', this.pokemonId, 'para:', this.pokemon.name);
  }

  private loadPokemonDetails(): void {
    this.isLoadingDetails = true;
    console.log('🎴 PokemonCard - Cargando detalles para ID:', this.pokemonId, 'nombre:', this.pokemon.name, 'URL:', this.pokemon.url);
    this.pokemonService.getPokemonById(this.pokemonId).subscribe({
      next: (pokemon) => {
        this.pokemonDetails = pokemon;
        this.imageUrl = this.pokemonService.getPokemonSprite(pokemon);
        
        // Detectar si es shiny usando el cache
        this.isShiny = this.pokemonService.isPokemonShinyInCache(pokemon.id) || 
                      this.pokemonService.isPokemonSelectedAsShiny(pokemon.id);
        
        this.isLoadingDetails = false;
        console.log('🎴 PokemonCard - Detalles cargados:', pokemon.name, 'ID:', pokemon.id, 'Imagen:', this.imageUrl, 'Es Shiny:', this.isShiny, 'para tarjeta:', this.pokemon.name);
        console.log('🎴 PokemonCard - Sprites disponibles:', pokemon.sprites);
      },
      error: (error) => {
        console.error('Error loading Pokemon details:', error);
        this.imageUrl = 'assets/images/pokemon/pokemon-placeholder.png';
        this.isLoadingDetails = false;
      }
    });
  }

  onCardClick(): void {
    console.log('🎴 PokemonCard - clicked:', this.pokemon.name, 'disabled:', this.isDisabled, 'isSelected:', this.isSelected);
    if (!this.isDisabled) {
      if (this.isSelected) {
        this.pokemonDeselected.emit(this.pokemon);
      } else {
        this.pokemonSelected.emit(this.pokemon);
      }
    } else {
      console.log('🎴 PokemonCard - Card is disabled, click ignored');
    }
  }

  getPokemonTypes(): string[] {
    return this.pokemonDetails ? this.pokemonService.getPokemonTypes(this.pokemonDetails) : [];
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