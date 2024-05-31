import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '@zx-ng/app/components/header/header.component';
import { FooterComponent } from '@zx-ng/app/components/footer/footer.component';
import { NgProgressComponent } from 'ngx-progressbar';

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
  constructor() {
  }

  ngOnInit(): void {
  }
}
