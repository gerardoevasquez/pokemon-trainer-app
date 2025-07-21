import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PokemonCardComponent } from '../pokemon-card';
import { PokemonListItem, Pokemon } from '../../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-swiper',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    PokemonCardComponent
  ],
  templateUrl: './pokemon-swiper.component.html',
  styleUrls: ['./pokemon-swiper.component.scss']
})
export class PokemonSwiperComponent implements OnInit, OnDestroy {
  @Input() pokemonList: PokemonListItem[] = [];
  @Input() selectedPokemon: Pokemon[] = [];
  @Input() isLoading: boolean = false;
  @Input() maxSelection: number = 3;
  
  @Output() pokemonSelected = new EventEmitter<PokemonListItem>();
  @Output() pokemonDeselected = new EventEmitter<PokemonListItem>();

  swiperConfig = {
    slidesPerView: 3,
    grid: {
      rows: 3,
      fill: 'row'
    },
    spaceBetween: 8,
    navigation: true,
    pagination: {
      clickable: true,
      dynamicBullets: true
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        grid: {
          rows: 2
        }
      },
      768: {
        slidesPerView: 3,
        grid: {
          rows: 3
        }
      }
    }
  };

  ngOnInit(): void {
    console.log('🎠 PokemonSwiper - ngOnInit:', this.pokemonList.length);
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

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

  onPokemonSelected(pokemonItem: PokemonListItem): void {
    console.log('🎠 PokemonSwiper - onPokemonSelected:', pokemonItem);
    this.pokemonSelected.emit(pokemonItem);
  }

  onPokemonDeselected(pokemonItem: PokemonListItem): void {
    console.log('🎠 PokemonSwiper - onPokemonDeselected:', pokemonItem);
    this.pokemonDeselected.emit(pokemonItem);
  }

  getPokemonId(pokemonItem: PokemonListItem): number {
    const urlParts = pokemonItem.url.split('/');
    return parseInt(urlParts[urlParts.length - 2]);
  }

  trackByPokemonId(index: number, pokemonItem: PokemonListItem): number {
    return this.getPokemonId(pokemonItem);
  }
} 