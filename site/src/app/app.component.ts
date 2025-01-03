import { isPlatformBrowser } from "@angular/common";
import { Component, inject, OnInit, PLATFORM_ID, Signal, viewChild } from "@angular/core";
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  Router,
  RouterOutlet,
} from "@angular/router";
import { NgProgressbar, NgProgressRef } from "ngx-progressbar";
import { filter, map, switchMap, take } from "rxjs";
import { MainComponent } from "./components";

@Component({
  selector: "zxa-root",
  standalone: true,
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  imports: [RouterOutlet, MainComponent, NgProgressbar],
})
export class AppComponent implements OnInit {
  isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private progressBar: Signal<NgProgressRef | undefined> = viewChild(NgProgressRef);
  private readonly router = inject(Router);

  ngOnInit() {
    this.setupPageNavigationDimming();
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
            this.progressBar()?.start();
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
        this.progressBar()?.complete();
      });
  }
}

export const PROGRESS_BAR_DELAY = 30;
