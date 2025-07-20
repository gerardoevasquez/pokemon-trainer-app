import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface StepMessage {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  showEditButton?: boolean;
  editButtonText?: string;
}

@Component({
  selector: 'app-step-message',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './step-message.component.html',
  styleUrls: ['./step-message.component.scss']
})
export class StepMessageComponent {
  @Input() message: StepMessage = {
    title: '',
    subtitle: '',
    showBackButton: true,
    showEditButton: false,
    editButtonText: 'Editar perfil'
  };

  @Output() backClick = new EventEmitter<void>();
  @Output() editClick = new EventEmitter<void>();

  onBackClick(): void {
    this.backClick.emit();
  }

  onEditClick(): void {
    this.editClick.emit();
  }
} 