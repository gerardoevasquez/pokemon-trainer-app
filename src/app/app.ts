import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoadingScreenComponent } from './components/loading/loading-screen';
import { LoadingService } from './services/loading.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, LoadingScreenComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'Gerardo_Vasquez_Prueba_tecnica';

  constructor(public loadingService: LoadingService) {}

  onLoadingComplete(): void {
    // Manejar cuando se completa el loading

  }
}
