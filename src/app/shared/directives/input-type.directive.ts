import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[inputType]',
  standalone: true
})
export class InputTypeDirective {
  @Input() inputType: 'name' | 'minority-card' | 'dui' = 'name';
  
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    // Si no hay tipo especificado, no aplicar restricciones
    if (!this.inputType) return;
    
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
    
    switch (this.inputType) {
      case 'name':
        // Solo letras (sin espacios ni acentos)
        if (!/^[a-zA-Z]$/.test(event.key)) {
          event.preventDefault();
        }
        break;
        
      case 'minority-card':
        // Solo números, máximo 8 dígitos
        const target = event.target as HTMLInputElement;
        const value = target.value;
        
        if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        } else if (value.length >= 8) {
          event.preventDefault();
        }
        break;
        
      case 'dui':
        // Solo números y guión en posición específica
        const duiTarget = event.target as HTMLInputElement;
        const duiValue = duiTarget.value;
        
        if (event.key === '-') {
          if (duiValue.length !== 8) {
            event.preventDefault(); // Solo guión después de 8 dígitos
          }
        } else if (!/[0-9]/.test(event.key)) {
          event.preventDefault();
        } else if (duiValue.length >= 10) {
          event.preventDefault(); // Máximo 10 caracteres (8 dígitos + guión + 1 dígito)
        }
        break;
    }
  }
  
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    // Si no hay tipo especificado, no aplicar restricciones
    if (!this.inputType) return;
    
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text/plain') || '';
    
    switch (this.inputType) {
      case 'name':
        // Solo letras (sin espacios ni acentos)
        const cleanName = pastedText.replace(/[^a-zA-Z]/g, '');
        document.execCommand('insertText', false, cleanName);
        break;
        
      case 'minority-card':
        // Solo números, máximo 8 dígitos
        const cleanMinority = pastedText.replace(/[^0-9]/g, '').substring(0, 8);
        document.execCommand('insertText', false, cleanMinority);
        break;
        
      case 'dui':
        // Solo números y guión en posición correcta
        const cleanDui = pastedText.replace(/[^0-9-]/g, '');
        if (cleanDui.length <= 10) {
          document.execCommand('insertText', false, cleanDui);
        }
        break;
    }
  }
} 