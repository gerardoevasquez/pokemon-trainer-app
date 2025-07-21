import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Layout Components
import { AppHeaderComponent } from '../../components/layout/app-header';
import { TrainerProfileFormComponent } from '../../components/forms/trainer-profile-form/trainer-profile-form.component';
import { SectionHeaderComponent } from '../../components/forms/section-header/section-header.component';
import { ProfileImageUploaderComponent, ProfileData } from '../../components/profile/profile-image-uploader';
import { StepMessageComponent } from '../../components/layout/step-message';
import { LoadingScreenComponent } from '../../components/loading/loading-screen/loading-screen.component';

// Pokemon Components (necesitaremos crearlos)
import { PokemonSelectionComponent } from '../../components/pokemon/pokemon-selection/pokemon-selection.component';
import { TrainerSummaryComponent } from '../../components/trainer/trainer-summary/trainer-summary.component';

import { LoadingService } from '../../services/loading.service';

@Component({
  selector: 'app-trainer-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppHeaderComponent,
    SectionHeaderComponent,
    TrainerProfileFormComponent,
    ProfileImageUploaderComponent,
    StepMessageComponent,
    LoadingScreenComponent,
    PokemonSelectionComponent,
    TrainerSummaryComponent
  ],
  templateUrl: './trainer-profile.component.html',
  styleUrls: ['./trainer-profile.component.scss']
})
export class TrainerProfileComponent implements OnInit {
  currentStep = 1;
  isLoading = false;
  profileData: ProfileData | undefined;
  selectedTeam: any[] = [];
  isEditingProfile = false; // Nueva variable para detectar edición de perfil

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {}

  // Getters para determinar el comportamiento
  get profileMode(): 'upload' | 'display' | 'final' {
    if (this.currentStep === 1) return 'upload';
    if (this.currentStep === 2) return 'display';
    if (this.currentStep === 3) return 'final';
    return 'upload';
  }

  /**
   * Get only the first name from the full name
   */
  getFirstName(): string {
    if (!this.profileData?.name || this.profileData.name.trim() === '') {
      return 'Entrenador';
    }
    return this.profileData.name.split(' ')[0];
  }

  get stepMessage() {
    if (this.currentStep === 1) {
      return { 
        title: '¡Hola! Configuremos tu perfil', 
        subtitle: 'Queremos conocerte mejor.',
      };
    }
    if (this.currentStep === 2) {
      return { 
        title: '¡Ya casi terminamos!', 
        subtitle: 'Revisa la información, y completa lo solicitado.',
        showBackButton: true
      };
    }
    if (this.currentStep === 3) {
      return { 
        title: `¡Hola ${this.getFirstName()}!`, 
        subtitle: '',
        showBackButton: false,
        showEditButton: true,
        editButtonText: 'Editar perfil'
      };
    }
    return {
      title: 'Paso no válido',
      subtitle: '',
      showBackButton: true
    };
  }

  // Event handlers
  onProfileCompleted(data: any) {

    
    this.profileData = {
      name: data.name || '',
      hobby: data.hobby || '',
      age: 0, // Se calculará en el componente de fecha
      document: data.document || '',
      birthDate: data.birthday || null,
      selectedPokemon: this.profileData?.selectedPokemon || [], // Preservar Pokémon seleccionados
      isCompleted: true,
      imageUrl: this.profileData?.imageUrl // Preservar imagen del perfil
    };
    

    
    if (this.isEditingProfile) {
      // Si se está editando el perfil, ir directamente al paso 3
  
      this.isEditingProfile = false; // Resetear la bandera
      this.showLoaderAndGoToStep(3);
    } else {
      // Si es la primera vez, continuar al paso 2
  
      this.showLoaderAndNextStep();
    }
  }

  onTeamSelected(team: any[]) {
    this.selectedTeam = team;

    this.showLoaderAndNextStep();
  }

  onTeamEdited(team: any[]) {
    this.selectedTeam = team;
    // Mostrar loader y volver al paso 3 después de editar
    this.showLoaderAndNextStep();
  }

  onImageUploaded(file: File): void {
    // Solo relevante en el paso 1
    if (this.currentStep === 1 && this.profileData) {
      this.profileData = {
        ...this.profileData,
        imageUrl: URL.createObjectURL(file),
        name: this.profileData.name,
        hobby: this.profileData.hobby,
        age: this.profileData.age,
        document: this.profileData.document,
        birthDate: this.profileData.birthDate,
        selectedPokemon: this.profileData.selectedPokemon,
        isCompleted: this.profileData.isCompleted
      };
    }
  }

  onImageRemoved(): void {
    if (this.currentStep === 1 && this.profileData) {
      this.profileData = {
        ...this.profileData,
        imageUrl: undefined,
        name: this.profileData.name,
        hobby: this.profileData.hobby,
        age: this.profileData.age,
        document: this.profileData.document,
        birthDate: this.profileData.birthDate,
        selectedPokemon: this.profileData.selectedPokemon,
        isCompleted: this.profileData.isCompleted
      };
    }
  }

  onBackClick(): void {
    if (this.currentStep > 1) {
      // Mostrar loading cuando se navega hacia atrás desde el paso 3
      if (this.currentStep === 3) {
        this.showLoaderAndGoToStep(this.currentStep - 1);
      } else {
        this.currentStep--;
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  onEditProfile(): void {
    this.isEditingProfile = true; // Marcar que se está editando el perfil

    // Mostrar loading antes de navegar al paso 1
    this.showLoaderAndGoToStep(1);
  }

  onEditPokemon(): void {

    // Mostrar loading antes de navegar al paso 2
    this.showLoaderAndGoToStep(2);
  }

  // Helper methods
  showLoaderAndNextStep() {

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.currentStep++;
    }, 1500);
  }

  showLoaderAndGoToStep(step: number) {

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
              this.currentStep = step;
    }, 1500);
  }

  goToStep(step: number) {
    this.currentStep = step;
  }
} 