import { Component, Output, EventEmitter, OnInit, Input, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputFieldComponent } from '../input-field';
import { DatePickerFieldComponent } from '../date-picker-field';
import { PrimaryButtonComponent } from '../primary-button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-trainer-profile-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputFieldComponent,
    DatePickerFieldComponent,
    PrimaryButtonComponent,
    MatAutocompleteModule,
    MatChipsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './trainer-profile-form.component.html',
  styleUrls: ['./trainer-profile-form.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TrainerProfileFormComponent implements OnInit {
  @Input() hasProfileImage: boolean = false;
  @Input() existingProfileData?: any; // Datos existentes del perfil
  @Output() formSubmitted = new EventEmitter<any>();
  
  hobbiesList: string[] = [
    'Andar en bicicleta',
    'Bailar',
    'Cocinar',
    'Coleccionar monedas',
    'Correr',
    'Dibujar',
    'Escuchar música',
    'Escribir',
    'Fotografía',
    'Jardinería',
    'Jugar Basquetball',
    'Jugar Fifa',
    'Jugar Fútbol',
    'Jugar Tennis',
    'Jugar Voleibol',
    'Jugar Videojuegos',
    'Leer',
    'Meditar',
    'Nadar',
    'Pintar',
    'Programar',
    'Tejer',
    'Tocar guitarra',
    'Viajar',
    'Yoga'
  ].sort((a, b) => a.localeCompare(b));
  filteredHobbies: string[] = [];
  selectedHobbies: string[] = [];
  hobbyInput = new FormControl<string>('');
  
  trainerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    hobby: new FormControl<string[]>([], Validators.required),
    birthday: new FormControl<Date | null>(null, Validators.required),
    document: new FormControl({value: '', disabled: true}, Validators.required)
  });
  
  maxDate = new Date();
  hasValidBirthday = false;
  isAdult = false;
  isLoading = false;
  
  ngOnInit() {
    this.trainerForm.get('document')?.disable();
    this.filteredHobbies = this.hobbiesList.slice();
    this.hobbyInput.valueChanges.subscribe(value => {
      this.filterHobbies(value);
    });

    // Rellenar formulario con datos existentes si están disponibles
    if (this.existingProfileData) {
      console.log('Datos existentes recibidos:', this.existingProfileData);
      this.fillFormWithExistingData();
    } else {
      console.log('No hay datos existentes para rellenar');
    }
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      actualAge--;
    }
    
    return actualAge;
  }

  private fillFormWithExistingData() {
    console.log('Rellenando formulario con datos existentes:', this.existingProfileData);
    
    // Rellenar nombre
    if (this.existingProfileData.name) {
      this.trainerForm.get('name')?.setValue(this.existingProfileData.name);
    }

    // Rellenar hobby
    if (this.existingProfileData.hobby) {
      this.selectedHobbies = [this.existingProfileData.hobby];
      this.trainerForm.get('hobby')?.setValue(this.selectedHobbies);
      this.hobbyInput.disable();
      // Limpiar las sugerencias filtradas
      this.filteredHobbies = this.hobbiesList.filter(hobby => 
        !this.selectedHobbies.includes(hobby)
      );
    }

    // Rellenar fecha de nacimiento
    if (this.existingProfileData.birthDate) {
      const birthDate = new Date(this.existingProfileData.birthDate);
      this.trainerForm.get('birthday')?.setValue(birthDate);
      
      // Calcular la edad correctamente
      const calculatedAge = this.calculateAge(birthDate);
      const isAdult = calculatedAge >= 18;
      
      // Configurar el estado de edad y documento
      this.hasValidBirthday = true;
      this.isAdult = isAdult;
      
      console.log('Edad calculada:', calculatedAge, 'Es adulto:', isAdult);
      
      // Habilitar y configurar el campo documento
      const documentControl = this.trainerForm.get('document');
      documentControl?.enable();
      
      // Configurar validadores según la edad
      if (this.isAdult) {
        // DUI: 8 dígitos + guión + 1 dígito = 10 caracteres total (OBLIGATORIO)
        documentControl?.setValidators([
          Validators.required,
          Validators.pattern(/^\d{8}-\d{1}$/)
        ]);
        console.log('Configurando validadores para DUI (adulto) - OBLIGATORIO');
      } else {
        // Carnet de minoridad: 8 dígitos (NO OBLIGATORIO)
        documentControl?.setValidators([
          Validators.pattern(/^\d{8}$/)
        ]);
        console.log('Configurando validadores para Carnet de Minoridad (menor) - NO OBLIGATORIO');
      }
      documentControl?.updateValueAndValidity();
      
      // Disparar el evento de cambio de edad después de un breve delay
      setTimeout(() => {
        this.onAgeChanged({ 
          isAdult: this.isAdult, 
          age: calculatedAge
        });
        
        // Rellenar documento DESPUÉS de que se configuren los validadores
        if (this.existingProfileData.document) {
          console.log('Estableciendo documento después de onAgeChanged:', this.existingProfileData.document);
          documentControl?.setValue(this.existingProfileData.document);
          console.log('Documento establecido, valor actual:', documentControl?.value);
          console.log('Documento válido:', documentControl?.valid);
        }
      }, 100);
    }
  }

  filterHobbies(value: string | null) {
    const filterValue = (value || '').toLowerCase();
    this.filteredHobbies = this.hobbiesList.filter(hobby =>
      hobby.toLowerCase().includes(filterValue) && !this.selectedHobbies.includes(hobby)
    );
  }

  addHobby(hobby: string, inputRef?: HTMLInputElement) {
    if (hobby && !this.selectedHobbies.includes(hobby)) {
      // Solo permitir un hobby, reemplazar si ya hay uno
      this.selectedHobbies = [hobby];
      this.trainerForm.get('hobby')?.setValue(this.selectedHobbies);
      this.hobbyInput.reset(); // Limpiar completamente el input
      if (inputRef) inputRef.value = '';
      this.filterHobbies('');
      // Deshabilitar el input cuando se agrega un hobby
      this.hobbyInput.disable();
    }
  }

  removeHobby(hobby: string) {
    this.selectedHobbies = this.selectedHobbies.filter(h => h !== hobby);
    this.trainerForm.get('hobby')?.setValue(this.selectedHobbies);
    // Limpiar y habilitar el input
    this.hobbyInput.reset();
    this.hobbyInput.enable();
    this.filterHobbies('');
  }

  onHobbySelected(event: any, inputRef?: HTMLInputElement) {
    this.addHobby(event.option.value, inputRef);
  }

  onInputChange(event: any) {
    const value = event.target.value;
    if (value) {
      this.filterHobbies(value);
    } else {
      this.filteredHobbies = this.hobbiesList.filter(hobby => 
        !this.selectedHobbies.includes(hobby)
      );
    }
  }
  
  onSubmit() {
    if (this.isFormValid) {
      this.isLoading = true;
      
      const formData = {
        name: this.trainerForm.get('name')?.value || '',
        hobby: this.selectedHobbies[0] || '',
        birthday: this.trainerForm.get('birthday')?.value || '',
        document: this.trainerForm.get('document')?.value || '',
        isAdult: this.isAdult,
        hasValidBirthday: this.hasValidBirthday
      };
      
      console.log('Enviando datos del formulario:', formData);
      this.formSubmitted.emit(formData);
    }
  }
  
  onAgeChanged(event: { isAdult: boolean; age: number }) {
    console.log('Edad calculada:', event);
    console.log('Estado anterior - hasValidBirthday:', this.hasValidBirthday, 'isAdult:', this.isAdult);
    
    this.hasValidBirthday = true;
    this.isAdult = event.isAdult;

    console.log('Estado actualizado - hasValidBirthday:', this.hasValidBirthday, 'isAdult:', this.isAdult);
    
    const documentControl = this.trainerForm.get('document');
    
    if (this.hasValidBirthday) {
      // Habilitar el campo documento
      documentControl?.enable();
      
      // Solo limpiar el valor si no estamos rellenando con datos existentes
      if (!this.existingProfileData?.document) {
        documentControl?.setValue('');
      }
      
      // Configurar validadores según la edad
      if (this.isAdult) {
        // DUI: 8 dígitos + guión + 1 dígito = 10 caracteres total (OBLIGATORIO)
        documentControl?.setValidators([
          Validators.required,
          Validators.pattern(/^\d{8}-\d{1}$/)
        ]);
        console.log('Configurando validadores para DUI (adulto) - OBLIGATORIO');
      } else {
        // Carnet de minoridad: 8 dígitos (NO OBLIGATORIO)
        documentControl?.setValidators([
          Validators.pattern(/^\d{8}$/)
        ]);
        console.log('Configurando validadores para Carnet de Minoridad (menor) - NO OBLIGATORIO');
      }
      documentControl?.updateValueAndValidity();
    } else {
      // Deshabilitar el campo documento
      documentControl?.disable();
      documentControl?.setValue('');
      console.log('Deshabilitando campo documento - no hay fecha válida');
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
    const nameValid = this.trainerForm.get('name')?.valid || false;
    const hobbyValid = this.selectedHobbies.length > 0;
    const birthdayValid = this.trainerForm.get('birthday')?.valid || false;
    
    // El documento solo es obligatorio para adultos (DUI)
    let documentValid = true;
    if (this.hasValidBirthday && this.isAdult) {
      documentValid = this.trainerForm.get('document')?.valid || false;
    }
    
    const isValid = nameValid && hobbyValid && birthdayValid && documentValid;
    
    console.log('Form validation debug:', {
      nameValid,
      hobbyValid,
      birthdayValid,
      documentValid,
      hasValidBirthday: this.hasValidBirthday,
      isAdult: this.isAdult,
      selectedHobbies: this.selectedHobbies,
      isValid
    });
    
    return isValid;
  }
} 