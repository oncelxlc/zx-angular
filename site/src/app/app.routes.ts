import {Routes} from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('../pages/index/index.component').then(m => m.IndexComponent),
    pathMatch: 'full'
  },
  {
    path: 'blog',
    loadChildren: () => import('../pages/blog/blog.component').then(m => m.BlogComponent),
  },
  {
    path: 'experiment',
    loadChildren: () => import('../pages/experiment/experiment.component').then(m => m.ExperimentComponent),
  },
  {
    path: 'notes',
    loadChildren: () => import('../pages/notes/notes.component').then(m => m.NotesComponent),
  },
  {
    path: 'not-found',
    loadChildren: () => import('../pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '/not-found'
  }
];
