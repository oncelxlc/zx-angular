import { Component } from '@angular/core';
import { AsideComponent } from 'site/src/app/components/aside/aside.component';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'zxa-main',
  imports: [HeaderComponent, FooterComponent, AsideComponent],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
}
