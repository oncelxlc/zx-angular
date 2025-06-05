import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { AsideComponent } from '../aside/aside.component';

@Component({
  selector: 'zxa-main',
  imports: [HeaderComponent, FooterComponent, AsideComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
}
