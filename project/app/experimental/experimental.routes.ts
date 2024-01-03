import { Routes } from '@angular/router';

export const experimentalRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/proving-ground/proving-ground.component').then(c => c.ProvingGroundComponent),
  }
];
