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
  birthDate?: Date; // Agregar esta línea
  selectedPokemon?: any[]; // Para el paso 3
  isCompleted?: boolean; // Para mostrar medallita
}

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
  @Input() isEditMode: boolean = true;
  @Output() imageUploaded = new EventEmitter<File>();
  @Output() imageRemoved = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedImage: string | null = null;
  selectedFile: File | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImage = e.target.result;
      };
      reader.readAsDataURL(file);
      this.imageUploaded.emit(file);
    }
  }

  hasImage(): boolean {
    return !!(this.selectedImage || this.profileData?.imageUrl);
  }

  removeImage() {
    this.selectedImage = null;
    this.selectedFile = null;
    this.imageRemoved.emit();
    // Limpiar el input para permitir seleccionar el mismo archivo
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

  getFileName(): string {
    if (this.selectedFile) {
      return this.selectedFile.name;
    }
    if (this.profileData?.imageUrl) {
      // Extraer nombre del archivo de la URL
      const urlParts = this.profileData.imageUrl.split('/');
      return urlParts[urlParts.length - 1] || 'Imagen de perfil';
    }
    return 'Imagen de perfil';
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }
} 