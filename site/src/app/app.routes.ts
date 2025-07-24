import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("@zxa-pages/container/container.component").then(c => c.ContainerComponent),
    children: [
      {
        path: "",
        loadComponent: () => import("@zxa-pages/home/home.component").then(c => c.HomeComponent),
        pathMatch: "full",
        title: "首页",
      },
      {
        path: "blog",
        loadComponent: () => import("@zxa-pages/blog/blog.component").then(c => c.BlogComponent),
        title: "博客",
      },
      {
        path: "experiment",
        loadChildren: () => import("@zxa-routes/experiment.routes").then(r => r.experimentRoutes),
        title: "实验",
      },
      {
        path: "notes",
        loadComponent: () => import("@zxa-pages/notes/notes.component").then(c => c.NotesComponent),
        title: "笔记",
      },
    ],
  },
  {
    path: "login",
    loadComponent: () => import("@zxa-pages/login/login.component").then(c => c.LoginComponent),
    title: "登录",
  },
  {
    path: "not-found",
    loadComponent: () => import("@zxa-pages/not-found/not-found.component").then(c => c.NotFoundComponent),
    title: "找不到页面",
  },
  {
    path: "**",
    redirectTo: "/not-found",
  },
];
