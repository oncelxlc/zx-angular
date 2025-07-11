import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainComponent } from 'site/src/pages/container/components/main/main.component';

@Component({
  selector: 'zxa-container',
  imports: [
    MainComponent,
    RouterOutlet,
  ],
  templateUrl: './container.component.html',
  styleUrl: './container.component.scss'
})
export class ContainerComponent {

}
