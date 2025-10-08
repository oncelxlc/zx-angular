import { Routes } from "@angular/router";

export const experimentRoutes: Routes = [
  {
    path: "",
    loadComponent: () => import("@zxa-pages/experiment/experiment.component").then(c => c.ExperimentComponent),
  },
];
