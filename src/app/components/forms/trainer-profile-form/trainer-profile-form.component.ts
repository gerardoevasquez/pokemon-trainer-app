import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputFieldComponent } from '../input-field';
import { DatePickerFieldComponent } from '../date-picker-field';
import { PrimaryButtonComponent } from '../primary-button';

@Component({
  selector: 'app-trainer-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputFieldComponent,
    DatePickerFieldComponent,
    PrimaryButtonComponent
  ],
  templateUrl: './trainer-profile-form.component.html',
  styleUrls: ['./trainer-profile-form.component.scss']
})
export class TrainerProfileFormComponent implements OnInit {
  @Input() hasProfileImage: boolean = false;
  @Output() formSubmitted = new EventEmitter<any>();
  
  trainerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    hobby: new FormControl(''),
    birthday: new FormControl('', Validators.required),
    document: new FormControl('', Validators.required)
  });
  
  maxDate = new Date();
  hasValidBirthday = false;
  isAdult = false;
  isLoading = false;
  
  ngOnInit() {
    // Deshabilitar el campo documento inicialmente
    this.trainerForm.get('document')?.disable();
  }
  
  onSubmit() {
    if (this.isFormValid) {
      this.isLoading = true;
      this.formSubmitted.emit(this.trainerForm.value);
    }
  }
  
  onAgeChanged(event: { isAdult: boolean; age: number }) {
    this.hasValidBirthday = true;
    this.isAdult = event.isAdult;
    
    const documentControl = this.trainerForm.get('document');
    
    if (this.hasValidBirthday) {
      // Habilitar el campo documento
      documentControl?.enable();
      // Limpiar el valor anterior
      documentControl?.setValue('');
    } else {
      // Deshabilitar el campo documento
      documentControl?.disable();
      documentControl?.setValue('');
    }
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
    if (!this.hasValidBirthday) {
      return 0;
    }
    return this.isAdult ? 10 : 8;
  }
  
  get isFormValid(): boolean {
    return this.trainerForm.valid && 
           this.hasValidBirthday && 
           this.hasProfileImage;
  }
} 