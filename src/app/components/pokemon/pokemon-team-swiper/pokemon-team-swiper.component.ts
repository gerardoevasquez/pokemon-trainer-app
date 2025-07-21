import { Component, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PokemonDisplayCardComponent } from '../pokemon-display-card';
import { Pokemon } from '../../../models/pokemon.model';

@Component({
  selector: 'app-pokemon-team-swiper',
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    PokemonDisplayCardComponent
  ],
  templateUrl: './pokemon-team-swiper.component.html',
  styleUrls: ['./pokemon-team-swiper.component.scss']
})
export class PokemonTeamSwiperComponent {
  @Input() pokemonTeam: Pokemon[] = [];

  swiperConfig = {
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: true,
    pagination: {
      clickable: true,
      dynamicBullets: true
    },
    breakpoints: {
      768: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 40
      }
    }
  };
} 