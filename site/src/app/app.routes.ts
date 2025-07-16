import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("@zxa-pages/container/container.component").then(m => m.ContainerComponent),
    pathMatch: "full",
    children: [
      {
        path: "",
        loadComponent: () => import("@zxa-pages/home/home.component").then(m => m.HomeComponent),
        title: "首页",
      },
      {
        path: "blog",
        loadComponent: () => import("@zxa-pages/blog/blog.component").then(m => m.BlogComponent),
        title: "博客",
      },
      {
        path: "experiment",
        loadChildren: () => import("@zxa-routes/experiment.routes").then(m => m.experimentRoutes),
        title: "实验",
      },
      {
        path: "notes",
        loadComponent: () => import("@zxa-pages/notes/notes.component").then(m => m.NotesComponent),
        title: "笔记",
      },
      {
        path: "**",
        redirectTo: "",
      },
    ],
  },
  {
    path: "login",
    loadComponent: () => import("@zxa-pages/login/login.component").then(m => m.LoginComponent),
    title: "登录",
  },
  {
    path: "not-found",
    loadComponent: () => import("@zxa-pages/not-found/not-found.component").then(m => m.NotFoundComponent),
    title: "找不到页面",
  },
  {
    path: "**",
    redirectTo: "/not-found",
  },
];
