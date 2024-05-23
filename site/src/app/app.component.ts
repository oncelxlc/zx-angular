import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MainComponent} from '@zx-ng/app/components';

@Component({
  selector: 'zxa-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, MainComponent],
})
export class AppComponent {
}
