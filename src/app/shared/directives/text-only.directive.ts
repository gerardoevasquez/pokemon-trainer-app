import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[appTextOnly]',
  standalone: true
})
export class TextOnlyDirective {
  @Input() appTextOnly: boolean = true;
  
  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (!this.appTextOnly) return;
    
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
    
    // Solo letras (sin espacios ni acentos)
    if (!/^[a-zA-Z]$/.test(event.key)) {
      event.preventDefault();
    }
  }
  
  @HostListener('paste', ['$event'])
  onPaste(event: ClipboardEvent) {
    if (!this.appTextOnly) return;
    
    event.preventDefault();
    const pastedText = event.clipboardData?.getData('text/plain') || '';
    
    // Solo letras (sin espacios ni acentos)
    const cleanText = pastedText.replace(/[^a-zA-Z]/g, '');
    document.execCommand('insertText', false, cleanText);
  }
} 