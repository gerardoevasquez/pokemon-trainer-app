import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]',
  standalone: true
})
export class NumberOnlyDirective {
  @Input() appNumberOnly: boolean = true;
  @Input() maxLength: number = 8; // Por defecto 8 dígitos para carnet de minoridad
  
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.appNumberOnly) return;
    
    // Teclas que siempre están permitidas
    const allowedKeys = [
      'Backspace', 
      'Delete', 
      'Tab', 
      'ArrowLeft', 
      'ArrowRight', 
      'ArrowUp', 
      'ArrowDown',
      'Home',
      'End',
      'Enter'
    ];
    
    if (allowedKeys.includes(event.key)) return;
    
    // Solo números
    if (!/[0-9]/.test(event.key)) {
      event.preventDefault();
      return;
    }
    
    // Verificar límite de caracteres
    const target = event.target as HTMLInputElement;
    const value = target.value;
    
    if (value.length >= this.maxLength) {
      event.preventDefault();
    }
  }
  
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (!this.appNumberOnly) return;
    
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text/plain') || '';
    
    // Solo números, máximo la longitud especificada
    const cleanNumbers = pastedText.replace(/[^0-9]/g, '').substring(0, this.maxLength);
    document.execCommand('insertText', false, cleanNumbers);
  }
} 