import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "project/app/common/header/header.component";
import { ZxNavComponent } from 'zx-ui/nav'
import { FooterComponent } from 'project/app/common/footer/footer.component'

@Component({
  selector: 'zxa-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ZxNavComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
}
