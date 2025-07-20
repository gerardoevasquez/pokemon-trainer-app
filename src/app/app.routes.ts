import { Routes } from '@angular/router';
import { TrainerProfileComponent } from './pages/trainer-profile';

export const routes: Routes = [
  { path: '', redirectTo: '/trainer-profile', pathMatch: 'full' },
  { path: 'trainer-profile', component: TrainerProfileComponent },
  // TODO: Add other routes here
];
