import { isPlatformBrowser } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd, NavigationError, NavigationSkipped,
  NavigationStart,
  Router,
  RouterOutlet,
} from '@angular/router';
import { MainComponent, PROGRESS_BAR_DELAY } from '@zx-ng/app/components';
import { NgProgressComponent } from 'ngx-progressbar';
import { filter, map, switchMap, take } from 'rxjs';

@Component({
  selector: 'zxa-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, MainComponent, NgProgressComponent],
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);

  @ViewChild(NgProgressComponent, {static: true}) progressBar!: NgProgressComponent;

  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  ngOnInit(): void {
    this.setupPageNavigationDimming();
  }

  private setupPageNavigationDimming() {
    if (!this.isBrowser) {
      return;
    }
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationStart),
        map(() => {
          // Only apply set the property if the navigation is not "immediate"
          return setTimeout(() => {
            this.progressBar.start();
          }, PROGRESS_BAR_DELAY);
        }),
        switchMap((timeoutId) => {
          return this.router.events.pipe(
            filter((e) => {
              return (
                e instanceof NavigationEnd ||
                e instanceof NavigationCancel ||
                e instanceof NavigationSkipped ||
                e instanceof NavigationError
              );
            }),
            take(1),
            map(() => timeoutId),
          );
        }),
      )
      .subscribe((timeoutId) => {
        // When the navigation finishes, prevent the navigating class from being applied in the timeout.
        clearTimeout(timeoutId);
        this.progressBar.complete();
      });
  }
}
