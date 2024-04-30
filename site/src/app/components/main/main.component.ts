import {isPlatformBrowser} from '@angular/common';
import {Component, inject, OnInit, PLATFORM_ID, ViewChild} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd, NavigationError,
  NavigationSkipped,
  NavigationStart,
  Router,
} from '@angular/router';
import {HeaderComponent} from '@zx-ng/app/components/header/header.component';
import {FooterComponent} from '@zx-ng/app/components/footer/footer.component';
import {NgProgressComponent} from 'ngx-progressbar';
import {filter, map, switchMap, take} from 'rxjs';

export const PROGRESS_BAR_DELAY = 30;

@Component({
  selector: 'zxa-main',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
    NgProgressComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  private readonly router = inject(Router);

  @ViewChild(NgProgressComponent, {static: true}) progressBar!: NgProgressComponent;

  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor() {
  }

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
