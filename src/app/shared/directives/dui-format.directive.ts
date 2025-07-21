import { Directive, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Custom directive to automatically format DUI input
 * Following Angular best practices and SOLID principles
 */
@Directive({
  selector: '[appDuiFormat]',
  standalone: true
})
export class DuiFormatDirective implements OnInit {
  
  @Input() appDuiFormat: boolean = true;
  
  private readonly DUI_REGEX = /^\d{0,8}-?\d{0,1}$/;
  private readonly MAX_LENGTH = 10; // 8 digits + hyphen + 1 digit

  constructor(
    private el: ElementRef<HTMLInputElement>,
    private control: NgControl
  ) {}

  ngOnInit(): void {
    if (this.appDuiFormat) {
      this.setupInput();
    }
  }

  /**
   * Listens to input events and formats DUI automatically
   */
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    if (!this.appDuiFormat) return;

    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9]/g, ''); // Remove non-digits

    // Limit to 9 digits
    if (value.length > 9) {
      value = value.substring(0, 9);
    }

    // Format with hyphen
    if (value.length >= 8) {
      value = `${value.substring(0, 8)}-${value.substring(8)}`;
    }

    // Update input value
    input.value = value;
    
    // Update form control
    if (this.control.control) {
      this.control.control.setValue(value, { emitEvent: false });
    }
  }

  /**
   * Listens to paste events and formats pasted content
   */
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent): void {
    if (!this.appDuiFormat) return;

    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text/plain') || '';
    const cleanValue = pastedText.replace(/[^0-9]/g, '').substring(0, 9);
    
    let formattedValue = cleanValue;
    if (cleanValue.length >= 8) {
      formattedValue = `${cleanValue.substring(0, 8)}-${cleanValue.substring(8)}`;
    }

    this.el.nativeElement.value = formattedValue;
    if (this.control.control) {
      this.control.control.setValue(formattedValue);
    }
  }

  /**
   * Listens to keydown events for special handling
   */
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.appDuiFormat) return;

    const input = event.target as HTMLInputElement;
    const key = event.key;
    const value = input.value;
    const selectionStart = input.selectionStart || 0;

    // Manejo especial para backspace justo después del guion
    if (key === 'Backspace' && value[selectionStart - 1] === '-' && selectionStart === value.length) {
      // Eliminar guion y el dígito anterior
      const newValue = value.slice(0, selectionStart - 2);
      input.value = newValue;
      if (this.control.control) {
        this.control.control.setValue(newValue, { emitEvent: false });
      }
      event.preventDefault();
      return;
    }

    // Allow: backspace, delete, tab, escape, enter, navigation keys
    if ([8, 9, 27, 13, 46, 37, 39].includes(event.keyCode) || 
        (event.ctrlKey && [65, 67, 86, 88].includes(event.keyCode))) {
      return;
    }

    // Allow only digits
    if (!/^[0-9]$/.test(key)) {
      event.preventDefault();
      return;
    }

    // Prevent input if max length reached
    if (value.length >= this.MAX_LENGTH && !this.isNavigationKey(event.keyCode)) {
      event.preventDefault();
    }
  }

  /**
   * Listens to blur events for final formatting
   */
  @HostListener('blur')
  onBlur(): void {
    if (!this.appDuiFormat) return;

    const value = this.el.nativeElement.value;
    if (value && value.length === 8) {
      // Add hyphen if only 8 digits entered
      const formattedValue = `${value}-`;
      this.el.nativeElement.value = formattedValue;
      if (this.control.control) {
        this.control.control.setValue(formattedValue);
      }
    }
  }

  /**
   * Sets up input element with proper attributes
   */
  private setupInput(): void {
    const input = this.el.nativeElement;
    input.setAttribute('maxlength', this.MAX_LENGTH.toString());
    input.setAttribute('placeholder', '00000000-0');
    input.setAttribute('pattern', '\\d{8}-\\d');
  }

  /**
   * Checks if key code is a navigation key
   */
  private isNavigationKey(keyCode: number): boolean {
    return [37, 38, 39, 40].includes(keyCode); // Arrow keys
  }
} 