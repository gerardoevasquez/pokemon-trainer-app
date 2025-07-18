import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Factory pattern for creating custom validators
 * Following SOLID principles and DRY methodology
 */
export class ValidatorFactory {
  
  /**
   * Creates a validator for DUI format (00000000-0)
   * Single Responsibility Principle: Each validator has one specific purpose
   */
  static duiValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null; // Let required validator handle empty values
      }
      
      const duiRegex = /^\d{8}-\d$/;
      const isValid = duiRegex.test(control.value);
      
      return isValid ? null : { invalidDui: { value: control.value } };
    };
  }

  /**
   * Creates a validator for age-based document requirements
   * Open/Closed Principle: Easy to extend without modifying existing code
   */
  static ageBasedDocumentValidator(minAge: number = 18): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const birthDate = control.get('birthDate')?.value;
      const document = control.get('identificationDocument')?.value;
      
      if (!birthDate) {
        return null;
      }
      
      const age = this.calculateAge(new Date(birthDate));
      const isAdult = age >= minAge;
      
      if (isAdult && !document) {
        return { documentRequired: { requiredAge: minAge, currentAge: age } };
      }
      
      return null;
    };
  }

  /**
   * Creates a validator for Pokemon team size
   */
  static pokemonTeamValidator(maxSize: number = 3): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value || !Array.isArray(control.value)) {
        return null;
      }
      
      const teamSize = control.value.length;
      return teamSize <= maxSize ? null : { teamTooLarge: { maxSize, currentSize: teamSize } };
    };
  }

  /**
   * Creates a validator for file size
   */
  static fileSizeValidator(maxSizeMB: number = 5): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const file = control.value as File;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;
      
      return file.size <= maxSizeBytes ? null : { fileTooLarge: { maxSizeMB, currentSizeMB: (file.size / 1024 / 1024).toFixed(2) } };
    };
  }

  /**
   * Creates a validator for file type
   */
  static fileTypeValidator(allowedTypes: string[] = ['image/jpeg', 'image/png', 'image/webp']): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      if (!control.value) {
        return null;
      }
      
      const file = control.value as File;
      const isValidType = allowedTypes.includes(file.type);
      
      return isValidType ? null : { invalidFileType: { allowedTypes, currentType: file.type } };
    };
  }

  /**
   * Utility method to calculate age from birth date
   */
  private static calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}

/**
 * Custom error messages following DRY principle
 */
export const VALIDATION_MESSAGES = {
  required: 'Este campo es requerido',
  invalidDui: 'El formato del DUI debe ser 00000000-0',
  documentRequired: 'Documento de identidad requerido para mayores de edad',
  teamTooLarge: 'El equipo no puede tener más de {maxSize} Pokémon',
  fileTooLarge: 'El archivo no puede ser mayor a {maxSizeMB}MB',
  invalidFileType: 'Tipo de archivo no permitido. Tipos válidos: {allowedTypes}',
  invalidEmail: 'Formato de email inválido',
  minLength: 'Mínimo {requiredLength} caracteres',
  maxLength: 'Máximo {requiredLength} caracteres'
} as const; 