import { Component, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface ProfileData {
  name: string;
  hobby: string;
  age: number;
  document: string;
  imageUrl?: string;
  birthDate?: Date;
  selectedPokemon?: any[];
  isCompleted?: boolean;
}

export type ProfileMode = 'upload' | 'display' | 'final';

@Component({
  selector: 'app-profile-image-uploader',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './profile-image-uploader.component.html',
  styleUrls: ['./profile-image-uploader.component.scss']
})
export class ProfileImageUploaderComponent {
  @Input() profileData?: ProfileData;
  @Input() mode: ProfileMode = 'upload'; // 'upload' | 'display' | 'final'
  @Input() currentStep: number = 1; // Paso actual (1, 2, 3)
  @Output() imageUploaded = new EventEmitter<File>();
  @Output() imageRemoved = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedImage: string | null = null;
  selectedFile: File | null = null;
  hasError: boolean = false;
  errorMessage: string = '';

  // Tipos de imagen válidos
  private readonly VALID_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/gif',
    'image/webp'
  ];

  // Getters para determinar el comportamiento
  get isUploadMode(): boolean {
    return this.mode === 'upload';
  }

  get isDisplayMode(): boolean {
    return this.mode === 'display';
  }

  get isFinalMode(): boolean {
    return this.mode === 'final';
  }

  get showUploadButton(): boolean {
    const result = this.isUploadMode && !this.hasImage();
    console.log('showUploadButton:', result, 'isUploadMode:', this.isUploadMode, 'hasImage:', this.hasImage());
    return result;
  }

  get showImagePreview(): boolean {
    const result = this.hasImage();
    console.log('showImagePreview:', result, 'selectedImage:', this.selectedImage, 'profileData.imageUrl:', this.profileData?.imageUrl);
    return result;
  }

  get showProfileData(): boolean {
    return this.isDisplayMode || this.isFinalMode;
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar si es un archivo de imagen válido
      if (this.isValidImageFile(file)) {
        this.selectedFile = file;
        this.hasError = false;
        this.errorMessage = '';
        
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.selectedImage = e.target.result;
        };
        reader.readAsDataURL(file);
        this.imageUploaded.emit(file);
      } else {
        // Archivo no válido
        this.hasError = true;
        this.errorMessage = 'Por favor adjunta un archivo con formato PNG, JPG, GIF o WEBP';
        this.selectedFile = null;
        this.selectedImage = null;
        
        // Limpiar el input
        if (this.fileInput) {
          this.fileInput.nativeElement.value = '';
        }
        
        // Emitir evento de error
        this.imageRemoved.emit();
      }
    }
  }

  /**
   * Valida si el archivo es una imagen válida
   */
  private isValidImageFile(file: File): boolean {
    // Verificar tipo MIME
    if (!this.VALID_IMAGE_TYPES.includes(file.type)) {
      return false;
    }
    
    // Verificar extensión del archivo
    const fileName = file.name.toLowerCase();
    const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
    
    if (!hasValidExtension) {
      return false;
    }
    
    // Verificar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return false;
    }
    
    return true;
  }

  hasImage(): boolean {
    return !!(this.selectedImage || this.profileData?.imageUrl);
  }

  removeImage() {
    this.selectedImage = null;
    this.selectedFile = null;
    this.hasError = false;
    this.errorMessage = '';
    this.imageRemoved.emit();
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  getDisplayImage(): string {
    return this.selectedImage || this.profileData?.imageUrl || 'assets/images/default-avatar.png';
  }

  getAge(): number {
    if (this.profileData?.birthDate) {
      const today = new Date();
      const birthDate = new Date(this.profileData.birthDate);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age;
    }
    return this.profileData?.age || 0;
  }

  getDocumentType(): string {
    return this.getAge() >= 18 ? 'DUI' : 'Carnet de Minoridad';
  }

  shouldShowDocument(): boolean {
    return !!(this.profileData?.document && 
              this.profileData.document !== null && 
              this.profileData.document !== undefined && 
              this.profileData.document.trim() !== '');
  }

  // Métodos para contenido dinámico según el paso
  getStepTitle(): string {
    switch (this.currentStep) {
      case 1:
        return 'Imagen perfil';
      case 2:
        return this.profileData?.name || 'Entrenador';
      case 3:
        return 'Entrenador';
      default:
        return 'Imagen perfil';
    }
  }

  getStepSubtitle(): string {
    switch (this.currentStep) {
      case 1:
        return 'Sube una foto para tu perfil';
      case 2:
        return ''; // No subtitle in step 2
      case 3:
        return ''; // No subtitle in step 3
      default:
        return 'Sube una foto para tu perfil';
    }
  }

  shouldShowProfileInfo(): boolean {
    return this.currentStep >= 2 && !!this.profileData;
  }

  shouldShowAchievementBadge(): boolean {
    return this.currentStep === 3; // Only in step 3
  }

  getFileName(): string {
    if (this.selectedFile) {
      console.log('Selected file name:', this.selectedFile.name);
      return this.selectedFile.name;
    }
    if (this.profileData?.imageUrl) {
      const urlParts = this.profileData.imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1] || 'Imagen de perfil';
      console.log('Profile image URL name:', fileName);
      return fileName;
    }
    console.log('No file name found, returning default');
    return 'Imagen de perfil';
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
} 