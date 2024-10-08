import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/index/index.component').then(m => m.IndexComponent),
    pathMatch: 'full',
  },
  {
    path: 'blog',
    loadComponent: () => import('../pages/blog/blog.component').then(m => m.BlogComponent),
  },
  {
    path: 'experiment',
    loadChildren: () => import('../routes/experiment.routes').then(m => m.experimentRoutes),
  },
  {
    path: 'notes',
    loadComponent: () => import('../pages/notes/notes.component').then(m => m.NotesComponent),
  },
  {
    path: 'not-found',
    loadComponent: () => import('../pages/not-found/not-found.component').then(m => m.NotFoundComponent),
  },
  {
    path: '**',
    redirectTo: '/not-found',
  },
];
