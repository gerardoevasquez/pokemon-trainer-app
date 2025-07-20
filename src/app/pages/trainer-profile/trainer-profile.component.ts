import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Layout Components
import { AppHeaderComponent } from '../../components/layout/app-header';
import { TrainerProfileFormComponent } from '../../components/forms/trainer-profile-form/trainer-profile-form.component';
import { SectionHeaderComponent } from '../../components/forms/section-header/section-header.component';
import { ProfileImageUploaderComponent } from '../../components/profile/profile-image-uploader/profile-image-uploader.component';
import { StepMessageComponent } from '../../components/layout/step-message';
import { LoadingScreenComponent } from '../../components/loading/loading-screen/loading-screen.component';

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
    LoadingScreenComponent
  ],
  templateUrl: './trainer-profile.component.html',
  styleUrls: ['./trainer-profile.component.scss']
})
export class TrainerProfileComponent implements OnInit {
  trainerForm: FormGroup;
  isAdult: boolean = false;
  isLoading: boolean = false;
  maxDate: Date = new Date();
  hasValidBirthday: boolean = false; // Para controlar si ya se validó la edad
  hasProfileImage: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private loadingService: LoadingService
  ) {
    this.trainerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      hobby: [''],
      birthday: [null, Validators.required],
      document: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Escuchar cambios en la fecha de cumpleaños
    this.trainerForm.get('birthday')?.valueChanges.subscribe(date => {
      if (date) {
        this.checkAge(date);
      }
    });
  }

  onAgeChanged(event: { isAdult: boolean; age: number }) {
    this.hasValidBirthday = event.isAdult;
    if (!this.hasValidBirthday) {
      this.trainerForm.get('document')?.setValue('');
    }
  }

  private checkAge(birthDate: Date): void {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      actualAge--;
    }
    
    this.isAdult = actualAge >= 18;
  }

  getDocumentLabel(): string {
    if (!this.hasValidBirthday) {
      return 'Documento';
    }
    return this.isAdult ? 'DUI' : 'Carnet de Minoridad';
  }

  getDocumentPlaceholder(): string {
    if (!this.hasValidBirthday) {
      return 'Selecciona tu fecha de nacimiento primero';
    }
    return this.isAdult ? 'Ej: 12345678-9' : 'Ej: 12345678';
  }

  getDocumentMaxLength(): number {
    return this.isAdult ? 10 : 8;
  }

  onSubmit(): void {
    if (this.trainerForm.valid) {
      this.isLoading = true;
      
      // Simular envío de datos
      setTimeout(() => {
        console.log('Formulario enviado:', this.trainerForm.value);
        this.isLoading = false;
        
        // Navegar al siguiente paso
        this.router.navigate(['/pokemon-selection']);
      }, 1500);
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.trainerForm.controls).forEach(key => {
      const control = this.trainerForm.get(key);
      control?.markAsTouched();
    });
  }

  get isFormValid(): boolean {
    return this.trainerForm.valid && !this.isLoading && this.hasProfileImage;
  }

  onBackClick(): void {
    // Navegar hacia atrás o a la página anterior
    this.router.navigate(['/']); // O la ruta que corresponda
  }

  onFormSubmitted(formData: any) {
    console.log('Formulario enviado:', formData);
    
    // Mostrar loading antes de navegar al siguiente paso
    this.loadingService.showStepTransition('selección de Pokémon');
    
    // Simular tiempo de carga
    setTimeout(() => {
      this.loadingService.hide();
      this.router.navigate(['/pokemon-selection']);
    }, 1500);
  }

  onImageUploaded(file: File): void {
    this.hasProfileImage = true;
  }

  onImageRemoved(): void {
    this.hasProfileImage = false;
  }
} 