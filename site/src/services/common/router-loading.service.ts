import { inject, Injectable, OnDestroy } from "@angular/core";
import {
  ActivationEnd,
  ActivationStart,
  ChildActivationEnd,
  ChildActivationStart,
  GuardsCheckEnd,
  GuardsCheckStart,
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  ResolveEnd,
  ResolveStart,
  RouteConfigLoadEnd,
  RouteConfigLoadStart,
  Router,
  RoutesRecognized,
} from "@angular/router";
import { map, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class RouterLoadingService implements OnDestroy {
  private unsubscribe$ = new Subject<void>();
  private router: Router = inject(Router);

  public routerLoading() {
    return this.router.events.pipe(
      map(events => {
        let process = 0;
        if (events instanceof NavigationCancel || events instanceof NavigationError || events instanceof NavigationSkipped) {
          process = 0;
        } else if (events instanceof NavigationStart) {
          process = 1;
        } else if (events instanceof RouteConfigLoadStart) {
          process = 10;
        } else if (events instanceof RouteConfigLoadEnd) {
          process = 20;
        } else if (events instanceof RoutesRecognized) {
          process = 25;
        } else if (events instanceof GuardsCheckStart) {
          process = 30;
        } else if (events instanceof ChildActivationStart) {
          process = 35;
        } else if (events instanceof ActivationStart) {
          process = 40;
        } else if (events instanceof GuardsCheckEnd) {
          process = 50;
        } else if (events instanceof ResolveStart) {
          process = 60;
        } else if (events instanceof ResolveEnd) {
          process = 70;
        } else if (events instanceof ChildActivationEnd) {
          process = 80;
        } else if (events instanceof ActivationEnd) {
          process = 90;
        } else if (events instanceof NavigationEnd) {
          process = 100;
        }
        return process;
      }),
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
