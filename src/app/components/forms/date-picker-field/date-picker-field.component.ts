import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-date-picker-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule
  ],
  templateUrl: './date-picker-field.component.html',
  styleUrls: ['./date-picker-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DatePickerFieldComponent),
      multi: true
    }
  ]
})
export class DatePickerFieldComponent implements ControlValueAccessor {
  @Input() label: string = 'Fecha';
  @Input() placeholder: string = 'Selecciona una fecha';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() errorMessage: string = '';
  @Input() minDate?: Date;
  @Input() maxDate?: Date;
  @Input() ageThreshold: number = 18; // Edad para determinar si es mayor de edad
  
  @Output() ageChanged = new EventEmitter<{ isAdult: boolean; age: number }>();

  value: Date | null = null;
  touched: boolean = false;

  onChange = (value: Date | null) => {};
  onTouched = () => {};

  writeValue(value: Date | null): void {
    this.value = value;
    if (value) {
      this.checkAge(value);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDateChange(date: Date | null): void {
    console.log('Fecha seleccionada:', date);
    this.value = date;
    this.onChange(date);
    this.onTouched();
    
    if (date) {
      this.checkAge(date);
    }
  }

  onBlur(): void {
    this.touched = true;
    this.onTouched();
  }

  private checkAge(birthDate: Date): void {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    let actualAge = age;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      actualAge--;
    }
    
    const isAdult = actualAge >= this.ageThreshold;
    console.log('Cálculo de edad:', {
      birthDate,
      today,
      age,
      monthDiff,
      actualAge,
      isAdult,
      ageThreshold: this.ageThreshold
    });
    
    this.ageChanged.emit({ isAdult, age: actualAge });
  }

  get isError(): boolean {
    return this.touched && this.required && !this.value;
  }

  get isInvalidAge(): boolean {
    if (!this.value) return false;
    const today = new Date();
    return this.value > today;
  }
} 