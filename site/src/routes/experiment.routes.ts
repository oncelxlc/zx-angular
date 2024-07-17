import { Routes } from '@angular/router';

export const experimentRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/experiment/experiment.component').then(m => m.ExperimentComponent),
    pathMatch: 'full',
  },
];
