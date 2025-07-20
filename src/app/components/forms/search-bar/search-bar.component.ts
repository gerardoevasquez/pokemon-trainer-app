import { Component, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SearchBarComponent),
      multi: true
    }
  ]
})
export class SearchBarComponent implements ControlValueAccessor {
  @Input() placeholder: string = 'Buscar...';
  @Input() showFilters: boolean = false;
  @Input() filters: Array<{value: string, label: string}> = [];
  @Input() selectedFilter?: string;
  @Input() disabled: boolean = false;
  @Input() loading: boolean = false;
  
  @Output() search = new EventEmitter<{query: string, filter?: string}>();
  @Output() filterChange = new EventEmitter<string>();

  value: string = '';
  touched: boolean = false;

  onChange = (value: string) => {};
  onTouched = () => {};

  writeValue(value: string): void {
    this.value = value || '';
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

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.onChange(value);
  }

  onBlur(): void {
    this.touched = true;
    this.onTouched();
  }

  onSearch(): void {
    this.search.emit({
      query: this.value,
      filter: this.selectedFilter
    });
  }

  onFilterChange(filter: string): void {
    this.selectedFilter = filter;
    this.filterChange.emit(filter);
  }

  clearSearch(): void {
    this.value = '';
    this.onChange('');
    this.search.emit({ query: '' });
  }
} 