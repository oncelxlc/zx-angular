import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from "project/app/common/header/header.component";
import { ZxNavComponent } from 'zx-ui/nav'

@Component({
  selector: 'zxa-home',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ZxNavComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
