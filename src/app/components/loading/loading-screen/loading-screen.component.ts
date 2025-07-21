import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LoadingConfig {
  message?: string;
  showLogo?: boolean;
  showProgress?: boolean;
  progressValue?: number;
  autoHide?: boolean;
  autoHideDelay?: number;
}

@Component({
  selector: 'app-loading-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-screen.component.html',
  styleUrls: ['./loading-screen.component.scss']
})
export class LoadingScreenComponent {
  @Input() config: LoadingConfig = {
    message: 'Cargando',
    showLogo: true,
    showProgress: false,
    progressValue: 0,
    autoHide: false,
    autoHideDelay: 2000
  };

  @Input() isVisible: boolean = false;
  @Output() loadingComplete = new EventEmitter<void>();

  ngOnInit(): void {
    if (this.config.autoHide && this.isVisible) {
      setTimeout(() => {
        this.isVisible = false;
        this.loadingComplete.emit();
      }, this.config.autoHideDelay);
    }
  }

  onAnimationComplete(): void {
    if (!this.config.autoHide) {
      this.loadingComplete.emit();
    }
  }
} 