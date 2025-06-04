import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgProgressbar } from 'ngx-progressbar';
import { NgProgressRouter } from 'ngx-progressbar/router';
import { MainComponent } from './components/main/main.component';

@Component({
  selector: 'zxa-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, MainComponent, NgProgressbar, NgProgressRouter],
})
export class AppComponent {

  constructor() {
  }
}
