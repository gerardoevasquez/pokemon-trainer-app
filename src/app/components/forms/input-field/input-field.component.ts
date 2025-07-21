import { Component, Input, forwardRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DuiFormatDirective } from '../../../shared/directives/dui-format.directive';
import { TextOnlyDirective } from '../../../shared/directives/text-only.directive';
import { NumberOnlyDirective } from '../../../shared/directives/number-only.directive';

@Component({
  selector: 'app-input-field',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    DuiFormatDirective,
    TextOnlyDirective,
    NumberOnlyDirective
  ],
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputFieldComponent),
      multi: true
    }
  ]
})
export class InputFieldComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: 'text' | 'email' | 'password' | 'number' = 'text';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() errorMessage: string = '';
  @Input() hint: string = '';
  @Input() maxLength?: number;
  @Input() enableDuiFormat: boolean = false;
  @Input() textOnly: boolean = false;
  @Input() numberOnly: boolean = false;

  formControl = new FormControl('');
  touched: boolean = false;

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.formControl.setValue(value || '');
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  ngOnInit(): void {
    this.formControl.valueChanges.subscribe(value => {
      this.onChange(value || '');
    });

    this.formControl.statusChanges.subscribe(() => {
      this.onTouched();
    });
  }

  get isError(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }
} 