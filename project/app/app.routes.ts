import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./common/home/home.component').then(c => c.HomeComponent),
  },
  {
    path: 'docs',
    loadChildren: () => import('./docs/docs.routes').then(m => m.docsRoutes),
  },
  {
    path: 'experimental',
    loadChildren: () => import('./experimental/experimental.routes').then(m => m.experimentalRoutes),
  },
  {
    path: 'knowledge',
    loadChildren: () => import('./knowledge/knowledge.routes').then(m => m.knowledgeRoutes),
  },
];
