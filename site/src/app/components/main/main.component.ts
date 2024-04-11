import {Component, OnInit} from '@angular/core';
import {HeaderComponent} from '@zx-ng/app/components/header/header.component';
import {FooterComponent} from '@zx-ng/app/components/footer/footer.component';
import {RouterLoadingService} from '@zx-ng/services';
import * as NProgress from 'nprogress';

@Component({
  selector: 'zxa-main',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  constructor(private routerLoading: RouterLoadingService) {
  }

  ngOnInit(): void {
    NProgress.configure({easing: 'ease', speed: 800, trickleSpeed: 1200, showSpinner: false});
    this.routerLoading.routerLoading().subscribe(res => {
      if (res === 1) {
        NProgress.start();
      } else if (res === 0 && NProgress.isStarted()) {
        NProgress.done();
      } else if (res === 100) {
        NProgress.done();
      } else if (res > 0 && NProgress.isStarted()) {
        NProgress.set(Number((res / 100).toFixed(2)));
      }
    });
  }
}
