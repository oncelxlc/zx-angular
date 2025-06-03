import { Component } from '@angular/core';
import { HeightObserverDirective } from '@ngx-zx/directive';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'zxa-main',
  imports: [HeaderComponent, FooterComponent, HeightObserverDirective],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
}
