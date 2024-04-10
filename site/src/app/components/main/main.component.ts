import { Component } from '@angular/core';
import {HeaderComponent} from '@zx-ng/app/components/header/header.component';
import {FooterComponent} from '@zx-ng/app/components/footer/footer.component';

@Component({
  selector: 'zxa-main',
  standalone: true,
  imports: [
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {

}
