import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NxWelcomeComponent } from './nx-welcome.component';
import { HeaderComponent } from './common/header/header.component'

@Component({
  standalone: true,
  imports: [NxWelcomeComponent, RouterModule, HeaderComponent],
  selector: 'zxa-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'zx-angular';
}
