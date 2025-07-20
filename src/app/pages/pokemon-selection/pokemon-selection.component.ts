import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

// Layout Components
import { AppHeaderComponent } from '../../components/layout/app-header';
import { StepMessageComponent } from '../../components/layout/step-message';
import { ProfileImageUploaderComponent, ProfileData } from '../../components/profile/profile-image-uploader/profile-image-uploader.component';

// Pokemon Components
import { PokemonGridComponent } from '../../components/pokemon/pokemon-grid';
import { SearchBarComponent } from '../../components/forms/search-bar/search-bar.component';
import { PrimaryButtonComponent } from '../../components/forms/primary-button/primary-button.component';

// Services
import { PokemonService } from '../../services/pokemon.service';
import { TrainerService } from '../../services/trainer.service';
import { LoadingService } from '../../services/loading.service';

// Models
import { Pokemon, PokemonListItem } from '../../models/pokemon.model';
import { Trainer } from '../../models/trainer.model';

@Component({
  selector: 'app-pokemon-selection',
  standalone: true,
  imports: [
    CommonModule,
    AppHeaderComponent,
    StepMessageComponent,
    ProfileImageUploaderComponent,
    PokemonGridComponent,
    SearchBarComponent,
    PrimaryButtonComponent
  ],
  templateUrl: './pokemon-selection.component.html',
  styleUrls: ['./pokemon-selection.component.scss']
})
export class PokemonSelectionComponent implements OnInit {
  pokemonList: PokemonListItem[] = [];
  filteredPokemon: PokemonListItem[] = [];
  selectedPokemon: Pokemon[] = [];
  trainer: Trainer | null = null;
  isLoading = false;
  searchQuery = '';

  constructor(
    private pokemonService: PokemonService,
    private trainerService: TrainerService,
    private loadingService: LoadingService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTrainerData();
    this.loadPokemonList();
  }

  private loadTrainerData(): void {
    this.trainerService.trainer$.subscribe(trainer => {
      this.trainer = trainer;
      if (trainer) {
        this.selectedPokemon = trainer.selectedPokemon;
      }
    });
  }

  private loadPokemonList(): void {
    this.isLoading = true;
    this.pokemonService.getPokemonList().subscribe({
      next: (pokemonList) => {
        this.pokemonList = pokemonList;
        this.filteredPokemon = pokemonList;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading Pokemon list:', error);
        this.isLoading = false;
      }
    });
  }

  onSearch(query: { query: string, filter?: string }): void {
    this.searchQuery = query.query;
    if (query.query.trim()) {
      this.pokemonService.searchPokemon(query.query).subscribe({
        next: (results) => {
          this.filteredPokemon = results;
        },
        error: (error) => {
          console.error('Error searching Pokemon:', error);
          this.filteredPokemon = [];
        }
      });
    } else {
      this.filteredPokemon = this.pokemonList;
    }
  }

  onPokemonSelected(pokemon: Pokemon): void {
    if (this.selectedPokemon.length >= 3) {
      alert('Ya tienes 3 Pokémon seleccionados. Elimina uno para agregar otro.');
      return;
    }

    if (this.selectedPokemon.some(p => p.id === pokemon.id)) {
      alert('Este Pokémon ya está en tu equipo.');
      return;
    }

    this.trainerService.addPokemonToTeam(pokemon).subscribe({
      next: (updatedTrainer) => {
        this.selectedPokemon = updatedTrainer.selectedPokemon;
      },
      error: (error) => {
        console.error('Error adding Pokemon to team:', error);
        alert(error);
      }
    });
  }

  onPokemonRemoved(pokemonId: number): void {
    this.trainerService.removePokemonFromTeam(pokemonId).subscribe({
      next: (updatedTrainer) => {
        this.selectedPokemon = updatedTrainer.selectedPokemon;
      },
      error: (error) => {
        console.error('Error removing Pokemon from team:', error);
        alert(error);
      }
    });
  }

  onSaveTeam(): void {
    if (this.selectedPokemon.length < 3) {
      alert('Debes seleccionar 3 Pokémon para continuar.');
      return;
    }

    this.loadingService.showStepTransition('perfil final');
    
    setTimeout(() => {
      this.loadingService.hide();
      this.router.navigate(['/trainer-profile-view']);
    }, 1500);
  }

  onBackClick(): void {
    this.loadingService.showStepTransition('configuración de perfil');
    
    setTimeout(() => {
      this.loadingService.hide();
      this.router.navigate(['/trainer-profile']);
    }, 1000);
  }

  get canSave(): boolean {
    return this.selectedPokemon.length === 3;
  }

  get profileDataForDisplay(): ProfileData | undefined {
    if (!this.trainer) return undefined;
    
    const age = this.calculateAge(this.trainer.birthDate);
    
    return {
      name: this.trainer.name,
      hobby: this.trainer.hobby || '',
      age: age,
      document: this.trainer.identificationDocument || '',
      imageUrl: this.trainer.photo,
      birthDate: this.trainer.birthDate,
      selectedPokemon: this.trainer.selectedPokemon,
      isCompleted: false
    };
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }
} 