import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'zxa-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'zx-app';
}
