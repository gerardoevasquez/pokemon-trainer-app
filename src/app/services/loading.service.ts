import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface LoadingConfig {
  message?: string;
  showLogo?: boolean;
  showProgress?: boolean;
  progressValue?: number;
  autoHide?: boolean;
  autoHideDelay?: number;
}

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private configSubject = new BehaviorSubject<LoadingConfig>({
    message: 'Cargando...',
    showLogo: true,
    showProgress: false,
    progressValue: 0,
    autoHide: false,
    autoHideDelay: 2000
  });

  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  config$: Observable<LoadingConfig> = this.configSubject.asObservable();

  show(config?: Partial<LoadingConfig>): void {
    if (config) {
      this.configSubject.next({ ...this.configSubject.value, ...config });
    }
    this.loadingSubject.next(true);
  }

  hide(): void {
    this.loadingSubject.next(false);
  }

  showStepTransition(stepName: string): void {
    this.show({
      message: `Preparando ${stepName}...`,
      showLogo: true,
      showProgress: false,
      autoHide: true,
      autoHideDelay: 1500
    });
  }

  showWithProgress(message: string, progress: number): void {
    this.show({
      message,
      showProgress: true,
      progressValue: progress,
      autoHide: false
    });
  }
} 