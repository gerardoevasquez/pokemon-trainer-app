import { Pokemon } from './pokemon.model';

export interface Trainer {
  id?: string;
  name: string;
  photo?: string;
  hobby?: string;
  birthDate: Date;
  isAdult: boolean;
  identificationDocument?: string;
  identificationType?: 'DUI' | 'MINORITY_CARD';
  selectedPokemon: Pokemon[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TrainerFormData {
  name: string;
  photo?: File;
  hobby?: string;
  birthDate: Date;
  identificationDocument?: string;
} 