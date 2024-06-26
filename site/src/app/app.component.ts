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

  async ngOnInit(): Promise<void> {
    this.setupPageNavigationDimming();
    await this.loadCss('font.css', 'font').then();
  }

  /**
   * 导航活动指示
   * @private
   */
  private setupPageNavigationDimming() {
    if (!this.isBrowser) {
      return;
    }
    this.router.events
      .pipe(
        filter((e) => e instanceof NavigationStart),
        map(() => {
          // 仅当导航不是“立即”时才应用设置属性
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
        // 当导航完成时，防止在超时时间内应用导航类。
        clearTimeout(timeoutId);
        this.progressBar.complete();
      });
  }

  private loadCss(href: string, id: string): Promise<Event> {
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.id = id;
      link.media = 'print';
      link.onload = resolve;
      link.onerror = reject;
      document.head.append(link);
      link.onload = function () {
        link.media = 'all'; // 加载完成后，设置为 all 以应用样式
      };
    });
  }
}
