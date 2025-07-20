import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss']
})
export class SectionHeaderComponent {
  @Input() title: string = '';
  @Input() subtitle?: string;
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() align: 'left' | 'center' | 'right' = 'left';
  @Input() showDivider: boolean = false;
} 