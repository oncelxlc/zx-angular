import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('../pages/home/home.component').then(m => m.HomeComponent),
    title: '首页',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () => import('../pages/login/login.component').then(m => m.LoginComponent),
    title: '登录',
  },
  {
    path: 'blog',
    loadComponent: () => import('../pages/blog/blog.component').then(m => m.BlogComponent),
    title: '博客',
  },
  {
    path: 'experiment',
    loadChildren: () => import('../routes/experiment.routes').then(m => m.experimentRoutes),
    title: '实验',
  },
  {
    path: 'notes',
    loadComponent: () => import('../pages/notes/notes.component').then(m => m.NotesComponent),
    title: '笔记',
  },
  {
    path: 'not-found',
    loadComponent: () => import('../pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '找不到页面',
  },
  {
    path: '**',
    redirectTo: '/not-found',
  },
];
