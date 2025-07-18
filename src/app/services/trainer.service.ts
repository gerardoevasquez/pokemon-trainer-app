import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Trainer, TrainerFormData } from '../models/trainer.model';
import { Pokemon } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {
  private readonly STORAGE_KEY = 'pokemon_trainer_data';
  private trainerSubject = new BehaviorSubject<Trainer | null>(null);
  public trainer$ = this.trainerSubject.asObservable();

  constructor() {
    this.loadTrainerFromStorage();
  }

  /**
   * Create or update trainer profile
   */
  saveTrainer(trainerData: TrainerFormData): Observable<Trainer> {
    return new Observable(observer => {
      const trainer: Trainer = {
        id: this.generateId(),
        name: trainerData.name,
        photo: trainerData.photo ? URL.createObjectURL(trainerData.photo) : undefined,
        hobby: trainerData.hobby,
        birthDate: trainerData.birthDate,
        isAdult: this.calculateAge(trainerData.birthDate) >= 18,
        identificationDocument: trainerData.identificationDocument,
        identificationType: this.calculateAge(trainerData.birthDate) >= 18 ? 'DUI' : 'MINORITY_CARD',
        selectedPokemon: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      this.trainerSubject.next(trainer);
      this.saveTrainerToStorage(trainer);
      observer.next(trainer);
      observer.complete();
    });
  }

  /**
   * Update trainer profile
   */
  updateTrainer(updates: Partial<Trainer>): Observable<Trainer> {
    return new Observable(observer => {
      const currentTrainer = this.trainerSubject.value;
      if (!currentTrainer) {
        observer.error('No trainer found');
        return;
      }

      const updatedTrainer: Trainer = {
        ...currentTrainer,
        ...updates,
        updatedAt: new Date()
      };

      this.trainerSubject.next(updatedTrainer);
      this.saveTrainerToStorage(updatedTrainer);
      observer.next(updatedTrainer);
      observer.complete();
    });
  }

  /**
   * Add Pokemon to trainer's team
   */
  addPokemonToTeam(pokemon: Pokemon): Observable<Trainer> {
    return new Observable(observer => {
      const currentTrainer = this.trainerSubject.value;
      if (!currentTrainer) {
        observer.error('No trainer found');
        return;
      }

      if (currentTrainer.selectedPokemon.length >= 3) {
        observer.error('Team is full. Maximum 3 Pokemon allowed.');
        return;
      }

      if (currentTrainer.selectedPokemon.some(p => p.id === pokemon.id)) {
        observer.error('Pokemon already in team');
        return;
      }

      const updatedTrainer: Trainer = {
        ...currentTrainer,
        selectedPokemon: [...currentTrainer.selectedPokemon, pokemon],
        updatedAt: new Date()
      };

      this.trainerSubject.next(updatedTrainer);
      this.saveTrainerToStorage(updatedTrainer);
      observer.next(updatedTrainer);
      observer.complete();
    });
  }

  /**
   * Remove Pokemon from trainer's team
   */
  removePokemonFromTeam(pokemonId: number): Observable<Trainer> {
    return new Observable(observer => {
      const currentTrainer = this.trainerSubject.value;
      if (!currentTrainer) {
        observer.error('No trainer found');
        return;
      }

      const updatedTrainer: Trainer = {
        ...currentTrainer,
        selectedPokemon: currentTrainer.selectedPokemon.filter(p => p.id !== pokemonId),
        updatedAt: new Date()
      };

      this.trainerSubject.next(updatedTrainer);
      this.saveTrainerToStorage(updatedTrainer);
      observer.next(updatedTrainer);
      observer.complete();
    });
  }

  /**
   * Get current trainer
   */
  getCurrentTrainer(): Trainer | null {
    return this.trainerSubject.value;
  }

  /**
   * Clear trainer data
   */
  clearTrainer(): void {
    this.trainerSubject.next(null);
    localStorage.removeItem(this.STORAGE_KEY);
  }

  /**
   * Validate DUI format
   */
  validateDUI(dui: string): boolean {
    // DUI format: 00000000-0 (8 digits, hyphen, 1 digit)
    const duiRegex = /^\d{8}-\d$/;
    return duiRegex.test(dui);
  }

  /**
   * Format DUI with automatic hyphen insertion
   */
  formatDUI(dui: string): string {
    const cleanDUI = dui.replace(/[^0-9]/g, '');
    if (cleanDUI.length >= 8) {
      return `${cleanDUI.slice(0, 8)}-${cleanDUI.slice(8, 9)}`;
    }
    return cleanDUI;
  }

  /**
   * Calculate age from birth date
   */
  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  /**
   * Save trainer to localStorage
   */
  private saveTrainerToStorage(trainer: Trainer): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(trainer));
    } catch (error) {
      console.error('Error saving trainer to storage:', error);
    }
  }

  /**
   * Load trainer from localStorage
   */
  private loadTrainerFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const trainer = JSON.parse(stored);
        // Convert string dates back to Date objects
        trainer.birthDate = new Date(trainer.birthDate);
        trainer.createdAt = new Date(trainer.createdAt);
        trainer.updatedAt = new Date(trainer.updatedAt);
        this.trainerSubject.next(trainer);
      }
    } catch (error) {
      console.error('Error loading trainer from storage:', error);
    }
  }
} 