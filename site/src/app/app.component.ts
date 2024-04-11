import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import { MainComponent } from "@zx-ng/app/components/main/main.component";
import {HttpClientModule} from '@angular/common/http';

@Component({
  selector: 'zxa-root',
  standalone: true,
  imports: [RouterOutlet, MainComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
}
