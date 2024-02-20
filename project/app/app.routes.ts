import {Route} from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () => import('./pages/home/home.routes').then(m => m.homeRoutes),
  },
  {
    path: 'docs',
    loadChildren: () => import('./pages/docs/docs.routes').then(m => m.docsRoutes),
  },
  {
    path: 'experimental',
    loadChildren: () => import('./pages/experimental/experimental.routes').then(m => m.experimentalRoutes),
  },
  {
    path: 'knowledge',
    loadChildren: () => import('./pages/knowledge/knowledge.routes').then(m => m.knowledgeRoutes),
  },
];
