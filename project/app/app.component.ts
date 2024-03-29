import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from "@angular/router";
import {ZxaFooterComponent} from './common';
import {ZxaHeaderComponent} from './common';
import {ZxaFirstNavComponent} from './common';

@Component({
  selector: 'zxa-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ZxaFooterComponent, ZxaHeaderComponent, ZxaFirstNavComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'zx-app';
}
