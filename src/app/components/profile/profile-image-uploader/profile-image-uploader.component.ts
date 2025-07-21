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
  @Output() imageUploaded = new EventEmitter<File>();
  @Output() imageRemoved = new EventEmitter<void>();
  @ViewChild('fileInput') fileInput!: ElementRef;

  selectedImage: string | null = null;
  selectedFile: File | null = null;

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